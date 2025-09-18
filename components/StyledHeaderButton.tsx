import React from 'react';

interface StyledHeaderButtonProps {
    onClick: () => void;
    title: string;
    'aria-label': string;
    label: string;
    iconUrl: string;
}

export const StyledHeaderButton: React.FC<StyledHeaderButtonProps> = ({ onClick, title, 'aria-label': ariaLabel, label, iconUrl }) => {
    return (
        <button className="header-action-button" onClick={onClick} title={title} aria-label={ariaLabel}>
            <div className="inner">
                <img src={iconUrl} alt="" className="icon" />
                <span>{label}</span>
            </div>
        </button>
    );
};
