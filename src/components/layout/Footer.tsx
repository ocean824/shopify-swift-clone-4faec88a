import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube } from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'Sample Kits', href: '/' },
    { name: 'Drum Kits', href: '/drum-kits' },
    { name: 'MIDI Kits', href: '/midi-kits' },
    { name: 'Merch', href: '/merch' },
    { name: 'All Kits Bundle', href: '/bundle' },
  ],
  support: [
    { name: 'Contact', href: '/contact' },
    { name: 'Credits', href: '/credits' },
    { name: 'FAQ', href: '/faq' },
  ],
  legal: [
    { name: 'Terms & License', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
};

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com/samplesociety', icon: Instagram },
  { name: 'Twitter', href: 'https://twitter.com/samplesociety', icon: Twitter },
  { name: 'YouTube', href: 'https://youtube.com/samplesociety', icon: Youtube },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-xl font-bold uppercase text-foreground">
              SAMPLE SOCIETY
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              Premium sample packs, MIDI kits, and production resources crafted for 
              the modern music producer. 100% royalty-free.
            </p>
            
            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Shop
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sample Society. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}