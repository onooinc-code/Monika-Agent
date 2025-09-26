
'use client';

import React, { useRef, useEffect } from 'react';
import { useAppContext } from '@/contexts/StateProvider';
import { MicrophoneOffIcon } from '@/components/Icons';
import { safeRender } from '@/services/utils/safeRender';

export const LiveConversationBar: React.FC = () => {
    const { isConnected, isConnecting, error, transcriptionHistory, closeSession } = useAppContext();
    const transcriptionContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (transcriptionContainerRef.current) {
            transcriptionContainerRef.current.scrollTop = transcriptionContainerRef.current.scrollHeight;
        }
    }, [transcriptionHistory]);

    let statusText: string;
    let statusColorClass: string;

    if (error) {
        statusText = `Error: ${error}`;
        statusColorClass = 'text-red-400';
    } else if (isConnecting) {
        statusText = 'Connecting...';
        statusColorClass = 'text-yellow-400 animate-pulse';
    } else if (isConnected) {
        statusText = 'Live Conversation Active';
        statusColorClass = 'text-green-400';
    } else {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-2 animate-fade-in-up">
            <div className="max-w-4xl mx-auto glass-pane rounded-xl shadow-2xl shadow-indigo-500/30 flex flex-col">
                <div className="flex justify-between items-center p-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                        <h3 className={`font-semibold ${statusColorClass}`}>{statusText}</h3>
                    </div>
                    <button onClick={closeSession} className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold bg-red-600 hover:bg-red-500 text-white transition-all transform hover:scale-105 neon-glow-indigo">
                        <MicrophoneOffIcon className="w-5 h-5" />
                        <span>End Session</span>
                    </button>
                </div>
                <div ref={transcriptionContainerRef} className="h-24 overflow-y-auto p-3 text-sm space-y-2">
                    {transcriptionHistory.length === 0 && (
                         <p className="text-gray-500 italic">Listening...</p>
                    )}
                    {transcriptionHistory.map((entry, index) => (
                        <div key={index}>
                            <span className={`font-semibold ${entry.speaker === 'user' ? 'text-indigo-300' : 'text-cyan-300'}`}>
                                {entry.speaker === 'user' ? 'You: ' : 'AI: '}
                            </span>
                            <span className={`${entry.isFinal ? 'text-gray-200' : 'text-gray-400'}`}>
                                {safeRender(entry.text)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
