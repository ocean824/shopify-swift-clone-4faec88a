import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import vznImage from '@/assets/artists/vzn.jpeg';
import nikoImage from '@/assets/artists/niko.jpeg';
import oceanImage from '@/assets/artists/ocean.jpeg';

const artists = [
  {
    id: 'ocean',
    name: 'ØCEAN',
    image: oceanImage,
  },
  {
    id: 'niko-the-great',
    name: 'NIKO THE GREAT',
    image: nikoImage,
  },
  {
    id: 'vzn',
    name: 'VZN',
    image: vznImage,
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
            Meet the producers behind Sample Society.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          {artists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card/50 backdrop-blur-sm rounded-xl border border-border overflow-hidden group"
            >
              {/* Artist Photo */}
              <div className="aspect-square bg-background/50 overflow-hidden border-b border-border">
                <img 
                  src={artist.image} 
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              {/* Artist Info */}
              <div className="p-6 text-center">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-4">{artist.name}</h3>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/artist/${artist.id}`}>View Kits</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default SocietyPage;
