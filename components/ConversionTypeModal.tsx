'use client';

import React from 'react';
import { useAppContext } from '@/contexts/StateProvider';
import { FlipSwitch } from '@/components/FlipSwitch';
// FIX: Corrected import path to explicitly use the barrel file.
import { ConversionType } from '@/types/index';

export const ConversionTypeModal: React.FC = () => {
    const { isConversionTypeModalOpen, setIsConversionTypeModalOpen, conversionType, setConversionType } = useAppContext();

    const handleTypeChange = (newType: ConversionType) => {
        setConversionType(newType);
        setTimeout(() => {
            setIsConversionTypeModalOpen(false);
        }, 300); // Small delay to show the switch animation
    };
    
    if (!isConversionTypeModalOpen) return null;
    
    const options = [
        { id: 'Multi', label: 'Multi-Conversation' },
        { id: 'Continuous', label: 'Continuous-Conversation' },
    ];

    return (
        <div 
            className="fixed inset-0 flex justify-center items-center z-50 p-4 modal-overlay open conversion-type-modal" 
            onClick={() => setIsConversionTypeModalOpen(false)}
        >
            <div 
                className="conversion-type-modal-pane glass-pane rounded-xl shadow-2xl w-full max-w-md flex flex-col modal-content shadow-cyan-500/20" 
                onClick={e => e.stopPropagation()}
            >
                <div className="flex-1 flex items-center justify-center p-12">
                    <FlipSwitch
                        options={options}
                        selectedValue={conversionType}
                        onChange={(val) => handleTypeChange(val as ConversionType)}
                    />
                </div>
            </div>
        </div>
    );
};