'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function SessionExpiredToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('session') !== 'expired') return;

    toast.error('Your session has expired. Please log in again.');

    const params = new URLSearchParams(searchParams.toString());
    params.delete('session');
    const nextUrl =
      params.size > 0 ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [searchParams, pathname, router]);

  return null;
}
