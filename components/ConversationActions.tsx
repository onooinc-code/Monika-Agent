import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { EditIcon, SparklesIcon, SettingsIcon, AlignLeftIcon, BookmarkIcon, HistoryIcon, PlusIcon } from './Icons.tsx';

export const ConversationActions: React.FC = () => {
    const { 
        activeConversation,
        setIsConversationSettingsOpen,
        isBookmarksPanelOpen,
        setIsBookmarksPanelOpen,
        setIsArchiveOpen,
        handleShowHistory, 
        handleGenerateTitle,
        handleUpdateConversationTitle,
    } = useAppContext();

    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const indicatorTimerRef = useRef<number | null>(null);
    const indicatorKey = useRef(0); // For resetting animation

    const isChatActive = !!activeConversation;

    const handleEditTitle = () => {
        if (!isChatActive) return;
        const newTitle = prompt("Enter new conversation title:", activeConversation.title);
        if (newTitle && newTitle.trim() !== '') {
            handleUpdateConversationTitle(activeConversation.id, newTitle);
        }
    };

    const actions = [
        { id: 'edit', title: 'Edit Title', icon: <EditIcon className="w-5 h-5"/>, action: handleEditTitle, disabled: !isChatActive },
        { id: 'gen-title', title: 'Generate Title with AI', icon: <SparklesIcon className="w-5 h-5"/>, action: () => handleGenerateTitle(activeConversation!.id), disabled: !isChatActive || activeConversation?.isGeneratingTitle },
        { id: 'conv-settings', title: 'Conversation Settings', icon: <SettingsIcon className="w-5 h-5"/>, action: () => setIsConversationSettingsOpen(true), disabled: !isChatActive },
        { id: 'archive', title: 'Message Archive', icon: <AlignLeftIcon className="w-5 h-5"/>, action: () => setIsArchiveOpen(true), disabled: false },
        { id: 'bookmarks', title: 'Bookmarks', icon: <BookmarkIcon className="w-5 h-5"/>, action: () => setIsBookmarksPanelOpen(!isBookmarksPanelOpen), disabled: !isChatActive },
        { id: 'history', title: 'History', icon: <HistoryIcon className="w-5 h-5"/>, action: handleShowHistory, disabled: !isChatActive },
        { id: 'placeholder1', title: 'Future Action 1', icon: <PlusIcon className="w-5 h-5"/>, action: () => {}, disabled: true },
        { id: 'placeholder2', title: 'Future Action 2', icon: <PlusIcon className="w-5 h-5"/>, action: () => {}, disabled: true },
        { id: 'placeholder3', title: 'Future Action 3', icon: <PlusIcon className="w-5 h-5"/>, action: () => {}, disabled: true },
        { id: 'placeholder4', title: 'Future Action 4', icon: <PlusIcon className="w-5 h-5"/>, action: () => {}, disabled: true },
    ];
    
    useEffect(() => {
        return () => {
            if (indicatorTimerRef.current) {
                clearTimeout(indicatorTimerRef.current);
            }
        };
    }, []);

    const handleActionClick = (index: number, action: () => void) => {
        if (indicatorTimerRef.current) {
            clearTimeout(indicatorTimerRef.current);
        }
        indicatorKey.current += 1; // Change key to force re-render and restart animation
        setActiveIndex(index);
        action();
        indicatorTimerRef.current = window.setTimeout(() => {
            setActiveIndex(null);
        }, 2000);
    };
    
    const indicatorTransform = activeIndex !== null ? `translateX(calc(${activeIndex} * (100% + 6px)))` : 'translateX(0)';
    
    return (
        <>
            <style>{`
                .ConversationActions .pill-radio-container {
                    --main-color: #ff6ec4;
                    --secondary-color: #7873f5;
                    --text-color: #ddd;

                    display: flex;
                    position: relative;
                    border-radius: 20px;
                    padding: 4px;
                    gap: 6px;
                    width: fit-content;
                    height: 100%;
                    align-items: center;
                    
                    /* Matching ConversationTitle */
                    background: linear-gradient(45deg, #1a1a1a, #262626);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.2);
                }

                .ConversationActions .action-button {
                    position: relative;
                    width: 40px; /* Fixed width */
                    height: 32px; /* Fixed height */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    background: transparent;
                    border-radius: 16px;
                    cursor: pointer;
                    color: var(--text-color);
                    transition: all 0.2s ease-in-out;
                    z-index: 2;
                }

                .ConversationActions .action-button:hover:not(:disabled) {
                    color: var(--main-color);
                    background-color: rgba(255,255,255,0.05);
                }

                .ConversationActions .action-button:disabled {
                    color: #555;
                    cursor: not-allowed;
                }
                
                @keyframes flash-and-fade {
                    0%   { opacity: 1; }
                    80%  { opacity: 1; }
                    90%  { opacity: 0.3; }
                    100% { opacity: 0; }
                }

                .ConversationActions .pill-indicator {
                    position: absolute;
                    bottom: 4px;
                    left: 4px;
                    height: 3px;
                    width: 40px; /* Same as button width */
                    background: linear-gradient(to right, var(--main-color), var(--secondary-color));
                    border-radius: 2px;
                    transition: transform 0.4s cubic-bezier(0.45, 0, 0.55, 1);
                    z-index: 1;
                    opacity: 0; /* Hidden by default */
                }

                 .ConversationActions .pill-indicator.visible {
                    opacity: 1;
                    animation: flash-and-fade 2s ease-in-out forwards;
                }
            `}</style>
            <div className="ConversationActions h-full">
                <div className="pill-radio-container">
                    {actions.map((action, index) => (
                        <button
                            key={action.id}
                            title={action.title}
                            className="action-button"
                            onClick={() => handleActionClick(index, action.action)}
                            disabled={action.disabled}
                        >
                            {action.icon}
                        </button>
                    ))}
                    {activeIndex !== null && (
                      <div 
                          key={indicatorKey.current}
                          className="pill-indicator visible"
                          style={{ transform: indicatorTransform }}
                      ></div>
                    )}
                </div>
            </div>
        </>
    );
};