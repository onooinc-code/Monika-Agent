import React from 'react';
import { Agent, AgentManager } from '../types/index.ts';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { MenuIcon, PowerIcon, InformationCircleIcon, CpuIcon } from './Icons.tsx';
import { safeRender } from '../services/utils/safeRender.ts';
import { GlassIconButton } from './GlassIconButton.tsx';

// --- SHARED COMPONENTS ---

const HeaderButton: React.FC<{onClick: () => void, disabled?: boolean, title: string, 'aria-label': string, children: React.ReactNode}> = ({ onClick, disabled, title, 'aria-label': ariaLabel, children }) => (
    <button 
        onClick={onClick} 
        disabled={disabled} 
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover-glow-indigo" 
        title={title}
        aria-label={ariaLabel}
    >
        {children}
    </button>
);

const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const AgentCard: React.FC<{ agent: Agent }> = ({ agent }) => {
    const { usageMetrics, lastTurnAgentIds, handleToggleAgentEnabled, openAgentSettingsModal } = useAppContext();
    const todayStr = getTodayDateString();
    
    const stats = usageMetrics.agentUsage[agent.id] || { totalMessages: 0, dailyUsage: [] };
    const todayStats = stats.dailyUsage.find(d => d.date === todayStr) || { tokens: 0, messages: 0 };
    const wasUsed = lastTurnAgentIds.has(agent.id);
    const isEnabled = agent.isEnabled ?? true;

    const formatStat = (num: number) => {
        if (num > 1000) return `${(num / 1000).toFixed(1)}k`;
        return String(num);
    };

    const borderColorClass = typeof agent.color === 'string' ? agent.color.replace('bg-', 'border-') : 'border-gray-500';

    return (
        <div className="flex-1 min-w-[150px] glass-pane rounded-lg flex flex-col transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20">
            <div className={`flex items-center justify-between p-2 border-b-2 ${borderColorClass}`}>
                <h3 className="font-bold text-sm text-white truncate">{safeRender(agent.name)}</h3>
                <button onClick={() => openAgentSettingsModal(agent)} className="p-1 rounded-full text-gray-400 hover:bg-white/20 hover:text-white transition-colors" title={`View details for ${safeRender(agent.name)}`}>
                    <InformationCircleIcon className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-1 p-2 flex items-center justify-around text-center">
                <div className="flex-1 flex flex-col items-center justify-center" title={isEnabled ? 'Click to Disable Agent' : 'Click to Enable Agent'}>
                    <button onClick={() => handleToggleAgentEnabled(agent.id)} className={`p-2 rounded-full transition-colors ${isEnabled ? 'text-green-400 hover:bg-red-500/20 hover:text-red-400' : 'text-gray-500 hover:bg-green-500/20 hover:text-green-400'}`}>
                        <PowerIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center" title={wasUsed ? "Used in last turn" : "Not used in last turn"}>
                    <div className={`w-4 h-4 rounded-full ${wasUsed ? 'bg-green-400 flashing-dot' : 'bg-red-500'}`}></div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center" title="Tokens used today (estimate)">
                     <p className="font-mono font-bold text-sm text-white">{formatStat(todayStats.tokens)}</p>
                     <p className="text-xs text-white">Tokens</p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center" title="Requests today (estimate)">
                    <p className="font-mono font-bold text-sm text-white">{formatStat(todayStats.messages)}</p>
                    <p className="text-xs text-white">Reqs</p>
                </div>
            </div>
        </div>
    );
};

const ManagerCard: React.FC<{ manager: AgentManager }> = ({ manager }) => {
    const { usageMetrics, openAgentSettingsModal } = useAppContext();
    const stats = usageMetrics.agentUsage['manager'] || { totalMessages: 0 };
    
    const formatStat = (num: number) => {
        if (num > 1000) return `${(num / 1000).toFixed(1)}k`;
        return String(num);
    };

    return (
        <div className="flex-1 min-w-[150px] glass-pane rounded-lg flex flex-col transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/20">
            <div className="flex items-center justify-between p-2 border-b-2 border-yellow-500">
                <h3 className="font-bold text-sm text-white truncate">Agent Manager</h3>
                <button onClick={() => openAgentSettingsModal(manager)} className="p-1 rounded-full text-gray-400 hover:bg-white/20 hover:text-white transition-colors" title="View details for Agent Manager">
                    <InformationCircleIcon className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-1 p-2 flex items-center justify-around text-center">
                <div className="flex-1 flex flex-col items-center justify-center text-yellow-400">
                    <CpuIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center" title="Total decisions made">
                     <p className="font-mono font-bold text-sm text-white">{formatStat(stats.totalMessages)}</p>
                     <p className="text-xs text-white">Decisions</p>
                </div>
            </div>
        </div>
    );
};

// Main Header component is now the Dashboard Header
export const Header: React.FC<{ isSidebarOpen: boolean, toggleSidebar: () => void }> = ({ toggleSidebar }) => {
    const { agents, agentManager, setIsSettingsOpen, setIsTeamGeneratorOpen, setIsApiUsageOpen } = useAppContext();
    return (
        <header 
            className="sticky top-0 p-2 flex justify-between items-center md:items-stretch gap-2 flex-shrink-0 z-30 border-b border-white/10 shadow-lg"
            style={{
                background: 'linear-gradient(-45deg, #0a0a0f, #1e293b, #3b0764, #1e293b, #0a0a0f)',
                backgroundSize: '400% 400%',
                animation: 'animated-gradient-bg 15s ease infinite'
            }}
        >
            <div className="flex-shrink-0 md:w-[25%] flex items-center gap-2">
                <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Toggle Sidebar" title="Toggle conversation list">
                    <MenuIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 md:w-[50%] flex flex-col">
                 <div className="flex items-center justify-center md:h-[40%]">
                    <h1 
                        className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400"
                        style={{ backgroundSize: '200% 200%', animation: 'animated-gradient-text 5s ease infinite' }}
                    >
                        Monica
                    </h1>
                </div>
                <div className="hidden md:flex flex-1 items-center justify-center gap-2">
                    {agents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
                    <ManagerCard manager={agentManager} />
                </div>
            </div>

            <div className="flex-shrink-0 md:w-[25%] flex items-end justify-end">
                <div className="hidden md:flex items-center gap-2 text-xs">
                    <GlassIconButton
                        onClick={() => setIsTeamGeneratorOpen(true)}
                        title="Generate Team"
                        aria-label="Open Team Generator"
                        gradient="purple"
                        // To use your PNG icon, uncomment the line below and replace the URL
                        // iconUrl="URL_TO_YOUR_TEAM_ICON.png"
                    />
                     <GlassIconButton
                        onClick={() => setIsApiUsageOpen(true)}
                        title="API Usage"
                        aria-label="Open API Usage"
                        gradient="cyan"
                        // To use your PNG icon, uncomment the line below and replace the URL
                        // iconUrl="URL_TO_YOUR_API_ICON.png"
                    />
                    <GlassIconButton
                        onClick={() => setIsSettingsOpen(true)}
                        title="Settings"
                        aria-label="Open Settings"
                        gradient="indigo"
                         // To use your PNG icon, uncomment the line below and replace the URL
                        // iconUrl="URL_TO_YOUR_SETTINGS_ICON.png"
                    />
                </div>
                {/* Placeholder for mobile to balance flexbox */}
                <div className="w-6 h-6 md:hidden"></div>
            </div>
        </header>
    );
};