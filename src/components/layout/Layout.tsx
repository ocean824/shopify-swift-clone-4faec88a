import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { PromoMarquee } from './PromoMarquee';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MiniPlayer } from '@/components/audio/MiniPlayer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <PromoMarquee />
      <Header />
      <main className="flex-1 pb-20">{children}</main>
      <Footer />
      <CartDrawer />
      <MiniPlayer />
    </div>
  );
}
