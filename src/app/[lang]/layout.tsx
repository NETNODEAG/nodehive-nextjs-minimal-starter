import Connector from '@/nodehive/connector';
import { spaceConfig } from '@/nodehive/space-config';

import '@/styles/globals.css';

import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { Locale } from '@/nodehive/i18n-config';

import { AuthProvider } from '@/components/providers/auth-provider';
import Footer from '@/components/theme/global-layout/footer';
import Header from '@/components/theme/global-layout/header';

const inter = Inter({ subsets: ['latin'] });
const helvetica = localFont({
  src: [
    {
      path: '@/assets/fonts/HelveticaNowVar.ttf',
      style: 'normal',
    },
  ],
  variable: '--font-helvetica-now',
  fallback: ['Helvetica', 'sans-serif'],
  display: 'swap',
});

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
      <body className={`${inter.className} ${helvetica.variable}`}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header lang={locale} />

            <div className="flex-[1_0_auto]" id="scroll-container">
              <main className="">{children}</main>
            </div>

            <Footer />
          </div>

          <Connector />
        </AuthProvider>
      </body>
    </html>
  );
}
