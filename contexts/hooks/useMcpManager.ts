
import { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage.ts';
import { McpServer, McpServerStatus, McpLog } from '../../types/index.ts';

export const useMcpManager = () => {
    const [mcpServers, setMcpServers] = useLocalStorage<McpServer[]>('mcp-servers', []);
    const [mcpServerStatuses, setMcpServerStatuses] = useState<Record<string, McpServerStatus>>({});
    const [mcpServerLogs, setMcpServerLogs] = useState<Record<string, McpLog[]>>({});

    useEffect(() => {
        const handleMessageFromExtension = (event: MessageEvent) => {
            // Basic validation for the event origin and data structure
            if (event.source !== window || !event.data || !event.data.source || event.data.source !== 'monica-extension-r3sponse') {
                return;
            }

            const { type, serverId, payload } = event.data;
            
            if (type === 'MCP_STATUS_UPDATE' && serverId && payload) {
                setMcpServerStatuses(prev => ({ ...prev, [serverId]: payload.status as McpServerStatus }));
            }

            if (type === 'MCP_LOG' && serverId && payload) {
                const newLog: McpLog = {
                    id: `log-${Date.now()}-${Math.random()}`,
                    serverId: serverId,
                    type: payload.type as 'stdout' | 'stderr' | 'status',
                    message: payload.message,
                    timestamp: new Date().toISOString(),
                };
                setMcpServerLogs(prev => {
                    const logs = prev[serverId] ? [...prev[serverId], newLog] : [newLog];
                    // Keep the log buffer from growing indefinitely
                    if (logs.length > 200) {
                        logs.splice(0, logs.length - 200);
                    }
                    return { ...prev, [serverId]: logs };
                });
            }
        };

        window.addEventListener('message', handleMessageFromExtension);
        return () => {
            window.removeEventListener('message', handleMessageFromExtension);
        };
    }, []);
    
    const postCommandToExtension = (command: string, serverId: string, serverConfig?: McpServer) => {
        window.postMessage({
            source: 'monica-webapp-r3qu3st',
            type: 'MONICA_MCP_COMMAND',
            payload: {
                command,
                serverId,
                config: serverConfig,
            }
        }, '*');
    };

    const addMcpServer = (server: Omit<McpServer, 'id'>) => {
        const newServer = { ...server, id: `mcp-${Date.now()}` };
        setMcpServers(prev => [...prev, newServer]);
    };

    const removeMcpServer = (id: string) => {
        setMcpServers(prev => prev.filter(s => s.id !== id));
        setMcpServerStatuses(prev => {
            const newStatuses = { ...prev };
            delete newStatuses[id];
            return newStatuses;
        });
        setMcpServerLogs(prev => {
            const newLogs = { ...prev };
            delete newLogs[id];
            return newLogs;
        });
    };

    const updateMcpServer = (id: string, updates: Partial<McpServer>) => {
        setMcpServers(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    };
    
    const startMcpServer = (id: string) => {
        const server = mcpServers.find(s => s.id === id);
        if (server) {
            setMcpServerLogs(prev => ({ ...prev, [id]: [] })); // Clear logs on start
            postCommandToExtension('start', id, server);
        }
    };
    
    const stopMcpServer = (id: string) => {
        postCommandToExtension('stop', id);
    };

    return {
        mcpServers,
        addMcpServer,
        removeMcpServer,
        updateMcpServer,
        startMcpServer,
        stopMcpServer,
        mcpServerStatuses,
        mcpServerLogs,
    };
};
