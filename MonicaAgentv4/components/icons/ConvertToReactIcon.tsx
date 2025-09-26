
import React from 'react';

export const ConvertToReactIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <polyline points="10 8 6 12 10 16" />
        <line x1="6" y1="12" x2="1" y2="12" />
        <circle cx="18" cy="12" r="3" />
        <ellipse cx="18" cy="12" rx="7" ry="3" transform="rotate(60 18 12)" />
        <ellipse cx="18" cy="12" rx="7" ry="3" transform="rotate(120 18 12)" />
    </svg>
);
