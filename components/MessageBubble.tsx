import React, { useEffect, useRef, useState } from 'react';
import { Message, Agent, Conversation } from '../types/index.ts';
import { MANAGER_COLOR } from '../constants/agentConstants.ts';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { Avatar } from './Avatar.tsx';
import { 
    CopyIcon, BookmarkIcon, EditIcon, TrashIcon, RegenerateIcon, SummarizeIcon, RewriteIcon, 
    CodeIcon, WorkflowIcon, BookmarkFilledIcon
} from './Icons.tsx';

import { PlanDisplay } from './PlanDisplay.tsx';
import { safeRender } from '../services/utils/safeRender.ts';
import { ContextMenuItem } from '../types/ui.ts';
import { CopyClearWrapper } from './CopyClearWrapper.tsx';

declare const marked: any;
declare const DOMPurify: any;
declare const hljs: any;

interface MessageBubbleProps {
    message: Message;
    agent?: Agent;
    featureFlags?: Conversation['featureFlags'];
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, agent, featureFlags }) => {
    const { 
        handleShowHtmlPreview, 
        handleUpdateMessageText, 
        handleToggleMessageEdit,
        handleChangeAlternativeResponse,
        handleToggleMessageBookmark,
        handleDeleteMessage,
        handleSummarizeMessage,
        handleRewritePrompt,
        handleRegenerateResponse,
        openInspectorModal,
        openPromptInspectorModal,
        openContextMenu,
    } = useAppContext();
    
    const contentRef = useRef<HTMLDivElement>(null);
    const [editText, setEditText] = useState(() => safeRender(message.text));
    const editTextAreaRef = useRef<HTMLTextAreaElement>(null);
    
    const activeAlternativeIndex = message.activeAlternativeIndex ?? -1;
    const currentMessage = activeAlternativeIndex > -1 && message.alternatives?.[activeAlternativeIndex]
        ? { ...message, ...message.alternatives[activeAlternativeIndex] }
        : message;

    const [isExpanded, setIsExpanded] = useState(false);

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
    
    const handleCopy = () => navigator.clipboard.writeText(safeRender(currentMessage.text));
    
    const hasSummary = !!currentMessage.summary && currentMessage.summary !== currentMessage.text;

    const getMessageContent = () => {
        const textToRender = safeRender(isExpanded ? currentMessage.text : (currentMessage.summary || currentMessage.text));
        return DOMPurify.sanitize(marked.parse(textToRender));
    };

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block as HTMLElement);
            });
            contentRef.current.querySelectorAll('pre').forEach((preElement) => {
                if (preElement.querySelector('.code-toolbar')) return;
                const code = preElement.querySelector('code');
                const lang = Array.from(code?.classList || []).find(cls => cls.startsWith('language-'))?.replace('language-', '') || '';
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
    }, [currentMessage, handleShowHtmlPreview, isExpanded]);
    
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const commonActions: ContextMenuItem[] = [
            { label: 'Copy Text', icon: <CopyIcon className="w-5 h-5"/>, action: handleCopy },
            { label: message.isBookmarked ? 'Unbookmark' : 'Bookmark', icon: message.isBookmarked ? <BookmarkFilledIcon className="w-5 h-5 text-indigo-400"/> : <BookmarkIcon className="w-5 h-5"/>, action: () => handleToggleMessageBookmark(message.id) },
        ];
        
        let specificActions: ContextMenuItem[] = [];
        if(isUser) {
            specificActions = [
                { label: 'Edit', icon: <EditIcon className="w-5 h-5"/>, action: () => handleToggleMessageEdit(message.id) },
                { label: 'Rewrite with AI', icon: <RewriteIcon className="w-5 h-5"/>, action: () => handleRewritePrompt(message.id) },
            ];
        } else {
            specificActions = [
                { label: 'Summarize', icon: <SummarizeIcon className="w-5 h-5"/>, action: () => handleSummarizeMessage(message.id) },
                { label: 'Regenerate', icon: <RegenerateIcon className="w-5 h-5"/>, action: () => handleRegenerateResponse(message.id) },
            ];
            if (message.pipeline && message.pipeline.length > 0) {
                 specificActions.push({ label: 'Inspect Workflow', icon: <WorkflowIcon className="w-5 h-5"/>, action: () => openInspectorModal(message.pipeline!) });
                 specificActions.push({ label: 'Inspect Prompt', icon: <CodeIcon className="w-5 h-5"/>, action: () => openPromptInspectorModal(message) });
            }
        }
        
        const finalActions: ContextMenuItem[] = [
            ...specificActions,
            ...commonActions,
            { isSeparator: true },
            { label: 'Delete Message', icon: <TrashIcon className="w-5 h-5"/>, action: () => handleDeleteMessage(message.id), isDestructive: true },
        ];
        
        openContextMenu(e.clientX, e.clientY, finalActions);
    };

    const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (message.isEditing) {
        return (
            <div className="MessageBubbleEditing flex w-full px-4 md:px-8 mb-6 animate-fade-in-up">
                 <div className="MessageAvatar"><Avatar name={senderName} color={agentColorIndicator} /></div>
                <div className="flex flex-col w-full ml-4">
                    <div className="rounded-lg p-4 bg-gray-700">
                        <CopyClearWrapper value={editText} onClear={() => setEditText('')}>
                            <textarea
                                ref={editTextAreaRef}
                                value={editText}
                                onChange={(e) => {
                                    setEditText(e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                onKeyDown={handleEditKeyDown}
                                className="MessageEditInput w-full bg-gray-600 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                rows={1}
                            />
                        </CopyClearWrapper>
                        <div className="MessageEditActions mt-2 flex justify-end gap-2">
                            <button onClick={handleCancelEdit} className="MessageEditCancelButton px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 rounded">Cancel</button>
                            <button onClick={handleSaveEdit} className="MessageEditSaveButton px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 rounded">Save & Submit</button>
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

    return (
        <div id={message.id} className="MessageBubble w-full px-4 md:px-8 mb-6 animate-fade-in-up" onContextMenu={handleContextMenu}>
            <div className={`flex items-start w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start w-auto max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="MessageAvatar"><Avatar name={senderName} color={agentColorIndicator} /></div>
                    <div 
                        className={`MessageContentContainer group flex flex-col w-full rounded-xl shadow-md overflow-hidden border ${isUser ? 'border-indigo-700' : 'border-slate-700'} ${isInsight ? '!border-yellow-500/50' : ''} ${isUser ? 'ml-0 mr-4' : 'ml-4'} transition-transform duration-300`}
                    >
                        {/* Header */}
                        <div className={`MessageBubbleHeader flex items-center justify-between p-3 bg-primary-header ${isInsight ? '!bg-yellow-900/50' : ''} ${isUser ? 'flex-row-reverse' : ''}`} style={{backgroundColor: isInsight ? '' : 'var(--color-primary-header)'}}>
                             <div className={`flex items-center ${isUser ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-3 h-3 rounded-sm ${agentColorIndicator}`}></div>
                                <div className={`mx-3 text-sm font-semibold ${isUser ? 'text-right' : 'text-left'}`}>
                                    <p className="SenderName text-white">{senderName}</p>
                                    <p className="SenderJob text-white text-xs">{senderJob}</p>
                                </div>
                            </div>
                             <div className="flex items-center text-xs text-gray-500">
                                {hasAlternatives && (
                                    <div className="AlternativeResponseNavigator flex items-center gap-2 mr-2 text-white">
                                        <button onClick={() => handleChangeAlternativeResponse(message.id, 'prev')} disabled={currentResponseIndex <= -1} className="disabled:opacity-50">&lt;</button>
                                        <span>{currentResponseIndex + 2} / {totalResponses}</span>
                                        <button onClick={() => handleChangeAlternativeResponse(message.id, 'next')} disabled={currentResponseIndex >= totalResponses - 2} className="disabled:opacity-50">&gt;</button>
                                    </div>
                                )}
                                <span className="MessageTimestamp">{formattedTime}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div
                            className={`MessageBubbleBody p-4 ${isUser ? 'content-bg-user prose-user' : 'content-bg-agent prose-agent'}`}
                        >
                            {message.plan ? (
                                <div className="PlanDisplayContainer"><PlanDisplay plan={message.plan} /></div>
                            ) : (
                                <>
                                    <div
                                        ref={contentRef}
                                        className="MessageText prose max-w-none prose-p:my-2 prose-headings:my-3"
                                        dangerouslySetInnerHTML={{ __html: getMessageContent() }}
                                    />
                                    {message.isStreaming && <span className="streaming-cursor"></span>}
                                </>
                            )}
                            
                            {hasSummary && !isUser && (
                                 <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="ExpandMessageButton text-indigo-400 hover:text-indigo-200 text-sm font-semibold mt-2 focus:outline-none bg-black bg-opacity-20 px-2 py-1 rounded"
                                >
                                    {isExpanded ? 'Show Summary' : 'Show Full Text'}
                                </button>
                            )}
                             {message.attachment && (
                                <div className="mt-2">
                                    <img src={`data:${message.attachment.mimeType};base64,${message.attachment.base64}`} alt="Attachment" className="MessageAttachment max-w-xs rounded-lg border-2 border-gray-200" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};