(function() {
    'use strict';

    // --- 1. STATE MANAGEMENT ---
    let conversationState = {};
    let cumulativeChangelog = '';
    let isAutomationEnabled = true;
    let logs = [];
    let tagStatus = {
        GET_PREVIEW_STATE: { status: 'idle', last_run: null },
        GET_DOM_STRUCTURE: { status: 'idle', last_run: null },
        INTERACT_ELEMENT: { status: 'idle', last_run: null },
    };
    const features = [
        { name: "Conversation Lifecycle", status: "Completed" },
        { name: "Conversation Titling", status: "Completed" },
        { name: "Per-Conversation Settings", status: "Completed" },
        { name: "Rich Message Content", status: "Completed" },
        { name: "Message Metadata Display", status: "Completed" },
        { name: "Long Message Handling", status: "Completed" },
        { name: "Message Toolbar (Standard)", status: "Completed" },
        { name: "Message Toolbar (AI)", status: "Completed" },
        { name: "Backend Process Transparency", status: "Completed" },
        { name: "Status Bar Metrics", status: "Completed" },
        { name: "Discussion Mode (Core)", status: "Completed" },
        { name: "Discussion Mode (AI Rules)", status: "Completed" },
        { name: "Advanced Agent Configuration", status: "Completed" },
        { name: "Automatic Agent Generation", status: "Completed" },
    ];


    // --- 2. UI & STYLING ---
    function injectStylesheet() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = chrome.runtime.getURL('style.css');
        document.head.appendChild(link);
    }

    function createControlPanel() {
        if (document.getElementById('ai-bridge-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'ai-bridge-panel';
        panel.innerHTML = `
            <div id="ai-bridge-header">
                <h3>AI Interactive Bridge</h3>
                <div id="ai-bridge-status-light" class="status-light-red" title="Status: Disconnected"></div>
                <button id="ai-bridge-toggle-btn" title="Minimize">-</button>
            </div>
            <div id="ai-bridge-body">
                <div class="button-grid">
                    <button id="new-session-btn" title="Sends the initial context prompt to the AI.">🚀 New Session</button>
                    <button id="view-conversation-btn">📋 View State</button>
                    <button id="view-tags-btn">🏷️ View Tags</button>
                    <button id="view-log-btn">📜 View Log</button>
                    <button id="view-features-btn">✨ View Features</button>
                    <button id="toggle-automation-btn" class="automation-on" title="Toggle autonomous execution of commands from the AI.">🟢 Automation ON</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        makeDraggable(panel);
        createModals();
    }
    
    function createModals() {
        // Conversation State Modal
        const conversationModal = document.createElement('div');
        conversationModal.id = 'conversation-modal';
        conversationModal.className = 'ai-bridge-modal';
        conversationModal.innerHTML = `
            <div class="modal-header"><h2>Conversation State</h2><button class="modal-close-btn">X</button></div>
            <div class="modal-content"><pre id="conversation-state-pre"></pre></div>
        `;
        document.body.appendChild(conversationModal);

        // Tags Status Modal
        const tagsModal = document.createElement('div');
        tagsModal.id = 'tags-modal';
        tagsModal.className = 'ai-bridge-modal';
        tagsModal.innerHTML = `
            <div class="modal-header"><h2>Tag Status</h2><button class="modal-close-btn">X</button></div>
            <div class="modal-content" id="tags-status-content"></div>
        `;
        document.body.appendChild(tagsModal);

        // Features Modal
        const featuresModal = document.createElement('div');
        featuresModal.id = 'features-modal';
        featuresModal.className = 'ai-bridge-modal';
        featuresModal.innerHTML = `
            <div class="modal-header"><h2>Feature Status</h2><button class="modal-close-btn">X</button></div>
            <div class="modal-content" id="features-status-content"></div>
        `;
        document.body.appendChild(featuresModal);

        // Log Modal
        const logModal = document.createElement('div');
        logModal.id = 'log-modal';
        logModal.className = 'ai-bridge-modal';
        logModal.innerHTML = `
            <div class="modal-header"><h2>Event Log</h2><button class="modal-close-btn">X</button></div>
            <div class="modal-content" id="log-content"></div>
        `;
        document.body.appendChild(logModal);
    }
    
    function toggleModal(modalId, show) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = show ? 'flex' : 'none';
        }
    }

    function updateTagStatusUI() {
        const content = document.getElementById('tags-status-content');
        if (!content) return;
        content.innerHTML = '<ul>' + Object.entries(tagStatus).map(([tag, data]) => 
            `<li><span class="status-light-${data.status === 'success' ? 'green' : (data.status === 'running' ? 'yellow' : 'red')}"></span>${tag}<span class="last-run">${data.last_run ? new Date(data.last_run).toLocaleTimeString() : 'Never'}</span></li>`
        ).join('') + '</ul>';
    }
    
    function updateLogUI() {
        const content = document.getElementById('log-content');
        if (!content) return;
        content.innerHTML = logs.map(log => `<div class="log-entry log-${log.type}"><span class="log-time">${log.time}</span>${log.message}</div>`).join('');
        content.scrollTop = content.scrollHeight;
    }

    function updateFeaturesUI() {
        const content = document.getElementById('features-status-content');
        if (!content) return;
        content.innerHTML = `
            <table>
                <thead><tr><th>Feature</th><th>Status</th></tr></thead>
                <tbody>
                    ${features.map(f => `<tr><td>${f.name}</td><td><span class="status-light-${f.status === 'Completed' ? 'green' : 'yellow'}"></span>${f.status}</td></tr>`).join('')}
                </tbody>
            </table>`;
    }

    // --- 3. CORE FUNCTIONALITY & HELPERS ---
    function logMessage(message, type = 'info') {
        const time = new Date().toLocaleTimeString();
        logs.push({ time, message, type });
        if (logs.length > 100) logs.shift(); // Keep log size reasonable
        if (document.getElementById('log-modal')?.style.display === 'flex') {
            updateLogUI();
        }
    }

    function getProjectId() { try { return window.location.pathname.split('/drive/')[1].split('/')[0]; } catch (e) { return null; } }
    function getChatInput() { return document.querySelector('textarea[placeholder*="Make changes"]'); }
    function getSendButton() { return document.querySelector('button.send-button'); }
    function setStatusLight(color) {
        const light = document.getElementById('ai-bridge-status-light');
        if(light) {
            light.className = `status-light-${color}`;
            light.title = `Status: ${color === 'green' ? 'Connected & Ready' : (color === 'yellow' ? 'Processing...' : 'Disconnected')}`;
        }
    }
    function getPreviewIframe() { return document.querySelector('iframe[title="Preview"]'); }

    // --- 4. AUTOMATION & COMMAND HANDLING ---
    async function sendReportToMonica(report) {
        const input = getChatInput();
        const sendBtn = getSendButton();
        if (input && sendBtn && !sendBtn.disabled) {
            const prompt = `Here is the diagnostic report you requested.\n\n\`\`\`json\n${JSON.stringify(report, null, 2)}\n\`\`\``;
            input.value = prompt;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            await new Promise(r => setTimeout(r, 100));
            sendBtn.click();
            logMessage("Sent diagnostic report to AI.", "success");
        } else {
            logMessage("Could not send report: Input or Send button not available/ready.", "error");
        }
    }

    async function handleGetPreviewState() {
        logMessage("Action received: GET_PREVIEW_STATE");
        tagStatus.GET_PREVIEW_STATE.status = 'running'; updateTagStatusUI();
        const studioErrors = Array.from(document.querySelectorAll('.error-list .message, ms-console-status .message.error')).map(el => el.textContent.trim());
        const iframeErrors = await injectAndListenForIframeErrors();
        const report = { studioBuildErrors: studioErrors, previewConsoleErrors: iframeErrors };
        await sendReportToMonica(report);
        tagStatus.GET_PREVIEW_STATE.status = 'success'; tagStatus.GET_PREVIEW_STATE.last_run = Date.now(); updateTagStatusUI();
    }

    function injectAndListenForIframeErrors() {
        return new Promise(async (resolve) => {
            const iframe = getPreviewIframe();
            if (!iframe) { logMessage("Preview iframe not found.", "error"); resolve(["Error: Preview iframe not found."]); return; }
            const frameIdStr = iframe.id; // Using ID is more stable
            if (!frameIdStr) { logMessage("Preview iframe has no ID.", "error"); resolve(["Error: Could not determine frame ID."]); return; }
            const frameId = parseInt(frameIdStr.split('_')[1], 10);
            if(isNaN(frameId)) { logMessage("Could not parse frame ID.", "error"); resolve(["Error: Could not parse frame ID."]); return; }

            let collectedErrors = [];
            const timeout = setTimeout(() => {
                window.removeEventListener('message', messageListener);
                resolve(collectedErrors.length > 0 ? collectedErrors : []);
            }, 2000);
            const messageListener = (event) => {
                if (event.data && event.data.type === 'MONICA_IFRAME_ERROR') {
                    collectedErrors.push(event.data.error);
                }
            };
            window.addEventListener('message', messageListener, false);
            chrome.runtime.sendMessage({ type: 'INJECT_SCRIPT', frameId: frameId}, response => {
                 if(!response || response.status !== 'success') {
                     clearTimeout(timeout);
                     window.removeEventListener('message', messageListener);
                     const errorMsg = `Error injecting script: ${response?.message || 'Unknown error'}`;
                     logMessage(errorMsg, "error");
                     resolve([errorMsg]);
                 }
            });
        });
    }

    async function handleGetDomStructure() {
        logMessage("Action received: GET_DOM_STRUCTURE");
        tagStatus.GET_DOM_STRUCTURE.status = 'running'; updateTagStatusUI();
        const iframe = getPreviewIframe();
        if (iframe && iframe.contentDocument) {
            await sendReportToMonica({ domStructure: iframe.contentDocument.body.innerHTML });
            tagStatus.GET_DOM_STRUCTURE.status = 'success';
        } else {
            await sendReportToMonica({ domError: "Could not access preview iframe DOM." });
            tagStatus.GET_DOM_STRUCTURE.status = 'error';
        }
        tagStatus.GET_DOM_STRUCTURE.last_run = Date.now(); updateTagStatusUI();
    }
    
    async function handleInteractElement(params) {
        logMessage(`Action received: INTERACT_ELEMENT with params: ${JSON.stringify(params)}`);
        tagStatus.INTERACT_ELEMENT.status = 'running'; updateTagStatusUI();
        const iframe = getPreviewIframe();
        if (!iframe || !iframe.contentDocument) {
            await sendReportToMonica({ interactionError: "Could not access preview iframe." });
            tagStatus.INTERACT_ELEMENT.status = 'error';
            updateTagStatusUI();
            return;
        }
        const element = iframe.contentDocument.querySelector(params.selector);
        if (!element) {
            await sendReportToMonica({ interactionError: `Element with selector "${params.selector}" not found.` });
            tagStatus.INTERACT_ELEMENT.status = 'error';
            updateTagStatusUI();
            return;
        }
        let result = {};
        try {
            if (params.action === 'click') {
                element.click();
                result = { interactionSuccess: `Clicked element "${params.selector}".` };
            } else if (params.action === 'getText') {
                result = { elementText: element.textContent.trim() };
            }
            tagStatus.INTERACT_ELEMENT.status = 'success';
        } catch (e) {
            result = { interactionError: e.message };
            tagStatus.INTERACT_ELEMENT.status = 'error';
        }
        await sendReportToMonica(result);
        tagStatus.INTERACT_ELEMENT.last_run = Date.now(); updateTagStatusUI();
    }
    
    function isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    function deepMerge(target, source) {
        const output = { ...target };
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = deepMerge(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }

    function handleUpdateContext(updateData) {
        if (!updateData) {
            logMessage("Received empty update data.", "warn");
            return;
        }
        logMessage(`Merging context update: ${JSON.stringify(updateData.context_update)}`);
        conversationState = deepMerge(conversationState, updateData.context_update || {});
        if (updateData.summary) {
            if (!conversationState.messages) {
                conversationState.messages = [];
            }
            conversationState.messages.push({ sender: 'ai', full_text: '...', summary: updateData.summary, timestamp: new Date().toISOString() });
        }
        saveContext();
    }
    
    async function parseAndExecuteCommands(node) {
        logMessage("New AI response detected. Parsing for commands...");
        const changelogRegex = /<!--\s*MONICA_CHANGELOG_START\s*-->([\s\S]*?)<!--\s*MONICA_CHANGELOG_END\s*-->/g;
        const actionRegex = /<!--\s*MONICA_ACTION:\s*({[\s\S]*?})\s*-->/g;
        const updateRegex = /<!--\s*MONICA_UPDATE:\s*({[\s\S]*?})\s*-->/g;

        const html = node.innerHTML;
        let changelogMatch, actionMatch, updateMatch;
        let commandFound = false;
        
        while ((changelogMatch = changelogRegex.exec(html)) !== null) {
            const newChangelog = changelogMatch[1].trim();
            cumulativeChangelog += newChangelog + '\n\n';
            logMessage(`Changelog found and appended: ${newChangelog.substring(0, 50)}...`);
            saveContext();
        }

        while ((actionMatch = actionRegex.exec(html)) !== null) {
            commandFound = true;
            try {
                const command = JSON.parse(actionMatch[1]);
                logMessage(`MONICA_ACTION found: ${command.action}`);
                if (isAutomationEnabled) {
                    setStatusLight('yellow');
                    switch(command.action) {
                        case 'GET_PREVIEW_STATE': await handleGetPreviewState(); break;
                        case 'GET_DOM_STRUCTURE': await handleGetDomStructure(); break;
                        case 'INTERACT_ELEMENT': await handleInteractElement(command.params); break;
                    }
                } else {
                    logMessage(`Automation is OFF. Skipping execution of ${command.action}.`, "warn");
                }
            } catch (e) { 
                logMessage(`Failed to parse MONICA_ACTION: ${e.message}`, "error");
                setStatusLight('red');
            }
        }

        while ((updateMatch = updateRegex.exec(html)) !== null) {
            commandFound = true;
            try {
                const updateData = JSON.parse(updateMatch[1]);
                logMessage("MONICA_UPDATE found. Updating context.");
                handleUpdateContext(updateData);
            } catch (e) { 
                logMessage(`Failed to parse MONICA_UPDATE: ${e.message}`, "error");
                setStatusLight('red');
            }
        }

        if(commandFound) {
            setStatusLight('green');
        } else {
            logMessage("No commands found in the latest AI response.");
        }
    }
    
    function injectCommitButton(modal) {
        if (modal.querySelector('#paste-commit-btn')) return;

        const pasteButton = document.createElement('button');
        pasteButton.id = 'paste-commit-btn';
        pasteButton.textContent = '📋 Paste Accumulated Changelog';
        pasteButton.title = 'Paste the accumulated changelog into the commit message.';
        
        pasteButton.addEventListener('click', () => {
            const textarea = modal.querySelector('textarea[formcontrolname="message"]');
            if (textarea) {
                textarea.value = cumulativeChangelog;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                cumulativeChangelog = ''; // Clear after pasting
                saveContext();
            }
        });
        
        const submitButton = modal.querySelector('button.submit-button');
        if (submitButton) {
            submitButton.parentNode.insertBefore(pasteButton, submitButton);
        }
    }

    // --- 5. EVENT LISTENERS & INITIALIZATION ---
    function setupListeners() {
        // Observer for new AI messages
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
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('turn') && node.classList.contains('output')) {
                        parseAndExecuteCommands(node);
                    }
                }
            }
        });
        observer.observe(chatContainer, { childList: true, subtree: true });
        logMessage("MutationObserver attached to chat container.");

        // Observer for modals (e.g., GitHub commit)
        const modalObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('[mat-dialog-title] .title')?.textContent.includes('GitHub')) {
                        injectCommitButton(node);
                    }
                    if (isAutomationEnabled && node.nodeType === Node.ELEMENT_NODE && node.querySelector('.fix-errors-container button.ms-button-borderless')) {
                        logMessage("Auto-fix panel detected. Clicking fix button...");
                        node.querySelector('.fix-errors-container button.ms-button-borderless').click();
                    }
                }
            }
        });
        modalObserver.observe(document.body, { childList: true, subtree: true });
        logMessage("ModalObserver attached to document body.");

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
    
    async function sendBootstrapPrompt() {
        const input = getChatInput();
        const sendBtn = getSendButton();
        if (!input || !sendBtn) {
            logMessage("Cannot start new session: Chat input not found.", "error");
            return;
        }
        
        try {
            const response = await fetch(chrome.runtime.getURL('bootstrap_prompt.txt'));
            let promptText = await response.text();
            logMessage("Bootstrap prompt loaded.");

            if (Object.keys(conversationState).length > 0) {
                promptText += "\n\n### Previous Session Context\nHere is the saved context from our last session:\n```json\n" + JSON.stringify(conversationState, null, 2) + "\n```";
                logMessage("Appended previous session context to bootstrap prompt.");
            }

            input.value = promptText;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            await new Promise(r => setTimeout(r, 100));
            if (!sendBtn.disabled) {
                sendBtn.click();
                logMessage("Bootstrap prompt sent to AI.");
            }
        } catch (error) {
            logMessage(`Error sending bootstrap prompt: ${error.message}`, "error");
            input.value = "Error: Could not load the initial bootstrap prompt. Please check the extension files.";
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
    
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById("ai-bridge-header");
        if (header) { header.onmousedown = dragMouseDown; }

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function saveContext() {
        const projectId = getProjectId();
        if (projectId) {
            const dataToSave = { conversationState, cumulativeChangelog };
            chrome.runtime.sendMessage({ type: 'SAVE_CONTEXT', projectId, data: dataToSave }, () => {
                logMessage("Context save request sent to background.");
            });
        } else {
            logMessage("Could not save context: No Project ID found.", "warn");
        }
    }

    function loadContext() {
        const projectId = getProjectId();
        if (projectId) {
             chrome.runtime.sendMessage({ type: 'LOAD_CONTEXT', projectId }, (response) => {
                 if (response && response.data) {
                     conversationState = response.data.conversationState || {};
                     cumulativeChangelog = response.data.cumulativeChangelog || '';
                     logMessage("Successfully loaded context for project " + projectId, "success");
                 } else {
                     logMessage("No previous context found for this project.");
                 }
             });
        }
    }

    function initialize() {
        if (document.getElementById('ai-bridge-panel')) return;
        
        const startupInterval = setInterval(() => {
            const appRoot = document.querySelector('app-root');
            // AI Studio's chat container selector can be brittle. This is a common one.
            const chatContainer = document.querySelector('ms-code-assistant-chat ms-autoscroll-container');
            
            if (appRoot && chatContainer) {
                clearInterval(startupInterval);
                logMessage("Monica Bridge Initializing...");
                injectStylesheet();
                createControlPanel();
                setupListeners();
                loadContext();
                logMessage("Monica Bridge Initialized.", "success");
            }
        }, 1000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();