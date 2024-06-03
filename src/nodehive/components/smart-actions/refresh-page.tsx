'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

export default function RefreshPage() {
  const pathname = usePathname();
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  async function refreshPage() {
    let success = false;
    let error = null;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/api/nodehive/revalidate?path=${pathname}`
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
    <button
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1"
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </button>
  );
}
