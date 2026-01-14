'use client';

import { usePathname } from 'next/navigation';

import { getLocaleFromPathname } from '@/lib/utils';

export default function useLocale() {
  const pathname = usePathname();
  return getLocaleFromPathname(pathname);
}
