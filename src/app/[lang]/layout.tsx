import Connector from '@/nodehive/connector';
import { spaceConfig } from '@/nodehive/space-config';

import '@/styles/globals.css';

import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Locale } from '@/nodehive/i18n-config';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { AuthProvider } from '@/components/providers/AuthProvider';

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
  params: Promise<{ lang: string }>;
}

export default async function RootLayout(props: LayoutProps) {
  const params = await props.params;

  const { children } = props;

  const { lang } = params;
  const locale = lang as Locale;

  return (
    <html lang={lang}>
      <body className={inter.className}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header lang={locale} />

            <div className="flex-[1_0_auto]" id="scroll-container">
              <main className="my-16">{children}</main>
            </div>

            <Footer />
          </div>

          <Connector />
        </AuthProvider>
      </body>
    </html>
  );
}
