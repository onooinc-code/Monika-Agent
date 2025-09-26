'use client';

import React, { useId } from 'react';

interface FlipSwitchProps {
    options: { id: string; label: string }[];
    selectedValue: string;
    onChange: (value: string) => void;
}

export const FlipSwitch: React.FC<FlipSwitchProps> = ({ options, selectedValue, onChange }) => {
    if (options.length !== 2) {
        console.error("FlipSwitch component requires exactly 2 options.");
        return null;
    }
    
    const uniqueId = useId();

    return (
        <div className="flip-switch-container">
          <div className="flip-switch">
            {options.map((opt, index) => (
                <input 
                    key={`opt-input-${index}`} 
                    type="radio" 
                    id={`switch-opt-${index + 1}-${uniqueId}`} 
                    name={`flip-switch-${uniqueId}`} 
                    value={opt.id}
                    checked={selectedValue === opt.id}
                    onChange={() => onChange(opt.id)}
                />
            ))}
            
            {options.map((opt, index) => (
                <label key={`opt-label-${index}`} htmlFor={`switch-opt-${index + 1}-${uniqueId}`} className="switch-button">
                    <span>{opt.label}</span>
                </label>
            ))}

            <div className="switch-card">
              <div className="card-face card-front"></div>
              <div className="card-face card-back"></div>
            </div>
          </div>
        </div>
    );
};