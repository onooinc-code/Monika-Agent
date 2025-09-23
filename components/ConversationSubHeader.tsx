import React, { useState } from 'react';
import { Conversation, ConversationMode } from '../types/index.ts';
import { NavTabs } from './NavTabs.tsx';
import { ConversationTitle } from './ConversationTitle.tsx';
import { ConversationActions } from './ConversationActions.tsx';
import { useAppContext } from '../contexts/StateProvider.tsx';

export const ConversationSubHeader: React.FC<{ conversation: Conversation | null }> = ({ conversation }) => {
    const { conversationMode, setConversationMode } = useAppContext();
    const [secondaryMode, setSecondaryMode] = useState('Scope');

    const title = conversation ? conversation.title : "No Active Conversation";

    const primaryModes: { id: ConversationMode, label: string }[] = [
        { id: 'Dynamic', label: 'Dynamic' },
        { id: 'Continuous', label: 'AI Agents' },
        { id: 'Manual', label: 'Manual' },
    ];
    
    const secondaryModes: { id: string, label: string }[] = [
        { id: 'Scope', label: 'Scope' },
        { id: 'Context', label: 'Context' },
        { id: 'Memory', label: 'Memory' },
    ];


    return (
        <div className="px-2 md:px-4 my-3">
            <header 
                className="ConversationSubHeader relative flex justify-between items-center h-[56px] glass-pane rounded-2xl overflow-hidden sub-header-shine p-2 gap-4"
            >
                <ConversationTitle title={title} />
                
                <div className="flex-grow flex justify-center h-full items-center gap-4">
                    <NavTabs 
                        modes={primaryModes}
                        selectedValue={conversationMode}
                        onChange={(modeId) => setConversationMode(modeId as ConversationMode)}
                        variant="primary"
                    />
                    <NavTabs 
                        modes={secondaryModes}
                        selectedValue={secondaryMode}
                        onChange={setSecondaryMode}
                        variant="secondary"
                    />
                </div>
                
                <ConversationActions />
            </header>
        </div>
    );
};