'use client';

import React, { createContext, useContext } from 'react';

// The full AppState will be built out in subsequent steps.
// This is just the initial structure.
interface AppState {
    // Placeholder state
    placeholder: string;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    // All the custom hooks (useConversationManager, useChatHandler, etc.) will be added here.

    const value: AppState = {
        placeholder: "Hello from AppProvider",
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
