import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/StateProvider.tsx';

interface HeaderActionsProps {
    toggleSidebar: () => void;
    sidebarAnimationState: 'idle' | 'slow' | 'fast';
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ toggleSidebar, sidebarAnimationState }) => {
    const { setIsSettingsOpen, setIsComponentsGalleryOpen, setIsConversionTypeModalOpen } = useAppContext();
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    // This effect will "uncheck" the radio button after a short delay,
    // allowing the animation to play but preventing it from staying in a selected state.
    useEffect(() => {
        if (selectedValue) {
            const timer = setTimeout(() => setSelectedValue(null), 500);
            return () => clearTimeout(timer);
        }
    }, [selectedValue]);

    const handleAction = (value: string) => {
        setSelectedValue(value);
        switch (value) {
            case 'settings':
                setIsSettingsOpen(true);
                break;
            case 'sidebar':
                toggleSidebar();
                break;
            case 'gallery':
                setIsComponentsGalleryOpen(true);
                break;
            case 'conversation-type':
                setIsConversionTypeModalOpen(true);
                break;
        }
    };
    
    const sidebarBlinkClass = {
        slow: 'animate-neon-blink-slow',
        fast: 'animate-neon-blink-fast',
        idle: '',
    }[sidebarAnimationState];

    return (
        <div className="HeaderActions header-action-card">
            <div className="radio-input p-3 z-10">
                <div className="center"></div>
                
                {/* Settings */}
                <label className="label spring" title="Settings">
                    <input 
                        type="radio" 
                        value="settings" 
                        name="header-actions" 
                        checked={selectedValue === 'settings'}
                        onChange={() => handleAction('settings')}
                    />
                    <span className="text spring">Settings</span>
                </label>
                
                {/* Toggle Sidebar */}
                <label className={`label summer rounded-[22px] ${sidebarBlinkClass}`} title="Toggle Sidebar">
                    <input 
                        type="radio" 
                        value="sidebar" 
                        name="header-actions" 
                        checked={selectedValue === 'sidebar'}
                        onChange={() => handleAction('sidebar')}
                    />
                    <span className="text summer">Menu</span>
                </label>
                
                {/* Components Gallery */}
                <label className="label autumn" title="Components Gallery">
                    <input 
                        type="radio" 
                        value="gallery" 
                        name="header-actions" 
                        checked={selectedValue === 'gallery'}
                        onChange={() => handleAction('gallery')}
                    />
                    <span className="text autumn">Gallery</span>
                </label>
                
                {/* Conversation Type */}
                <label className="label winter" title="Conversation Type">
                    <input 
                        type="radio" 
                        value="conversation-type" 
                        name="header-actions" 
                        checked={selectedValue === 'conversation-type'}
                        onChange={() => handleAction('conversation-type')}
                    />
                    <span className="text winter">Mode</span>
                </label>
            </div>
        </div>
    );
}