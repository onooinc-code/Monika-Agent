import { getGenAIClient } from '@/services/gemini/client';
import { AgentManager } from '@/types/index';
import { AIError } from '@/services/utils/errorHandler';

export const summarizeMessage = async (text: string, manager: AgentManager, globalApiKey: string): Promise<string> => {
    const prompt = `Summarize the following text in one or two concise sentences:\n\n---\n${text}\n---`;
    try {
        const apiKey = manager.apiKey || globalApiKey;
         if (!apiKey) {
            throw new Error("API Key not configured. Please set a global key in the settings to enable summarization.");
        }
        const ai = getGenAIClient(apiKey);
        const response = await ai.models.generateContent({
            model: manager.model,
            contents: prompt,
            config: {
                systemInstruction: "You are a summarization assistant.",
            }
        });
        return (response.text || '').trim();
    } catch (error) {
        const contextString = 'summarizeMessage';
        console.error(`Error in ${contextString}:`, error);
        const originalMessage = error instanceof Error ? error.message : String(error);
        throw new AIError(originalMessage, contextString, prompt);
    }
};

export const rewritePrompt = async (prompt: string, manager: AgentManager, globalApiKey: string): Promise<string> => {
    const fullPrompt = `Rewrite the following user prompt to be clearer, more detailed, and more effective for an AI assistant. Return only the rewritten prompt.\n\n---\n${prompt}\n---`;
     try {
        const apiKey = manager.apiKey || globalApiKey;
        if (!apiKey) {
            throw new Error("API Key not configured. Please set a global key in the settings to enable rewriting.");
        }
        const ai = getGenAIClient(apiKey);
        const response = await ai.models.generateContent({
            model: manager.model,
            contents: fullPrompt,
            config: {
                systemInstruction: "You are an expert prompt engineer. You rewrite user prompts to be optimal for large language models.",
            }
        });
        let rewritten = (response.text || '').trim();
        if (rewritten.startsWith('"') && rewritten.endsWith('"')) {
            rewritten = rewritten.substring(1, rewritten.length - 1);
        }
        return rewritten;
    } catch (error) {
        const contextString = 'rewritePrompt';
        console.error(`Error in ${contextString}:`, error);
        const originalMessage = error instanceof Error ? error.message : String(error);
        throw new AIError(originalMessage, contextString, fullPrompt);
    }
}