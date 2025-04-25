'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { EditIcon } from '@/lib/icons';

export default function VisualParagraphEditButton({
  label,
  type,
  uuid,
  id,
  parentId,
  langcode,
}) {
  const pathname = usePathname();
  const [isInIframe, setIsInIframe] = useState(false);

  const editComponent = (e) => {
    e.preventDefault();

    window.parent.postMessage(
      {
        type: type,
        uuid: uuid,
        id: id,
        parent_id: parentId,
        pathname: pathname,
        langcode: langcode,
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
    <div className="absolute top-0 right-0 m-2 flex transform-gpu gap-2 antialiased opacity-75 transition-all duration-75 ease-in-out hover:scale-105 hover:opacity-100">
      <button
        onClick={editComponent}
        className="bg-primary-700 hover:bg-primary-900 flex gap-2 rounded-sm px-3 py-2 text-xs font-bold text-white shadow-lg transition-colors"
      >
        <span>{label}</span>

        <EditIcon />
      </button>
    </div>
  );
}
