import { getGenAIClient } from '@/services/gemini/client';
import { Agent, Message, AgentManager, ManualSuggestion, PipelineStep, PlanStep } from '@/types/index';
import { buildContext } from '@/services/utils/contextBuilder';
import { Type } from "@google/genai";
import { AIError } from '@/services/utils/errorHandler';

export interface ModerationResult {
    critique: string | null;
    decision: 'speak' | 'wait_for_user';
    nextSpeakerAgentId: string | null;
    taskForNextSpeaker: string | null;
    rationale: string;
}

export interface DynamicPlanResult {
    plan: PlanStep[];
    planRationale: string;
}

export const decideNextSpeaker = async (
    latestText: string, 
    agents: Agent[], 
    messages: Message[], 
    manager: AgentManager,
    systemInstructionOverride: string | undefined,
    globalApiKey: string,
): Promise<{ result: { nextSpeaker: string | null; newTopic?: string }; pipeline: PipelineStep[] }> => {
    const pipeline: PipelineStep[] = [];
    const startTime = performance.now();

    const context = buildContext(messages);
    const systemInstruction = systemInstructionOverride || manager.systemInstruction;
    const prompt = `Conversation History:\n${context}\n\nUser's latest message: "${latestText}"\n\nAnalyze the user's latest message. First, determine if it introduces a new topic distinct from the prior conversation. Second, based on the message and history, decide which agent should respond next.`;
    
    pipeline.push({
        stage: 'Context Assembly',
        input: { latestText, messageCount: messages.length, managerSystemInstruction: systemInstruction },
        output: prompt,
    });
    
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
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        nextSpeaker: { type: Type.STRING, description: "The ID of the agent that should speak next." },
                        new_topic: { type: Type.STRING, description: "The name of the new topic if one is detected, otherwise null." }
                    }
                }
            }
        });

        const modelDuration = performance.now() - startTime;
        
        if (!response.text || response.text.trim() === '') {
            throw new AIError("AI model returned an empty JSON response.", "decideNextSpeaker", prompt);
        }

        let json;
        try {
            json = JSON.parse(response.text);
        } catch (e) {
            const contextString = 'decideNextSpeaker';
            console.error(`Error in ${contextString}:`, e);
            const originalMessage = e instanceof Error ? e.message : String(e);
            throw new AIError(originalMessage, contextString, prompt, response.text);
        }

        const nextSpeaker = typeof json.nextSpeaker === 'string' ? json.nextSpeaker : null;
        const newTopic = typeof json.new_topic === 'string' && json.new_topic.trim() ? json.new_topic.trim() : undefined;


        pipeline.push({
            stage: 'Model Invocation: decideNextSpeaker',
            input: prompt,
            output: json,
            durationMs: Math.round(modelDuration),
        });

        return { result: { nextSpeaker, newTopic }, pipeline };
    } catch (error) {
        const contextString = 'decideNextSpeaker';
        console.error(`Error in ${contextString}:`, error);
        const originalMessage = error instanceof Error ? error.message : String(error);
        throw new AIError(originalMessage, contextString, prompt);
    }
};


export const generateManualSuggestions = async (
    latestText: string,
    agents: Agent[],
    messages: Message[],
    manager: AgentManager,
    globalApiKey: string,
): Promise<{ result: ManualSuggestion[], pipeline: PipelineStep[] }> => {
    const pipeline: PipelineStep[] = [];
    const startTime = performance.now();

    const context = buildContext(messages);
    const agentProfiles = agents.map(a => `- ${a.id}: ${a.name} (${a.systemInstruction})`).join('\n');
    const prompt = `Conversation History:\n${context}\n\nUser's latest message: "${latestText}"\n\nAgent Profiles:\n${agentProfiles}\n\nSuggest 3 agents who could respond to the user's message and provide a brief reason for each.`;

    pipeline.push({
        stage: 'Context Assembly',
        input: { latestText, messageCount: messages.length, agentProfiles },
        output: prompt,
    });

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
                systemInstruction: "You are an AI assistant that suggests which agent should speak next in a multi-agent chat.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    agentId: { type: Type.STRING },
                                    reason: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        const modelDuration = performance.now() - startTime;
        
        if (!response.text || response.text.trim() === '') {
            throw new AIError("AI model returned an empty JSON response.", "generateManualSuggestions", prompt);
        }

        let json;
        try {
            json = JSON.parse(response.text);
        } catch (e) {
            const contextString = 'generateManualSuggestions';
            console.error(`Error in ${contextString}:`, e);
            const originalMessage = e instanceof Error ? e.message : String(e);
            throw new AIError(originalMessage, contextString, prompt, response.text);
        }

        const suggestions: ManualSuggestion[] = (Array.isArray(json.suggestions)) 
            ? json.suggestions.filter((s: any) => s && typeof s.agentId === 'string' && typeof s.reason === 'string') : [];

        pipeline.push({
            stage: 'Model Invocation: generateManualSuggestions',
            input: prompt,
            output: json,
            durationMs: Math.round(modelDuration),
        });

        return { result: suggestions, pipeline };
    } catch (error) {
        const contextString = 'generateManualSuggestions';
        console.error(`Error in ${contextString}:`, error);
        const originalMessage = error instanceof Error ? error.message : String(error);
        throw new AIError(originalMessage, contextString, prompt);
    }
};

export const generateDynamicPlan = async (
    latestText: string,
    agents: Agent[],
    messages: Message[],
    manager: AgentManager,
    globalApiKey: string,
): Promise<{ result: DynamicPlanResult, pipeline: PipelineStep[] }> => {
    const pipeline: PipelineStep[] = [];
    const startTime = performance.now();

    const context = buildContext(messages);
    const agentProfiles = agents.map(a => `- ${a.id}: ${a.name} (${a.job}) - ${a.role}`).join('\n');
    const prompt = `
        You are an expert AI Manager. Your job is to create a step-by-step plan to address the user's request using a team of AI agents.
        **Available Agents:**
        ${agentProfiles}
        **Conversation History:**
        ${context}
        **User's latest message:** "${latestText}"
        **Your Task:**
        You MUST formulate a plan. Create a sequence of tasks for the agents to follow. Your response MUST be a valid JSON object.
    `;
    
    pipeline.push({
        stage: 'Plan Generation Context Assembly',
        input: { latestText, agentCount: agents.length, messageCount: messages.length },
        output: prompt,
    });

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
                systemInstruction: "You are an expert AI project manager. Your goal is to create a sequence of tasks for other AI agents to complete based on a user's request. Respond with only a valid JSON object.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        planRationale: { type: Type.STRING },
                        plan: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    agentId: { type: Type.STRING },
                                    task: { type: Type.STRING },
                                    rationale: { type: Type.STRING },
                                }
                            }
                        }
                    }
                }
            }
        });
        
        const modelDuration = performance.now() - startTime;
        
        if (!response.text || response.text.trim() === '') {
            throw new AIError("AI model returned an empty JSON response.", "generateDynamicPlan", prompt);
        }
        
        let json;
        try {
            json = JSON.parse(response.text);
        } catch (e) {
            const contextString = 'generateDynamicPlan';
            console.error(`Error in ${contextString}:`, e);
            const originalMessage = e instanceof Error ? e.message : String(e);
            throw new AIError(originalMessage, contextString, prompt, response.text);
        }

        const validatedPlan = (Array.isArray(json.plan)) 
            ? json.plan.filter((s: any) => s && typeof s.agentId === 'string' && typeof s.task === 'string') : [];

        const planResult: DynamicPlanResult = {
            plan: validatedPlan,
            planRationale: typeof json.planRationale === 'string' ? json.planRationale : '',
        };

        pipeline.push({
            stage: 'Model Invocation: generateDynamicPlan',
            input: prompt,
            output: json,
            durationMs: Math.round(modelDuration),
        });

        return { result: planResult, pipeline };
    } catch (error) {
        const contextString = 'generateDynamicPlan';
        console.error(`Error in ${contextString}:`, error);
        const originalMessage = error instanceof Error ? error.message : String(error);
        throw new AIError(originalMessage, contextString, prompt);
    }
};


export const moderateTurn = async (
    agents: Agent[],
    messages: Message[],
    manager: AgentManager,
    rules: string,
    globalApiKey: string,
): Promise<{ result: ModerationResult | null; pipeline: PipelineStep[] }> => {
    const pipeline: PipelineStep[] = [];
    const startTime = performance.now();
    const context = buildContext(messages);
    const agentProfiles = agents.map(a => `- ${a.id}: ${a.name} (${a.job})`).join('\n');
    const lastMessage = messages[messages.length - 1];
    
    const prompt = `
        You are an expert AI conversation moderator.
        **Available Agents:**
        ${agentProfiles}
        **Conversation Rules:**
        ${rules}
        **Full Conversation History:**
        ${context}
        **Your Task:**
        Analyze the state of the conversation and decide the next step. Your response MUST be a valid JSON object.
    `;

    pipeline.push({
        stage: 'Moderation Context Assembly',
        input: { rule: rules, agentCount: agents.length, messageCount: messages.length },
        output: prompt,
    });
    
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
                systemInstruction: "You are an AI conversation moderator. Your response must be a single, valid JSON object following the specified schema.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        critique: { type: Type.STRING, nullable: true },
                        decision: { type: Type.STRING, enum: ['speak', 'wait_for_user'] },
                        nextSpeakerAgentId: { type: Type.STRING, nullable: true },
                        taskForNextSpeaker: { type: Type.STRING, nullable: true },
                        rationale: { type: Type.STRING },
                    },
                    required: ["critique", "decision", "nextSpeakerAgentId", "taskForNextSpeaker", "rationale"]
                }
            }
        });

        const modelDuration = performance.now() - startTime;
        
        if (!response.text || response.text.trim() === '') {
            throw new AIError("AI model returned an empty JSON response.", "moderateTurn", prompt);
        }
        
        let json;
        try {
            json = JSON.parse(response.text);
        } catch (e) {
            const contextString = 'moderateTurn';
            console.error(`Error in ${contextString}:`, e);
            const originalMessage = e instanceof Error ? e.message : String(e);
            throw new AIError(originalMessage, contextString, prompt, response.text);
        }
        
        pipeline.push({
            stage: 'Model Invocation: moderateTurn',
            input: prompt,
            output: json,
            durationMs: Math.round(modelDuration),
        });

        return { result: json as ModerationResult, pipeline };

    } catch (error) {
        const contextString = 'moderateTurn';
        console.error(`Error in ${contextString}:`, error);
        const originalMessage = error instanceof Error ? error.message : String(error);
        throw new AIError(originalMessage, contextString, prompt);
    }
};