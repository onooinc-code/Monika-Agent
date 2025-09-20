import React from 'react';
import { Agent, UsageMetrics } from '../types/index.ts';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { InformationCircleIcon, PowerIcon } from './Icons.tsx';
import { safeRender } from '../services/utils/safeRender.ts';
import AgentPowerButton from './AgentPowerButton.tsx';
import AgentLastTurnStatus from './AgentLastTurnStatus.tsx';

interface CardProps {
  agent: Agent;
  gradientColors: { from: string; to: string };
  gradientId: string;
}

const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AgentCardV2: React.FC<CardProps> = ({ agent, gradientColors, gradientId }) => {
  const { usageMetrics, lastTurnAgentIds, handleToggleAgentEnabled, openAgentSettingsModal } = useAppContext();
  const todayStr = getTodayDateString();


  const stats = usageMetrics.agentUsage[agent.id] || {
    totalMessages: 0,
    dailyUsage: [],
  };
  const todayStats = stats.dailyUsage.find((d) => d.date === todayStr) || {
    tokens: 0,
    messages: 0,
  };
  const wasUsed = lastTurnAgentIds.has(agent.id);
  const isEnabled = agent.isEnabled ?? true;

  const formatStat = (num: number) => {
    if (num > 1000) return `${(num / 1000).toFixed(1)}k`;
    return String(num);
  };

  return (
    <div className="agent-card-v2 flex-1 min-w-[150px] glass-pane rounded-lg flex flex-col transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20">
      <div className="relative group h-full">
        <div className="absolute -inset-1 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"
             style={{ background: `linear-gradient(to right, ${gradientColors.from}, ${gradientColors.to})` }} />
        <div className="relative bg-white dark:bg-gray-900 rounded-xl p-1 shadow-xl h-full w-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            
          
             <div className="agent-header relative w-full overflow-hidden rounded-lg p-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-between">
    {/* Left side: Agent Name and Description */}
    <div className="flex flex-col">
        <p className="text-md font-bold bg-clip-text text-transparent truncate"
            style={{ backgroundImage: `linear-gradient(to right, ${gradientColors.from}, ${gradientColors.to})` }}>
            {safeRender(agent.name)}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {agent.description}
        </p>
    </div>

    {/* Right side: Buttons */}
    <div className="settings-buttons flex items-center">
        <AgentPowerButton isOn={isEnabled} handleToggle={() => handleToggleAgentEnabled(agent.id)} />
        <button
            onClick={() => openAgentSettingsModal(agent)}
            className="w-5 h-5 flex items-center justify-center text-white rounded-lg transform hover:scale-105 transition-transform"
            style={{ background: `linear-gradient(to right, ${gradientColors.from}, ${gradientColors.to})` }}
        >
            <InformationCircleIcon className="w-4 h-4" />
        </button>
    </div>
</div>
        <div className="agent-header-underline absolute bottom-0 left-0 w-full h-0.5 rounded-full"
             style={{ background: `linear-gradient(to right, ${gradientColors.from}, ${gradientColors.to})`, opacity: 0.7 }} />
          
           <div className="flex items-center justify-between mb-2">
            <div className="space-y-0.5"></div>
            
          </div>
          
 

        
          </div>
          <div className="stats-grid grid grid-cols-3 gap-1 mb-2  flex items-center justify-center flex-1">
            <div className="stat-item relative  flex items-center justify-center overflow-hidden rounded-lg p-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <div className="relative z-10">
                <span className="block  flex items-center justify-center text-lg font-bold"
                      style={{ color: gradientColors.from }}
                      title="Tokens used today (estimate)">
                  {formatStat(todayStats.tokens)}
                </span>
              </div>
              <div className="stat-underline absolute bottom-0 left-0 w-full h-0.5 rounded-full"
                   style={{ background: `linear-gradient(to right, ${gradientColors.from}, ${gradientColors.to})` }} />
            </div>
            <div className="stat-item relative overflow-hidden rounded-lg p-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <div className="relative z-10">
                <span className="block  flex items-center justify-center text-lg font-bold"
                      style={{ color: gradientColors.to }}
                      title="Requests today (estimate)">
                  {formatStat(todayStats.messages)}
                </span>
              </div>
              <div className="stat-underline absolute bottom-0 left-0 w-full h-0.5 rounded-full"
                   style={{ background: `linear-gradient(to right, ${gradientColors.to}, ${gradientColors.from})` }} />
            </div>
            <div className="stat-item relative overflow-hidden rounded-lg p-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <div className="relative z-10">
                <span className="block  flex items-center justify-center text-lg font-bold"
                      style={{ color: gradientColors.from }}
                      title="Total messages processed">
                  {formatStat(stats.totalMessages)}
                </span>
              </div>
              <div className="stat-underline absolute bottom-0 left-0 w-full h-0.5 rounded-full"
                   style={{ background: `linear-gradient(to right, ${gradientColors.from}, ${gradientColors.to})` }} />
            </div>
          </div>

          
        </div>
          
      </div>
        <div className="card-bottom-line relative bottom-0 h-0.5 rounded-full mx-auto"
    style={{
        width: '90%',
        background: `linear-gradient(to right, ${gradientColors.from}, ${gradientColors.to})`,
        opacity: 0.5
    }}
/>
    </div>
  );
};

export default AgentCardV2;

