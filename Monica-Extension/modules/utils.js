'use strict';

// This module provides globally accessible utility functions.
// NOTE: These DOM query selectors are brittle. If the AI Studio frontend changes,
// these functions will need to be updated. They are centralized here for easy maintenance.

function getProjectId() { try { return window.location.pathname.split('/drive/')[1].split('/')[0]; } catch (e) { return null; } }
function getChatInput() { return document.querySelector('textarea[placeholder*="Make changes"]'); }
function getSendButton() { return document.querySelector('button.send-button'); }
function getPreviewIframe() { return document.querySelector('iframe[title="Preview"]'); }

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
