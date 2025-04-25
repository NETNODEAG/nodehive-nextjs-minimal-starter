'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export default function Tooltip({ label, children }) {
  const ref = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  useEffect(() => {
    const node = ref.current;

    if (node?.nodeType === Node.ELEMENT_NODE) {
      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (node?.nodeType === Node.ELEMENT_NODE) {
        node.removeEventListener('mouseenter', handleMouseEnter);
        node.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [handleMouseEnter, handleMouseLeave]);

  return (
    <div ref={ref} className="relative">
      {isHovering && (
        <div className="tooltip absolute -top-12 left-1/2 -translate-x-1/2 transform rounded-lg bg-black p-2 text-xs text-white">
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform bg-black"></div>
          <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
            {label}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
