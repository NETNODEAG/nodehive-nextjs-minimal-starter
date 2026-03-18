'use client';

import { useEffect, useState } from 'react';
import { usePuckEditor } from '@/providers/puck-editor-provider';
import { SquareDashedMousePointerIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function OpenPuckEditor() {
  const [isInIframe, setIsInIframe] = useState(false);
  const { openEditor, setIsHighlighted } = usePuckEditor();

  useEffect(() => {
    setIsInIframe(typeof window !== 'undefined' && window.self !== window.top);
  }, []);

  if (isInIframe) {
    return null;
  }

  return (
    <div
      onClick={openEditor}
      onMouseEnter={() => setIsHighlighted(true)}
      onMouseLeave={() => setIsHighlighted(false)}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-neutral-700',
        'cursor-pointer'
      )}
    >
      <span className="sr-only">Edit</span>
      <SquareDashedMousePointerIcon className="h-5 w-5" />
    </div>
  );
}
