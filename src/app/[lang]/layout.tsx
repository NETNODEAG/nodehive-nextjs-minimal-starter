import { spaceConfig } from '@/config/space-config';
import Connector from '@/components/nodehive/connector';

import '@/styles/globals.css';

import { Suspense } from 'react';
import { Metadata } from 'next';
import AppProvider from '@/providers/app-provider';

import { helveticaNow, inter } from '@/lib/fonts';
import SessionExpiredToast from '@/components/auth/session-expired-toast';
import Footer from '@/components/theme/global-layout/footer/footer';
import Header from '@/components/theme/global-layout/header/header';
import { Toaster } from '@/components/ui/atoms/toaster/toaster';

const { spaceMetadata } = spaceConfig;

/**
 * The metadata
 * @type {Metadata}
 */
export const metadata: Metadata = {
  metadataBase: new URL(spaceMetadata.baseUrl),
  title: {
    template: spaceMetadata.title.template,
    default: spaceMetadata.title.default,
  },
  description: spaceMetadata.description,
  icons: spaceMetadata.icons,
  openGraph: spaceMetadata.openGraph,
};

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function RootLayout(props: LayoutProps) {
  const { children, params } = props;
  const { lang } = await params;

  return (
    <html lang={lang}>
      <body className={`${inter.variable} ${helveticaNow.variable} font-sans`}>
        <AppProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header lang={lang} />
            <main className="flex-[1_0_auto]">{children}</main>
            <Suspense>
              <Footer />
            </Suspense>
          </div>
          <Suspense>
            <Connector />
          </Suspense>
          <Toaster position="top-center" />
          <Suspense>
            <SessionExpiredToast />
          </Suspense>
        </AppProvider>
      </body>
    </html>
  );
}
