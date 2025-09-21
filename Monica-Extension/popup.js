// State management for Monica-Ext extension
class ActionManager {
    constructor() {
        this.actions = [
            { id: 'action1', name: 'Navigate to New Chat', status: 'ready', value: null },
            { id: 'action2', name: 'Write "hello Agent" in text input', status: 'ready', value: null },
            { id: 'action3', name: 'Click on the "Run" button', status: 'ready', value: null },
            { id: 'action4', name: 'Retrieve conversation title', status: 'ready', value: null },
            { id: 'action5', name: 'Action 5', status: 'ready', value: null },
            { id: 'action6', name: 'Action 6', status: 'ready', value: null },
            { id: 'action7', name: 'Action 7', status: 'ready', value: null }
        ];

        this.initializeEventListeners();
        this.renderActions();
    }

    initializeEventListeners() {
        // Listen for messages from background script
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep message channel open for async response
        });
    }

    handleMessage(request, sender, sendResponse) {
        switch (request.type) {
            case 'ACTION_STATUS_UPDATE':
                this.updateActionStatus(request.actionId, request.status, request.value);
                break;
            case 'GET_ACTIONS':
                sendResponse({ actions: this.actions });
                break;
        }
    }

    updateActionStatus(actionId, status, value = null) {
        const action = this.actions.find(a => a.id === actionId);
        if (action) {
            action.status = status;
            if (value !== null) {
                action.value = value;
            }
            this.renderActions();
            this.saveState();
        }
    }

    async executeAction(actionId) {
        const action = this.actions.find(a => a.id === actionId);
        if (!action) return;

        // Update status to pending
        this.updateActionStatus(actionId, 'pending');

        try {
            // Send message to background script to execute action
            const response = await this.sendMessageToBackground({
                type: 'EXECUTE_ACTION',
                actionId: actionId
            });

            if (response.success) {
                this.updateActionStatus(actionId, 'success', response.value);
            } else {
                this.updateActionStatus(actionId, 'error');
            }
        } catch (error) {
            console.error('Error executing action:', error);
            this.updateActionStatus(actionId, 'error');
        }
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

    renderActions() {
        const buttonsContainer = document.getElementById('action-buttons');
        const statusContainer = document.getElementById('action-status');
        const valuesContainer = document.getElementById('action-values');

        // Clear existing content
        buttonsContainer.innerHTML = '';
        statusContainer.innerHTML = '';
        valuesContainer.innerHTML = '';

        this.actions.forEach(action => {
            // Create action button row
            const buttonRow = document.createElement('div');
            buttonRow.className = `action-row ${action.status}`;

            const button = document.createElement('button');
            button.className = 'action-button';
            button.textContent = action.name;
            button.onclick = () => this.executeAction(action.id);

            // Disable button if action is pending
            if (action.status === 'pending') {
                button.disabled = true;
            }

            buttonRow.appendChild(button);
            buttonsContainer.appendChild(buttonRow);

            // Create status display row
            const statusRow = document.createElement('div');
            statusRow.className = `action-row ${action.status}`;

            const status = document.createElement('div');
            status.className = 'action-status';

            const statusIndicator = document.createElement('span');
            statusIndicator.className = `status-indicator status-${action.status}`;

            // Set status text and spinner for pending
            if (action.status === 'pending') {
                statusIndicator.innerHTML = '<span class="spinner"></span> PENDING';
            } else {
                statusIndicator.textContent = action.status.toUpperCase();
            }

            status.appendChild(statusIndicator);
            statusRow.appendChild(status);
            statusContainer.appendChild(statusRow);

            // Create value display row
            const valueRow = document.createElement('div');
            valueRow.className = `action-row ${action.status}`;

            const value = document.createElement('div');
            value.className = 'action-value';
            value.textContent = action.value || '';
            valueRow.appendChild(value);
            valuesContainer.appendChild(valueRow);
        });
    }

    saveState() {
        chrome.storage.local.set({ actions: this.actions });
    }

    loadState() {
        chrome.storage.local.get(['actions'], (result) => {
            if (result.actions) {
                this.actions = result.actions;
                this.renderActions();
            }
        });
    }
}

// Placeholder action implementations
const ActionImplementations = {
    async action1() {
        // Placeholder for Action 1 implementation
        return { success: true, value: 'Result 1' };
    },

    async action2() {
        // Placeholder for Action 2 implementation
        return { success: true, value: 'Result 2' };
    },

    async action3() {
        // Placeholder for Action 3 implementation
        return { success: true, value: 'Result 3' };
    },

    async action4() {
        // Placeholder for Action 4 implementation
        return { success: true, value: 'Result 4' };
    },

    async action5() {
        // Placeholder for Action 5 implementation
        return { success: true, value: 'Result 5' };
    },

    async action6() {
        // Placeholder for Action 6 implementation
        return { success: true, value: 'Result 6' };
    },

    async action7() {
        // Placeholder for Action 7 implementation
        return { success: true, value: 'Result 7' };
    }
};

// Initialize the extension when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const actionManager = new ActionManager();
    actionManager.loadState();

    // Make action manager globally available for debugging
    window.actionManager = actionManager;
});