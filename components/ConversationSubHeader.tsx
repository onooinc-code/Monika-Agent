
import React, { useState, useEffect, useRef } from 'react';
import { Conversation } from '../types/index.ts';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { Spinner } from './Spinner.tsx';
import { EditIcon, CheckIcon, SparklesIcon, SettingsIcon, HistoryIcon, BookmarkIcon, AlignLeftIcon, EllipsisVerticalIcon } from './Icons.tsx';
import { safeRender } from '../services/utils/safeRender.ts';


const HeaderButton: React.FC<{onClick: () => void, disabled?: boolean, title: string, 'aria-label': string, children: React.ReactNode}> = ({ onClick, disabled, title, 'aria-label': ariaLabel, children }) => (
    <button 
        onClick={onClick} 
        disabled={disabled} 
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover-glow-indigo" 
        title={title}
        aria-label={ariaLabel}
    >
        {children}
    </button>
);

export const ConversationSubHeader: React.FC<{ conversation: Conversation }> = ({ conversation }) => {
    const {
        conversationMode, 
        setConversationMode, 
        setIsConversationSettingsOpen,
        isBookmarksPanelOpen,
        setIsBookmarksPanelOpen,
        setIsArchiveOpen,
        handleShowHistory, 
        handleUpdateConversationTitle,
        handleGenerateTitle,
        activeConversation,
    } = useAppContext();
    
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(conversation.title || '');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTitle(conversation.title || '');
        setIsEditingTitle(false);
    }, [conversation]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleTitleSave = () => {
        if (title.trim()) {
            handleUpdateConversationTitle(conversation.id, title.trim());
        }
        setIsEditingTitle(false);
    };

    const handleTitleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleTitleSave();
        else if (e.key === 'Escape') {
            setTitle(conversation.title || '');
            setIsEditingTitle(false);
        }
    };

    const handleModeClick = (mode: Conversation['discussionSettings'] extends { enabled: true } ? never : 'Dynamic' | 'Continuous' | 'Manual') => {
        setConversationMode(mode);
        setIsMenuOpen(false);
    };

    const handleHistoryClick = () => {
        handleShowHistory();
        setIsMenuOpen(false);
    };

    const handleArchiveClick = () => {
        setIsArchiveOpen(true);
        setIsMenuOpen(false);
    };

    const bookmarkedCount = activeConversation?.messages.filter(m => m.isBookmarked).length || 0;

    const MobileMenuItem: React.FC<{onClick: () => void, children: React.ReactNode}> = ({ onClick, children }) => (
        <button onClick={onClick} className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md transition-colors text-gray-200 hover:bg-white/10 hover:text-white">
            {children}
        </button>
    );

    return (
        <header className="p-2 flex justify-between items-center flex-shrink-0 z-10 border-b border-white/10 shadow-md bg-[var(--color-primary-header)]">
            {/* Left */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
                 <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isEditingTitle ? (
                        <input 
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={handleTitleKeydown}
                            onBlur={handleTitleSave}
                            className="bg-transparent text-white text-lg font-bold rounded px-2 py-0.5 outline-none ring-2 ring-indigo-500 w-full"
                            autoFocus
                        />
                    ) : (
                         <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-white truncate">{safeRender(conversation.title)}</h1>
                            {conversation.discussionSettings?.enabled && (
                                <span className="hidden md:inline-block bg-purple-500/50 text-purple-200 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-400/50 flex-shrink-0">Moderated</span>
                            )}
                        </div>
                    )}
                    
                    {isEditingTitle ? (
                        <button onClick={handleTitleSave} className="p-1.5 rounded-full hover:bg-white/10" aria-label="Save title" title="Save title">
                            <CheckIcon className="w-5 h-5" />
                        </button>
                    ) : (
                         <div className="hidden md:flex items-center gap-1">
                            <button onClick={() => setIsEditingTitle(true)} className="p-1.5 rounded-full hover:bg-white/10" aria-label="Edit title" title="Edit conversation title"><EditIcon className="w-4 h-4" /></button>
                            <button onClick={() => handleGenerateTitle(conversation.id)} className="p-1.5 rounded-full hover:bg-white/10 text-yellow-400 hover-glow-indigo" disabled={conversation.isGeneratingTitle} title="Generate title with AI">{conversation.isGeneratingTitle ? <Spinner/> : <SparklesIcon className="w-5 h-5" />}</button>
                            <button onClick={() => setIsConversationSettingsOpen(true)} className="p-1.5 rounded-full hover:bg-white/10" disabled={!conversation} title="Open conversation settings"><SettingsIcon className="w-5 h-5" /></button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Middle: Desktop */}
            <div className="hidden md:flex flex-none mx-4">
                <div className="flex items-center glass-pane rounded-full p-1 text-xs">
                    <button onClick={() => setConversationMode('Dynamic')} title="AI Manager creates a dynamic plan" className={`px-3 py-1 font-semibold rounded-full transition-all ${ conversationMode === 'Dynamic' ? 'bg-indigo-600 text-white neon-glow-indigo' : 'text-gray-300 hover:bg-white/5' }`}> Dynamic </button>
                    <button onClick={() => setConversationMode('Continuous')} title="A single, continuous conversation with multiple topics" className={`px-3 py-1 font-semibold rounded-full transition-all ${ conversationMode === 'Continuous' ? 'bg-indigo-600 text-white neon-glow-indigo' : 'text-gray-300 hover:bg-white/5' }`}> Continuous </button>
                    <button onClick={() => setConversationMode('Manual')} title="Manually choose the agent" className={`px-3 py-1 font-semibold rounded-full transition-all ${ conversationMode === 'Manual' ? 'bg-indigo-600 text-white neon-glow-indigo' : 'text-gray-300 hover:bg-white/5' }`}> Manual </button>
                </div>
            </div>

            {/* Right: Desktop */}
            <div className="hidden md:flex items-center gap-1 text-xs justify-end flex-1">
                <HeaderButton onClick={() => setIsArchiveOpen(true)} title="Message Archive" aria-label="View Message Archive">
                    <AlignLeftIcon className="w-5 h-5" />
                </HeaderButton>
                <HeaderButton onClick={() => setIsBookmarksPanelOpen(!isBookmarksPanelOpen)} disabled={!conversation} title="Bookmarks" aria-label="View Bookmarks">
                    <BookmarkIcon className="w-5 h-5" />
                    {bookmarkedCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold ring-2 ring-[#1e293b]">{bookmarkedCount}</span>}
                </HeaderButton>
                <HeaderButton onClick={handleShowHistory} disabled={!conversation} title="History" aria-label="View History"><HistoryIcon className="w-5 h-5"/></HeaderButton>
            </div>
            
            {/* Right: Mobile */}
            <div className="flex md:hidden items-center gap-1">
                <HeaderButton onClick={() => setIsBookmarksPanelOpen(!isBookmarksPanelOpen)} disabled={!conversation} title="Bookmarks" aria-label="View Bookmarks">
                    <BookmarkIcon className="w-5 h-5" />
                    {bookmarkedCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold ring-2 ring-[#1e293b]">{bookmarkedCount}</span>}
                </HeaderButton>
                
                <div className="relative" ref={menuRef}>
                    <HeaderButton onClick={() => setIsMenuOpen(prev => !prev)} title="More options" aria-label="More options">
                        <EllipsisVerticalIcon className="w-5 h-5"/>
                    </HeaderButton>
                    {isMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 origin-top-right glass-pane rounded-md shadow-lg z-50 p-2 animate-fade-in-up">
                             <p className="px-3 pt-1 pb-2 text-xs font-semibold text-gray-400">Mode</p>
                             <div className="flex flex-col items-stretch gap-1 text-sm mb-2">
                                <button onClick={() => handleModeClick('Dynamic')} className={`w-full text-left px-3 py-1.5 rounded-md ${conversationMode === 'Dynamic' ? 'bg-indigo-500/50 text-white' : 'hover:bg-white/10'}`}>Dynamic</button>
                                <button onClick={() => handleModeClick('Continuous')} className={`w-full text-left px-3 py-1.5 rounded-md ${conversationMode === 'Continuous' ? 'bg-indigo-500/50 text-white' : 'hover:bg-white/10'}`}>Continuous</button>
                                <button onClick={() => handleModeClick('Manual')} className={`w-full text-left px-3 py-1.5 rounded-md ${conversationMode === 'Manual' ? 'bg-indigo-500/50 text-white' : 'hover:bg-white/10'}`}>Manual</button>
                            </div>
                            <hr className="my-2 border-white/10" />
                            <MobileMenuItem onClick={() => { setIsEditingTitle(true); setIsMenuOpen(false); }}><EditIcon className="w-5 h-5"/> Edit Title</MobileMenuItem>
                            <MobileMenuItem onClick={() => { handleGenerateTitle(conversation.id); setIsMenuOpen(false); }}><SparklesIcon className="w-5 h-5"/> Generate Title</MobileMenuItem>
                            <MobileMenuItem onClick={() => { setIsConversationSettingsOpen(true); setIsMenuOpen(false); }}><SettingsIcon className="w-5 h-5"/> Chat Settings</MobileMenuItem>
                            <hr className="my-2 border-white/10" />
                            <MobileMenuItem onClick={handleHistoryClick}><HistoryIcon className="w-5 h-5"/> History</MobileMenuItem>
                            <MobileMenuItem onClick={handleArchiveClick}><AlignLeftIcon className="w-5 h-5"/> Archive</MobileMenuItem>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
