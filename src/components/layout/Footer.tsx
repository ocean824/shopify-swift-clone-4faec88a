import { useState } from 'react';
import { Instagram, Twitter, Youtube, Mail, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com/samplesociety', icon: Instagram },
  { name: 'Twitter', href: 'https://twitter.com/samplesociety', icon: Twitter },
  { name: 'YouTube', href: 'https://youtube.com/samplesociety', icon: Youtube },
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
