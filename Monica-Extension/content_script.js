'use strict';

// This is the main orchestrator script.
// It relies on functions defined in the other module files that are loaded before it.
// All modules share the same global scope.

// --- EVENT LISTENERS & INITIALIZATION ---
function setupListeners() {
    // This observer watches for new AI responses added to the chat.
    const chatContainer = document.querySelector('ms-code-assistant-chat ms-autoscroll-container');
    if (!chatContainer) {
        logMessage("Chat container not found for MutationObserver.", "error");
        return;
    }
    const observer = new MutationObserver((mutations) => {
        const sendBtn = getSendButton();
        if (sendBtn && sendBtn.disabled) { setStatusLight('yellow'); return; }
        if(document.getElementById('ai-bridge-status-light').classList.contains('status-light-yellow')) {
            setStatusLight('red');
        }
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                // We are interested in new 'turn' elements from the 'output' (AI).
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('turn') && node.classList.contains('output')) {
                    parseAndExecuteCommands(node);
                }
            }
        }
    });
    observer.observe(chatContainer, { childList: true, subtree: true });
    logMessage("MutationObserver attached to chat container.");

    // This observer watches for modals appearing in the DOM.
    const modalObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;
                // Check for GitHub commit modal to inject our button.
                if (node.querySelector('[mat-dialog-title] .title')?.textContent.includes('GitHub')) {
                    injectCommitButton(node);
                }
                // Check for "Fix Errors" panel to auto-click if automation is on.
                if (isAutomationEnabled && node.querySelector('.fix-errors-container button.ms-button-borderless')) {
                    logMessage("Auto-fix panel detected. Clicking fix button...");
                    node.querySelector('.fix-errors-container button.ms-button-borderless').click();
                }
            }
        }
    });
    modalObserver.observe(document.body, { childList: true, subtree: true });
    logMessage("ModalObserver attached to document body.");

    // Use event delegation for all panel/modal buttons for efficiency.
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        switch(target.id) {
            case 'new-session-btn': sendBootstrapPrompt(); break;
            case 'view-conversation-btn':
                document.getElementById('conversation-state-pre').textContent = JSON.stringify(conversationState, null, 2);
                toggleModal('conversation-modal', true);
                break;
            case 'view-tags-btn':
                updateTagStatusUI();
                toggleModal('tags-modal', true);
                break;
            case 'view-log-btn':
                updateLogUI();
                toggleModal('log-modal', true);
                break;
            case 'view-features-btn':
                updateFeaturesUI();
                toggleModal('features-modal', true);
                break;
            case 'toggle-automation-btn':
                isAutomationEnabled = !isAutomationEnabled;
                target.classList.toggle('automation-on', isAutomationEnabled);
                target.classList.toggle('automation-off', !isAutomationEnabled);
                target.textContent = isAutomationEnabled ? '🟢 Automation ON' : '🔴 Automation OFF';
                logMessage(`Automation toggled ${isAutomationEnabled ? 'ON' : 'OFF'}.`);
                break;
            case 'ai-bridge-toggle-btn':
                const panel = document.getElementById('ai-bridge-panel');
                panel.classList.toggle('minimized');
                target.textContent = panel.classList.contains('minimized') ? '+' : '-';
                target.title = panel.classList.contains('minimized') ? 'Expand' : 'Minimize';
                break;
        }
        if (target.classList.contains('modal-close-btn')) {
            target.closest('.ai-bridge-modal').style.display = 'none';
        }
    });
}

function main() {
    try {
        if (document.getElementById('ai-bridge-panel')) return;
        
        // Use a MutationObserver to wait for the app to be ready. This is more efficient than setInterval.
        const appObserver = new MutationObserver((mutations, observer) => {
            const appRoot = document.querySelector('app-root');
            const chatContainer = document.querySelector('ms-code-assistant-chat ms-autoscroll-container');

            if (appRoot && chatContainer) {
                observer.disconnect(); // Stop observing once we've found our elements.
                logMessage("Monica Bridge Initializing...");
                injectStylesheet();
                createControlPanel();
                setupListeners();
                loadContext();
                logMessage("Monica Bridge Initialized.", "success");
            }
        });

        appObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    } catch (e) {
        console.error("CRITICAL ERROR during Monica Bridge Initialization:", e);
    }
}
    
main();