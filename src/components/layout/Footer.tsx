import { useState } from 'react';
import { Instagram, Twitter, Youtube, Mail, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// TikTok icon component (not available in lucide-react)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/samplexsociety?igsh=Znd4ODh1OHRibmd6&utm_source=qr', icon: Instagram },
  { name: 'Twitter', href: 'https://x.com/samplexsociety?s=21&t=B7ZyF-Vx4kcIR1w93CBVTg', icon: Twitter },
  { name: 'YouTube', href: 'https://youtube.com/@samplexsociety8796?si=tTnuzj1Plakvdxbo', icon: Youtube },
  { name: 'TikTok', href: 'https://www.tiktok.com/@samplexsociety?_r=1&_t=ZP-93gccym8gVq', icon: TikTokIcon },
  { name: 'Email', href: 'mailto:contact@samplesociety.com', icon: Mail },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Thanks for subscribing!');
    setEmail('');
    setPhone('');
    setIsSubmitting(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border bg-background pb-20">
      {/* Stay Updated Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-xl font-bold text-foreground">Stay Updated</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get notified about new releases, sample packs, and exclusive content.
          </p>
          
          <form onSubmit={handleSubscribe} className="mt-6 space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-border bg-background"
            />
            <Input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 border-border bg-background"
            />
            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Brand Name */}
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
              SAMPLE SOCIETY
            </span>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
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

          {/* Copyright */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sample Society. All rights reserved.
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-24 right-6 z-40 h-10 w-10 rounded-full border-primary bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  );
}
