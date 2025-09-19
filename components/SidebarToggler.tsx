import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/StateProvider';
import { PinIcon, MenuIcon } from './Icons';

export const SidebarToggler: React.FC = () => {
    const { isSidebarOpen, setIsSidebarOpen, isSidebarPinned, setIsSidebarPinned } = useAppContext();
    const [isFlashing, setIsFlashing] = useState(false);
    const [flashingSpeed, setFlashingSpeed] = useState<'slow' | 'medium'>('slow');

    useEffect(() => {
        if (isSidebarOpen) {
            // Start flashing effect
            setIsFlashing(true);
            setFlashingSpeed('slow');
            
            // After 5 seconds, change flashing speed
            const speedChangeTimer = setTimeout(() => {
                setFlashingSpeed('medium');
            }, 5000);
            
            // After 10 seconds, stop flashing and close sidebar
            const closeSidebarTimer = setTimeout(() => {
                setIsFlashing(false);
                setIsSidebarOpen(false);
            }, 10000);
            
            return () => {
                clearTimeout(speedChangeTimer);
                clearTimeout(closeSidebarTimer);
            };
        }
    }, [isSidebarOpen, setIsSidebarOpen]);

    return (
        <div 
            className={`fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'left-[288px]' : 'left-0'}`}
        >
            <div className="relative group">
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`w-8 h-24 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-r-full flex items-center justify-center shadow-lg 
                        ${isFlashing ? (flashingSpeed === 'slow' ? 'neon-flash-slow' : 'neon-flash-medium') : ''}`}
                    title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                >
                    <MenuIcon className="w-6 h-6 text-white" />
                </button>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setIsSidebarPinned(!isSidebarPinned)}
                        className={`p-2 rounded-full transition-colors ${isSidebarPinned ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-white'}`}
                        title={isSidebarPinned ? 'Unpin Sidebar' : 'Pin Sidebar'}
                    >
                        <PinIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};