import { useMemo } from 'react';
// FIX: Corrected the import path for types to point to the barrel file.
import { SoundEvent } from '@/types/index';
import { SOUNDS } from '@/assets/sounds';

interface SoundManagerProps {
    isSoundEnabled: boolean;
}

export const useSoundManager = ({ isSoundEnabled }: SoundManagerProps) => {
    const audio = useMemo(() => {
        if (typeof window !== 'undefined') {
            const el = new Audio();
            el.preload = 'auto';
            return el;
        }
        return null;
    }, []);

    const playSound = (event: SoundEvent) => {
        if (isSoundEnabled && audio && SOUNDS[event]) {
            try {
                audio.src = SOUNDS[event];
                audio.play().catch(e => console.warn("Audio playback failed:", e));
            } catch (error) {
                console.error("Failed to play sound:", error);
            }
        }
    };
    
    return { playSound };
};