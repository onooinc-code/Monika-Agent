
export interface McpServer {
  id: string;
  name: string;
  command: string;
  args: string; // Stored as a single string for textarea
  env: string; // Stored as a single string for textarea
}

export type McpServerStatus = 'stopped' | 'running' | 'error';

export interface McpLog {
    id: string; // Unique ID for the log entry
    serverId: string;
    type: 'stdout' | 'stderr' | 'status';
    message: string;
    timestamp: string;
}
