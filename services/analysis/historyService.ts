import { getGenAIClient } from '@/services/gemini/client';
// FIX: Corrected import path for types to point to the barrel file.
import { Message, AgentManager } from '@/types/index';
import { Type } from "@google/genai";
import { buildContext } from '@/services/utils/contextBuilder';
import { AIError, handleAndThrowError } from '@/services/utils/errorHandler';

export const summarizeMessageChunk = async (messages: Message[], manager: AgentManager, globalApiKey: string): Promise<string> => {
    const context = buildContext(messages);
    const prompt = `Summarize the following part of a conversation in a single, concise sentence:\n\n${context}`;
    try {
        const apiKey = manager.apiKey || globalApiKey;
         if (!apiKey) {
            return "Could not summarize: API Key is not configured.";
        }
        const ai = getGenAIClient(apiKey);
        const response = await ai.models.generateContent({
            model: manager.model,
            contents: prompt,
            config: {
                systemInstruction: "You are a summarization assistant.",
            }
        });
        return response.text || "Summary could not be generated for this section.";
    } catch (error) {
        console.error("Error summarizing chunk:", error);
        // For chunks, we prefer to return a soft error message rather than failing the whole history view.
        return "Could not summarize this section due to an API error.";
    }
};

export async function generateOverallSummaryAndTopics(messages: Message[], manager: AgentManager, globalApiKey: string): Promise<{ overallSummary: string, topics: string[] }> {
    const context = buildContext(messages);
    const prompt = `Analyze the following conversation and provide an overall summary and a list of the main topics discussed.\n\n${context}`;
    
    let responseText: string | undefined = undefined;

    try {
        const apiKey = manager.apiKey || globalApiKey;
        if (!apiKey) {
            throw new Error("API Key not configured for the Agent Manager. Please set it in the settings.");
        }
        const ai = getGenAIClient(apiKey);

        const response = await ai.models.generateContent({
            model: manager.model,
            contents: prompt,
            config: {
                systemInstruction: "You are a summarization assistant. Your response must be a valid JSON object.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallSummary: { type: Type.STRING },
                        topics: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });

        responseText = response.text;
        if (!responseText || responseText.trim() === '') {
            throw new Error('The AI model returned an empty response for the summary and topics generation.');
        }
        
        const json = JSON.parse(responseText);

        if (typeof json !== 'object' || json === null) {
            throw new Error('AI response is not a valid JSON object.');
        }

        const overallSummary = typeof json.overallSummary === 'string' ? json.overallSummary : "No summary available.";
        // FIX: Replaced the 'any' type with a proper type guard and filter to ensure type safety.
        const topics = Array.isArray(json.topics) 
            ? json.topics.filter((t: any): t is string => typeof t === 'string') 
            : [];
        
        return {
            overallSummary,
            topics,
        };
    } catch (error) {
        // Re-implement the logic of handleAndThrowError here to make the 'throw' explicit
        const contextString = 'generateOverallSummaryAndTopics';
        console.error(`Error in ${contextString}:`, error);
        const originalMessage = error instanceof Error ? error.message : String(error);
        throw new AIError(originalMessage, contextString, prompt, responseText);
    }
}