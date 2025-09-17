'use strict';

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
    const conversationModal = document.createElement('div');
    conversationModal.id = 'conversation-modal';
    conversationModal.className = 'ai-bridge-modal';
    conversationModal.innerHTML = `
        <div class="modal-header"><h2>Conversation State</h2><button class="modal-close-btn">X</button></div>
        <div class="modal-content"><pre id="conversation-state-pre"></pre></div>
    `;
    document.body.appendChild(conversationModal);

    const tagsModal = document.createElement('div');
    tagsModal.id = 'tags-modal';
    tagsModal.className = 'ai-bridge-modal';
    tagsModal.innerHTML = `
        <div class="modal-header"><h2>Tag Status</h2><button class="modal-close-btn">X</button></div>
        <div class="modal-content" id="tags-status-content"></div>
    `;
    document.body.appendChild(tagsModal);

    const featuresModal = document.createElement('div');
    featuresModal.id = 'features-modal';
    featuresModal.className = 'ai-bridge-modal';
    featuresModal.innerHTML = `
        <div class="modal-header"><h2>Feature Status</h2><button class="modal-close-btn">X</button></div>
        <div class="modal-content" id="features-status-content"></div>
    `;
    document.body.appendChild(featuresModal);

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

function setStatusLight(color) {
    const light = document.getElementById('ai-bridge-status-light');
    if(light) {
        light.className = `status-light-${color}`;
        light.title = `Status: ${color === 'green' ? 'Connected & Ready' : (color === 'yellow' ? 'Processing...' : 'Disconnected')}`;
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
