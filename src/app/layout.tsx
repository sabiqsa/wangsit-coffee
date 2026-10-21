import type { Metadata } from 'next';
import { Bricolage_Grotesque, Geist, Geist_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { Providers } from '@/components/layout/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import '@/app/globals.css';
import '@/styles/globals.scss';

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap' });
const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'WangsitCoffee | Kopi Nusantara pilihan',
  description: 'Biji kopi single-origin dari Gayo, Toraja, Lampung, dan Mandailing. Dipanggang per batch, dikirim ke rumah kamu.',
  openGraph: {
    title: 'WangsitCoffee | Kopi Nusantara pilihan',
    description: 'Biji kopi single-origin dari Gayo, Toraja, Lampung, dan Mandailing.',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${bricolage.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body className="flex flex-col min-h-dvh m-0" suppressHydrationWarning>
        <AppRouterCacheProvider>
          <Providers>
            <a href="#main" className="skip-link">Langsung ke konten</a>
            <Navbar />
            <main id="main" className="flex-1 pb-20 md:pb-0">{children}</main>
            <Footer />
            <MobileBottomNav />
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
