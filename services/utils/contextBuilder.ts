


// FIX: Corrected the import path for types to point to the barrel file.
import { Message } from '@/types/index';

export const buildContext = (messages: Message[]): string => {
    return messages.map(m => `${m.sender}: ${m.text}`).join('\n');
};

/**
 * Builds a focused context for the AI based on the user's "continuous awareness" requirements.
 * @param messages The full list of messages in the conversation.
 * @returns An object containing messages from the current topic and a list of recent topic names.
 */
export const buildAwarenessContext = (messages: Message[]): { currentTopicMessages: Message[], recentTopicNames: string[] } => {
    // 1. Find the index of the last topic divider
    const lastDividerIndex = messages.slice().reverse().findIndex(m => m.messageType === 'topic_divider');
    const currentTopicStartIndex = lastDividerIndex === -1 ? 0 : messages.length - lastDividerIndex;

    // 2. Get all messages from the current topic onwards
    const currentTopicMessages = messages.slice(currentTopicStartIndex);

    // 3. Get all topic names from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentTopicNames = messages
        .filter(m => 
            m.messageType === 'topic_divider' && 
            new Date(m.timestamp) > sevenDaysAgo
        )
        .map(m => m.text);

    return {
        currentTopicMessages,
        recentTopicNames,
    };
};