import React from 'react';

interface AgentLastTurnStatusProps {
  wasUsed: boolean;
}

const AgentLastTurnStatusTailwind: React.FC<AgentLastTurnStatusProps> = ({ wasUsed }) => {
  return (
    <div
      className={`w-[28px] h-[28px] rounded-full flex items-center justify-center
        ${wasUsed ? 'bg-green-400' : 'bg-red-500'}
      `}
      title={wasUsed ? "Used in last turn" : "Not used in last turn"}
    >
      <div
        className={`w-3 h-3 rounded-full
          ${wasUsed ? 'bg-green-400 flashing-dot' : 'bg-red-500'}
        `}
      ></div>
    </div>
  );
};

export default AgentLastTurnStatusTailwind;
