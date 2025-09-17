'use strict';

// This module defines the global state for the extension.
// Because all content scripts in the manifest run in the same isolated world,
// variables defined here are accessible by all other module scripts.

// --- STATE MANAGEMENT ---
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

function logMessage(message, type = 'info') {
    const time = new Date().toLocaleTimeString();
    logs.push({ time, message, type });
    if (logs.length > 100) logs.shift(); // Keep log size reasonable
    // If the log modal is open, refresh its content.
    if (document.getElementById('log-modal')?.style.display === 'flex') {
        updateLogUI();
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
             if (chrome.runtime.lastError) {
                 logMessage(`Error loading context: ${chrome.runtime.lastError.message}`, "error");
                 return;
             }
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
