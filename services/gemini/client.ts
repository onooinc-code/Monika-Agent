import { GoogleGenAI } from "@google/genai";

const clients = new Map<string, GoogleGenAI>();

/**
 * Creates and caches GoogleGenAI clients based on the API key.
 * This prevents creating a new instance for every single request
 * while still allowing for multiple API keys to be used in the application.
 * @param apiKey The API key to initialize the client with.
 * @returns A GoogleGenAI instance.
 */
export const getGenAIClient = (apiKey: string): GoogleGenAI => {
    // In a Next.js environment, the key can be passed from state (user-set)
    // or from process.env.API_KEY (developer-set).
    const effectiveApiKey = apiKey || process.env.API_KEY;
    
    if (!effectiveApiKey || !effectiveApiKey.trim()) {
        // This error will be caught by services and shown to the user.
        throw new Error("Gemini API key is not configured. Please set it in the application settings or as an API_KEY environment variable.");
    }
    
    if (clients.has(effectiveApiKey)) {
        return clients.get(effectiveApiKey)!;
    }

    const newClient = new GoogleGenAI({ apiKey: effectiveApiKey });
    clients.set(effectiveApiKey, newClient);
    return newClient;
};
