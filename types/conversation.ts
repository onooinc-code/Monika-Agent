
import { Message } from './message';

export interface DiscussionSettings {
    enabled: boolean;
    rules: string; // The overall system prompt for the discussion
}

export interface ManagerSettings {
    showManagerInsights: boolean;
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    isGeneratingTitle?: boolean;
    systemInstructionOverride?: string;
    featureFlags?: {
        memoryExtraction: boolean;
        proactiveSuggestions: boolean;

        autoSummarization: boolean;
    };
    discussionSettings?: DiscussionSettings;
    managerSettings?: ManagerSettings;
}

export type ConversationMode = 'Continuous' | 'Manual' | 'Dynamic';
