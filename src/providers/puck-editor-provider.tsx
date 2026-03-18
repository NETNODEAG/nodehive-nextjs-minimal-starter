'use client';

import { createContext, useContext, useRef, useState } from 'react';

type PuckEditorContextType = {
  openEditor: () => void;
  registerEditor: (openFn: () => void) => void;
  isHighlighted: boolean;
  setIsHighlighted: (value: boolean) => void;
};

const PuckEditorContext = createContext<PuckEditorContextType>({
  openEditor: () => {},
  registerEditor: () => {},
  isHighlighted: false,
  setIsHighlighted: () => {},
});

export function PuckEditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const openFnRef = useRef<(() => void) | null>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const registerEditor = (openFn: () => void) => {
    openFnRef.current = openFn;
  };

  const openEditor = () => {
    openFnRef.current?.();
  };

  return (
    <PuckEditorContext.Provider
      value={{ openEditor, registerEditor, isHighlighted, setIsHighlighted }}
    >
      {children}
    </PuckEditorContext.Provider>
  );
}

export function usePuckEditor() {
  return useContext(PuckEditorContext);
}
