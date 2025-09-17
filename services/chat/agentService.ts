



import { getGenAIClient } from '../gemini/client.ts';
import { Agent, Message, Attachment, PipelineStep, LongTermMemoryData } from '../../types/index.ts';
import { handleAndThrowError } from '../utils/errorHandler.ts';
import { availableTools, toolSchemas } from '../tools/index.ts';
import { Content } from '@google/genai';

/**
 * Converts the application's message format to the Gemini API's `Content` format.
 * It also filters out system messages which are not part of the conversational context for the AI.
 */
const convertMessagesToHistory = (messages: Message[]): Content[] => {
    const filteredMessages = messages.filter(m => m.sender !== 'system');
    const history: Content[] = [];
    for (const message of filteredMessages) {
        const role = message.sender === 'user' ? 'user' : 'model';
        const parts: any[] = [{ text: message.text }];
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
): Promise<{ finalResult: string; pipeline: PipelineStep[] }> => {
    const pipeline: PipelineStep[] = [];
    let fullText = '';

    const baseSystemInstruction = systemInstructionOverride || agent.systemInstruction;
    let finalSystemInstruction = baseSystemInstruction;

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
    
    const agentToolSchemas = agent.tools?.map(name => toolSchemas[name]).filter(Boolean);
    const tools = agentToolSchemas?.length > 0 ? [{ functionDeclarations: agentToolSchemas }] : undefined;

    // Process the full conversation history for the model.
    const history = convertMessagesToHistory(messages);
    
    pipeline.push({
        stage: 'Context Assembly',
        input: {
            latestText,
            task,
            messageCount: messages.length,
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

            const toolFunction = availableTools[functionCall.name];
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
            const text = response.text;
            onStream(text);
            fullText = text;
        }

        return { finalResult: fullText, pipeline };
    } catch (error) {
        handleAndThrowError(error, `generateResponse for ${agent.name}`, null, fullText);
    }
};