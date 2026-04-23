import React, { createContext, useContext, ReactNode } from 'react';
import { useLiveAPI, TalkContext as ContextType } from '../hooks/useLiveAudio';

interface TalkContextValue {
  connect: () => Promise<void>;
  disconnect: () => void;
  connected: boolean;
  speaking: boolean;
  transcript: { role: 'jo' | 'beatrice', text: string, time: string, image?: string }[];
  detectedLanguage: { input: string, output: string, confidence: string } | null;
  lastGeneratedImage: string | null;
}

const TalkContext = createContext<TalkContextValue | undefined>(undefined);

export function TalkProvider({ children }: { children: ReactNode }) {
  // We default to 'Work' but could potentially handle context switching here too
  const talkAPI = useLiveAPI('Work');

  return (
    <TalkContext.Provider value={talkAPI}>
      {children}
    </TalkContext.Provider>
  );
}

export function useTalk() {
  const context = useContext(TalkContext);
  if (context === undefined) {
    throw new Error('useTalk must be used within a TalkProvider');
  }
  return context;
}
