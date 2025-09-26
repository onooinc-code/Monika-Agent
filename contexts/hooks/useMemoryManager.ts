// FIX: Removed useLocalStorage import as it is deprecated.
import { useState } from 'react';
import { LongTermMemoryData } from '@/types';

export const useMemoryManager = () => {
    // FIX: Replaced useLocalStorage with useState for in-memory state management.
    const [longTermMemory, setLongTermMemory] = useState<LongTermMemoryData>({});

    const clearMemory = () => {
        if (window.confirm('Are you sure you want to permanently delete the AI\'s long-term memory? This action cannot be undone.')) {
            setLongTermMemory({});
        }
    };

    return {
        longTermMemory,
        setLongTermMemory,
        clearMemory,
    };
};