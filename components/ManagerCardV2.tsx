import React from 'react';
import styled from 'styled-components';
import { AgentManager } from '../types/index.ts';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { InformationCircleIcon, CpuIcon } from './Icons.tsx';

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
    <StyledWrapper>
      <div className="card">
        <div className="card-header">
          <span className="manager-agent-label">Agent Manager</span>
          <button
            onClick={() => openAgentSettingsModal(manager)}
            className="view-details-button"
            title="View details for Agent Manager"
          >
            <InformationCircleIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="card-content">
          <div className="flex flex-col items-center justify-center">
            <CpuIcon className="w-8 h-8 text-yellow-400" />
            <p className="text-sm font-bold text-white">Decisions</p>
            <p className="text-xs text-yellow-400">{formatStat(stats.totalMessages)}</p>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 150px; /* Adjusted to fit header */
    height: 70px; /* Adjusted to fit header */
    background: linear-gradient(-45deg, #161616 0%, #000000 100%);
    color: #81818144;
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Adjusted */
    align-items: flex-start; /* Adjusted */
    padding: 5px; /* Reduced padding */
    gap: 5px; /* Reduced gap */
    border-radius: 8px;
    cursor: pointer;
    flex-shrink: 0; /* Prevent shrinking */
  }

  .card::before {
    content: "";
    position: absolute;
    inset: 0;
    left: 0;
    margin: auto;
    width: 150px; /* Adjusted */
    height: 74px; /* Adjusted */
    border-radius: 10px;
    background: linear-gradient(-45deg, #ffc107 0%, #ffeb3b 100%); /* Yellow gradient */
    z-index: -10;
    pointer-events: none;
    transition: all 0.8s cubic-bezier(0.175, 0.95, 0.9, 1.275);
    box-shadow: 0px 10px 15px hsla(0, 0%, 0%, 0.521); /* Adjusted shadow */
  }

  .card::after {
    content: "";
    z-index: -1;
    position: absolute;
    inset: 0;
    width: 130px; /* Adjusted */
    height: 65px; /* Adjusted */
    background: linear-gradient(-45deg, #ffc107 0%, #ffeb3b 100%); /* Yellow gradient */
    transform: translate3d(0, 0, 0) scale(0.45);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .manager-agent-label {
    font-size: 12px;
    font-weight: bold;
    color: #fff;
  }

  .view-details-button {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .view-details-button:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    width: 100%;
  }

  .card:hover::after {
    transition: all 0.2s cubic-bezier(0.175, 0.285, 0.82, 1.275);
  }

  .card:hover::before {
    transform: scaleX(1.02) scaleY(1.02);
    box-shadow: 0px 0px 15px 0px hsla(45, 100%, 50%, 0.356); /* Yellow glow */
  }
`;

export default ManagerCardV2;