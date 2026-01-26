import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { sampleKits } from '@/data/sampleKits';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import heroBanner from '@/assets/hero-banner.png';

function SampleKitCard({ kit, index }: { kit: typeof sampleKits[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
      className="group"
    >
      <Link to={`/product/${kit.wavHandle}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-card border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
          <img
            src={kit.image}
            alt={kit.title}
            loading="lazy"
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
              ${kit.wavPrice}
            </span>
            {kit.compareAtPrice && kit.compareAtPrice > kit.wavPrice && (
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

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton className="mx-auto h-4 w-3/4" />
      <Skeleton className="mx-auto h-4 w-1/2" />
    </div>
  );
}

const Index = () => {
  const { visibleItems, hasMore, isLoading, loaderRef } = useInfiniteScroll({
    items: sampleKits,
    initialCount: 10,
    incrementCount: 5,
  });

  return (
    <Layout>
      <BeamsBackground />
      
      {/* Hero Section with Wide Banner */}
      <section className="relative z-10 overflow-hidden py-8 md:py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="relative w-full overflow-hidden rounded-lg"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Wide banner with cropping to center on SAMPLE SOCIETY text */}
            <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden">
              <img 
                src={heroBanner} 
                alt="Sample Society" 
                className="w-full h-[200%] object-cover object-[center_70%]"
              />
            </div>
          </motion.div>
          <motion.p 
            className="mx-auto mt-6 max-w-2xl text-center text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Premium sample packs, MIDI kits, and production resources for the modern music producer. 
            Master use licensed.
          </motion.p>
        </div>
      </section>
      
      {/* Products Section */}
      <section className="relative z-10 container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold uppercase tracking-tight md:text-3xl">New Releases</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse our collection of premium sample packs
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visibleItems.map((kit, index) => (
            <SampleKitCard key={kit.id} kit={kit} index={index} />
          ))}
          
          {/* Loading skeletons */}
          {isLoading && (
            <>
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
            </>
          )}
        </div>
        
        {/* Infinite scroll trigger */}
        {hasMore && (
          <div ref={loaderRef} className="mt-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Index;
