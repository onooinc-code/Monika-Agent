
import { getGenAIClient } from '@/services/gemini/client';
// FIX: Corrected import path for types to point to the barrel file.
import { AgentManager, Message, LongTermMemoryData } from '@/types/index';
import { buildContext } from '@/services/utils/contextBuilder';
import { handleAndThrowError } from '@/services/utils/errorHandler';

export const extractKeyInformation = async (
    messages: Message[],
    manager: AgentManager,
    existingMemory: LongTermMemoryData,
    globalApiKey: string,
): Promise<LongTermMemoryData> => {
    
    // Use last 10 messages to keep the context focused and performant
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

        Return ONLY the complete, updated JSON object. Do not add any other text or markdown fences.
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

        const text = response.text.trim();
        // The model can sometimes wrap the JSON in ```json ... ``` despite instructions
        const jsonText = text.replace(/^```json\s*/, '').replace(/```$/, '');
        try {
            const potentialMemory = JSON.parse(jsonText);
            // Add validation to ensure we got an object
            if (typeof potentialMemory === 'object' && potentialMemory !== null && !Array.isArray(potentialMemory)) {
                return potentialMemory as LongTermMemoryData;
            }
            console.warn("AI returned a non-object for memory update:", potentialMemory);
            return existingMemory; // Return old memory if format is wrong
        } catch (e) {
            console.error('Failed to parse memory update JSON:', jsonText, e);
            // Return existing memory to prevent data loss from a single bad response
            return existingMemory;
        }

    } catch (error) {
        handleAndThrowError(error, 'extractKeyInformation', prompt);
    }
};