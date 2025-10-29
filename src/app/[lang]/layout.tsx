import { spaceConfig } from '@/config/space-config';
import Connector from '@/components/nodehive/connector';

import '@/styles/globals.css';

import { Suspense } from 'react';
import { Metadata } from 'next';

import { helveticaNow, inter } from '@/lib/fonts';
import { AuthProvider } from '@/components/providers/auth-provider';
import Footer from '@/components/theme/global-layout/footer/footer';
import Header from '@/components/theme/global-layout/header/header';
import HTML from '@/components/theme/global-layout/html/html';

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

export default function RootLayout(props: LayoutProps) {
  const { children, params } = props;

  const langPromise = params.then((p) => p.lang);

  return (
    <HTML langPromise={langPromise}>
      <body className={`${inter.variable} ${helveticaNow.variable} font-sans`}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header langPromise={langPromise} />
            <main className="flex-[1_0_auto]">{children}</main>
            <Footer />
          </div>

          <Connector />
        </AuthProvider>
      </body>
    </HTML>
  );
}
