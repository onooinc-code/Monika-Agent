import React from 'react';
import RadioActions from "./RadioActions";

export const TitleBar: React.FC = () => {
    return (
        <div className="TitleBarContainer glass-pane rounded-2xl p-3 flex justify-between items-center h-full border border-white/10 bg-gradient-to-br from-cyan-900/50 via-slate-900 to-purple-900/60 TitleBarAnimatedBg transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400" style={{ backgroundSize: '200% 200%', animation: 'animated-gradient-text 5s ease infinite'}}>
                    Monica V2
                </h1>
            </div>
             <RadioActions />
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2" title="System Status">
                    <div className="w-3 h-3 rounded-full bg-green-400 flashing-dot"></div>
                    <span className="text-sm font-medium text-gray-300 hidden sm:inline">Online</span>
                </div>
                {/* Placeholder for future buttons */}
                <div className="hidden md:flex items-center gap-2">
                </div>
            </div>
        </div>
    );
};