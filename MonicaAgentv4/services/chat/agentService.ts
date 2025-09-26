import { getGenAIClient } from '@/services/gemini/client';
import { Agent, Message, Attachment, PipelineStep, LongTermMemoryData } from '@/types/index';
import { AIError } from '@/services/utils/errorHandler';
import { availableTools, toolSchemas } from '@/services/tools';
import { getFullMessageTextSchema } from '@/services/tools/contextual';
import { buildAwarenessContext } from '@/services/utils/contextBuilder';
import { Content, FunctionCall } from '@google/genai';

/**
 * Converts the application's message format to the Gemini API's `Content` format.
 */
const convertMessagesToHistory = (messages: Message[]): Content[] => {
    const filteredMessages = messages.filter(m => m.sender !== 'system' && m.messageType !== 'topic_divider');
    const history: Content[] = [];
    for (const message of filteredMessages) {
        const role = message.sender === 'user' ? 'user' : 'model';
        const textToUse = message.summary || message.text;
        const parts: any[] = [{ text: `(msg_id: ${message.id}) ${textToUse}` }];
        
        if (message.attachment) {
            parts.unshift({
                inlineData: {
                    mimeType: message.attachment.mimeType,
                    data: message.attachment.base64,
                },
            });
        }
        
        const lastEntry = history[history.length - 1];
        if (lastEntry && lastEntry.role === role) {
            lastEntry.parts!.push(...parts);
        } else {
            history.push({ role, parts });
        }
    }
    return history;
};


export const generateResponse = async (
    latestText: string, 
    agent: Agent, 
    messages: Message[], 
    attachment: Attachment | undefined,
    systemInstructionOverride: string | undefined,
    longTermMemory: LongTermMemoryData,
    onStream: (chunk: string) => void,
    task: string | undefined,
    globalApiKey: string,
): Promise<{ finalResult: string; summary: string; pipeline: PipelineStep[] }> => {
    const pipeline: PipelineStep[] = [];
    let fullText = '';
    let accumulatedFunctionCalls: FunctionCall[] = [];

    const { currentTopicMessages, recentTopicNames } = buildAwarenessContext(messages);

    let baseSystemInstruction = systemInstructionOverride || agent.systemInstruction;
    
    if (recentTopicNames.length > 0) {
        baseSystemInstruction = `RECENT TOPICS DISCUSSED (for context): ${recentTopicNames.join(', ')}\n\n---\n\n${baseSystemInstruction}`;
    }
    
    let finalSystemInstruction = baseSystemInstruction;
    
    finalSystemInstruction = `You have a tool 'get_full_message_text' to retrieve the full, unabbreviated text of a previous message if the summary is insufficient. Use it if you need more detail to answer accurately. Message IDs are provided in the format (msg_id: ...).\n\n${finalSystemInstruction}`;

    if (agent.knowledge && agent.knowledge.trim()) {
        finalSystemInstruction = `You have the following background knowledge. Use it to inform your responses, but do not mention it directly unless asked.\n\n--- BACKGROUND KNOWLEDGE ---\n${agent.knowledge}\n--- END KNOWLEDGE ---\n\nYour instructions are:\n${finalSystemInstruction}`;
    }
    
    const memoryString = JSON.stringify(longTermMemory);
    if (memoryString !== '{}') {
        finalSystemInstruction = `Remember the following facts about the user and the ongoing context. This is your long-term memory.\n\n--- LONG-TERM MEMORY ---\n${memoryString}\n--- END MEMORY ---\n\n${finalSystemInstruction}`;
    }

    const apiKey = agent.apiKey || globalApiKey;
    if (!apiKey) {
        throw new Error(`API Key not configured for agent "${agent.name}". Please set a global key or an agent-specific key in the settings.`);
    }
    const ai = getGenAIClient(apiKey);
    
    const get_full_message_text = async ({ message_id }: { message_id: string }) => {
        const msg = messages.find(m => m.id === message_id);
        return { full_text: msg ? msg.text : "Error: Message not found." };
    };
    
    const dynamicAvailableTools: Record<string, (args: any) => Promise<any>> = { ...availableTools, get_full_message_text };

    const agentToolSchemas = agent.tools?.map(name => toolSchemas[name]).filter(Boolean) || [];
    agentToolSchemas.push(getFullMessageTextSchema);
    
    const tools = agentToolSchemas.length > 0 ? [{ functionDeclarations: agentToolSchemas }] : undefined;

    const history = convertMessagesToHistory(currentTopicMessages);
    
    pipeline.push({
        stage: 'Context Assembly',
        input: { latestText, task, messageCount: currentTopicMessages.length, agentName: agent.name, hasAttachment: !!attachment },
        output: { systemInstruction: finalSystemInstruction, tools: agent.tools },
    });
    
    try {
        const startTime = performance.now();
        const firstStream = await ai.models.generateContentStream({
            model: agent.model,
            contents: history,
            config: { systemInstruction: finalSystemInstruction, tools },
        });
        pipeline.push({
            stage: 'Initial Streaming Invocation',
            input: history,
            output: 'Stream started...',
            durationMs: Math.round(performance.now() - startTime),
        });

        for await (const chunk of firstStream) {
            const chunkText = chunk.text;
            if (chunkText) {
                onStream(chunkText);
                fullText += chunkText;
            }
            if (chunk.functionCalls && chunk.functionCalls.length > 0) {
                 accumulatedFunctionCalls.push(...chunk.functionCalls);
            }
        }
        
        if (accumulatedFunctionCalls.length > 0) {
            const toolOutputForStream = `\n\n> **Thinking...** (Using ${accumulatedFunctionCalls.map(fc => `\`${fc.name}\``).join(', ')})\n\n`;
            onStream(toolOutputForStream);
            fullText += toolOutputForStream;
            
            pipeline.push({ stage: 'Tool Call(s) Detected', input: null, output: accumulatedFunctionCalls });

            const toolExecutionPromises = accumulatedFunctionCalls.map(async (functionCall) => {
                const toolFunction = dynamicAvailableTools[functionCall.name];
                if (!toolFunction) {
                     return { name: functionCall.name, response: { error: `Unknown tool "${functionCall.name}" requested by the model.` } };
                }
                const toolStartTime = performance.now();
                const toolResult = await toolFunction(functionCall.args);
                pipeline.push({
                    stage: `Tool Execution: ${functionCall.name}`,
                    input: functionCall.args,
                    output: toolResult,
                    durationMs: Math.round(performance.now() - toolStartTime),
                });
                return { name: functionCall.name, response: toolResult };
            });
            
            const toolResults = await Promise.all(toolExecutionPromises);

            const finalResultStream = await ai.models.generateContentStream({
                model: agent.model,
                contents: [ ...history, { role: 'model', parts: accumulatedFunctionCalls.map(fc => ({ functionCall: fc })) }, { role: 'tool', parts: toolResults.map(tr => ({ functionResponse: tr })) } ],
                config: { systemInstruction: finalSystemInstruction },
            });
            
            const streamingStartTime = performance.now();
            for await (const chunk of finalResultStream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    onStream(chunkText);
                    fullText += chunkText;
                }
            }
             pipeline.push({
                stage: 'Final Streaming Invocation (Post-Tool)',
                input: 'Tool Results',
                output: { text: fullText },
                durationMs: Math.round(performance.now() - streamingStartTime),
            });
        }
        
        let summary = fullText;
        if (fullText.length > 250) { 
            try {
                const summaryStartTime = performance.now();
                const summaryPrompt = `You just wrote the following text. Now, create a very short summary phrase (max 15 words) that captures its core essence for your own memory.\n\n---\n${fullText}\n---`;
                const summaryResult = await ai.models.generateContent({
                    model: agent.model,
                    contents: summaryPrompt,
                    config: { systemInstruction: "You are an expert at creating very brief summaries of your own writing for memory purposes. Respond with only the summary text." }
                });
                summary = (summaryResult.text || '').trim();
                 pipeline.push({
                    stage: 'Self-Summarization',
                    input: `Text length: ${fullText.length}`,
                    output: summary,
                    durationMs: Math.round(performance.now() - summaryStartTime),
                });
            } catch (summaryError) {
                console.error("Agent failed to summarize its own response, falling back to full text.", summaryError);
                 pipeline.push({ stage: 'Self-Summarization Failed', input: null, output: (summaryError as Error).message });
            }
        }

        return { finalResult: fullText, summary, pipeline };
    } catch (error) {
        const contextString = `generateResponse for ${agent.name}`;
        console.error(`Error in ${contextString}:`, error);
        const originalMessage = error instanceof Error ? error.message : String(error);
        throw new AIError(originalMessage, contextString, null, fullText);
    }
};