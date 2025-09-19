import React from 'react';
import { PowerIcon } from './Icons';

interface AgentPowerButtonProps {
  isOn: boolean;
  handleToggle: () => void;
}

const AgentPowerButton: React.FC<AgentPowerButtonProps> = ({ isOn, handleToggle }) => {
  return (
    <button
      onClick={handleToggle}
      title={isOn ? 'Disable Agent' : 'Enable Agent'}
      className="w-7 h-7 flex items-center justify-center rounded-lg transform hover:scale-105 transition-transform relative mr-2 border border-gray-600"
      style={{ background: 'linear-gradient(to right, #4a4a4a, #000000)' }}
    >
      <PowerIcon className={`w-5 h-5 ${isOn ? 'text-green-400' : 'text-red-500'}`} />
      {isOn && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
      )}
    </button>
  );
};

export default AgentPowerButton;
