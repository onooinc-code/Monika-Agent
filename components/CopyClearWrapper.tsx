import React, { useState } from 'react';
import { CopyIcon, XCircleIcon, CheckIcon } from '@/components/Icons';

interface CopyClearWrapperProps {
    value: string;
    onClear: () => void;
    children: React.ReactNode;
}

export const CopyClearWrapper: React.FC<CopyClearWrapperProps> = ({ value, onClear, children }) => {
    const [hasCopied, setHasCopied] = useState(false);
    
    const handleCopy = () => {
        if (value) {
            navigator.clipboard.writeText(value);
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        }
    };
    
    return (
        <div className="relative group">
            {children}
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={handleCopy} className="p-1 rounded-full bg-black/20 text-gray-400 hover:text-white hover:bg-black/40" title="Copy">
                     {hasCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                </button>
                <button type="button" onClick={onClear} className="p-1 rounded-full bg-black/20 text-gray-400 hover:text-red-400 hover:bg-black/40" title="Clear">
                    <XCircleIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
