
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage.ts';
import { Conversation, AgentManager, Message, Agent } from '../../types/index.ts';
import * as TitleService from '../../services/analysis/titleService.ts';
import { isConversationArray } from '../../types/utils.ts';

export const useConversationManager = () => {
    const [conversations, setConversations] = useLocalStorage<Conversation[]>('conversations', []);
    const [activeConversationId, setActiveConversationId] = useLocalStorage<string | null>('active-conversation-id', null);
    
    // Effect to sanitize conversations data loaded from localStorage, running only once on mount.
    // This prevents crashes from malformed data like [null] or objects without an 'id'.
    useEffect(() => {
        if (Array.isArray(conversations)) {
            const needsCleaning = conversations.some(c => !c || !c.id);
            if (needsCleaning) {
                console.warn("Corrupted conversation data found in localStorage. Cleaning up.");
                setConversations(conversations.filter(c => c && c.id));
            }
        } else if (conversations) {
            // If it's not an array but is truthy, it's invalid. Reset.
            console.error("Invalid conversation data format in localStorage. Resetting.");
            setConversations([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures this runs only once after the initial render.

    const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

    useEffect(() => {
        const activeConvExists = activeConversationId ? conversations.some(c => c.id === activeConversationId) : false;

        // If the active conversation doesn't exist (or isn't set), find a new one.
        if (!activeConvExists) {
            if (conversations.length > 0) {
                // Set the first valid conversation as active.
                setActiveConversationId(conversations[0].id);
            } else if (activeConversationId !== null) {
                // If no conversations exist, clear the active ID.
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
                alert(`Import failed: ${(error as Error).message}`);
            }
        };
        reader.onerror = () => {
             alert("An error occurred while reading the file.");
        }
        reader.readAsText(file);
    }, [setConversations]);

    const handleToggleMessageBookmark = useCallback((messageId: string) => {
        setConversations(prevConversations => {
            const activeId = activeConversationId;
            if (!activeId) return prevConversations;
            return prevConversations.map(conv => {
                if (conv.id !== activeId) return conv;
                const updatedMessages = conv.messages.map(msg =>
                    msg.id === messageId ? { ...msg, isBookmarked: !msg.isBookmarked } : msg
                );
                return { ...conv, messages: updatedMessages };
            });
        });
    }, [activeConversationId, setConversations]);
    
    const handleDeleteMessage = useCallback((messageId: string) => {
        if (!window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
            return;
        }
        setConversations(prevConversations => {
            const activeId = activeConversationId;
            if (!activeId) return prevConversations;
            return prevConversations.map(conv => {
                if (conv.id !== activeId) return conv;
                const updatedMessages = conv.messages.filter(msg => msg.id !== messageId);
                return { ...conv, messages: updatedMessages };
            });
        });
    }, [activeConversationId, setConversations]);
    
    const handleToggleMessageEdit = useCallback((messageId: string) => {
        setConversations(prevConversations => {
            const activeId = activeConversationId;
            if (!activeId) return prevConversations;
            return prevConversations.map(conv => {
                if (conv.id !== activeId) return conv;
                const updatedMessages = conv.messages.map(msg => ({
                    ...msg,
                    isEditing: msg.id === messageId ? !msg.isEditing : false,
                }));
                return { ...conv, messages: updatedMessages };
            });
        });
    }, [activeConversationId, setConversations]);
    
    const handleUpdateMessageText = useCallback((messageId: string, newText: string) => {
        setConversations(prevConversations => {
            const activeId = activeConversationId;
            if (!activeId) return prevConversations;
            return prevConversations.map(conv => {
                if (conv.id !== activeId) return conv;
                const updatedMessages = conv.messages.map(msg =>
                    msg.id === messageId ? { ...msg, text: newText, isEditing: false } : msg
                );
                return { ...conv, messages: updatedMessages };
            });
        });
    }, [activeConversationId, setConversations]);

    const handleChangeAlternativeResponse = useCallback((messageId: string, direction: 'next' | 'prev') => {
        setConversations(prevConversations => {
            const activeId = activeConversationId;
            if (!activeId) return prevConversations;
            return prevConversations.map(conv => {
                if (conv.id !== activeId) return conv;
                const updatedMessages = conv.messages.map(msg => {
                    if (msg.id !== messageId) return msg;

                    const totalAlternatives = msg.alternatives?.length ?? 0;
                    let currentIndex = msg.activeAlternativeIndex ?? -1;

                    if (direction === 'next') {
                        currentIndex = Math.min(currentIndex + 1, totalAlternatives - 1);
                    } else {
                        currentIndex = Math.max(currentIndex - 1, -1);
                    }
                    return { ...msg, activeAlternativeIndex: currentIndex };
                });
                return { ...conv, messages: updatedMessages };
            });
        });
    }, [activeConversationId, setConversations]);
    
    const handleAppendToMessageText = useCallback((conversationId: string, messageId: string, textChunk: string) => {
        setConversations(prevConversations => prevConversations.map(conv => {
            if (conv.id !== conversationId) return conv;
            const updatedMessages = conv.messages.map(msg => 
                msg.id === messageId ? { ...msg, text: (msg.text || '') + textChunk } : msg
            );
            return { ...conv, messages: updatedMessages };
        }));
    }, [setConversations]);

    const handleFinalizeMessage = useCallback((conversationId: string, messageId: string, finalMessageData: Partial<Message>) => {
        setConversations(prevConversations => prevConversations.map(conv => {
            if (conv.id !== conversationId) return conv;
            const updatedMessages = conv.messages.map(msg =>
                msg.id === messageId ? { ...msg, ...finalMessageData } : msg
            );
            return { ...conv, messages: updatedMessages };
        }));
    }, [setConversations]);

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
