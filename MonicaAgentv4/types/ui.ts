
import React from 'react';

export interface BubbleSettings {
  alignment: 'left' | 'right';
  scale: number;
  textDirection: 'ltr' | 'rtl';
  fontSize: number; // Stored as a rem value, e.g., 1 for 1rem
}

export interface ContextMenuItem {
    label?: string;
    icon?: React.ReactNode;
    action?: () => void;
    isDestructive?: boolean;
    isSeparator?: boolean;
}

export type SoundEvent = 'open' | 'close' | 'success' | 'send' | 'receive' | 'error' | 'action' | 'connect' | 'disconnect';

export interface TranscriptionEntry {
    speaker: 'user' | 'model';
    text: string;
    isFinal: boolean;
}

export interface LiveHandlerState {
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
    transcriptionHistory: TranscriptionEntry[];
    startSession: () => void;
    closeSession: () => void;
}
