'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '@/contexts/StateProvider';
import { EditIcon, SparklesIcon, SettingsIcon, AlignLeftIcon, BookmarkIcon, HistoryIcon, PlusIcon, MicrophoneIcon, MicrophoneOffIcon, ChevronUpIcon, ChevronDownIcon } from '@/components/Icons';

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
        isConnected,
        isConnecting,
        startSession,
        closeSession,
        isHeaderExpanded,
        setIsHeaderExpanded,
    } = useAppContext();

    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const indicatorTimerRef = useRef<number | null>(null);
    const indicatorKey = useRef(0); // For resetting animation

    const isChatActive = !!activeConversation;
    const isLiveModeActive = isConnected || isConnecting;

    const handleEditTitle = () => {
        if (!isChatActive) return;
        const newTitle = prompt("Enter new conversation title:", activeConversation.title);
        if (newTitle && newTitle.trim() !== '') {
            handleUpdateConversationTitle(activeConversation.id, newTitle);
        }
    };
    
    const handleToggleLiveMode = () => {
        if (isLiveModeActive) {
            closeSession();
        } else {
            startSession();
        }
    };

    const actions = [
        { id: 'toggle-header', title: isHeaderExpanded ? 'Collapse Header' : 'Expand Header', icon: isHeaderExpanded ? <ChevronUpIcon className="w-5 h-5"/> : <ChevronDownIcon className="w-5 h-5"/>, action: () => setIsHeaderExpanded(!isHeaderExpanded), disabled: false },
        { id: 'live', title: isLiveModeActive ? 'Stop Live Session' : 'Start Live Session', icon: isLiveModeActive ? <MicrophoneOffIcon className="w-5 h-5"/> : <MicrophoneIcon className="w-5 h-5"/>, action: handleToggleLiveMode, disabled: !isChatActive },
        { id: 'edit', title: 'Edit Title', icon: <EditIcon className="w-5 h-5"/>, action: handleEditTitle, disabled: !isChatActive || isLiveModeActive },
        { id: 'gen-title', title: 'Generate Title with AI', icon: <SparklesIcon className="w-5 h-5"/>, action: () => handleGenerateTitle(activeConversation!.id), disabled: !isChatActive || activeConversation?.isGeneratingTitle || isLiveModeActive },
        { id: 'conv-settings', title: 'Conversation Settings', icon: <SettingsIcon className="w-5 h-5"/>, action: () => setIsConversationSettingsOpen(true), disabled: !isChatActive || isLiveModeActive },
        { id: 'archive', title: 'Message Archive', icon: <AlignLeftIcon className="w-5 h-5"/>, action: () => setIsArchiveOpen(true), disabled: isLiveModeActive },
        { id: 'bookmarks', title: 'Bookmarks', icon: <BookmarkIcon className="w-5 h-5"/>, action: () => setIsBookmarksPanelOpen(!isBookmarksPanelOpen), disabled: !isChatActive || isLiveModeActive },
        { id: 'history', title: 'History', icon: <HistoryIcon className="w-5 h-5"/>, action: handleShowHistory, disabled: !isChatActive || isLiveModeActive },
    ];
    
    useEffect(() => {
        return () => {
            if (indicatorTimerRef.current) clearTimeout(indicatorTimerRef.current);
        };
    }, []);

    const handleActionClick = (index: number, action: () => void) => {
        if (indicatorTimerRef.current) clearTimeout(indicatorTimerRef.current);
        indicatorKey.current += 1;
        setActiveIndex(index);
        action();
        indicatorTimerRef.current = window.setTimeout(() => setActiveIndex(null), 2000);
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
                    background: linear-gradient(45deg, #1a1a1a, #262626);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.2);
                }
                .ConversationActions .action-button {
                    position: relative;
                    width: 40px;
                    height: 32px;
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
                .ConversationActions .live-active-btn {
                    color: #f87171; /* red-400 */
                    animation: live-pulse 1.5s infinite;
                }
                @keyframes live-pulse {
                    0%, 100% { background-color: rgba(239, 68, 68, 0.2); box-shadow: 0 0 8px rgba(239, 68, 68, 0.5); }
                    50% { background-color: rgba(239, 68, 68, 0.1); box-shadow: 0 0 12px rgba(239, 68, 68, 0.7); }
                }
                @keyframes flash-and-fade {
                    0%   { opacity: 1; } 80%  { opacity: 1; } 90%  { opacity: 0.3; } 100% { opacity: 0; }
                }
                .ConversationActions .pill-indicator {
                    position: absolute;
                    bottom: 4px;
                    left: 4px;
                    height: 3px;
                    width: 40px;
                    background: linear-gradient(to right, var(--main-color), var(--secondary-color));
                    border-radius: 2px;
                    transition: transform 0.4s cubic-bezier(0.45, 0, 0.55, 1);
                    z-index: 1;
                    opacity: 0;
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
                            className={`action-button ${action.id === 'live' && isLiveModeActive ? 'live-active-btn' : ''}`}
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
