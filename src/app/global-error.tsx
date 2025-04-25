'use client';

import '@/styles/globals.css';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-[1_0_auto]">
            <main className="container-wrapper my-16">
              <section className="space-y-4">
                <h1>Something went wrong!</h1>
                <p>{error?.message || 'An unknown error occurred.'}</p>
                <button onClick={() => reset()} className="btn-primary">
                  Try again
                </button>
              </section>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
