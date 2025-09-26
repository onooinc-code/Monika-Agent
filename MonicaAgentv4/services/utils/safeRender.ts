
import React from 'react';

/**
 * Safely renders content that might be an object if an AI model fails to follow a string schema.
 * If the content is not a string, it is stringified to prevent React from crashing.
 * @param content The content to render.
 * @returns A renderable string.
 */
export const safeRender = (content: any): string => {
    if (React.isValidElement(content)) {
        console.warn("A React Element was passed for rendering where a string was expected. Returning a placeholder to prevent a crash.", { element: content });
        return '[React Element]';
    }

    if (typeof content === 'string') {
        return content;
    }
    if (typeof content === 'number' || typeof content === 'boolean' || content === null || typeof content === 'undefined') {
        return String(content);
    }
    if (typeof content === 'object') {
        try {
            console.warn("A non-string object was passed for rendering. Stringifying to prevent a crash:", content);
            return JSON.stringify(content, null, 2);
        } catch (e) {
            return '[Unserializable Object]';
        }
    }
    return String(content);
};
