
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/StateProvider';
// FIX: Corrected import path for types to point to the barrel file.
import { Agent, AgentManager } from '@/types/index';
import { CloseIcon, CpuIcon } from '@/components/Icons';
import { safeRender } from '@/services/utils/safeRender';
import { SecureInput } from '@/components/SecureInput';
import { CopyClearWrapper } from '@/components/CopyClearWrapper';
import { FancySwitch } from '@/components/FancySwitch';

// Type guard to check if it's an Agent
const isAgent = (agent: Agent | AgentManager): agent is Agent => {
    return 'id' in agent;
};

export const AgentSettingsModal: React.FC = () => {
    const { 
        isAgentSettingsModalOpen, 
        closeAgentSettingsModal, 
        selectedAgentForModal,
        handleUpdateSingleAgent,
        handleUpdateAgentManager,
        playSound,
    } = useAppContext();

    const [localAgent, setLocalAgent] = useState<Agent | AgentManager | null>(null);

    useEffect(() => {
        if (selectedAgentForModal) {
            // Create a deep copy to prevent direct mutation of context state
            setLocalAgent(JSON.parse(JSON.stringify(selectedAgentForModal)));
        }
    }, [selectedAgentForModal, isAgentSettingsModalOpen]);

    const handleChange = (field: keyof Agent | keyof AgentManager, value: any) => {
        setLocalAgent(prev => {
            if (!prev) return null;
            return { ...prev, [field]: value };
        });
    };

    const handleListChange = (field: keyof Agent, value: string) => {
        const listValue = value.split('\n').map(item => item.trim()).filter(Boolean);
        handleChange(field, listValue);
    };

    const handleSave = () => {
        if (!localAgent) return;
        
        if (isAgent(localAgent)) {
            handleUpdateSingleAgent(localAgent.id, localAgent);
        } else {
            handleUpdateAgentManager(localAgent);
        }
        playSound('success');
        closeAgentSettingsModal();
    };

    if (!isAgentSettingsModalOpen || !localAgent) {
        return null;
    }
    
    const agent = localAgent;
    const title = isAgent(agent) ? `Edit Agent: ${safeRender(agent.name)}` : 'Edit Agent Manager';
    const borderColorClass = isAgent(agent) ? (agent.color.replace('bg-', 'border-') || 'border-gray-500') : 'border-yellow-500';

    return (
        <div className={`fixed inset-0 flex justify-center items-center z-50 p-4 modal-overlay open`} onClick={closeAgentSettingsModal}>
            <div className={`glass-pane rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col modal-content shadow-cyan-500/20 border-t-4 ${borderColorClass}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <button onClick={closeAgentSettingsModal} className="p-1 rounded-full hover:bg-white/10">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {isAgent(agent) && (
                         <div className="flex items-center justify-between glass-pane p-3 rounded-lg">
                            <label className="font-medium text-gray-200">Agent Status</label>
                            <div className="flex items-center gap-3">
                                <span className={`text-sm font-semibold ${ (agent.isEnabled ?? true) ? 'text-green-400' : 'text-gray-500'}`}>
                                    { (agent.isEnabled ?? true) ? 'Enabled' : 'Disabled'}
                                </span>
                                <FancySwitch 
                                    checked={agent.isEnabled ?? true} 
                                    onChange={(checked) => handleChange('isEnabled', checked)} 
                                />
                            </div>
                        </div>
                    )}
                    {isAgent(agent) ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                    <CopyClearWrapper value={agent.name} onClear={() => handleChange('name', '')}>
                                        <input type="text" value={safeRender(agent.name)} onChange={e => handleChange('name', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white" />
                                    </CopyClearWrapper>
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
                                    <CopyClearWrapper value={agent.job} onClear={() => handleChange('job', '')}>
                                        <input type="text" value={safeRender(agent.job)} onChange={e => handleChange('job', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white" />
                                    </CopyClearWrapper>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">API Key (Optional)</label>
                                <SecureInput id={`${agent.id}-modal-api-key`} value={agent.apiKey || ''} onChange={e => handleChange('apiKey', e.target.value)} placeholder="Uses Global API Key"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Model</label>
                                <CopyClearWrapper value={agent.model} onClear={() => handleChange('model', '')}>
                                    <input type="text" value={safeRender(agent.model)} onChange={e => handleChange('model', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white" />
                                </CopyClearWrapper>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">System Instruction</label>
                                <CopyClearWrapper value={agent.systemInstruction} onClear={() => handleChange('systemInstruction', '')}>
                                    <textarea value={safeRender(agent.systemInstruction)} onChange={e => handleChange('systemInstruction', e.target.value)} rows={5} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white font-mono text-sm"></textarea>
                                </CopyClearWrapper>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Goals (one per line)</label>
                                <CopyClearWrapper value={agent.goals?.join('\n') || ''} onClear={() => handleChange('goals', [])}>
                                    <textarea value={agent.goals?.map(safeRender).join('\n') || ''} onChange={e => handleListChange('goals', e.target.value)} rows={3} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white font-mono text-sm"></textarea>
                                </CopyClearWrapper>
                            </div>
                        </>
                    ) : (
                        <>
                             <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Manager API Key (Optional)</label>
                                <SecureInput id="manager-modal-api-key" value={agent.apiKey || ''} onChange={e => handleChange('apiKey', e.target.value)} placeholder="Uses Global API Key" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Model</label>
                                <CopyClearWrapper value={agent.model} onClear={() => handleChange('model', '')}>
                                    <input type="text" value={agent.model} onChange={e => handleChange('model', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white focus:ring-indigo-500 focus:border-indigo-500" />
                                </CopyClearWrapper>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">System Instruction</label>
                                 <CopyClearWrapper value={agent.systemInstruction} onClear={() => handleChange('systemInstruction', '')}>
                                    <textarea value={agent.systemInstruction} onChange={e => handleChange('systemInstruction', e.target.value)} rows={4} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"></textarea>
                                </CopyClearWrapper>
                            </div>
                        </>
                    )}
                </div>

                <div className="p-6 mt-auto border-t border-white/10 flex justify-end gap-3">
                    <button onClick={closeAgentSettingsModal} className="bg-black/20 text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-white/10 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105 neon-glow-indigo">
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
};
