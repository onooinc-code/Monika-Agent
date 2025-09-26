
import { useEffect, useCallback } from 'react';
// FIX: Corrected import path for types to point to the barrel file.
import { Conversation, AgentManager, Message } from '@/types/index';
import * as TitleService from '@/services/analysis/titleService';
import { isConversationArray } from '@/types/utils';
import { useLocalStorage } from './useLocalStorage';

export const useConversationManager = () => {
    const [conversations, setConversations] = useLocalStorage<Conversation[]>('conversations', []);
    const [activeConversationId, setActiveConversationId] = useLocalStorage<string | null>('activeConversationId', null);
    
    const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

    useEffect(() => {
        const activeConvExists = activeConversationId ? conversations.some(c => c.id === activeConversationId) : false;

        if (!activeConvExists) {
            if (conversations.length > 0) {
                setActiveConversationId(conversations[0].id);
            } else if (activeConversationId !== null) {
                setActiveConversationId(null);
            }
        }
    }, [conversations, activeConversationId, setActiveConversationId]);


    const handleNewConversation = useCallback(() => {
        const newConversation: Conversation = {
            id: `conv-${Date.now()}`,
            title: 'New Chat',
            messages: [],
            featureFlags: {
                memoryExtraction: true,
                proactiveSuggestions: true,
                autoSummarization: true,
            },
            discussionSettings: {
                enabled: false,
                rules: 'Agents should build on each other\'s ideas and work towards a common goal. Keep responses concise.',
            },
            managerSettings: {
                showManagerInsights: false,
            }
        };
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);
    }, [setConversations, setActiveConversationId]);

    const handleDeleteConversation = useCallback((conversationId: string) => {
        setConversations(prev => {
            const newConversations = prev.filter(c => c.id !== conversationId);
            if (activeConversationId === conversationId) {
                setActiveConversationId(newConversations.length > 0 ? newConversations[0].id : null);
            }
            return newConversations;
        });
    }, [activeConversationId, setConversations, setActiveConversationId]);

    const handleSelectConversation = useCallback((conversationId: string) => {
        setActiveConversationId(conversationId);
    }, [setActiveConversationId]);
    
    const handleUpdateConversation = useCallback((conversationId: string, updates: Partial<Conversation>) => {
        setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, ...updates } : c));
    }, [setConversations]);

    const handleUpdateConversationTitle = useCallback((conversationId: string, title: string) => {
        handleUpdateConversation(conversationId, { title });
    }, [handleUpdateConversation]);

    const handleGenerateTitle = useCallback(async (conversationId: string, agentManager: AgentManager, globalApiKey: string, onComplete: (id: string, updates: Partial<Conversation>) => void) => {
        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation || conversation.messages.length === 0) {
             onComplete(conversationId, { isGeneratingTitle: false });
             return;
        }

        try {
            const newTitle = await TitleService.generateConversationTitle(conversation.messages, agentManager, globalApiKey);
            handleUpdateConversationTitle(conversationId, newTitle);
        } catch(error) {
            const errorMessage = (error instanceof Error) ? error.message : 'Failed to generate title due to an unexpected error.';
            alert(`Title Generation Failed: ${errorMessage}`);
        } finally {
            onComplete(conversationId, { isGeneratingTitle: false });
        }
    }, [conversations, handleUpdateConversationTitle]);

    const handleExportConversations = useCallback(() => {
        try {
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(conversations, null, 2)
            )}`;
            const link = document.createElement('a');
            const date = new Date().toISOString().split('T')[0];
            link.href = jsonString;
            link.download = `ai-assistant-backup-${date}.json`;
            link.click();
        } catch (error) {
            console.error("Failed to export conversations:", error);
            alert("An error occurred while exporting your conversations.");
        }
    }, [conversations]);

    const handleImportConversations = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File content is not readable text.");
                }
                const importedData = JSON.parse(text);

                if (!isConversationArray(importedData)) {
                    throw new Error("Invalid file format. The file must contain an array of conversations.");
                }

                setConversations(prev => {
                    const existingIds = new Set(prev.map(c => c.id));
                    const newConversations = importedData.filter(c => !existingIds.has(c.id));
                    const updatedConversations = [...newConversations, ...prev];
                    return updatedConversations;
                });
                alert(`${importedData.length} conversations were found. New conversations have been added to your list.`);

            } catch (error) {
                console.error("Failed to import conversations:", error);
                const message = (error instanceof Error) ? error.message : "An unknown error occurred during import.";
                alert(`Import Failed: ${message}`);
            }
        };
        reader.readAsText(file);
    }, [setConversations]);

    const handleToggleMessageBookmark = useCallback((messageId: string) => {
        setConversations(prev => prev.map(c => {
            if (c.id === activeConversationId) {
                const updatedMessages = c.messages.map(m => 
                    m.id === messageId ? { ...m, isBookmarked: !m.isBookmarked } : m
                );
                return { ...c, messages: updatedMessages };
            }
            return c;
        }));
    }, [activeConversationId, setConversations]);

    const handleDeleteMessage = useCallback((messageId: string) => {
        if (!window.confirm('Are you sure you want to delete this message? This cannot be undone.')) return;
        setConversations(prev => prev.map(c => {
            if (c.id === activeConversationId) {
                const updatedMessages = c.messages.filter(m => m.id !== messageId);
                return { ...c, messages: updatedMessages };
            }
            return c;
        }));
    }, [activeConversationId, setConversations]);

    const handleToggleMessageEdit = useCallback((messageId: string) => {
        setConversations(prev => prev.map(c => {
            if (c.id === activeConversationId) {
                const updatedMessages = c.messages.map(m => 
                    m.id === messageId ? { ...m, isEditing: !m.isEditing } : { ...m, isEditing: false }
                );
                return { ...c, messages: updatedMessages };
            }
            return c;
        }));
    }, [activeConversationId, setConversations]);

    const handleUpdateMessageText = useCallback((messageId: string, newText: string) => {
        setConversations(prev => prev.map(c => {
            if (c.id === activeConversationId) {
                const updatedMessages = c.messages.map(m => 
                    m.id === messageId ? { ...m, text: newText, isEditing: false } : m
                );
                return { ...c, messages: updatedMessages };
            }
            return c;
        }));
    }, [activeConversationId, setConversations]);

    const handleAppendToMessageText = useCallback((conversationId: string, messageId: string, textChunk: string) => {
        setConversations(prev => prev.map(c => {
            if (c.id === conversationId) {
                const messages = c.messages.map(m => {
                    if (m.id === messageId) {
                        return { ...m, text: m.text + textChunk, isStreaming: true };
                    }
                    return m;
                });
                return { ...c, messages };
            }
            return c;
        }));
    }, [setConversations]);

    const handleFinalizeMessage = useCallback((conversationId: string, messageId: string, finalMessageData: Partial<Message>) => {
        setConversations(prev => prev.map(c => {
            if (c.id === conversationId) {
                const messages = c.messages.map(m => {
                    if (m.id === messageId) {
                        return { ...m, ...finalMessageData, isStreaming: false };
                    }
                    return m;
                });
                return { ...c, messages };
            }
            return c;
        }));
    }, [setConversations]);

    const handleChangeAlternativeResponse = useCallback((messageId: string, direction: 'next' | 'prev') => {
        setConversations(prev => prev.map(c => {
            if (c.id === activeConversationId) {
                const updatedMessages = c.messages.map(m => {
                    if (m.id === messageId && m.alternatives && m.alternatives.length > 0) {
                        let currentIndex = m.activeAlternativeIndex ?? -1;
                        let nextIndex;
                        
                        if (direction === 'next') {
                            nextIndex = currentIndex + 1;
                            if (nextIndex >= m.alternatives.length) nextIndex = m.alternatives.length - 1; // Cap at the end
                        } else { // 'prev'
                            nextIndex = currentIndex - 1;
                            if (nextIndex < -1) nextIndex = -1; // Cap at original
                        }
                        
                        return { ...m, activeAlternativeIndex: nextIndex };
                    }
                    return m;
                });
                return { ...c, messages: updatedMessages };
            }
            return c;
        }));
    }, [activeConversationId, setConversations]);

    return {
        conversations,
        activeConversationId,
        activeConversation,
        handleNewConversation,
        handleDeleteConversation,
        handleSelectConversation,
        handleUpdateConversation,
        handleUpdateConversationTitle,
        handleGenerateTitle,
        handleExportConversations,
        handleImportConversations,
        handleToggleMessageBookmark,
        handleDeleteMessage,
        handleToggleMessageEdit,
        handleUpdateMessageText,
        handleChangeAlternativeResponse,
        handleAppendToMessageText,
        handleFinalizeMessage,
    };
};
