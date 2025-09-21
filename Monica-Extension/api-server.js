// API Server for Monica-Ext extension
class APIServer {
    constructor() {
        this.port = 8080;
        this.isRunning = false;
        this.server = null;
        this.routes = new Map();
        this.middleware = [];

        this.initializeRoutes();
    }

    initializeRoutes() {
        // Default routes
        this.addRoute('GET', '/api/status', this.handleStatus.bind(this));
        this.addRoute('GET', '/api/actions', this.handleGetActions.bind(this));
        this.addRoute('POST', '/api/actions/:actionId/execute', this.handleExecuteAction.bind(this));
        this.addRoute('GET', '/api/actions/:actionId/status', this.handleGetActionStatus.bind(this));
        this.addRoute('GET', '/api/history', this.handleGetHistory.bind(this));
        this.addRoute('POST', '/api/webhook', this.handleWebhook.bind(this));

        // Health check
        this.addRoute('GET', '/health', this.handleHealthCheck.bind(this));
    }

    addRoute(method, path, handler) {
        this.routes.set(`${method}:${path}`, handler);
    }

    use(middleware) {
        this.middleware.push(middleware);
    }

    async start(port = 8080) {
        if (this.isRunning) {
            console.log('API server is already running');
            return;
        }

        this.port = port;

        try {
            // In a browser extension context, this would typically be a service worker
            // or use chrome.sockets APIs for TCP connections
            // For now, we'll simulate the server structure

            this.isRunning = true;
            console.log(`Monica-Ext API server started on port ${this.port}`);

            // In a real implementation, you would set up actual HTTP server
            // For browser extension, this might use chrome.sockets or WebSocket
            this.setupMessageListener();

            return { success: true, port: this.port };

        } catch (error) {
            console.error('Failed to start API server:', error);
            return { success: false, error: error.message };
        }
    }

    async stop() {
        if (!this.isRunning) {
            console.log('API server is not running');
            return;
        }

        try {
            this.isRunning = false;
            console.log('Monica-Ext API server stopped');

            return { success: true };

        } catch (error) {
            console.error('Failed to stop API server:', error);
            return { success: false, error: error.message };
        }
    }

    setupMessageListener() {
        // Listen for messages from other extension scripts
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.type && request.type.startsWith('API_')) {
                this.handleAPIMessage(request, sender, sendResponse);
                return true;
            }
        });
    }

    handleAPIMessage(request, sender, sendResponse) {
        switch (request.type) {
            case 'API_REQUEST':
                this.processAPIRequest(request.method, request.path, request.body, sender)
                    .then(result => sendResponse(result))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                break;

            case 'API_START':
                this.start(request.port)
                    .then(result => sendResponse(result))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                break;

            case 'API_STOP':
                this.stop()
                    .then(result => sendResponse(result))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                break;
        }
    }

    async processAPIRequest(method, path, body, sender) {
        try {
            const routeKey = `${method}:${path}`;
            const handler = this.routes.get(routeKey);

            if (!handler) {
                return {
                    success: false,
                    error: 'Route not found',
                    status: 404
                };
            }

            // Apply middleware
            for (const middleware of this.middleware) {
                const result = await middleware({ method, path, body, sender });
                if (result) {
                    return result;
                }
            }

            // Execute route handler
            const result = await handler({ method, path, body, sender });

            return {
                success: true,
                data: result,
                status: 200
            };

        } catch (error) {
            console.error('API request error:', error);
            return {
                success: false,
                error: error.message,
                status: 500
            };
        }
    }

    // Route handlers
    async handleStatus({ sender }) {
        return {
            status: 'running',
            port: this.port,
            timestamp: Date.now(),
            version: chrome.runtime.getManifest().version
        };
    }

    async handleGetActions({ sender }) {
        return [
            { id: 'action1', name: 'Action 1', description: 'Execute action 1' },
            { id: 'action2', name: 'Action 2', description: 'Execute action 2' },
            { id: 'action3', name: 'Action 3', description: 'Execute action 3' },
            { id: 'action4', name: 'Action 4', description: 'Execute action 4' },
            { id: 'action5', name: 'Action 5', description: 'Execute action 5' },
            { id: 'action6', name: 'Action 6', description: 'Execute action 6' },
            { id: 'action7', name: 'Action 7', description: 'Execute action 7' }
        ];
    }

    async handleExecuteAction({ path, body, sender }) {
        const actionId = path.split('/')[3]; // Extract actionId from path

        try {
            // Send message to background script to execute action
            const result = await this.sendMessageToBackground({
                type: 'EXECUTE_ACTION',
                actionId: actionId,
                source: 'api'
            });

            return {
                actionId: actionId,
                success: result.success,
                value: result.value,
                timestamp: Date.now()
            };

        } catch (error) {
            return {
                actionId: actionId,
                success: false,
                error: error.message,
                timestamp: Date.now()
            };
        }
    }

    async handleGetActionStatus({ path, sender }) {
        const actionId = path.split('/')[3];

        // Get action status from storage
        return new Promise((resolve) => {
            chrome.storage.local.get(['actions'], (result) => {
                const actions = result.actions || [];
                const action = actions.find(a => a.id === actionId);

                if (action) {
                    resolve({
                        actionId: actionId,
                        status: action.status,
                        value: action.value,
                        timestamp: Date.now()
                    });
                } else {
                    resolve({
                        actionId: actionId,
                        status: 'not_found',
                        error: 'Action not found',
                        timestamp: Date.now()
                    });
                }
            });
        });
    }

    async handleGetHistory({ sender }) {
        return new Promise((resolve) => {
            chrome.storage.local.get(['actionHistory'], (result) => {
                resolve(result.actionHistory || []);
            });
        });
    }

    async handleWebhook({ body, sender }) {
        console.log('Webhook received:', body);

        // Process webhook data
        const result = {
            received: true,
            timestamp: Date.now(),
            data: body
        };

        // Store webhook data
        chrome.storage.local.get(['webhooks'], (result) => {
            const webhooks = result.webhooks || [];
            webhooks.push({
                timestamp: Date.now(),
                data: body,
                sender: sender
            });

            // Keep only last 50 webhooks
            if (webhooks.length > 50) {
                webhooks.splice(0, webhooks.length - 50);
            }

            chrome.storage.local.set({ webhooks: webhooks });
        });

        return result;
    }

    async handleHealthCheck({ sender }) {
        return {
            status: 'healthy',
            timestamp: Date.now(),
            uptime: this.isRunning ? Date.now() - this.startTime : 0
        };
    }

    sendMessageToBackground(message) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        });
    }

    // Utility methods
    getStatus() {
        return {
            isRunning: this.isRunning,
            port: this.port,
            routes: Array.from(this.routes.keys()),
            middleware: this.middleware.length
        };
    }
}

// Middleware example
const authMiddleware = async (request) => {
    // Check if request requires authentication
    if (request.path.startsWith('/api/')) {
        // In a real implementation, you would check API keys or tokens
        console.log('API request authenticated');
    }
};

const loggingMiddleware = async (request) => {
    console.log(`${request.method} ${request.path} - ${new Date().toISOString()}`);
};

// Initialize API server
const apiServer = new APIServer();

// Add middleware
apiServer.use(authMiddleware);
apiServer.use(loggingMiddleware);

// Export for use by other scripts
window.MonicaExtAPIServer = apiServer;