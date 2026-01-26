import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { sampleKits } from '@/data/sampleKits';
import logo from '@/assets/logo.gif';

function SampleKitCard({ kit, index }: { kit: typeof sampleKits[0]; index: number }) {
  const salePercentage = kit.compareAtPrice 
    ? Math.round(((kit.compareAtPrice - kit.price) / kit.compareAtPrice) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group"
    >
      <Link to={`/product/${kit.handle}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-card border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
          <img
            src={kit.image}
            alt={kit.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Sale Badge */}
          {kit.isOnSale && (
            <Badge
              variant="destructive"
              className="absolute left-3 top-3 bg-primary text-primary-foreground"
            >
              Sale
            </Badge>
          )}
          
          {/* Hover Overlay with Buy Now */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button size="lg" className="font-semibold">
              Buy Now
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-1 text-center">
          <h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
            {kit.title}
          </h3>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-bold text-foreground">
              ${kit.price}
            </span>
            {kit.compareAtPrice && kit.compareAtPrice > kit.price && (
              <span className="text-sm text-muted-foreground line-through">
                ${kit.compareAtPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

const Index = () => {
  return (
    <Layout>
      {/* Hero Section with Logo */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-card/50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.img 
            src={logo} 
            alt="Sample Society" 
            className="mx-auto h-32 w-auto md:h-40"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.p 
            className="mx-auto mt-6 max-w-2xl text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Premium sample packs, MIDI kits, and production resources for the modern music producer. 
            100% royalty-free.
          </motion.p>
        </div>
      </section>
      
      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold uppercase tracking-tight md:text-3xl">New Releases</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse our collection of premium sample packs
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {sampleKits.map((kit, index) => (
            <SampleKitCard key={kit.id} kit={kit} index={index} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
