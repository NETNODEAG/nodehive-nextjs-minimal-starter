'use client';

import { useEffect, useState } from 'react';

export default function IframeWrapper({ children }) {
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);
  }, []);

  if (!isInIframe) {
    return children;
  }

  return (
    <div className="outline-primary-700 rounded-lg p-2 hover:outline-2 hover:-outline-offset-2 hover:outline-dashed">
      {children}
    </div>
  );
}
