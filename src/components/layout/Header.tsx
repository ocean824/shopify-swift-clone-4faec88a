import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useTheme } from '@/hooks/useTheme';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo-main.webp';

const navigation = [
  { name: 'BEATS', href: '/beats' },
  { name: 'SAMPLE KITS', href: '/' },
  { name: 'DRUM KITS', href: '/drum-kits' },
  { name: 'MIDI KITS', href: '/midi-kits' },
  { name: 'MERCH', href: '/merch' },
  { name: 'APPLY', href: '/apply' },
  { name: 'SOCIETY', href: '/society' },
  { name: 'SUBSCRIBE', href: '/subscribe' },
  { name: 'CREDITS', href: '/credits' },
  { name: 'TERMS', href: '/terms' },
  { name: 'CONTACT', href: '/contact' },
  { name: 'ALL KITS BUNDLE', href: '/bundle', highlight: true },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openCart, totalItems } = useCartStore();
  const { theme } = useTheme();
  const itemCount = totalItems();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="Sample Society" 
            className={cn(
              "h-10 w-auto",
              theme === 'dark' && "invert brightness-0 invert"
            )} 
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-xs font-semibold uppercase tracking-wider transition-colors",
                item.highlight 
                  ? "text-primary hover:text-primary/80" 
                  : "text-muted-foreground hover:text-foreground",
                location.pathname === item.href && "text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={openCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </motion.span>
            )}
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="border-t border-border bg-background px-4 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block py-3 text-sm font-semibold uppercase tracking-wider transition-colors",
                    item.highlight 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground",
                    location.pathname === item.href && "text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
