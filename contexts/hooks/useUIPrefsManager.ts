
import { useCallback } from 'react';
// FIX: Restored useLocalStorage to ensure data persistence.
import { useLocalStorage } from './useLocalStorage';

// The state will be an object where keys are the input IDs and values are booleans.
// e.g., { 'global-api-key': true, 'agent-1-api-key': false }
type SecureInputVisibilityState = Record<string, boolean>;

export const useUIPrefsManager = () => {
    // FIX: Replaced useState with useLocalStorage to fix data loss on refresh.
    const [secureInputVisibility, setSecureInputVisibility] = useLocalStorage<SecureInputVisibilityState>('secureInputVisibility', {});

    const isPermanentlyVisible = useCallback((id: string): boolean => {
        return secureInputVisibility[id] ?? false;
    }, [secureInputVisibility]);

    const togglePermanentVisibility = useCallback((id: string) => {
        setSecureInputVisibility(prev => ({
            ...prev,
            [id]: !(prev[id] ?? false),
        }));
    }, [setSecureInputVisibility]);

    return {
        isPermanentlyVisible,
        togglePermanentVisibility,
    };
};
