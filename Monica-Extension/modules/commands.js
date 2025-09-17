'use strict';

// This module handles the execution of commands received from the AI.
// It depends on functions from state.js and utils.js.

async function sendReportToMonica(report) {
    const input = getChatInput();
    const sendBtn = getSendButton();
    if (input && sendBtn && !sendBtn.disabled) {
        const prompt = `Here is the diagnostic report you requested.\n\n\`\`\`json\n${JSON.stringify(report, null, 2)}\n\`\`\``;
        input.value = prompt;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        // A small delay to ensure the UI updates before clicking.
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
    return new Promise((resolve) => {
        const iframe = getPreviewIframe();
        if (!iframe) { 
            logMessage("Preview iframe not found.", "error");
            resolve(["Error: Preview iframe not found."]); 
            return; 
        }

        // The frame ID is often needed for scripting APIs. This is brittle.
        const frameIdStr = iframe.id; 
        if (!frameIdStr) { 
            logMessage("Preview iframe has no ID.", "error");
            resolve(["Error: Could not determine frame ID."]); 
            return; 
        }
        const frameId = parseInt(frameIdStr.split('_')[1], 10);
        if(isNaN(frameId)) { 
            logMessage("Could not parse frame ID from iframe.id.", "error");
            resolve(["Error: Could not parse frame ID."]); 
            return; 
        }

        let collectedErrors = [];
        // Increased timeout to 3 seconds to give the app more time to load and potentially error.
        const timeout = setTimeout(() => {
            window.removeEventListener('message', messageListener);
            logMessage(`Error listener timeout reached. Found ${collectedErrors.length} errors.`);
            resolve(collectedErrors);
        }, 3000); 

        const messageListener = (event) => {
            // Check for source and type for security and to avoid processing irrelevant messages.
            if (event.source === iframe.contentWindow && event.data && event.data.type === 'MONICA_IFRAME_ERROR') {
                collectedErrors.push(event.data.error);
            }
        };
        window.addEventListener('message', messageListener, false);

        // Send message to background script to inject our listener.
        chrome.runtime.sendMessage({ type: 'INJECT_SCRIPT', frameId: frameId}, response => {
             // If injection fails, we must clean up and resolve immediately.
             if(!response || response.status !== 'success') {
                 clearTimeout(timeout);
                 window.removeEventListener('message', messageListener);
                 const errorMsg = `Error injecting script into iframe: ${response?.message || 'Unknown error'}`;
                 logMessage(errorMsg, "error");
                 resolve([errorMsg]);
             } else {
                 logMessage("Successfully injected iframe error listener.");
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
