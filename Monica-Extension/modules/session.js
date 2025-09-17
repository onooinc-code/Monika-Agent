'use strict';

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
