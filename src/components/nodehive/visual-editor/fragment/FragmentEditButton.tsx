'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { EditIcon } from '@/lib/icons';

type FragmentEditButtonProps = {
  label: string;
  type: string;
  uuid: string;
  id: string;
};

export default function FragmentEditButton({
  label,
  type,
  uuid,
  id,
}: FragmentEditButtonProps) {
  const pathname = usePathname();
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    setIsInIframe(typeof window !== 'undefined' && window.self !== window.top);
  }, []);

  const editComponent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // TODO: Add language information. To edit the content in the correct language.
    window.parent.postMessage(
      {
        type: type,
        uuid: uuid,
        id: id,
        pathname: pathname,
      },
      '*'
    );
  };

  if (!isInIframe) {
    return null;
  }

  return (
    <div className="absolute -top-2 -right-2 flex transform-gpu gap-2 antialiased opacity-75 transition-all duration-75 ease-in-out hover:scale-105 hover:opacity-100">
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
