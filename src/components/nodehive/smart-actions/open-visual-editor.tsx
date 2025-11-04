'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Edit, Eye } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function OpenVisualEditor() {
  const pathname = usePathname();
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    setIsInIframe(typeof window !== 'undefined' && window.self !== window.top);
  }, []);

  const openBackend = () => {
    const frontendUrl = `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}${pathname}`;
    const url = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/space/${process.env.NEXT_PUBLIC_DRUPAL_NODEHIVE_SPACE_ID}/visualeditor?url=${frontendUrl}`;

    window.open(url, '_parent');
  };

  const openFrontend = () => {
    const frontendUrl = `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}${pathname}`;
    window.open(frontendUrl, '_parent');
  };

  return (
    <>
      {isInIframe ? (
        <div
          onClick={openFrontend}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-neutral-700',
            'cursor-pointer'
          )}
        >
          <span className="sr-only">Frontend</span>
          <Eye className="h-5 w-5" />
        </div>
      ) : (
        <div
          onClick={openBackend}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-neutral-700',
            'cursor-pointer'
          )}
        >
          <span className="sr-only">Visual Editor</span>
          <Edit className="h-5 w-5" />
        </div>
      )}
    </>
  );
}
