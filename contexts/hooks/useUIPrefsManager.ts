// FIX: Removed useLocalStorage import as it is deprecated.
import { useState } from 'react';

// The state will be an object where keys are the input IDs and values are booleans.
// e.g., { 'global-api-key': true, 'agent-1-api-key': false }
type SecureInputVisibilityState = Record<string, boolean>;

export const useUIPrefsManager = () => {
    // FIX: Replaced useLocalStorage with useState for in-memory state management.
    const [secureInputVisibility, setSecureInputVisibility] = useState<SecureInputVisibilityState>({});

    const isPermanentlyVisible = (id: string): boolean => {
        return secureInputVisibility[id] ?? false;
    };

    const togglePermanentVisibility = (id: string) => {
        setSecureInputVisibility(prev => ({
            ...prev,
            [id]: !isPermanentlyVisible(id),
        }));
    };

    return {
        isPermanentlyVisible,
        togglePermanentVisibility,
    };
};
