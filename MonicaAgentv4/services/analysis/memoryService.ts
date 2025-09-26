import { getGenAIClient } from '@/services/gemini/client';
import { AgentManager, Message, LongTermMemoryData } from '@/types/index';
import { buildContext } from '@/services/utils/contextBuilder';
import { AIError } from '@/services/utils/errorHandler';

export const extractKeyInformation = async (
    messages: Message[],
    manager: AgentManager,
    existingMemory: LongTermMemoryData,
    globalApiKey: string,
): Promise<LongTermMemoryData> => {
    
    const conversationContext = buildContext(messages.slice(-10));

    const prompt = `
        Analyze the following conversation snippet. Your goal is to extract or update key facts for a long-term memory JSON object.
        The CURRENT memory object is:
        ${JSON.stringify(existingMemory, null, 2)}
        Based on the conversation below, update the memory. You can add new key-value pairs or update existing ones. Keys should be descriptive (snake_case). Focus on important, non-trivial facts like names, goals, or stated preferences.
        Conversation Snippet:
        ---
        ${conversationContext}
        ---
        Return ONLY the complete, updated JSON object.
    `;
    
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
                systemInstruction: "You are an AI that extracts key information from conversations to build a persistent memory. You must respond with only a valid JSON object.",
                responseMimeType: "application/json",
            }
        });

        const text = response.text?.trim();
        if (!text) {
            console.warn("AI returned an empty response for memory update.");
            return existingMemory;
        }
        const jsonText = text.replace(/^```json\s*/, '').replace(/```$/, '');
        try {
            const potentialMemory = JSON.parse(jsonText);
            if (typeof potentialMemory === 'object' && potentialMemory !== null && !Array.isArray(potentialMemory)) {
                return potentialMemory as LongTermMemoryData;
            }
            console.warn("AI returned a non-object for memory update:", potentialMemory);
            return existingMemory;
        } catch (e) {
            console.error('Failed to parse memory update JSON:', jsonText, e);
            return existingMemory;
        }

    } catch (error) {
        const contextString = 'extractKeyInformation';
        console.error(`Error in ${contextString}:`, error);
        const originalMessage = error instanceof Error ? error.message : String(error);
        throw new AIError(originalMessage, contextString, prompt);
    }
};