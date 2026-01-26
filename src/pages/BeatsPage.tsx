import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { motion } from 'framer-motion';

const BeatsPage = () => {
  return (
    <Layout>
      <BeamsBackground />
      <section className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          {/* BeatStars Blaze Pro Player Embed */}
          <div className="w-full max-w-6xl mx-auto">
            <iframe 
              src="https://player.beatstars.com/?storeId=142282" 
              width="100%" 
              height="800" 
              style={{ maxWidth: '100%', border: 'none' }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Sample Society Beat Store"
            />
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default BeatsPage;
