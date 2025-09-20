import React from "react";
import { AgentManager } from "../types/index.ts";
import { useAppContext } from "../contexts/StateProvider.tsx";
import { InformationCircleIcon, CpuIcon } from "./Icons.tsx";

interface ManagerCardV2Props {
  manager: AgentManager;
}

const ManagerCardV2: React.FC<ManagerCardV2Props> = ({ manager }) => {
  const { usageMetrics, openAgentSettingsModal } = useAppContext();
  const stats = usageMetrics.agentUsage["manager"] || { totalMessages: 0 };

  const formatStat = (num: number) => {
    if (num > 1000) return `${(num / 1000).toFixed(1)}k`;
    return String(num);
  };

  return (
    <div className="manager-card-v2 flex-1 min-w-[150px] glass-pane rounded-lg flex flex-col transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/20">
      <div className="relative group h-full">
        <div className="absolute -inset-1 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500 bg-gradient-to-r from-yellow-400 to-amber-500" />

        <div className="relative bg-white dark:bg-gray-900 rounded-xl p-1 shadow-xl h-full flex flex-col">
          <div className="manager-header relative overflow-hidden rounded-lg p-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
            <span className="block text-lg font-bold text-yellow-400">
              <p className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">
                Agent Manager
              </p>
            </span>
            <div className="flex   space-x-2 px-2 py-3 rounded-full"></div>

            

            <div className="manager-header-underline absolute bottom-0 left-0 w-full h-0.5 rounded-full"
              style={{
                background: `linear-gradient(to right, #F59E0B, #D97706)`,
                opacity: 0.7
              }}
            />
          </div>

          <div className="manager-stats-grid grid grid-cols-2 gap-1  mb-2 flex-1">
            <div className="manager-stat-item relative overflow-hidden rounded-lg p-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <span className="block text-lg font-bold text-amber-500">
                <button
                  onClick={() => openAgentSettingsModal(manager)}
                  className="w-5 h-5 flex items-center justify-center text-white rounded-lg transform hover:scale-105 transition-transform bg-gradient-to-r from-yellow-400 to-amber-500"
                  title="Configure Agent Manager"
                >
                  <InformationCircleIcon className="w-4 h-4" />
                </button>
              </span>
              <div className="manager-stat-underline absolute bottom-0 left-0 w-full h-0.5 rounded-full"
                style={{
                  background: `linear-gradient(to right, #F59E0B, #D97706)`,
                }}
              />
            </div>

            <div className="manager-stat-item relative overflow-hidden rounded-lg p-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <div className="relative z-10">
                <span
                  className="block text-lg font-bold flex items-center justify-center text-yellow-400"
                  title="Total decisions made"
                >
                  {formatStat(stats.totalMessages)}
                </span>
              </div>

              <div className="manager-stat-underline absolute bottom-0 left-0 w-full h-0.5 rounded-full"
                style={{
                  background: `linear-gradient(to right, #F59E0B, #D97706)`,
                }}
              />
            </div>
          </div>

          {/* Placeholder for alignment with agent cards - can be filled with manager-specific stats later if needed */}
          <div className="manager-placeholder relative overflow-hidden rounded-lg p-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
            <span className="block text-lg font-bold text-yellow-400">
              <div className="manager-placeholder-underline absolute bottom-0 left-0 w-full h-0.5 rounded-full"
                style={{
                  background: `linear-gradient(to right, #F59E0B, #D97706)`,
                }}
              />
            </span>
          </div>
        </div>
      </div>
      <div className="card-bottom-line relative bottom-0 h-0.5 rounded-full mx-auto"
  style={{
      width: '90%',
      background: `linear-gradient(to right, #F59E0B, #D97706)`,
      opacity: 0.5
  }}
/>
    </div>
  );
};

export default ManagerCardV2;
