
import { useState, useRef, useCallback, useEffect } from 'react';
// FIX: Removed `LiveSession` from import as it is not an exported member of `@google/genai`.
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { useLocalStorage } from './useLocalStorage';
import { AgentManager, LiveHandlerState, SoundEvent, TranscriptionEntry } from '@/types/index';

// FIX: Added a local interface for `LiveSession` to provide type safety for the session object,
// as the original type is not exported from the library.
interface LiveSession {
  close(): void;
  sendRealtimeInput(input: { media: Blob }): void;
}

// Helper functions from Gemini Live API documentation for audio processing
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}


export const useLiveHandler = (agentManager: AgentManager, globalApiKey: string, playSound: (event: SoundEvent) => void): LiveHandlerState => {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionEntry[]>([]);
    
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const nextStartTimeRef = useRef(0);
    const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
    
    const currentInputTranscriptionRef = useRef('');
    const currentOutputTranscriptionRef = useRef('');

    const startSession = useCallback(async () => {
        if (isConnecting || isConnected) return;
        
        setIsConnecting(true);
        setError(null);
        setTranscriptionHistory([]);
        playSound('action');

        try {
            const apiKey = agentManager.apiKey || globalApiKey;
            if (!apiKey) throw new Error("API Key is not configured for the Agent Manager.");

            const ai = new GoogleGenAI({ apiKey });
            
            // Initialize AudioContexts
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        console.log('Live session opened.');
                        setIsConnecting(false);
                        setIsConnected(true);
                        playSound('connect');

                        if (!inputAudioContextRef.current || !mediaStreamRef.current) return;

                        const source = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
                        mediaStreamSourceRef.current = source;
                        
                        const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            if (sessionPromiseRef.current) {
                                sessionPromiseRef.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle audio output
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current);
                            const source = outputAudioContextRef.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContextRef.current.destination);
                            source.addEventListener('ended', () => sourcesRef.current.delete(source));
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }

                        // Handle transcription
                        if (message.serverContent?.inputTranscription) {
                            const text = message.serverContent.inputTranscription.text;
                            currentInputTranscriptionRef.current += text;
                            setTranscriptionHistory(prev => {
                                const last = prev[prev.length - 1];
                                if (last && last.speaker === 'user' && !last.isFinal) {
                                    const updatedLast = { ...last, text: currentInputTranscriptionRef.current };
                                    return [...prev.slice(0, -1), updatedLast];
                                }
                                return [...prev, { speaker: 'user', text: currentInputTranscriptionRef.current, isFinal: false }];
                            });
                        }
                        if (message.serverContent?.outputTranscription) {
                            const text = message.serverContent.outputTranscription.text;
                            currentOutputTranscriptionRef.current += text;
                             setTranscriptionHistory(prev => {
                                const last = prev[prev.length - 1];
                                if (last && last.speaker === 'model' && !last.isFinal) {
                                    const updatedLast = { ...last, text: currentOutputTranscriptionRef.current };
                                    return [...prev.slice(0, -1), updatedLast];
                                }
                                return [...prev, { speaker: 'model', text: currentOutputTranscriptionRef.current, isFinal: false }];
                            });
                        }
                        if (message.serverContent?.turnComplete) {
                            setTranscriptionHistory(prev => prev.map(entry => ({...entry, isFinal: true})));
                            currentInputTranscriptionRef.current = '';
                            currentOutputTranscriptionRef.current = '';
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setError('A connection error occurred.');
                        closeSession();
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Live session closed.');
                        closeSession();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: agentManager.systemInstruction,
                },
            });
        } catch (err) {
            console.error('Failed to start live session:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setIsConnecting(false);
            setIsConnected(false);
            playSound('error');
        }
    }, [isConnecting, isConnected, agentManager, globalApiKey, playSound]);
    
    const closeSession = useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        
        mediaStreamSourceRef.current?.disconnect();
        mediaStreamSourceRef.current = null;

        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;

        sourcesRef.current.forEach(source => source.stop());
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;

        inputAudioContextRef.current?.close();
        outputAudioContextRef.current?.close();
        inputAudioContextRef.current = null;
        outputAudioContextRef.current = null;
        
        if (isConnected) {
            playSound('disconnect');
        }
        setIsConnected(false);
        setIsConnecting(false);
    }, [isConnected, playSound]);

    useEffect(() => {
        return () => {
            closeSession();
        };
    }, [closeSession]);


    return { isConnected, isConnecting, error, transcriptionHistory, startSession, closeSession };
};
