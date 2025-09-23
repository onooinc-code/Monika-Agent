import React from 'react';
import { PowerSwitch } from './PowerSwitch.tsx';
import { MonicaButton } from './MonicaButton.tsx';

export const TitleBar: React.FC = () => {
    return (
        <div className="TitleBarContainer glass-pane rounded-2xl p-3 flex justify-between items-center h-full border border-white/10 bg-gradient-to-br from-cyan-900/50 via-slate-900 to-purple-900/60 TitleBarAnimatedBg transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1">
            <div className="flex items-center gap-3">
                <MonicaButton />
            </div>
            {/* Placeholder for future buttons */}
            <div className="hidden md:flex items-center gap-2">
            </div>
            <div className="flex items-center gap-2">
                <PowerSwitch color="#3b82f6" title="System Core" initialChecked={true} />
                <PowerSwitch color="#22c55e" title="Memory Unit" initialChecked={true} />
                <PowerSwitch color="#ef4444" title="Security Layer" initialChecked={true} />
                <PowerSwitch color="#eab308" title="API Gateway" initialChecked={true} />
                <PowerSwitch color="#8b5cf6" title="Cognitive Engine" initialChecked={true} />
                <PowerSwitch color="#ec4899" title="Creative Module" initialChecked={true} />
            </div>
        </div>
    );
};