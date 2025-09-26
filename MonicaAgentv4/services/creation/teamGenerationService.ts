import { getGenAIClient } from '@/services/gemini/client';
import { Agent, TeamComponent } from '@/types/index';
import { Type } from "@google/genai";
import { AIError } from '@/services/utils/errorHandler';

const checkApiKey = (apiKey: string) => {
    if (!apiKey) {
        throw new Error("API Key not configured. Please set a global API key in the settings to use the Team Generator.");
    }
}

export const generateTeamPrompt = async (topic: string, goal: string, globalApiKey: string): Promise<string> => {
    const prompt = `Based on the following topic and goal, create a detailed prompt that can be used to generate a team of 3 distinct AI agents.
    Topic: "${topic}"
    Goal: "${goal}"
    Return ONLY the detailed prompt, ready to be used in another step.`;

    try {
        checkApiKey(globalApiKey);
        const ai = getGenAIClient(globalApiKey);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { systemInstruction: "You are an expert in designing prompts for AI agent team generation." }
        });
        return (response.text || '').trim();
    } catch (error) {
        const contextString = 'generateTeamPrompt';
        console.error(`Error in ${contextString}:`, error);
        const originalMessage = error instanceof Error ? error.message : String(error);
        throw new AIError(originalMessage, contextString, prompt);
    }
};

export const generateTeamComponents = async (prompt: string, globalApiKey: string): Promise<TeamComponent[]> => {
    try {
        checkApiKey(globalApiKey);
        const ai = getGenAIClient(globalApiKey);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are an AI that designs teams of specialized AI agents. You will generate a team of exactly 3 agents. Your output must be a valid JSON array.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        team: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    jobTitle: { type: Type.STRING },
                                    role: { type: Type.STRING },
                                    goals: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    specializations: { type: Type.ARRAY, items: { type: Type.STRING } }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!response.text || response.text.trim() === '') {
            throw new AIError("AI model returned an empty JSON response.", 'generateTeamComponents', prompt);
        }
        const json = JSON.parse(response.text);
        if (!json.team || json.team.length !== 3) {
            throw new Error("AI did not return a team of 3 agents.");
        }
        return json.team;
    } catch (error) {
        const contextString = 'generateTeamComponents';
        console.error(`Error in ${contextString}:`, error);
        const originalMessage = error instanceof Error ? error.message : String(error);
        throw new AIError(originalMessage, contextString, prompt);
    }
};


export const generateFinalAgents = async (components: TeamComponent[], globalApiKey: string): Promise<Partial<Agent>[]> => {
    const prompt = `For the following team of AI agents, generate the final details for each.
    Team Components:
    ${JSON.stringify(components, null, 2)}
    Return a valid JSON array where each object contains the details for one agent.`;
     try {
        checkApiKey(globalApiKey);
        const ai = getGenAIClient(globalApiKey);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are an AI that finalizes the profiles of AI agents. Your output must be a valid JSON array.",
                 responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        final_agents: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    systemInstruction: { type: Type.STRING },
                                    color: { type: Type.STRING },
                                    textColor: { type: Type.STRING },
                                    outputFormat: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        if (!response.text || response.text.trim() === '') {
            throw new AIError("AI model returned an empty JSON response.", 'generateFinalAgents', prompt);
        }
        const json = JSON.parse(response.text);
        if (!json.final_agents || json.final_agents.length !== 3) {
            throw new Error("AI did not return details for 3 agents.");
        }
        return json.final_agents;
    } catch (error) {
        const contextString = 'generateFinalAgents';
        console.error(`Error in ${contextString}:`, error);
        const originalMessage = error instanceof Error ? error.message : String(error);
        throw new AIError(originalMessage, contextString, prompt);
    }
}