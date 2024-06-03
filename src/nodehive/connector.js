'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Connector() {
  const pathname = usePathname(); // Use the usePathname hook at the top level
  const [isInIframe, setIsInIframe] = useState(false); // State to check if the component is in an iframe
  const [isReloading, setIsReloading] = useState(false); // State to manage the reloading state

  useEffect(() => {
    setIsInIframe(window.self !== window.top);

    const handleMessage = async (event) => {
      if (event.data === 'reloadFrame') {
        setIsReloading(true); // Start showing the overlay

        console.log(pathname);
        await fetch(
          `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/api/nodehive/revalidate?path=${pathname}`
        );

        location.reload();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [pathname]); // Include pathname and router in the dependency array

  return <>{isInIframe && isReloading && <SavingMessage />}</>;
}

const SavingMessage = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-900 bg-opacity-50 transition-all">
    <div className="text-3xl font-semibold text-white">Saving...</div>
  </div>
);
