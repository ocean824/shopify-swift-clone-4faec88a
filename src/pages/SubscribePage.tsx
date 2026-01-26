import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { motion } from 'framer-motion';
import { Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const perks = [
  'Exclusive discounts and early access',
  'Free sample packs for subscribers',
  'Production tips and tutorials',
  'New release announcements',
];

const SubscribePage = () => {
  return (
    <Layout>
      <BeamsBackground />
      <section className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto text-center"
        >
          <Mail className="mx-auto h-16 w-16 text-primary mb-6" />
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-4">Subscribe</h1>
          <p className="text-muted-foreground mb-8">
            Join our mailing list and never miss a drop.
          </p>

          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border">
            <ul className="text-left space-y-3 mb-8">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{perk}</span>
                </li>
              ))}
            </ul>

            <form className="flex gap-3">
              <Input 
                type="email" 
                placeholder="your@email.com" 
                className="flex-1"
              />
              <Button type="submit">
                Subscribe
              </Button>
            </form>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default SubscribePage;
