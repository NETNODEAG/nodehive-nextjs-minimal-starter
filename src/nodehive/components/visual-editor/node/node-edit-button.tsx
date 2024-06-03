'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { EditIcon } from '@/lib/icons';

export default function NodeEditButton({ node }) {
  const pathname = usePathname();

  const nodeData = node?.data;
  const internalId = nodeData?.drupal_internal__nid;

  const [isInIframe, setIsInIframe] = useState(false);

  const editNode = (e) => {
    if (!isInIframe) {
      const editUrl = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/node/${internalId}/edit?destination=${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}${pathname}`;
      window.open(editUrl, '_blank');
    } else {
      e.preventDefault();

      // TODO: Add language information. To edit the content in the correct language.
      // Backend implementation is not ready yet.
      window.parent.postMessage(
        {
          type: 'node',
          id: nodeData?.drupal_internal__nid,
          langcode: nodeData?.langcode,
        },
        '*'
      );
    }
  };

  useEffect(() => {
    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);
  }, []);

  return (
    <div className="absolute -top-10 right-0 flex transform-gpu gap-2 antialiased opacity-75 transition-all duration-75 ease-in-out hover:scale-105 hover:opacity-100">
      <button
        onClick={editNode}
        className="flex gap-2 rounded bg-primary-700 px-3 py-2 text-xs font-bold text-white shadow-lg transition-colors hover:bg-primary-900"
      >
        <EditIcon />
        Edit {nodeData?.title}
      </button>
    </div>
  );
}
