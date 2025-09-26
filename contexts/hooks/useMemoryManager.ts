// FIX: Restored useLocalStorage to ensure data persistence.
import { useLocalStorage } from './useLocalStorage';
// FIX: Corrected import path for types to point to the barrel file.
import { LongTermMemoryData } from '@/types/index';

export const useMemoryManager = () => {
    // FIX: Replaced useState with useLocalStorage to fix data loss on refresh.
    const [longTermMemory, setLongTermMemory] = useLocalStorage<LongTermMemoryData>('longTermMemory', {});

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