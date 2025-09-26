
import { getGenAIClient } from '@/services/gemini/client';
// FIX: Corrected import path for types to point to the barrel file.
import { Message, AgentManager } from '@/types/index';
import { buildContext } from '@/services/utils/contextBuilder';
import { handleAndThrowError } from '@/services/utils/errorHandler';

export const generateConversationTitle = async (messages: Message[], manager: AgentManager, globalApiKey: string): Promise<string> => {
    if (messages.length === 0) return "New Chat";
    
    const fullContext = buildContext(messages);
    const context = fullContext.substring(0, 4000); 
    const prompt = `Read the following conversation and generate a short, concise title (4 words maximum).\n\nConversation:\n${context}`;

    try {
        const apiKey = manager.apiKey || globalApiKey;
        if (!apiKey) {
            throw new Error("API Key not configured. Please set a global key in the settings to enable title generation.");
        }
        const ai = getGenAIClient(apiKey);
        const response = await ai.models.generateContent({
            model: manager.model,
            contents: prompt,
            config: {
                systemInstruction: "You generate short, relevant titles for conversations.",
            }
        });
        
        let title = response.text.trim();
        if (title.startsWith('"') && title.endsWith('"')) {
            title = title.substring(1, title.length - 1);
        }
        return title || "Untitled Chat";
    } catch (error) {
        handleAndThrowError(error, 'generateConversationTitle', prompt);
    }
};
