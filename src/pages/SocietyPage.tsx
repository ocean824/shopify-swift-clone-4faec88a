import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { motion } from 'framer-motion';
import { Users, Star, Zap, Trophy } from 'lucide-react';

const benefits = [
  {
    icon: Star,
    title: 'Exclusive Content',
    description: 'Get early access to new sample packs and exclusive member-only releases.',
  },
  {
    icon: Zap,
    title: 'Producer Community',
    description: 'Connect with like-minded producers and share your creations.',
  },
  {
    icon: Trophy,
    title: 'Discounts & Perks',
    description: 'Members receive special discounts on all products and bundles.',
  },
];

const SocietyPage = () => {
  return (
    <Layout>
      <BeamsBackground />
      <section className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Users className="mx-auto h-16 w-16 text-primary mb-6" />
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-4">The Society</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join an exclusive community of producers, beatmakers, and artists.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border text-center"
            >
              <benefit.icon className="mx-auto h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default SocietyPage;
