'use client';

import { helveticaNow, inter } from '@/lib/fonts';
import { H1 } from '@/components/theme/atoms-content/heading/heading';
import Container from '@/components/theme/atoms-layout/container/container';
import Button from '@/components/ui/atoms/button/button';

import '@/styles/globals.css';

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
      <body className={`${inter.variable} ${helveticaNow.variable} font-sans`}>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-[1_0_auto]">
            <main className="my-16">
              <Container>
                <section className="space-y-4">
                  <H1>Something went wrong!</H1>
                  <p>{error?.message || 'An unknown error occurred.'}</p>
                  <Button onClick={() => reset()}>Try again</Button>
                </section>
              </Container>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
