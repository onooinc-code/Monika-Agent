import React from 'react';

export const ComponentGalleryIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
    >
        <defs>
            <linearGradient id="grad-gallery-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
            <linearGradient id="grad-gallery-2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="grad-gallery-3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
            </linearGradient>
             <linearGradient id="grad-gallery-4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <filter id="shadow-gallery" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
            </filter>
        </defs>
        <g filter="url(#shadow-gallery)">
            <rect x="8" y="8" width="22" height="22" rx="6" fill="url(#grad-gallery-1)" stroke="#FFFFFF" strokeWidth="4" />
            <path d="M11 11 C 15 8, 25 8, 27 11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" fill="none" />
            
            <rect x="34" y="8" width="22" height="22" rx="6" fill="url(#grad-gallery-2)" stroke="#FFFFFF" strokeWidth="4" />
            <path d="M37 11 C 41 8, 51 8, 53 11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" fill="none" />
            
            <rect x="8" y="34" width="22" height="22" rx="6" fill="url(#grad-gallery-3)" stroke="#FFFFFF" strokeWidth="4" />
            <path d="M11 37 C 15 34, 25 34, 27 37" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" fill="none" />

            <rect x="34" y="34" width="22" height="22" rx="6" fill="url(#grad-gallery-4)" stroke="#FFFFFF" strokeWidth="4" />
            <path d="M37 37 C 41 34, 51 34, 53 37" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" fill="none" />
        </g>
    </svg>
);