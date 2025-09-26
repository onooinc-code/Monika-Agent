'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Agent, AgentManager, LongTermMemoryData } from '@/types';
import { useAppContext } from '@/contexts/StateProvider';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { CloseIcon, CpuIcon } from '@/components/Icons';
import { safeRender } from '@/services/utils/safeRender';
import { SecureInput } from '@/components/SecureInput';
import { CopyClearWrapper } from '@/components/CopyClearWrapper';

export const SettingsModal: React.FC = () => {
    const { 
        isSettingsOpen, 
        setIsSettingsOpen, 
        agents, 
        setAgents, 
        agentManager, 
        setAgentManager,
        sendOnEnter,
        setSendOnEnter,
        isSoundEnabled,
        setIsSoundEnabled,
        handleExportConversations,
        handleImportConversations,
        longTermMemory,
        setLongTermMemory,
        clearMemory,
        globalApiKey,
        setGlobalApiKey,
        playSound,
    } = useAppContext();

    const [localAgents, setLocalAgents] = useState(agents);
    const [localManager, setLocalManager] = useState(agentManager);
    const [localMemory, setLocalMemory] = useState('');
    const [localGlobalApiKey, setLocalGlobalApiKey] = useState('');
    const importFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(isSettingsOpen) {
            setLocalAgents(agents);
            setLocalManager(agentManager);
            setLocalMemory(JSON.stringify(longTermMemory, null, 2));
            setLocalGlobalApiKey(globalApiKey);
        }
    }, [isSettingsOpen, agents, agentManager, longTermMemory, globalApiKey]);
    
    const handleAgentChange = (id: string, field: keyof Agent, value: string | string[]) => {
        if (field === 'tools' && typeof value === 'string') {
            const toolsArray = value.split(',').map(t => t.trim()).filter(Boolean);
            setLocalAgents(prev => prev.map(a => a.id === id ? { ...a, [field]: toolsArray } : a));
        } else {
            setLocalAgents(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
        }
    };

    const handleManagerChange = (field: keyof AgentManager, value: string) => {
        setLocalManager(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        setGlobalApiKey(localGlobalApiKey);
        setAgents(localAgents);
        setAgentManager(localManager);
        playSound('success');
        setIsSettingsOpen(false);
    };

    const onImportFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImportConversations(file);
        }
        // Reset file input to allow importing the same file again
        if (e.target) {
            e.target.value = '';
        }
    };

    const handleMemorySave = () => {
        try {
            const parsedMemory: LongTermMemoryData = JSON.parse(localMemory);
            setLongTermMemory(parsedMemory);
            playSound('success');
            alert('Memory saved successfully!');
        } catch (e) {
            playSound('error');
            alert('Invalid JSON format. Please correct it and try again.');
        }
    };

    return (
        <div className={`fixed inset-0 flex justify-center items-center z-50 p-4 modal-overlay ${isSettingsOpen ? 'open' : ''}`} onClick={() => setIsSettingsOpen(false)}>
            <div className="glass-pane rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col modal-content shadow-indigo-500/20" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold text-white">Settings</h2>
                    <button onClick={() => setIsSettingsOpen(false)} className="p-1 rounded-full hover:bg-white/10">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* API Key Management */}
                    <div className="glass-pane p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-400 mb-4">API Key Management</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Global Fallback API Key</label>
                            <p className="text-xs text-white mb-2">This key will be used for any agent that does not have its own specific key assigned below.</p>
                            <SecureInput
                                id="global-api-key"
                                value={localGlobalApiKey} 
                                onChange={e => setLocalGlobalApiKey(e.target.value)} 
                                placeholder="Enter your global Gemini API key"
                            />
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="glass-pane p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-indigo-400 mb-4">Preferences</h3>
                        <div className="space-y-4">
                            <ToggleSwitch
                                label="Send message on Enter"
                                description="ON: Press Enter to send, Shift+Enter for new line. OFF: Press Ctrl+Enter to send."
                                enabled={sendOnEnter}
                                onChange={setSendOnEnter}
                            />
                            <ToggleSwitch
                                label="Enable Sound Effects"
                                description="Play subtle sounds for actions like sending messages and opening modals."
                                enabled={isSoundEnabled}
                                onChange={setIsSoundEnabled}
                            />
                        </div>
                    </div>

                    {/* Data Management */}
                    <div className="glass-pane p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-indigo-400 mb-4">Data Management</h3>
                        <div className="flex items-center gap-4">
                            <button onClick={handleExportConversations} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">
                                Export All Conversations
                            </button>
                            <input
                                type="file"
                                accept=".json"
                                ref={importFileInputRef}
                                onChange={onImportFileSelected}
                                className="hidden"
                            />
                            <button onClick={() => importFileInputRef.current?.click()} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-500 transition-colors">
                                Import Conversations
                            </button>
                        </div>
                         <p className="text-sm text-white mt-3">Export all your chats to a JSON file for backup. You can import this file later to restore your conversations.</p>
                    </div>

                    {/* Long-Term Memory */}
                     <div className="glass-pane p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <CpuIcon className="w-6 h-6 text-purple-400"/>
                            <h3 className="text-lg font-semibold text-purple-400">Long-Term Memory</h3>
                        </div>
                        <p className="text-sm text-white mb-2">This is the persistent memory shared by all agents, stored as a JSON object. Edit with caution.</p>
                         <CopyClearWrapper value={localMemory} onClear={() => setLocalMemory('')}>
                            <textarea 
                                value={localMemory}
                                onChange={e => setLocalMemory(e.target.value)}
                                rows={8} 
                                className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                                placeholder="{}"
                            />
                        </CopyClearWrapper>
                        <div className="flex justify-end gap-2 mt-2">
                            <button onClick={clearMemory} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors">
                                Clear Memory
                            </button>
                            <button onClick={handleMemorySave} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">
                                Save Memory
                            </button>
                        </div>
                    </div>

                    {/* Agent Manager Settings */}
                    <div className="glass-pane p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <CpuIcon className="w-6 h-6 text-yellow-400"/>
                            <h3 className="text-lg font-semibold text-yellow-400">Agent Manager</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Manager API Key (Optional)</label>
                                <SecureInput id="manager-api-key" value={localManager.apiKey || ''} onChange={e => handleManagerChange('apiKey', e.target.value)} placeholder="Uses Global API Key" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Model</label>
                                <CopyClearWrapper value={localManager.model} onClear={() => handleManagerChange('model', '')}>
                                    <input type="text" value={localManager.model} onChange={e => handleManagerChange('model', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white focus:ring-indigo-500 focus:border-indigo-500" />
                                </CopyClearWrapper>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">System Instruction</label>
                                 <CopyClearWrapper value={localManager.systemInstruction} onClear={() => handleManagerChange('systemInstruction', '')}>
                                    <textarea value={localManager.systemInstruction} onChange={e => handleManagerChange('systemInstruction', e.target.value)} rows={4} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"></textarea>
                                </CopyClearWrapper>
                            </div>
                        </div>
                    </div>

                    {/* Individual Agent Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {localAgents.map(agent => {
                            const borderColorClass = typeof agent.color === 'string' ? agent.color.replace('bg','border') : 'border-gray-500';
                            return (
                                <div key={agent.id} className={`glass-pane p-4 rounded-lg border-t-4 ${borderColorClass}`}>
                                    <h3 className="text-xl font-bold text-white mb-4">{safeRender(agent.name)}</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">API Key (Optional)</label>
                                            <SecureInput id={`${agent.id}-api-key`} value={agent.apiKey || ''} onChange={e => handleAgentChange(agent.id, 'apiKey', e.target.value)} placeholder="Uses Global API Key"/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                            <CopyClearWrapper value={agent.name} onClear={() => handleAgentChange(agent.id, 'name', '')}>
                                                <input type="text" value={safeRender(agent.name)} onChange={e => handleAgentChange(agent.id, 'name', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white" />
                                            </CopyClearWrapper>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
                                            <CopyClearWrapper value={agent.job} onClear={() => handleAgentChange(agent.id, 'job', '')}>
                                                <input type="text" value={safeRender(agent.job)} onChange={e => handleAgentChange(agent.id, 'job', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white" />
                                            </CopyClearWrapper>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                                            <CopyClearWrapper value={agent.role || ''} onClear={() => handleAgentChange(agent.id, 'role', '')}>
                                                <input type="text" value={safeRender(agent.role || '')} onChange={e => handleAgentChange(agent.id, 'role', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white" />
                                            </CopyClearWrapper>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Goals (one per line)</label>
                                            <CopyClearWrapper value={agent.goals?.join('\n') || ''} onClear={() => handleAgentChange(agent.id, 'goals', [])}>
                                                <textarea value={agent.goals?.map(safeRender).join('\n') || ''} onChange={e => handleAgentChange(agent.id, 'goals', e.target.value.split('\n'))} rows={3} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white font-mono text-sm"></textarea>
                                            </CopyClearWrapper>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Specializations (one per line)</label>
                                            <CopyClearWrapper value={agent.specializations?.join('\n') || ''} onClear={() => handleAgentChange(agent.id, 'specializations', [])}>
                                                <textarea value={agent.specializations?.map(safeRender).join('\n') || ''} onChange={e => handleAgentChange(agent.id, 'specializations', e.target.value.split('\n'))} rows={3} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white font-mono text-sm"></textarea>
                                            </CopyClearWrapper>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Model</label>
                                            <CopyClearWrapper value={agent.model} onClear={() => handleAgentChange(agent.id, 'model', '')}>
                                                <input type="text" value={safeRender(agent.model)} onChange={e => handleAgentChange(agent.id, 'model', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white" />
                                            </CopyClearWrapper>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">System Instruction</label>
                                            <CopyClearWrapper value={agent.systemInstruction} onClear={() => handleAgentChange(agent.id, 'systemInstruction', '')}>
                                                <textarea value={safeRender(agent.systemInstruction)} onChange={e => handleAgentChange(agent.id, 'systemInstruction', e.target.value)} rows={5} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white font-mono text-sm"></textarea>
                                            </CopyClearWrapper>
                                        </div>
                                         <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Tools (comma-separated)</label>
                                            <CopyClearWrapper value={agent.tools?.join(', ') || ''} onClear={() => handleAgentChange(agent.id, 'tools', [])}>
                                                <textarea value={agent.tools?.join(', ') || ''} onChange={e => handleAgentChange(agent.id, 'tools', e.target.value)} rows={2} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white font-mono text-sm" placeholder="e.g., calculator, search"></textarea>
                                            </CopyClearWrapper>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Knowledge Base</label>
                                            <CopyClearWrapper value={agent.knowledge || ''} onClear={() => handleAgentChange(agent.id, 'knowledge', '')}>
                                                <textarea value={safeRender(agent.knowledge || '')} onChange={e => handleAgentChange(agent.id, 'knowledge', e.target.value)} rows={4} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white font-mono text-sm" placeholder="Provide background info or data..."></textarea>
                                            </CopyClearWrapper>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Color Class</label>
                                            <CopyClearWrapper value={agent.color} onClear={() => handleAgentChange(agent.id, 'color', '')}>
                                                <input type="text" value={safeRender(agent.color)} onChange={e => handleAgentChange(agent.id, 'color', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white" placeholder="e.g., bg-blue-500" />
                                            </CopyClearWrapper>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Text Color Class</label>
                                            <CopyClearWrapper value={agent.textColor} onClear={() => handleAgentChange(agent.id, 'textColor', '')}>
                                                <input type="text" value={safeRender(agent.textColor)} onChange={e => handleAgentChange(agent.id, 'textColor', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white" placeholder="e.g., text-white" />
                                            </CopyClearWrapper>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 flex justify-end">
                    <button onClick={handleSave} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105 neon-glow-indigo">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};