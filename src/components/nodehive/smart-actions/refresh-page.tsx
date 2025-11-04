'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { RefreshCcw } from 'lucide-react';

import { Locale } from '@/config/i18n-config';
import { cn } from '@/lib/utils';

export default function RefreshPage({ lang }: { lang: Locale }) {
  const pathname = usePathname();

  async function refreshPage() {
    let success = false;
    let error = null;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/${lang}/api/nodehive/revalidate?path=${pathname}`
      );

      if (!response.ok) {
        error = 'Error revalidating the page';
      } else {
        success = true;
        location.reload();
      }
    } catch (err) {
      console.error(err);
      error = err instanceof Error ? err.message : 'Unknown error occurred';
    }

    return { success, error };
  }

  return (
    <div
      onClick={async () => await refreshPage()}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-neutral-700',
        'cursor-pointer'
      )}
    >
      <span className="sr-only">Refresh Page</span>
      <RefreshCcw className="h-5 w-5" />
    </div>
  );
}
