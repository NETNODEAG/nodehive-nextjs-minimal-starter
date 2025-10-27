import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const helveticaNow = localFont({
  src: [{ path: '../assets/fonts/HelveticaNowVar.ttf', style: 'normal' }],
  variable: '--font-helvetica-now',
  fallback: ['sans-serif'],
  display: 'swap',
});
