'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Message, Agent, Conversation, BubbleSettings } from '@/types/index';
import { MANAGER_COLOR } from '@/constants/agentConstants';
import { useAppContext } from '@/contexts/StateProvider';
import { Avatar } from '@/components/Avatar';
import { 
    CopyIcon, BookmarkIcon, EditIcon, TrashIcon, RegenerateIcon, SummarizeIcon, RewriteIcon, 
    CodeIcon, WorkflowIcon, AlignLeftIcon, AlignRightIcon, ZoomInIcon, ZoomOutIcon, 
    TextLtrIcon, TextRtlIcon, TokenIcon, BookmarkFilledIcon
} from '@/components/Icons';

import { PlanDisplay } from '@/components/PlanDisplay';
import * as TokenCounter from '@/services/utils/tokenCounter';
import { safeRender } from '@/services/utils/safeRender';

declare const marked: any;
declare const DOMPurify: any;
declare const hljs: any;

interface MessageBubbleProps {
    message: Message;
    agent?: Agent;
    featureFlags?: Conversation['featureFlags'];
}

const LONG_MESSAGE_LINES = 20;
const LONG_MESSAGE_CHARS = 1000;

const ActionButton: React.FC<{onClick: () => void, title: string, 'aria-label': string, children: React.ReactNode, className?: string, disabled?: boolean}> = ({ onClick, title, 'aria-label': ariaLabel, children, className, disabled }) => (
    <button onClick={onClick} title={title} aria-label={ariaLabel} className={`p-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`} disabled={disabled}>
        {children}
    </button>
);

interface MessageToolbarProps {
    message: Message;
    isUser: boolean;
    isContinuous: boolean;
    settings: BubbleSettings;
    handleAlignment: (align: 'left' | 'right') => void;
    handleTextDirection: (dir: 'ltr' | 'rtl') => void;
    handleFontSize: (direction: 'up' | 'down') => void;
    handleCopy: () => void;
}


const MessageToolbar: React.FC<MessageToolbarProps> = ({ message, isUser, isContinuous, settings, handleAlignment, handleTextDirection, handleFontSize, handleCopy }) => {
    const {
        handleToggleMessageBookmark, handleDeleteMessage, handleSummarizeMessage, handleRegenerateResponse,
        handleRewritePrompt, handleToggleMessageEdit, openPromptInspectorModal, openInspectorModal,
    } = useAppContext();

    const handleLocalAlignment = (align: 'left' | 'right') => {
        handleAlignment(align);
    };
    const handleLocalTextDirection = (dir: 'ltr' | 'rtl') => {
        handleTextDirection(dir);
    };
    const handleLocalFontSize = (direction: 'up' | 'down') => {
        handleFontSize(direction);
    };

    const tokenCount = TokenCounter.estimateTokens(message);
    const buttonClass = isUser ? "hover:bg-indigo-500" : "hover:bg-gray-700 hover:text-white";

    if (isContinuous) {
        return (
            <div className="flex items-center gap-1 glass-pane p-1 rounded-full shadow-lg">
                {!isUser && (
                    <ActionButton onClick={() => handleRegenerateResponse(message.id)} title="Regenerate" aria-label="Regenerate response" className={buttonClass}><RegenerateIcon className="w-4 h-4" /></ActionButton>
                )}
                {isUser && (
                    <ActionButton onClick={() => handleToggleMessageEdit(message.id)} title="Edit" aria-label="Edit message" className={buttonClass}><EditIcon className="w-4 h-4" /></ActionButton>
                )}
                <ActionButton onClick={() => handleToggleMessageBookmark(message.id)} title="Bookmark" aria-label="Bookmark message" className={buttonClass}>
                    {message.isBookmarked ? <BookmarkFilledIcon className="w-4 h-4 text-indigo-400" /> : <BookmarkIcon className="w-4 h-4" />}
                </ActionButton>
                <ActionButton onClick={handleCopy} title="Copy" aria-label="Copy message" className={buttonClass}><CopyIcon className="w-4 h-4" /></ActionButton>
                <ActionButton onClick={() => handleDeleteMessage(message.id)} title="Delete" aria-label="Delete message" className="text-red-400 hover:bg-red-500/50 hover:text-white"><TrashIcon className="w-4 h-4" /></ActionButton>
            </div>
        )
    }

    // Default Toolbar for 'Multi' mode
    return (
        <>
            <div className={`flex items-center gap-1 ${isUser ? 'text-white' : 'text-white'}`}>
                {!isUser && (
                    <>
                        <ActionButton onClick={() => handleSummarizeMessage(message.id)} title="Summarize message" aria-label="Summarize message" className={buttonClass}><SummarizeIcon className="w-5 h-5" /></ActionButton>
                        <ActionButton onClick={() => handleRegenerateResponse(message.id)} title="Regenerate response" aria-label="Regenerate response" className={buttonClass}><RegenerateIcon className="w-5 h-5" /></ActionButton>
                    </>
                )}
                {isUser && (
                    <>
                        <ActionButton onClick={() => handleRewritePrompt(message.id)} title="Rewrite prompt with AI" aria-label="Rewrite prompt" className={buttonClass}><RewriteIcon className="w-5 h-5" /></ActionButton>
                        <ActionButton onClick={() => handleToggleMessageEdit(message.id)} title="Edit message" aria-label="Edit message" className={buttonClass}><EditIcon className="w-5 h-5" /></ActionButton>
                    </>
                )}
                {message.pipeline && message.pipeline.length > 0 && !isUser && (
                    <ActionButton onClick={() => openPromptInspectorModal(message)} title="View full prompt & response" aria-label="Inspect prompt" className={buttonClass}><CodeIcon className="w-5 h-5" /></ActionButton>
                )}
                {message.pipeline && message.pipeline.length > 0 && !isUser && (
                    <ActionButton onClick={() => openInspectorModal(message.pipeline!)} title="View Workflow" aria-label="View AI Workflow" className={buttonClass}><WorkflowIcon className="w-5 h-5" /></ActionButton>
                )}
            </div>
            <div className="flex-grow"></div>
            <div className={`flex items-center gap-2 ${isUser ? 'text-white' : 'text-white'}`}>
                {tokenCount > 0 && (
                    <span className="font-mono text-xs flex items-center gap-1 opacity-80" title={`Estimated Tokens: ${tokenCount}`}><TokenIcon className="w-3.5 h-3.5" />{tokenCount}</span>
                )}
                {message.responseTimeMs && <span className="font-mono text-xs opacity-80" title="Response Time">{message.responseTimeMs}ms</span>}
                {(tokenCount > 0 || message.responseTimeMs) && <div className="w-px h-4 bg-white/10 mx-1"></div>}
                <ActionButton onClick={() => handleLocalAlignment('left')} title="Align Left" aria-label="Align message left" className={buttonClass}><AlignLeftIcon className="w-5 h-5"/></ActionButton>
                <ActionButton onClick={() => handleLocalAlignment('right')} title="Align Right" aria-label="Align message right" className={buttonClass}><AlignRightIcon className="w-5 h-5"/></ActionButton>
                <ActionButton onClick={() => handleLocalTextDirection('ltr')} title="Text LTR" aria-label="Set text direction to left-to-right" className={buttonClass}><TextLtrIcon className="w-5 h-5"/></ActionButton>
                <ActionButton onClick={() => handleLocalTextDirection('rtl')} title="Text RTL" aria-label="Set text direction to right-to-left" className={buttonClass}><TextRtlIcon className="w-5 h-5"/></ActionButton>
                <ActionButton onClick={() => handleLocalFontSize('down')} title="Decrease Font Size" aria-label="Decrease font size" disabled={settings.fontSize <= 0.75} className={buttonClass}><ZoomOutIcon className="w-5 h-5"/></ActionButton>
                <ActionButton onClick={() => handleLocalFontSize('up')} title="Increase Font Size" aria-label="Increase font size" disabled={settings.fontSize >= 1.5} className={buttonClass}><ZoomInIcon className="w-5 h-5"/></ActionButton>
                <ActionButton onClick={handleCopy} title="Copy message text" aria-label="Copy message" className={buttonClass}><CopyIcon className="w-5 h-5" /></ActionButton>
                <ActionButton onClick={() => handleToggleMessageBookmark(message.id)} title="Bookmark message" aria-label="Bookmark message" className={buttonClass}>
                    {message.isBookmarked ? <BookmarkFilledIcon className="w-5 h-5 text-indigo-400" /> : <BookmarkIcon className="w-5 h-5" />}
                </ActionButton>
                <ActionButton onClick={() => handleDeleteMessage(message.id)} title="Delete message" aria-label="Delete message" className="text-red-400 hover:bg-red-500/50 hover:text-white"><TrashIcon className="w-5 h-5" /></ActionButton>
            </div>
        </>
    );
};


export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, agent, featureFlags }) => {
    const { 
        handleShowHtmlPreview, 
        handleUpdateMessageText, 
        handleToggleMessageEdit,
        handleChangeAlternativeResponse,
        userBubbleSettings,
        agentBubbleSettings,
        conversionType,
        setAgentBubbleSettings,
        setUserBubbleSettings,
    } = useAppContext();
    
    const contentRef = useRef<HTMLDivElement>(null);
    const [editText, setEditText] = useState(() => safeRender(message.text));
    const editTextAreaRef = useRef<HTMLTextAreaElement>(null);

    const activeAlternativeIndex = message.activeAlternativeIndex ?? -1;
    const currentMessageText = activeAlternativeIndex > -1 && message.alternatives?.[activeAlternativeIndex]
        ? message.alternatives[activeAlternativeIndex].text
        : message.text;

    useEffect(() => {
        if (message.isEditing) {
            setEditText(safeRender(message.text));
            setTimeout(() => {
                if (editTextAreaRef.current) {
                    editTextAreaRef.current.focus();
                    editTextAreaRef.current.style.height = 'auto';
                    editTextAreaRef.current.style.height = `${editTextAreaRef.current.scrollHeight}px`;
                }
            }, 0);
        }
    }, [message.isEditing, message.text]);

    const isUser = message.sender === 'user';
    const settings = isUser ? userBubbleSettings : agentBubbleSettings;
    const setSettings = isUser ? setUserBubbleSettings : setAgentBubbleSettings;

    const handleAlignment = (align: 'left' | 'right') => {
        setSettings(prev => ({ ...prev, alignment: align }));
    };
    const handleTextDirection = (dir: 'ltr' | 'rtl') => {
        setSettings(prev => ({ ...prev, textDirection: dir }));
    };
    const handleFontSize = (direction: 'up' | 'down') => {
        setSettings(prev => ({ ...prev, fontSize: Math.max(0.75, Math.min(1.5, prev.fontSize + (direction === 'up' ? 0.1 : -0.1))) }));
    };
    const handleCopy = () => navigator.clipboard.writeText(safeRender(currentMessageText));


    const isPotentiallyLong = !isUser && (safeRender(currentMessageText).split('\n').length > LONG_MESSAGE_LINES || safeRender(currentMessageText).length > LONG_MESSAGE_CHARS);
    const isLongMessageEnabled = !message.isStreaming && isPotentiallyLong && featureFlags?.autoSummarization;
    const [isExpanded, setIsExpanded] = useState(!isLongMessageEnabled);
    
    let _senderName = 'You';
    let _senderJob = 'User';
    let agentColorIndicator = 'bg-indigo-500';

    if (!isUser) {
        if (agent) {
            _senderName = agent.name;
            _senderJob = agent.job;
            agentColorIndicator = typeof agent.color === 'string' ? agent.color : 'bg-gray-500';
        } else if (message.sender === 'system') {
            _senderName = message.messageType === 'insight' ? 'Manager Insight' : 'System';
            _senderJob = 'Manager';
            agentColorIndicator = MANAGER_COLOR.bg;
        }
    }

    const senderName = safeRender(_senderName);
    const senderJob = safeRender(_senderJob);
    
    const handleSaveEdit = () => {
        if (editText.trim()) {
            handleUpdateMessageText(message.id, editText.trim());
        }
    };
    
    const handleCancelEdit = () => {
        handleToggleMessageEdit(message.id);
    };

    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleCancelEdit();
        }
    };
    
    const getMessageContent = () => {
        const textToRender = safeRender(currentMessageText);
        if (isExpanded) {
            return DOMPurify.sanitize(marked.parse(textToRender));
        }
        const lines = textToRender.split('\n');
        let truncatedText = textToRender;
        if (lines.length > LONG_MESSAGE_LINES) {
            truncatedText = lines.slice(0, LONG_MESSAGE_LINES).join('\n') + '\n...';
        } else if (truncatedText.length > LONG_MESSAGE_CHARS) {
            truncatedText = truncatedText.substring(0, LONG_MESSAGE_CHARS) + '...';
        }
        return DOMPurify.sanitize(marked.parse(truncatedText));
    };

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block as HTMLElement);
            });
            contentRef.current.querySelectorAll('pre').forEach((preElement) => {
                if (preElement.querySelector('.code-toolbar')) return;
                const code = preElement.querySelector('code');
                const lang = (Array.from(code?.classList || []) as string[]).find(cls => cls.startsWith('language-'))?.replace('language-', '') || '';
                const toolbar = document.createElement('div');
                toolbar.className = 'code-toolbar glass-pane rounded-t-md px-3 py-1 flex justify-between items-center text-xs';
                const langSpan = document.createElement('span');
                langSpan.className = 'text-white font-mono';
                langSpan.innerText = lang;
                const buttonsWrapper = document.createElement('div');
                buttonsWrapper.className = 'flex items-center gap-2';
                if (lang === 'html') {
                    const viewButton = document.createElement('button');
                    viewButton.className = 'flex items-center gap-1 text-white hover:text-cyan-400';
                    viewButton.innerHTML = 'View HTML';
                    viewButton.onclick = () => handleShowHtmlPreview(code?.innerText || '');
                    buttonsWrapper.appendChild(viewButton);
                }
                const copyButton = document.createElement('button');
                copyButton.className = 'flex items-center gap-1 text-white hover:text-cyan-400';
                copyButton.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> Copy`;
                copyButton.onclick = () => navigator.clipboard.writeText(code?.innerText || '');
                buttonsWrapper.appendChild(copyButton);
                toolbar.appendChild(langSpan);
                toolbar.appendChild(buttonsWrapper);
                preElement.parentNode?.insertBefore(toolbar, preElement);
            });
        }
    }, [currentMessageText, handleShowHtmlPreview, isExpanded]);

    const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (message.isEditing) {
        return (
            <div className="flex w-full px-4 md:px-8 mb-6 animate-fade-in-up">
                 <Avatar name={senderName} color={agentColorIndicator} />
                <div className="flex flex-col w-full ml-4">
                    <div className="rounded-lg p-4 bg-gray-700">
                        <textarea
                            ref={editTextAreaRef}
                            value={editText}
                            onChange={(e) => {
                                setEditText(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            onKeyDown={handleEditKeyDown}
                            className="w-full bg-gray-600 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            rows={1}
                        />
                        <div className="mt-2 flex justify-end gap-2">
                            <button onClick={handleCancelEdit} className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 rounded">Cancel</button>
                            <button onClick={handleSaveEdit} className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 rounded">Save & Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    const hasAlternatives = message.alternatives && message.alternatives.length > 0;
    const currentResponseIndex = (message.activeAlternativeIndex ?? -1);
    const totalResponses = 1 + (message.alternatives?.length ?? 0);
    const isInsight = message.messageType === 'insight';
    const isContinuousConversation = conversionType === 'Continuous';
    const alignmentClass = { left: 'justify-start', right: 'justify-end' }[settings.alignment];

    // CONTINUOUS CONVERSATION MODE RENDER
    if (isContinuousConversation) {
        return (
            <div id={message.id} className={`w-full px-4 md:px-8 mb-3 animate-fade-in-up flex group relative ${alignmentClass}`}>
                <div className={`flex items-start w-auto max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`} style={{ transform: `scale(${settings.scale})`}}>
                    <div className="w-10 flex-shrink-0">
                        <Avatar name={senderName} color={agentColorIndicator} />
                    </div>
                    <div className={`flex flex-col w-full ${isUser ? 'ml-0 mr-3' : 'ml-3'}`}>
                        <div className={`flex items-baseline gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
                            <p className={`text-sm font-semibold ${isUser ? 'text-indigo-300' : 'text-cyan-300'}`}>{senderName}</p>
                            <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{formattedTime}</span>
                        </div>
                        <div
                            className={`prose max-w-none prose-p:my-1 prose-headings:mt-2 prose-headings:mb-1 mt-1 ${isUser ? 'prose-user text-gray-200' : 'prose-agent bg-slate-800/30 p-3 rounded-lg'}`}
                            dir={settings.textDirection}
                            style={{ fontSize: `${settings.fontSize}rem` }}
                            ref={contentRef}
                            dangerouslySetInnerHTML={{ __html: getMessageContent() }}
                        />
                         {message.isStreaming && <span className={`streaming-cursor ${agentColorIndicator}`}></span>}
                         {message.attachment && (
                            <div className="mt-2">
                                <img src={`data:${message.attachment.mimeType};base64,${message.attachment.base64}`} alt="Attachment" className="max-w-xs rounded-lg border-2 border-gray-700" />
                            </div>
                        )}
                    </div>
                    <div className={`absolute -top-3 ${isUser ? 'left-12' : 'right-12'} z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                        <MessageToolbar message={message} isUser={isUser} isContinuous={true} settings={settings} handleAlignment={handleAlignment} handleTextDirection={handleTextDirection} handleFontSize={handleFontSize} handleCopy={handleCopy} />
                    </div>
                </div>
            </div>
        );
    }
    
    // DEFAULT (MULTI-CONVERSATION) MODE RENDER
    return (
        <div id={message.id} className={`w-full px-4 md:px-8 mb-6 animate-fade-in-up flex ${alignmentClass}`}>
            <div className={`flex items-start w-auto max-w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar name={senderName} color={agentColorIndicator} />
                <div 
                    className={`group flex flex-col w-full max-w-3xl rounded-xl shadow-md overflow-hidden border ${isUser ? 'border-indigo-700' : 'border-slate-700'} ${isInsight ? '!border-yellow-500/50' : ''} ${isUser ? 'ml-0 mr-4' : 'ml-4'} transition-all duration-300`}
                    style={{ transform: `scale(${settings.scale})`}}
                >
                    <div className={`flex items-center justify-between p-3 bg-primary-header ${isInsight ? '!bg-yellow-900/50' : ''} ${isUser ? 'flex-row-reverse' : ''}`} style={{backgroundColor: isInsight ? '' : 'var(--color-primary-header)'}}>
                         <div className={`flex items-center ${isUser ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-3 h-3 rounded-sm ${agentColorIndicator}`}></div>
                            <div className={`mx-3 text-sm font-semibold ${isUser ? 'text-right' : 'text-left'}`}>
                                <p className="text-white">{senderName}</p>
                                <p className="text-white text-xs">{senderJob}</p>
                            </div>
                        </div>
                         <div className="flex items-center text-xs text-gray-500">
                            {hasAlternatives && (
                                <div className="flex items-center gap-2 mr-2">
                                    <button onClick={() => handleChangeAlternativeResponse(message.id, 'prev')} disabled={currentResponseIndex < 0} className="p-1 rounded-full text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed" title="Previous Response">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                    </button>
                                    <span className="font-mono" title="Response Version">{currentResponseIndex > -1 ? `#${currentResponseIndex + 2}` : "Original"} / {totalResponses}</span>
                                    <button onClick={() => handleChangeAlternativeResponse(message.id, 'next')} disabled={currentResponseIndex >= (message.alternatives?.length ?? 0) -1} className="p-1 rounded-full text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed" title="Next Response">
                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </button>
                                </div>
                            )}
                            <span>{formattedTime}</span>
                        </div>
                    </div>

                    <div 
                        className={`p-4 bg-slate-800/30`}
                        style={{ backgroundColor: isInsight ? 'transparent' : '' }}
                    >
                         {message.plan ? (
                            <PlanDisplay plan={message.plan} />
                        ) : (
                            <div
                                className={`prose max-w-none prose-invert`}
                                dir={settings.textDirection}
                                style={{ fontSize: `${settings.fontSize}rem` }}
                                ref={contentRef}
                                dangerouslySetInnerHTML={{ __html: getMessageContent() }}
                            />
                        )}
                        {message.isStreaming && <span className={`streaming-cursor ${agentColorIndicator}`}></span>}
                        {message.attachment && (
                            <div className="mt-2">
                                <img src={`data:${message.attachment.mimeType};base64,${message.attachment.base64}`} alt="Attachment" className="max-w-xs rounded-lg border-2 border-gray-700" />
                            </div>
                        )}
                        {!isExpanded && (
                            <div className="mt-2 text-center">
                                <button onClick={() => setIsExpanded(true)} className="text-indigo-400 text-sm font-semibold hover:underline">Show More</button>
                            </div>
                        )}
                    </div>
                    
                    <div className="MessageBubbleFooter flex items-center p-2 bg-primary-header/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <MessageToolbar 
                            message={message} 
                            isUser={isUser}
                            isContinuous={false}
                            settings={settings}
                            handleAlignment={handleAlignment}
                            handleTextDirection={handleTextDirection}
                            handleFontSize={handleFontSize}
                            handleCopy={handleCopy}
                         />
                    </div>
                </div>
            </div>
        </div>
    );
};
