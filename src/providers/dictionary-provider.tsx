'use client';

import { createContext, useContext } from 'react';
import type { Dictionary } from '@/dictionaries';

const DictionaryContext = createContext<Dictionary | null>(null);

export function useDictionary() {
  const dictionary = useContext(DictionaryContext);

  if (!dictionary) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }

  return dictionary;
}

interface DictionaryProviderProps {
  dictionary: Dictionary;
  children: React.ReactNode;
}

export function DictionaryProvider({
  dictionary,
  children,
}: DictionaryProviderProps) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}
