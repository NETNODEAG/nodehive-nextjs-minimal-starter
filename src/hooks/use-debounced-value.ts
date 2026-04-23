'use client';

import { useEffect, useRef, useState } from 'react';

export function useDebouncedValue<T>(
  value: T,
  delay: number
): [T, (v: T) => void] {
  const [debouncedValue, setInternal] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => setInternal(value), delay);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, delay]);

  const setDebouncedValue = (v: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setInternal(v);
  };

  return [debouncedValue, setDebouncedValue];
}
