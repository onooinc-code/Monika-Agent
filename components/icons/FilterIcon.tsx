import React from 'react';

export const FilterIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 0-2.3.4-3.2 1.1C6.7 5.9 5 8.3 5 11v1.8c0 .7-.3 1.4-.8 1.8L3.4 15.5c-.5.5-.7 1.1-.7 1.8V18c0 .8.7 1.5 1.5 1.5h15c.8 0 1.5-.7 1.5-1.5v-.7c0-.7-.2-1.3-.7-1.8l-1-1.1c-.5-.5-.8-1.1-.8-1.8V11c0-2.7-1.7-5.1-4.8-6.1C14.3 3.4 13.2 3 12 3z" />
    </svg>
);
