import React from 'react';

export const ApiUsageGlassIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="grad-glass-cyan" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#67e8f9" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <filter id="shadow-glass-btn-api" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.4"/>
      </filter>
    </defs>
    <g filter="url(#shadow-glass-btn-api)">
      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#grad-glass-cyan)" />
      <path d="M4 20C18 14 46 14 60 20L60 16C60 9.37 54.63 4 48 4L16 4C9.37 4 4 9.37 4 16L4 20Z" fill="white" fillOpacity="0.3" />
      <g transform="translate(16, 16) scale(0.5)">
        <path d="M44 24c4.4 0 8 3.6 8 8s-3.6 8-8 8H20c-5.9 0-10.7-4.8-10.7-10.7 0-5.5 4.1-10.1 9.5-10.6C20.1 14 25.6 8 32 8c6.6 0 12 5.4 12 12 0 .8-.1 1.6-.3 2.4" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </g>
  </svg>
);
