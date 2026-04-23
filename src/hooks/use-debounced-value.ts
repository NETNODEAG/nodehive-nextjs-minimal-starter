'use client';

import { useEffect, useRef, useState } from 'react';

export function useDebouncedValue<T>(
  value: T,
  delay: number
): [T, (v: T) => void] {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => setDebouncedValue(value), delay);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, delay]);

  const setImmediately = (v: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setDebouncedValue(v);
  };

  return [debouncedValue, setImmediately];
}
