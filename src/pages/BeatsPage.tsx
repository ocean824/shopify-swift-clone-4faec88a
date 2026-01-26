import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

const BeatsPage = () => {
  return (
    <Layout>
      <BeamsBackground />
      <section className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Music className="mx-auto h-16 w-16 text-primary mb-6" />
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-4">Beats</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Exclusive beats for lease and purchase. Coming soon.
          </p>
        </motion.div>
      </section>
    </Layout>
  );
};

export default BeatsPage;
