import React, { useState, useId } from 'react';

interface PowerSwitchProps {
    initialChecked?: boolean;
    onChange?: (checked: boolean) => void;
    color: string; // e.g., 'rgb(151, 243, 255)' or '#97f3ff'
    title: string;
}

export const PowerSwitch: React.FC<PowerSwitchProps> = ({ initialChecked = false, onChange, color, title }) => {
    const [isChecked, setIsChecked] = useState(initialChecked);
    const id = useId();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newChecked = e.target.checked;
        setIsChecked(newChecked);
        if (onChange) {
            onChange(newChecked);
        }
    };
    
    // Scaled down dimensions
    const switchSize = '32px';
    const svgSize = '0.9em';
    const uniqueClass = `switch-${id.replace(/:/g, "")}`;
    
    return (
        <div title={title} style={{ '--glow-color': color } as React.CSSProperties}>
            <style>{`
                .${uniqueClass}-checkbox { display: none; }
                
                .${uniqueClass}-switch {
                  position: relative;
                  width: ${switchSize};
                  height: ${switchSize};
                  background-color: rgb(99, 99, 99);
                  border-radius: 50%;
                  z-index: 1;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: 2px solid rgb(126, 126, 126);
                  box-shadow: 0px 0px 2px rgb(2, 2, 2) inset;
                  transition: all 0.3s ease;
                }
                .${uniqueClass}-switch svg {
                  width: ${svgSize};
                  transition: all 0.3s ease;
                }
                .${uniqueClass}-switch svg path {
                  fill: rgb(48, 48, 48);
                  transition: fill 0.3s ease;
                }
                .${uniqueClass}-checkbox:checked + .${uniqueClass}-switch {
                  box-shadow: 0px 0px 1px var(--glow-color) inset,
                    0px 0px 2px var(--glow-color) inset, 0px 0px 5px var(--glow-color) inset,
                    0px 0px 10px var(--glow-color), 0px 0px 25px var(--glow-color),
                    0px 0px 5px var(--glow-color);
                  border: 2px solid rgb(255, 255, 255);
                  background-color: color-mix(in srgb, var(--glow-color) 40%, #555);
                }
                .${uniqueClass}-checkbox:checked + .${uniqueClass}-switch svg {
                  filter: drop-shadow(0px 0px 3px var(--glow-color));
                }
                .${uniqueClass}-checkbox:checked + .${uniqueClass}-switch svg path {
                  fill: rgb(255, 255, 255);
                }
            `}</style>
            <input id={id} className={`${uniqueClass}-checkbox`} type="checkbox" checked={isChecked} onChange={handleChange} />
            <label className={`switch ${uniqueClass}-switch`} htmlFor={id}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="slider">
                <path
                  d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"
                ></path>
              </svg>
            </label>
        </div>
    );
};