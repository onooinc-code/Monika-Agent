
import React, { useMemo, useState } from 'react';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { CloseIcon } from './Icons.tsx';
import { Message } from '../types/index.ts';
import { safeRender } from '../services/utils/safeRender.ts';

const ArchiveItem: React.FC<{ message: Message, agentName: string, conversationTitle: string, viewMode: 'summary' | 'full' }> = ({ message, agentName, conversationTitle, viewMode }) => {
    const textToShow = viewMode === 'summary' ? (message.summary || message.text) : message.text;
    const isUser = message.sender === 'user';
    const formattedTime = new Date(message.timestamp).toLocaleString();

    return (
        <div className="glass-pane p-4 rounded-lg">
            <div className="flex justify-between items-start text-xs text-gray-400 mb-2">
                <span className="font-semibold text-indigo-300 truncate">From: {safeRender(conversationTitle)}</span>
                <span>{formattedTime}</span>
            </div>
            <p className={`font-semibold ${isUser ? 'text-white' : 'text-cyan-300'}`}>{agentName}:</p>
            <p className="text-gray-200 whitespace-pre-wrap">{safeRender(textToShow)}</p>
        </div>
    );
};

export const MessageArchiveModal: React.FC = () => {
    const { isArchiveOpen, setIsArchiveOpen, conversations, getAgent } = useAppContext();
    const [viewMode, setViewMode] = useState<'summary' | 'full'>('summary');

    const allMessages = useMemo(() => {
        if (!isArchiveOpen) return [];
        return conversations
            .flatMap(conv => conv.messages.map(msg => ({ ...msg, conversationTitle: conv.title })))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [conversations, isArchiveOpen]);

    if (!isArchiveOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 p-4 modal-overlay open" onClick={() => setIsArchiveOpen(false)}>
            <div className="glass-pane rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col modal-content shadow-cyan-500/20" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-white">Message Archive</h2>
                    <div className="flex items-center gap-4">
                         <div className="flex items-center glass-pane rounded-full p-1 text-xs">
                            <button onClick={() => setViewMode('summary')} className={`px-3 py-1 font-semibold rounded-full transition-all ${ viewMode === 'summary' ? 'bg-indigo-600 text-white neon-glow-indigo' : 'text-gray-300 hover:bg-white/5' }`}>Summary</button>
                            <button onClick={() => setViewMode('full')} className={`px-3 py-1 font-semibold rounded-full transition-all ${ viewMode === 'full' ? 'bg-indigo-600 text-white neon-glow-indigo' : 'text-gray-300 hover:bg-white/5' }`}>Full Text</button>
                        </div>
                        <button onClick={() => setIsArchiveOpen(false)} className="p-1 rounded-full hover:bg-white/10">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {allMessages.length > 0 ? (
                        allMessages.map(msg => {
                            const agentName = msg.sender === 'user' ? 'You' : (getAgent(msg.sender)?.name || 'System');
                            return <ArchiveItem key={msg.id} message={msg} agentName={agentName} conversationTitle={msg.conversationTitle} viewMode={viewMode} />;
                        })
                    ) : (
                        <p className="text-center text-gray-500">No messages found in any conversation.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
