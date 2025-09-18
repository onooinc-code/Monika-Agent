import React from 'react';

export const TeamGenGlassIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="grad-glass-purple" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#9333ea" />
      </linearGradient>
      <filter id="shadow-glass-btn-team" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.4"/>
      </filter>
    </defs>
    <g filter="url(#shadow-glass-btn-team)">
      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#grad-glass-purple)" />
      <path d="M4 20C18 14 46 14 60 20L60 16C60 9.37 54.63 4 48 4L16 4C9.37 4 4 9.37 4 16L4 20Z" fill="white" fillOpacity="0.3" />
      <g transform="translate(16, 16) scale(0.5)">
        <path d="M48 50v-2c0-4.4-3.6-8-8-8H24c-4.4 0-8 3.6-8 8v2" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="32" cy="22" r="10" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M58 50v-2c0-3.3-2-6.2-5-7.5" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 50v-2c0-3.3 2-6.2 5-7.5" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="15" cy="24" r="6" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="49" cy="24" r="6" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </g>
  </svg>
);
