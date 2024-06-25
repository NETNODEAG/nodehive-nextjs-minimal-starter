import Connector from '@/nodehive/connector';
import { spaceConfig } from '@/nodehive/space-config';

import '@/styles/globals.css';

import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Locale } from '@/nodehive/i18n-config';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

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
  params: {
    lang: Locale;
  };
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = params;

  return (
    <html lang={lang}>
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <Header lang={lang} />

          <div className="flex-[1_0_auto]">
            <main className="container-wrapper my-16">{children}</main>
          </div>

          <Footer />
        </div>

        <Connector />
      </body>
    </html>
  );
}
