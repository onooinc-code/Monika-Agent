
import React from 'react';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { safeRender } from '../services/utils/safeRender.ts';

export const ContextMenu: React.FC = () => {
    const { contextMenuState, closeContextMenu } = useAppContext();
    const { isOpen, x, y, menuItems } = contextMenuState;

    if (!isOpen) {
        return null;
    }

    const handleAction = (action: () => void) => {
        action();
        closeContextMenu();
    };

    const menuStyle: React.CSSProperties = {
        top: y,
        left: x,
        transform: 'translate(5px, 5px)', // Offset slightly from cursor
    };

    return (
        <div 
            className="fixed z-50 glass-pane rounded-lg shadow-2xl shadow-indigo-500/30 w-56 animate-fade-in-up"
            style={menuStyle}
            onClick={e => e.stopPropagation()} // Prevent clicks inside the menu from closing it
        >
            <div className="p-2">
                {menuItems.map((item, index) => {
                    if (item.isSeparator) {
                        return <hr key={`sep-${index}`} className="my-2 border-white/10" />;
                    }
                    return (
                        <button
                            key={item.label || index}
                            onClick={() => item.action && handleAction(item.action)}
                            className={`w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                item.isDestructive 
                                ? 'text-red-400 hover:bg-red-500/20 hover:text-red-300' 
                                : 'text-gray-200 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {item.icon}
                            <span>{safeRender(item.label)}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
