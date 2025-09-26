'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/contexts/StateProvider';
import { EyeIcon, EyeOffIcon, LockOpenIcon, LockClosedIcon, CopyIcon, XCircleIcon, CheckIcon } from '@/components/Icons';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
}

export const SecureInput: React.FC<SecureInputProps> = ({ id, value, onChange, ...props }) => {
    const { isPermanentlyVisible, togglePermanentVisibility } = useAppContext();
    const [isTemporarilyVisible, setIsTemporarilyVisible] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    const isVisible = isPermanentlyVisible(id) || isTemporarilyVisible;
    const inputType = isVisible ? 'text' : 'password';

    const handleCopy = () => {
        if (value) {
            navigator.clipboard.writeText(String(value));
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        }
    };

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onChange) {
            // Simulate a change event with an empty value for the parent state update
            const syntheticEvent = {
                target: { value: '' } as HTMLInputElement,
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
        }
    };
    
    return (
        <div className="relative group">
            <input
                id={id}
                type={inputType}
                value={value || ''}
                onChange={onChange}
                className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white focus:ring-indigo-500 focus:border-indigo-500 pr-28"
                {...props}
            />
            <div className="absolute top-0 right-0 h-full flex items-center pr-2">
                <div className="flex items-center gap-1 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={handleCopy} className="p-1 rounded-full bg-black/20 text-gray-400 hover:text-white hover:bg-black/40" title="Copy">
                        {hasCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-1 rounded-full bg-black/20 text-gray-400 hover:text-red-400 hover:bg-black/40"
                        title="Clear"
                    >
                        <XCircleIcon className="w-4 h-4" />
                    </button>
                    <div className="w-px h-5 bg-white/20 mx-1"></div>
                    <button
                        type="button"
                        onMouseDown={() => setIsTemporarilyVisible(true)}
                        onMouseUp={() => setIsTemporarilyVisible(false)}
                        onMouseLeave={() => setIsTemporarilyVisible(false)}
                        onTouchStart={() => setIsTemporarilyVisible(true)}
                        onTouchEnd={() => setIsTemporarilyVisible(false)}
                        className="p-1 rounded-full bg-black/20 text-gray-400 hover:text-white hover:bg-black/40"
                        title={isTemporarilyVisible ? 'Hide' : 'Show (hold)'}
                    >
                        {isVisible ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                    <button
                        type="button"
                        onClick={() => togglePermanentVisibility(id)}
                        className="p-1 rounded-full bg-black/20 text-gray-400 hover:text-white hover:bg-black/40"
                        title={isPermanentlyVisible(id) ? 'Forget visibility preference' : 'Remember visibility preference'}
                    >
                        {isPermanentlyVisible(id) ? <LockOpenIcon className="w-4 h-4 text-cyan-400" /> : <LockClosedIcon className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
};
