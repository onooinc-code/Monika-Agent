
import React from 'react';
import { safeRender } from '../services/utils/safeRender.ts';

interface TopicDividerProps {
    text: string;
    timestamp: string;
}

export const TopicDivider: React.FC<TopicDividerProps> = ({ text, timestamp }) => {
    const formattedDate = new Date(timestamp).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="relative my-8 text-center animate-fade-in-up">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-indigo-500/30"></div>
            </div>
            <div className="relative flex justify-center">
                <div className="bg-[#0a0a0f] px-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">{safeRender(text)}</h3>
                    <p className="text-xs text-gray-500">{formattedDate}</p>
                </div>
            </div>
        </div>
    );
};