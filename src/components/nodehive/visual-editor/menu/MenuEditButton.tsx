'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { EditIcon } from '@/lib/icons';

type MenuEditButtonProps = {
  label: string;
  type?: string;
  menuId: string;
  lang?: string;
};

export default function MenuEditButton({
  label,
  type = 'menu',
  menuId,
  lang = 'de',
}: MenuEditButtonProps) {
  const pathname = usePathname();
  const isInIframe =
    typeof window !== 'undefined' && window.self !== window.top;

  const editComponent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    window.parent.postMessage(
      {
        type: type,
        menu_id: menuId,
        lang: lang,
        pathname: pathname,
      },
      '*'
    );
  };

  if (!isInIframe) {
    return null;
  }

  return (
    <div className="absolute -top-2 -right-10 flex transform-gpu gap-2 antialiased opacity-75 transition-all duration-75 ease-in-out hover:scale-105 hover:opacity-100">
      <button
        onClick={editComponent}
        className="bg-primary-700 hover:bg-primary-900 flex gap-2 rounded-sm px-2 py-2 text-xs font-bold text-white shadow-lg transition-colors"
      >
        <span className="sr-only">{label}</span>

        <EditIcon />
      </button>
    </div>
  );
}
