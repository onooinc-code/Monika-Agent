import { getGenAIClient } from '@/services/gemini/client';
// FIX: Corrected import path for types to point to the barrel file.
import { Agent, Message, Attachment, PipelineStep, LongTermMemoryData } from '@/types/index';
// FIX: Changed from handleAndThrowError to AIError for explicit throw.
import { AIError } from '@/services/utils/errorHandler';
import { availableTools, toolSchemas } from '@/services/tools';
import { getFullMessageTextSchema } from '@/services/tools/contextual';
import { buildAwarenessContext } from '@/services/utils/contextBuilder';
import { Content } from '@google/genai';

/**
 * Converts the application's message format to the Gemini API's `Content` format.
 * It also filters out system messages which are not part of the conversational context for the AI.
 * It prioritizes using message summaries to save tokens.
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
        
        // Find the last entry for this role to potentially merge with
        const lastEntry = history[history.length - 1];
        if (lastEntry && lastEntry.role === role) {
            lastEntry.parts.push(...parts);
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
    
    // Create contextual tool for this specific request
    const get_full_message_text = async ({ message_id }: { message_id: string }) => {
        const msg = messages.find(m => m.id === message_id);
        return { full_text: msg ? msg.text : "Error: Message not found." };
    };
    
    const dynamicAvailableTools = { ...availableTools, get_full_message_text };

    const agentToolSchemas = agent.tools?.map(name => toolSchemas[name]).filter(Boolean) || [];
    agentToolSchemas.push(getFullMessageTextSchema);
    
    const tools = agentToolSchemas.length > 0 ? [{ functionDeclarations: agentToolSchemas }] : undefined;

    // Process the focused conversation history for the model.
    const history = convertMessagesToHistory(currentTopicMessages);
    
    pipeline.push({
        stage: 'Context Assembly',
        input: {
            latestText,
            task,
            messageCount: currentTopicMessages.length,
            agentName: agent.name,
            hasAttachment: !!attachment,
        },
        output: { systemInstruction: finalSystemInstruction, tools: agent.tools },
    });
    
    try {
        const startTime = performance.now();
        // Step 1: Make the initial API call with the full history to see if a tool is needed.
        const result = await ai.models.generateContent({
            model: agent.model,
            contents: history,
            config: { 
                systemInstruction: finalSystemInstruction,
                tools,
            },
        });
        const response = result;
        const functionCall = response.candidates[0]?.content?.parts[0]?.functionCall;

        pipeline.push({
            stage: 'Initial Model Invocation',
            input: history,
            output: response,
            durationMs: Math.round(performance.now() - startTime),
        });

        // Step 2: Check for a function call.
        if (functionCall) {
            const toolOutputForStream = `\n\n> **Using tool: \`${functionCall.name}\` with arguments: \`${JSON.stringify(functionCall.args)}\`**\n\n`;
            onStream(toolOutputForStream);
            fullText += toolOutputForStream;
            
            pipeline.push({ stage: 'Tool Call Detected', input: null, output: functionCall });

            const toolFunction = dynamicAvailableTools[functionCall.name];
            if (!toolFunction) {
                throw new Error(`Unknown tool "${functionCall.name}" requested by the model.`);
            }

            // Step 3: Execute the tool function.
            const toolStartTime = performance.now();
            const toolResult = await toolFunction(functionCall.args);
            pipeline.push({
                stage: `Tool Execution: ${functionCall.name}`,
                input: functionCall.args,
                output: toolResult,
                durationMs: Math.round(performance.now() - toolStartTime),
            });
            
            // Step 4: Send the tool's result back to the model to get a final text response.
            const finalResultStream = await ai.models.generateContentStream({
                model: agent.model,
                contents: [
                    ...history,
                    response.candidates[0].content, // Important: include the model's first turn
                    {
                        role: 'tool',
                        parts: [{
                            functionResponse: { 
                                name: functionCall.name, 
                                response: toolResult
                            }
                        }],
                    }
                ],
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
                stage: 'Final Streaming Invocation',
                input: 'Tool Result',
                output: { text: fullText },
                durationMs: Math.round(performance.now() - streamingStartTime),
            });
        } else {
            // No tool call, just a direct text response.
            const text = response.text || '';
            onStream(text);
            fullText = text;
        }

        // Step 5: After getting the full text, ask the same agent to summarize it.
        let summary = fullText; // Fallback
        if (fullText.length > 250) { 
            try {
                const summaryStartTime = performance.now();
                const summaryPrompt = `You just wrote the following text. Now, create a very short summary phrase (max 15 words) that captures its core essence for your own memory.\n\n---\n${fullText}\n---`;
                const summaryResult = await ai.models.generateContent({
                    model: agent.model,
                    contents: summaryPrompt,
                    config: {
                        systemInstruction: "You are an expert at creating very brief summaries of your own writing for memory purposes. Respond with only the summary text.",
                    }
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
        // FIX: Replaced handleAndThrowError with an explicit throw to satisfy TypeScript's control flow analysis.
        const contextString = `generateResponse for ${agent.name}`;
        console.error(`Error in ${contextString}:`, error);
        const originalMessage = error instanceof Error ? error.message : String(error);
        throw new AIError(originalMessage, contextString, null, fullText);
    }
};