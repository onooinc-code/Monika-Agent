'use client';

import React from "react";
// FIX: Corrected import path for types to point to the barrel file.
import { Agent, AgentManager } from "@/types/index";
import { useAppContext } from "@/contexts/StateProvider";
import {
  PowerIcon,
  InformationCircleIcon,
  CpuIcon,
} from "@/components/Icons";
import { safeRender } from "@/services/utils/safeRender";
import { HeaderActions } from "@/components/HeaderActions";
import { HeaderLeftActions } from "@/components/HeaderLeftActions";
import { TitleBar } from "@/components/TitleBar";


const AgentCard: React.FC<{ agent: Agent }> = React.memo(({ agent }) => {
  const {
    lastTurnAgentIds,
    handleToggleAgentEnabled,
    openAgentSettingsModal,
    getAgentTodayStats,
  } = useAppContext();

  const todayStats = getAgentTodayStats(agent.id);
  const wasUsed = lastTurnAgentIds.has(agent.id);
  const isEnabled = agent.isEnabled ?? true;

  const formatStat = (num: number) => {
    if (num > 1000) return `${(num / 1000).toFixed(1)}k`;
    return String(num);
  };

  const borderColorClass =
    typeof agent.color === "string"
      ? agent.color.replace("bg-", "border-")
      : "border-gray-500";

  return (
    <div className="AgentCard HeaderCards flex-1 min-w-0 glass-pane rounded-lg flex flex-col transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20">
      <div
        className={`flex items-center justify-between p-2 border-b-2 ${borderColorClass}`}
      >
        <h3 className="font-bold text-sm text-white truncate">
          {safeRender(agent.name)}
        </h3>
        <button
          onClick={() => openAgentSettingsModal(agent)}
          className="p-1 rounded-full text-gray-400 hover:bg-white/20 hover:text-white transition-colors"
          title={`View details for ${safeRender(agent.name)}`}
        >
          <InformationCircleIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 p-2 flex items-center justify-around text-center">
        <div
          className="flex-1 flex flex-col items-center justify-center"
          title={isEnabled ? "Click to Disable Agent" : "Click to Enable Agent"}
        >
          <button
            onClick={() => handleToggleAgentEnabled(agent.id)}
            className={`p-2 rounded-full transition-colors ${
              isEnabled
                ? "text-green-400 hover:bg-red-500/20 hover:text-red-400"
                : "text-gray-500 hover:bg-green-500/20 hover:text-green-400"
            }`}
          >
            <PowerIcon className="w-5 h-5" />
          </button>
        </div>
        <div
          className="flex-1 flex flex-col items-center justify-center"
          title={wasUsed ? "Used in last turn" : "Not used in last turn"}
        >
          <div
            className={`w-4 h-4 rounded-full ${
              wasUsed ? "bg-green-400 flashing-dot" : "bg-red-500"
            }`}
          ></div>
        </div>
        <div
          className="flex-1 flex flex-col items-center justify-center"
          title="Tokens used today (estimate)"
        >
          <p className="font-mono font-bold text-sm text-white">
            {formatStat(todayStats.tokens)}
          </p>
          <p className="text-xs text-white">Tokens</p>
        </div>
        <div
          className="flex-1 flex flex-col items-center justify-center"
          title="Requests today (estimate)"
        >
          <p className="font-mono font-bold text-sm text-white">
            {formatStat(todayStats.messages)}
          </p>
          <p className="text-xs text-white">Reqs</p>
        </div>
      </div>
    </div>
  );
});
AgentCard.displayName = 'AgentCard';

const ManagerCard: React.FC<{ manager: AgentManager }> = React.memo(({ manager }) => {
  const { usageMetrics, openAgentSettingsModal } = useAppContext();
  const stats = usageMetrics.agentUsage["manager"] || { totalMessages: 0 };

  const formatStat = (num: number) => {
    if (num > 1000) return `${(num / 1000).toFixed(1)}k`;
    return String(num);
  };

  return (
    <div className="ManagerCard HeaderCards flex-1 min-w-0 glass-pane rounded-lg flex flex-col transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/20">
      <div className="flex items-center justify-between p-2 border-b-2 border-yellow-500">
        <h3 className="font-bold text-sm text-white truncate">Agent Manager</h3>
        <button
          onClick={() => openAgentSettingsModal(manager)}
          className="p-1 rounded-full text-gray-400 hover:bg-white/20 hover:text-white transition-colors"
          title="View details for Agent Manager"
        >
          <InformationCircleIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 p-2 flex items-center justify-around text-center">
        <div className="flex-1 flex flex-col items-center justify-center text-yellow-400">
          <CpuIcon className="w-6 h-6" />
        </div>
        <div
          className="flex-1 flex flex-col items-center justify-center"
          title="Total decisions made"
        >
          <p className="font-mono font-bold text-sm text-white">
            {formatStat(stats.totalMessages)}
          </p>
          <p className="text-xs text-white">Decisions</p>
        </div>
      </div>
    </div>
  );
});
ManagerCard.displayName = 'ManagerCard';

export const Header: React.FC<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  sidebarAnimationState: 'idle' | 'slow' | 'fast';
}> = ({ isSidebarOpen, toggleSidebar, sidebarAnimationState }) => {
  const { agents, agentManager, isHeaderExpanded } = useAppContext();

  return (
    <header className={`AppHeader flex-shrink-0 transition-all duration-500 ease-in-out overflow-hidden ${isHeaderExpanded ? 'max-h-[30vh] p-2' : 'max-h-0 p-0'}`}>
        <div className={`flex items-stretch gap-4 w-full h-[calc(30vh-1rem)] xl:h-[calc(20vh-1rem)] transition-opacity duration-300 ${isHeaderExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="HeaderLeftSection flex aspect-square">
                <HeaderLeftActions />
            </div>
            <div className="HeaderCenterSection flex-1 min-w-0 flex flex-col gap-2">
                <div className="h-[30%]">
                    <TitleBar />
                </div>
                <div className="h-[70%]">
                    <div className="HeaderCardsContainer grid grid-cols-2 md:grid-cols-4 gap-2 min-w-0 h-full">
                        <ManagerCard manager={agentManager} />
                        {agents.map((agent) => (
                          <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="HeaderRightSection flex aspect-square">
                <HeaderActions 
                    toggleSidebar={toggleSidebar} 
                    sidebarAnimationState={sidebarAnimationState} 
                />
            </div>
        </div>
    </header>
  );
};
