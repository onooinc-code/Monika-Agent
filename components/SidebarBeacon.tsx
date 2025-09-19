import React from 'react';
import { useAppContext } from '../contexts/StateProvider';

export const SidebarBeacon: React.FC = () => {
    const { setIsSidebarOpen } = useAppContext();

    return (
        <button 
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-1/2 left-0 -translate-y-1/2 w-6 h-24 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-r-full flex items-center justify-center shadow-lg shadow-cyan-500/30 animate-pulse-slow z-40"
            title="Open Sidebar"
        >
            <div className="w-1 h-12 bg-white/80 rounded-full animate-flicker"></div>
        </button>
    );
};