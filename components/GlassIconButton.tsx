import React from 'react';

interface GlassIconButtonProps {
    onClick: () => void;
    title: string;
    ariaLabel: string;
    gradient: 'indigo' | 'cyan' | 'purple';
    iconUrl?: string;
}

const FALLBACK_ICONS = {
    purple: (
        <g transform="translate(16, 16) scale(0.5)">
            <path d="M48 50v-2c0-4.4-3.6-8-8-8H24c-4.4 0-8 3.6-8 8v2" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="32" cy="22" r="10" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M58 50v-2c0-3.3-2-6.2-5-7.5" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 50v-2c0-3.3 2-6.2 5-7.5" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="15" cy="24" r="6" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="49" cy="24" r="6" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
    ),
    cyan: (
         <g transform="translate(16, 16) scale(0.5)">
            <path d="M44 24c4.4 0 8 3.6 8 8s-3.6 8-8 8H20c-5.9 0-10.7-4.8-10.7-10.7 0-5.5 4.1-10.1 9.5-10.6C20.1 14 25.6 8 32 8c6.6 0 12 5.4 12 12 0 .8-.1 1.6-.3 2.4" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
    ),
    indigo: (
        <g transform="translate(16, 16) scale(0.5)">
            <path d="M51.4 39.5L46.8 37c-.8-.5-1.2-1.4-.9-2.3l1.5-8.1c.3-1 .9-1.6 1.9-1.5l8 .5c1.6.1 2.6 1.7 1.9 3.1l-4 6.9c-.4.8-1.2 1.3-2.1 1.2zM32 8c1.7 0 3 1.3 3 3v8c0 1.7-1.3 3-3 3s-3-1.3-3-3v-8c0-1.7 1.3-3 3-3zM12.6 39.5l4.6-2.5c.8-.5 1.2-1.4.9-2.3l-1.5-8.1c-.3-1-.9-1.6-1.9-1.5l-8 .5c-1.6.1-2.6 1.7-1.9 3.1l4 6.9c.4.8 1.2 1.3 2.1 1.2zM56 32c0 13.3-10.7 24-24 24S8 45.3 8 32 18.7 8 32 8s24 10.7 24 24z" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="32" cy="32" r="10" stroke="white" strokeWidth="6"/>
        </g>
    ),
};


export const GlassIconButton: React.FC<GlassIconButtonProps> = ({ onClick, title, ariaLabel, gradient, iconUrl }) => {
    
    const gradients = {
        indigo: { id: 'grad-glass-indigo-btn', stop1: '#818cf8', stop2: '#4f46e5' },
        cyan: { id: 'grad-glass-cyan-btn', stop1: '#67e8f9', stop2: '#06b6d4' },
        purple: { id: 'grad-glass-purple-btn', stop1: '#c084fc', stop2: '#9333ea' },
    };

    const selectedGradient = gradients[gradient];

    return (
        <button
            onClick={onClick}
            title={title}
            aria-label={ariaLabel}
            className="relative w-10 h-10 transition-transform transform hover:scale-110 focus:outline-none"
        >
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
                <defs>
                    <linearGradient id={selectedGradient.id} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={selectedGradient.stop1} />
                        <stop offset="100%" stopColor={selectedGradient.stop2} />
                    </linearGradient>
                    <filter id={`shadow-glass-btn-${gradient}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.4" />
                    </filter>
                </defs>
                <g filter={`url(#shadow-glass-btn-${gradient})`}>
                    <rect x="4" y="4" width="56" height="56" rx="16" fill={`url(#${selectedGradient.id})`} />
                    <path d="M4 20C18 14 46 14 60 20L60 16C60 9.37 54.63 4 48 4L16 4C9.37 4 4 9.37 4 16L4 20Z" fill="white" fillOpacity="0.3" />
                </g>
            </svg>
            {iconUrl ? (
                <img src={iconUrl} alt={title} className="absolute inset-0 w-full h-full object-contain p-2" />
            ) : (
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
                    <g filter={`url(#shadow-glass-btn-${gradient})`}>
                        {FALLBACK_ICONS[gradient]}
                    </g>
                </svg>
            )}
        </button>
    );
};