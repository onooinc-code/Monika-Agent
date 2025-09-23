import React from 'react';
import { MessageBubble } from './MessageBubble.tsx';
import { TopicDivider } from './TopicDivider.tsx';
import { useAppContext } from '../contexts/StateProvider.tsx';

export const MessageList: React.FC = () => {
    const { getAgent, activeConversation } = useAppContext();
    
    // The parent component now handles the case where there is no active conversation.
    if (!activeConversation) {
        return null;
    }
    
    return (
        <div className="MessageList">
            <div className="MessageListContainer max-w-4xl mx-auto">
                {activeConversation.messages.map(message => {
                    if (message.messageType === 'topic_divider') {
                        return <TopicDivider key={message.id} text={message.text} timestamp={message.timestamp} />;
                    }
                    return (
                        <MessageBubble 
                            key={message.id} 
                            message={message} 
                            agent={getAgent(message.sender)}
                            featureFlags={activeConversation.featureFlags}
                        />
                    );
                })}
            </div>
        </div>
    );
};