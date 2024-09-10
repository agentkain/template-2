"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const DeepgramContext = createContext<string | null>(null);

export const DeepgramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
    if (key) {
      setApiKey(key);
    } else {
      console.error('Deepgram API key is not set in the environment variables');
    }
  }, []);

  return (
    <DeepgramContext.Provider value={apiKey}>
      {children}
    </DeepgramContext.Provider>
  );
};

export const useDeepgram = () => useContext(DeepgramContext);
