import type { Metadata } from 'next';
import { Manrope, Work_Sans, JetBrains_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { Providers } from '@/components/layout/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import '@/app/globals.css';
import '@/styles/globals.scss';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const workSans = Work_Sans({ subsets: ['latin'], variable: '--font-work-sans', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'WangsitCoffee — Kopi Nusantara Terbaik',
  description: 'Temukan kopi berkualitas tinggi dari berbagai penjuru Nusantara. Belanja biji kopi, minuman, dan cold brew pilihan.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${manrope.variable} ${workSans.variable} ${jetbrainsMono.variable}`}
    >
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }} suppressHydrationWarning>
        <AppRouterCacheProvider>
          <Providers>
            <Navbar />
            <main style={{ flex: 1 }} className="pb-16 md:pb-0">{children}</main>
            <Footer />
            <MobileBottomNav />
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
