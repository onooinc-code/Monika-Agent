import React from "react";
import { Agent, AgentManager } from "../types/index.ts";
import { useAppContext } from "../contexts/StateProvider.tsx";
import {
  MenuIcon,
  PowerIcon,
  InformationCircleIcon,
  CpuIcon,
} from "./Icons.tsx";
import { safeRender } from "../services/utils/safeRender.ts";
import { HeaderActions } from "./HeaderActions.tsx";
import AgentCardV2 from './AgentCardV2.tsx';
import ManagerCardV2 from './ManagerCardV2.tsx';


const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const agentGradients = [
  { from: '#3B82F6', to: '#6366F1' }, // Blue-Indigo
  { from: '#10B981', to: '#059669' }, // Green-DarkGreen
  { from: '#EF4444', to: '#DC2626' }, // Red-DarkRed
  { from: '#F59E0B', to: '#D97706' }, // Amber-Orange
  { from: '#8B5CF6', to: '#7C3AED' }, // Purple-DarkPurple
  { from: '#EC4899', to: '#DB2777' }, // Pink-DarkPink
];

// Main Header component is now the Dashboard Header
export const Header: React.FC<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}> = ({ toggleSidebar }) => {
  const {
    agents,
    agentManager,
  } = useAppContext();
  return (
    <header
      className="sticky top-0 p-2 flex justify-between items-center md:items-stretch gap-2 flex-shrink-0 z-30 border-b border-white/10 shadow-lg glass-pane rounded-xl p-3 px-4 flex justify-between items-center"
      style={{
        background: "rgba(33, 33, 33, 0.7)",
        backdropFilter: "blur(10px)",
        backgroundSize: "400% 400%",
        animation: "animated-gradient-bg 15s ease infinite",
      }}
    >
      <div className="flex-shrink-0 md:w-[25%] flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Toggle Sidebar"
          title="Toggle conversation list"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 md:w-[50%] flex flex-col">
        <div className="flex items-center justify-center md:h-[40%]">
          <h1
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400"
            style={{
              backgroundSize: "200% 200%",
              animation: "animated-gradient-text 5s ease infinite",
            }}
          ></h1>
        </div>
        <div className="hidden md:flex flex-1 items-center justify-center gap-2">
          {agents.map((agent, index) => (
            <AgentCardV2
              key={agent.id}
              agent={agent}
              gradientColors={agentGradients[index % agentGradients.length]}
              gradientId={`agent-gradient-${index}`}
            />
          ))}
          <ManagerCardV2 manager={agentManager} />
        </div>
      </div>

      <div className="flex-shrink-0 md:w-auto flex items-center justify-end">
        <div className="hidden md:flex">
          <HeaderActions />
        </div>
        {/* Placeholder for mobile to balance flexbox */}
        <div className="w-6 h-6 md:hidden"></div>
      </div>
    </header>
  );
};