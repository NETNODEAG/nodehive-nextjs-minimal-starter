'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Locale } from '@/nodehive/i18n-config';
import { RefreshCcw } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function RefreshPage({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const [refreshSuccess, setRefreshSuccess] = useState(false);

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
    } catch (error) {
      console.error(error);
      error = error?.message;
    }

    return { success, error };
  }

  return (
    <div
      onClick={async () => {
        setRefreshSuccess(false);
        const { success, error } = await refreshPage();

        if (success) {
          setRefreshSuccess(true);
        }
      }}
      className={cn(
        'flex h-[32px] w-[32px] items-center justify-center rounded-full text-white transition-colors hover:bg-neutral-700',
        'cursor-pointer'
      )}
    >
      <span className="sr-only">Refresh Page</span>
      <RefreshCcw className="h-5 w-5" />
    </div>
  );
}
