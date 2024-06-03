'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function FieldEditButton({ label, type, field, nodeId, lang }) {
  const pathname = usePathname();
  const [isInIframe, setIsInIframe] = useState(false);

  const editComponent = (e) => {
    e.preventDefault();

    // TODO: Add language information. To edit the content in the correct language.
    // Backend implementation is not ready yet.
    window.parent.postMessage(
      {
        type: type,
        field: field,
        id: nodeId,
        pathname: pathname,
        lang: lang,
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
    <button
      onClick={editComponent}
      className="flex gap-2 rounded bg-primary-700 px-3 py-2 text-xs font-bold text-white shadow-lg transition-colors hover:bg-primary-900"
    >
      {label}
    </button>
  );
}
