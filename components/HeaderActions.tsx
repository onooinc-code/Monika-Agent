import React from 'react';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { GlassIconButton } from './GlassIconButton.tsx';

interface HeaderActionsProps {
    toggleSidebar: () => void;
    sidebarAnimationState: 'idle' | 'slow' | 'fast';
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ toggleSidebar, sidebarAnimationState }) => {
    const { setIsSettingsOpen } = useAppContext();

    const animationClass = {
        slow: 'animate-neon-blink-slow',
        fast: 'animate-neon-blink-fast',
        idle: '',
    }[sidebarAnimationState];

    return (
        <div className="HeaderActions header-action-card">
            <div className="grid grid-cols-2 grid-rows-2 gap-3 p-3 z-10 w-full h-full">
                <GlassIconButton
                    onClick={() => setIsSettingsOpen(true)}
                    title="Settings"
                    aria-label="Open Settings"
                    gradient="indigo"
                    className="SettingsActionButton"
                />
                 <div className={`ToggleSidebarActionButton rounded-[16px] ${animationClass} w-full h-full`}>
                    <GlassIconButton
                        onClick={toggleSidebar}
                        title="Toggle Sidebar"
                        aria-label="Toggle Sidebar"
                        gradient="menu"
                        className="MenuButton"
                    />
                </div>
                {/* Placeholders for more buttons */}
                <div/>
                <div/>
            </div>
        </div>
    );
}