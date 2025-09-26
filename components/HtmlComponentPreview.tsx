
import React from 'react';
// FIX: Corrected import path for types to point to the barrel file.
import { HtmlComponent } from '@/types/index';

interface HtmlComponentPreviewProps {
    component: HtmlComponent;
}

// Simple CSS parser to scope rules. This is a basic implementation.
const scopeCss = (css: string, scopeId: string): string => {
    if (!css) return '';
    // This regex is a simplified approach to prefix selectors.
    // It might not cover all edge cases but works for most standard CSS.
    return css.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|s*\{)/g, (match, selector) => {
        // Don't scope @keyframes, @media, etc.
        if (selector.trim().startsWith('@')) {
            return match;
        }
        const scopedSelector = selector.split(',').map((part: string) => {
            const trimmed = part.trim();
            if (trimmed) {
                return `#${scopeId} ${trimmed}`;
            }
            return '';
        }).join(', ');
        return match.replace(selector, scopedSelector);
    });
};

export const HtmlComponentPreview: React.FC<HtmlComponentPreviewProps> = ({ component }) => {
    const scopeId = `html-component-${component.id}`;
    const scopedCss = scopeCss(component.css, scopeId);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
            <div id={scopeId} dangerouslySetInnerHTML={{ __html: component.html }} />
        </>
    );
};