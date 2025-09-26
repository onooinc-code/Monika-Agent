
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/StateProvider';
import { safeRender } from '@/services/utils/safeRender';
// FIX: Corrected import path for types to point to the barrel file.
import { ContextMenuItem } from '@/types/index';

export const ContextMenu: React.FC = () => {
    const { contextMenuState, closeContextMenu } = useAppContext();
    const { isOpen, x, y, menuItems } = contextMenuState;
    const menuRef = useRef<HTMLDivElement>(null);
    const [adjustedPosition, setAdjustedPosition] = useState({ top: y, left: x });

    useEffect(() => {
        if (isOpen && menuRef.current) {
            const menuWidth = menuRef.current.offsetWidth;
            const menuHeight = menuRef.current.offsetHeight;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            let newX = x + 5; // Start with a small offset
            let newY = y + 5;

            if (newX + menuWidth > screenWidth) {
                newX = x - menuWidth - 5; // Open to the left
            }
            if (newY + menuHeight > screenHeight) {
                newY = screenHeight - menuHeight - 5; // Adjust to be fully on screen
            }
            
            setAdjustedPosition({ top: newY, left: newX });
        }
    }, [isOpen, x, y]);

    if (!isOpen) {
        return null;
    }

    const handleAction = (action?: () => void) => {
        if (action) {
            action();
        }
        closeContextMenu();
    };

    const getButtonClass = (item: ContextMenuItem): string => {
        const baseClass = "context-menu-btn";
        if (item.isDestructive) {
            return `${baseClass} context-menu-btn-destructive`;
        }
        if (item.label?.startsWith('Mode:')) {
            return `${baseClass} context-menu-btn-secondary`;
        }
        return `${baseClass} context-menu-btn-primary`;
    };

    const menuStyle: React.CSSProperties = {
        top: `${adjustedPosition.top}px`,
        left: `${adjustedPosition.left}px`,
    };

    return (
        <div 
            ref={menuRef}
            className="fixed z-50 glass-pane rounded-lg shadow-2xl shadow-indigo-500/30 w-56 animate-fade-in-up"
            style={menuStyle}
            onClick={e => e.stopPropagation()}
        >
            <div className="p-2 space-y-1">
                {menuItems.map((item, index) => (
                    item.isSeparator 
                    ? <div key={`sep-${index}`} className="h-px bg-white/10 my-1" />
                    : (
                        <button 
                            key={item.label || index} 
                            onClick={() => handleAction(item.action)} 
                            className={getButtonClass(item)}
                        >
                           {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                           <span>{safeRender(item.label)}</span>
                        </button>
                    )
                ))}
            </div>
        </div>
    );
};
