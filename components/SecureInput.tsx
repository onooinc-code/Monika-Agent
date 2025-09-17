import React, { useState } from 'react';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { EyeIcon, EyeOffIcon, LockOpenIcon, LockClosedIcon, CopyIcon, XCircleIcon, CheckIcon } from './Icons.tsx';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
}

export const SecureInput: React.FC<SecureInputProps> = ({ id, value, onChange, ...props }) => {
    const { isPermanentlyVisible, togglePermanentVisibility } = useAppContext();
    const [isTemporarilyVisible, setIsTemporarilyVisible] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    const isVisible = isPermanentlyVisible(id) || isTemporarilyVisible;

    const handleCopy = () => {
        if (value) {
            navigator.clipboard.writeText(String(value));
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        }
    };

    const handleClear = () => {
        if (onChange) {
            // Simulate the event object for the parent's handler
            const event = {
                target: { value: '' },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(event);
        }
    };

    return (
        <div className="relative group">
            <input
                id={id}
                type={isVisible ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                className="w-full bg-black/20 border border-white/10 rounded-md p-2 pr-32 text-white focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                {...props}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 opacity-50 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={() => setIsTemporarilyVisible(!isTemporarilyVisible)} className="p-1 rounded-full text-gray-400 hover:text-white" title={isTemporarilyVisible ? "Hide temporarily" : "Show temporarily"}>
                    {isTemporarilyVisible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
                <button type="button" onClick={() => togglePermanentVisibility(id)} className="p-1 rounded-full text-gray-400 hover:text-white" title={isPermanentlyVisible(id) ? "Don't remember visibility" : "Remember visibility"}>
                    {isPermanentlyVisible(id) ? <LockOpenIcon /> : <LockClosedIcon />}
                </button>
                <button type="button" onClick={handleCopy} className="p-1 rounded-full text-gray-400 hover:text-white" title="Copy">
                    {hasCopied ? <CheckIcon className="text-green-400" /> : <CopyIcon />}
                </button>
                <button type="button" onClick={handleClear} className="p-1 rounded-full text-gray-400 hover:text-red-400" title="Clear">
                    <XCircleIcon />
                </button>
            </div>
        </div>
    );
};
