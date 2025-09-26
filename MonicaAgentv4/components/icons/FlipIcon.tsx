
import React from 'react';

export const FlipIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 2.1l4 4-4 4" />
        <path d="M3 12.6V16a6 6 0 006 6h12" />
        <path d="M7 21.9l-4-4 4-4" />
        <path d="M21 11.4V8a6 6 0 00-6-6H3" />
    </svg>
);
