
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { McpServer, McpLog } from '../types/index.ts';
import { CloseIcon, PlusIcon, TrashIcon, ServerStackIcon } from './Icons.tsx';
import { safeRender } from '../services/utils/safeRender.ts';

export const McpServerManagerModal: React.FC = () => {
    const {
        isMcpServerManagerOpen,
        setIsMcpServerManagerOpen,
        mcpServers,
        addMcpServer,
        removeMcpServer,
        updateMcpServer,
        startMcpServer,
        stopMcpServer,
        mcpServerStatuses,
        mcpServerLogs,
    } = useAppContext();

    const [newServer, setNewServer] = useState({ name: '', command: '', args: '', env: '' });
    const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const selectedServer = mcpServers.find(s => s.id === selectedServerId);
    const logs = selectedServerId ? mcpServerLogs[selectedServerId] || [] : [];
    const status = selectedServerId ? mcpServerStatuses[selectedServerId] || 'stopped' : 'stopped';

    useEffect(() => {
        if (isMcpServerManagerOpen && mcpServers.length > 0 && !selectedServerId) {
            setSelectedServerId(mcpServers[0].id);
        }
    }, [isMcpServerManagerOpen, mcpServers, selectedServerId]);
    
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const handleAddServer = () => {
        if (newServer.name.trim() && newServer.command.trim()) {
            addMcpServer(newServer);
            setNewServer({ name: '', command: '', args: '', env: '' });
        }
    };
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'running': return 'bg-green-500';
            case 'error': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };
    
    const renderLog = (log: McpLog) => {
        let colorClass = 'text-gray-400';
        if (log.type === 'stderr') colorClass = 'text-red-400';
        if (log.type === 'status' && log.message.includes('running')) colorClass = 'text-green-400';
        if (log.type === 'status' && log.message.includes('error')) colorClass = 'text-red-400 font-bold';
        
        return (
            <div key={log.id} className={`flex gap-3 font-mono text-xs ${colorClass}`}>
                <span className="text-gray-500 flex-shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="whitespace-pre-wrap break-all">{log.message}</span>
            </div>
        )
    };

    return (
        <div className={`fixed inset-0 flex justify-center items-center z-50 p-4 modal-overlay ${isMcpServerManagerOpen ? 'open' : ''}`} onClick={() => setIsMcpServerManagerOpen(false)}>
            <div className="glass-pane rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col modal-content shadow-purple-500/20" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <ServerStackIcon className="w-7 h-7 text-purple-400"/>
                        <h2 className="text-2xl font-bold text-white">MCP Server Manager</h2>
                    </div>
                    <button onClick={() => setIsMcpServerManagerOpen(false)} className="p-1 rounded-full hover:bg-white/10">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-1 min-h-0">
                    {/* Server List & Add Form */}
                    <div className="w-1/3 border-r border-white/10 flex flex-col">
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                           {mcpServers.map(server => (
                                <div 
                                    key={server.id} 
                                    onClick={() => setSelectedServerId(server.id)}
                                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${selectedServerId === server.id ? 'bg-indigo-600/30' : 'hover:bg-white/10'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(mcpServerStatuses[server.id] || 'stopped')}`}></div>
                                        <span className="font-semibold text-white">{safeRender(server.name)}</span>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); removeMcpServer(server.id); }} className="p-1 rounded-full text-gray-400 hover:bg-red-500/50 hover:text-white opacity-0 group-hover:opacity-100">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                           ))}
                        </div>
                        <div className="p-4 border-t border-white/10 space-y-3 glass-pane">
                             <h3 className="text-lg font-semibold text-white">Add New Server</h3>
                             <input type="text" placeholder="Server Name (e.g., shell)" value={newServer.name} onChange={e => setNewServer(s => ({...s, name: e.target.value}))} className="w-full bg-black/20 p-2 rounded-md" />
                             <input type="text" placeholder="Command (e.g., npx)" value={newServer.command} onChange={e => setNewServer(s => ({...s, command: e.target.value}))} className="w-full bg-black/20 p-2 rounded-md" />
                             <textarea placeholder="Arguments (e.g., -y mcp-shell-server)" value={newServer.args} onChange={e => setNewServer(s => ({...s, args: e.target.value}))} rows={2} className="w-full bg-black/20 p-2 rounded-md font-mono text-sm"></textarea>
                             <textarea placeholder="Environment Vars (KEY=VALUE)" value={newServer.env} onChange={e => setNewServer(s => ({...s, env: e.target.value}))} rows={2} className="w-full bg-black/20 p-2 rounded-md font-mono text-sm"></textarea>
                             <button onClick={handleAddServer} className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors">
                                <PlusIcon className="w-5 h-5" /> Add Server
                             </button>
                        </div>
                    </div>
                    {/* Server Details & Logs */}
                    <div className="w-2/3 flex flex-col">
                        {selectedServer ? (
                            <>
                                <div className="p-4 border-b border-white/10 flex items-center justify-between glass-pane">
                                    <h3 className="text-xl font-bold text-white">{safeRender(selectedServer.name)}</h3>
                                    <div className="flex items-center gap-3">
                                        <div className={`flex items-center gap-2 text-sm font-semibold capitalize ${status === 'running' ? 'text-green-400' : (status === 'error' ? 'text-red-400' : 'text-gray-400')}`}>
                                            <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                                            {status}
                                        </div>
                                        <button onClick={() => startMcpServer(selectedServer.id)} disabled={status === 'running'} className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed">Start</button>
                                        <button onClick={() => stopMcpServer(selectedServer.id)} disabled={status !== 'running'} className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:cursor-not-allowed">Stop</button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-black/20">
                                    {logs.map(renderLog)}
                                    <div ref={logsEndRef} />
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                <p>Select a server to view details or add a new one.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
