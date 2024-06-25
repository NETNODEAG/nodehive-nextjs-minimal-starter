'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { EditIcon } from '@/lib/icons';

export default function MenuEditButton({
  label,
  type = 'menu',
  menuId,
  lang = 'de',
}) {
  const pathname = usePathname();
  const [isInIframe, setIsInIframe] = useState(false);

  const editComponent = (e) => {
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

  useEffect(() => {
    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);
  }, []);

  if (!isInIframe) {
    return null;
  }

  return (
    <div className="absolute -right-10 -top-2 flex transform-gpu gap-2 antialiased opacity-75 transition-all duration-75 ease-in-out hover:scale-105 hover:opacity-100">
      <button
        onClick={editComponent}
        className="flex gap-2 rounded bg-primary-700 px-2 py-2 text-xs font-bold text-white shadow-lg transition-colors hover:bg-primary-900"
      >
        <span className="sr-only">{label}</span>

        <EditIcon />
      </button>
    </div>
  );
}
