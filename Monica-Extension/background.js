'use strict';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SAVE_CONTEXT') {
    if (request.projectId && request.data) {
      chrome.storage.local.set({ [request.projectId]: request.data }, () => {
        sendResponse({ status: 'success' });
      });
    }
    return true;
  }

  if (request.type === 'LOAD_CONTEXT') {
    if (request.projectId) {
      chrome.storage.local.get(request.projectId, (result) => {
        sendResponse({ data: result[request.projectId] || null });
      });
    } else {
      // If projectId is null, respond immediately to prevent port closing error.
      sendResponse({ data: null });
    }
    return true;
  }
  
  if (request.type === 'INJECT_SCRIPT') {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id, frameIds: [request.frameId] },
      files: ['iframe_injector.js']
    }).then(() => sendResponse({status: 'success'}))
      .catch(err => sendResponse({status: 'error', message: err.message}));
    return true;
  }
});