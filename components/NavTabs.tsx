'use client';

import React from 'react';

interface NavTabsProps {
    modes: { id: string, label: string }[];
    selectedValue: string;
    onChange: (value: string) => void;
    variant?: 'primary' | 'secondary';
}

export const NavTabs: React.FC<NavTabsProps> = ({ modes, selectedValue, onChange, variant = 'primary' }) => {

    const handleModeChange = (modeId: string) => {
        onChange(modeId);
    };

    const selectedIndex = modes.findIndex(m => m.id === selectedValue);

    const gradients = {
        primary: {
            background: 'linear-gradient(to right, var(--color-neon-indigo), var(--color-neon-cyan))',
            boxShadow: '0 0 10px rgba(129, 140, 248, 0.5), 0 0 15px rgba(34, 211, 238, 0.5)',
        },
        secondary: {
            background: 'linear-gradient(to right, #8f51ea, #fe53bb)',
            boxShadow: '0 0 10px rgba(143, 81, 234, 0.5), 0 0 15px rgba(254, 83, 186, 0.5)',
        }
    };

    const selectedGradient = gradients[variant];

    const sliderStyle = {
        transform: `translateX(calc(${selectedIndex} * (100px + 4px)))`,
        background: selectedGradient.background,
        boxShadow: selectedGradient.boxShadow,
    };

    return (
        <div className="nav-tabs-container h-full flex items-center justify-center">
             <style>{`
                .nav-tabs-container .tabs-container {
                  display: flex;
                  align-items: center;
                  background: linear-gradient(45deg, #1a1a1a, #262626);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.2);
                  padding: 4px;
                  border-radius: 20px;
                  height: 40px;
                }

                .nav-tabs-container .tabs-group {
                  display: grid;
                  grid-auto-flow: column;
                  position: relative;
                  gap: 4px;
                }

                .nav-tabs-container .tab-input {
                  display: none;
                }

                .nav-tabs-container .tab-label {
                  width: 100px;
                  padding: 8px 0;
                  font-size: 14px;
                  font-weight: 600;
                  color: rgba(255, 255, 255, 0.6);
                  text-align: center;
                  cursor: pointer;
                  transition: color 0.3s ease;
                  position: relative;
                  z-index: 2;
                }

                .nav-tabs-container .tab-input:checked + .tab-label {
                  color: #ffffff;
                }
                
                .nav-tabs-container .tab-label:hover {
                  color: #ffffff;
                }
                
                .nav-tabs-container .tab-slider {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100px;
                  height: 100%;
                  border-radius: 16px;
                  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                  z-index: 1;
                }
             `}</style>
             <div className="tabs-container">
                <div className="tabs-group">
                    {modes.map(mode => (
                        <React.Fragment key={mode.id}>
                            <input
                                type="radio"
                                id={`radio-nav-${mode.id}-${variant}`}
                                name={`nav-tabs-${variant}`}
                                className="tab-input"
                                checked={selectedValue === mode.id}
                                onChange={() => handleModeChange(mode.id)}
                            />
                            <label className="tab-label" htmlFor={`radio-nav-${mode.id}-${variant}`}>
                                {mode.label}
                            </label>
                        </React.Fragment>
                    ))}
                    <div className="tab-slider" style={sliderStyle}></div>
                </div>
            </div>
        </div>
    );
};