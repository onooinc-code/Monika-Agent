import React from 'react';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { Agent, AgentManager } from '../types/index.ts';
import { CloseIcon } from './Icons.tsx';
import { safeRender } from '../services/utils/safeRender.ts';

const DetailItem: React.FC<{ label: string, value: any, isMono?: boolean, isList?: boolean }> = ({ label, value, isMono, isList }) => {
    let displayValue = value;
    if (isList && Array.isArray(value)) {
        displayValue = value.length > 0 ? value.map(safeRender).join(', ') : 'None';
    } else {
        displayValue = safeRender(value) || 'Not Set';
    }
    
    return (
        <div>
            <label className="block text-sm font-medium text-gray-400">{label}</label>
            <p className={`mt-1 text-white bg-black/20 p-2 rounded-md border border-white/10 ${isMono ? 'font-mono text-sm' : ''}`}>
                {displayValue}
            </p>
        </div>
    );
};

export const AgentSettingsModal: React.FC = () => {
    const { isAgentSettingsModalOpen, closeAgentSettingsModal, selectedAgentForModal } = useAppContext();

    if (!isAgentSettingsModalOpen || !selectedAgentForModal) {
        return null;
    }
    
    // Type guard to check if it's an Agent
    const isAgent = (agent: Agent | AgentManager): agent is Agent => {
        return 'id' in agent;
    };

    const agent = selectedAgentForModal;
    const title = isAgent(agent) ? `Agent Details: ${safeRender(agent.name)}` : 'Agent Manager Details';

    return (
        <div className={`fixed inset-0 flex justify-center items-center z-50 p-4 modal-overlay open`} onClick={closeAgentSettingsModal}>
            <div className="glass-pane rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col modal-content shadow-cyan-500/20" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <button onClick={closeAgentSettingsModal} className="p-1 rounded-full hover:bg-white/10">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {isAgent(agent) ? (
                        <>
                            <DetailItem label="Name" value={agent.name} />
                            <DetailItem label="Job Title" value={agent.job} />
                             <DetailItem label="Role" value={agent.role} />
                            <DetailItem label="Model" value={agent.model} />
                            <DetailItem label="System Instruction" value={agent.systemInstruction} isMono />
                            <DetailItem label="Goals" value={agent.goals} isList />
                            <DetailItem label="Specializations" value={agent.specializations} isList />
                            <DetailItem label="Tools" value={agent.tools} isList />
                            <DetailItem label="Knowledge Base" value={agent.knowledge} isMono />
                            <DetailItem label="API Key" value={agent.apiKey ? '********' : 'Using Global Key'} />
                            <DetailItem label="UI Color" value={agent.color} />
                        </>
                    ) : (
                        <>
                            <DetailItem label="Model" value={agent.model} />
                            <DetailItem label="System Instruction" value={agent.systemInstruction} isMono />
                            <DetailItem label="API Key" value={agent.apiKey ? '********' : 'Using Global Key'} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};