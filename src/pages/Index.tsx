import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, Play, Pause } from 'lucide-react';
import { sampleKits, SampleKit } from '@/data/sampleKits';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { useCartStore } from '@/stores/cartStore';
import { useAudio } from '@/components/audio/AudioPlayer';
import heroBanner from '@/assets/hero-banner.png';

function SampleKitCard({ kit, index }: { kit: SampleKit; index: number }) {
  const { addItem, isLoading: cartLoading, openCart } = useCartStore();
  const { play, isPlaying } = useAudio();
  const playing = isPlaying(kit.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const variantId = kit.shopifyWavVariantId || `gid://shopify/ProductVariant/${kit.id}-wav`;
    const productId = kit.shopifyWavProductId || `gid://shopify/Product/${kit.id}`;
    
    const productData = {
      node: {
        id: productId,
        title: kit.title,
        description: kit.description,
        handle: kit.wavHandle,
        productType: kit.category,
        vendor: 'Samplesociety',
        priceRange: {
          minVariantPrice: { amount: String(kit.wavPrice), currencyCode: 'USD' },
          maxVariantPrice: { amount: String(kit.wavPrice), currencyCode: 'USD' },
        },
        compareAtPriceRange: {
          minVariantPrice: { amount: String(kit.compareAtPrice || 0), currencyCode: 'USD' },
          maxVariantPrice: { amount: String(kit.compareAtPrice || 0), currencyCode: 'USD' },
        },
        images: {
          edges: [{ node: { url: kit.image, altText: kit.title } }],
        },
        variants: {
          edges: [{
            node: {
              id: variantId,
              title: 'WAV',
              price: { amount: String(kit.wavPrice), currencyCode: 'USD' },
              compareAtPrice: kit.compareAtPrice ? { amount: String(kit.compareAtPrice), currencyCode: 'USD' } : null,
              availableForSale: true,
              selectedOptions: [{ name: 'Format', value: 'WAV' }],
            },
          }],
        },
        options: [{ name: 'Format', values: kit.stemsHandle ? ['WAV', 'WAV + Stems'] : ['WAV'] }],
      },
    };

    await addItem({
      product: productData,
      variantId: variantId,
      variantTitle: 'WAV',
      price: { amount: String(kit.wavPrice), currencyCode: 'USD' },
      quantity: 1,
      selectedOptions: [{ name: 'Format', value: 'WAV' }],
    });
    openCart();
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (kit.audioPreviewUrl) {
      play(kit.id, kit.audioPreviewUrl);
    }
  };

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

          {/* Play Button - z-20 to stay above overlay */}
          {kit.audioPreviewUrl && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-3 top-3 z-20 h-10 w-10 rounded-full border-primary/50 bg-background/90 backdrop-blur hover:bg-primary/20 hover:scale-110 transition-transform"
              onClick={handlePlayClick}
            >
              {playing ? (
                <Pause className="h-4 w-4 text-primary" />
              ) : (
                <Play className="h-4 w-4 ml-0.5 text-primary" />
              )}
            </Button>
          )}
          
          {/* Hover Overlay with Buy Now */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
            <Button 
              size="default" 
              className="font-semibold gap-2 pointer-events-auto"
            >
              <ShoppingCart className="h-4 w-4" />
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

// External bundle URL
const BUNDLE_EXTERNAL_URL = 'https://my.flowlance.com/samplesociety';

// Featured Bundle Card Component - links to external URL
function FeaturedBundleCard({ kit }: { kit: SampleKit }) {
  const { play, isPlaying } = useAudio();
  const playing = isPlaying(kit.id);

  const handleGetBundle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(BUNDLE_EXTERNAL_URL, '_blank');
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (kit.audioPreviewUrl) {
      play(kit.id, kit.audioPreviewUrl);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-md"
    >
      
      <a 
        href={BUNDLE_EXTERNAL_URL} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="group block"
      >
        <div className="relative overflow-hidden rounded-xl bg-card border-2 border-primary/50 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/20">
          {/* Limited Time Banner */}
          <div className="absolute inset-x-0 top-0 z-10 bg-primary py-2 text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-primary-foreground">
              🔥 Limited Time Deal
            </span>
          </div>
          
          <div className="pt-10">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={kit.image}
                alt={kit.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Play Button */}
              {kit.audioPreviewUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-3 top-3 z-20 h-10 w-10 rounded-full border-primary/50 bg-background/90 backdrop-blur hover:bg-primary/20 hover:scale-110 transition-transform"
                  onClick={handlePlayClick}
                >
                  {playing ? (
                    <Pause className="h-4 w-4 text-primary" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5 text-primary" />
                  )}
                </Button>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Button 
                  size="lg" 
                  className="font-semibold gap-2 text-lg px-8"
                  onClick={handleGetBundle}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Get the Bundle
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-foreground md:text-2xl">
              {kit.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {kit.description}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="text-3xl font-bold text-primary">
                ${kit.wavPrice}
              </span>
              {kit.compareAtPrice && kit.compareAtPrice > kit.wavPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${kit.compareAtPrice}
                </span>
              )}
              {kit.compareAtPrice && kit.compareAtPrice > kit.wavPrice && (
                <Badge className="bg-primary text-primary-foreground">
                  {Math.round((1 - kit.wavPrice / kit.compareAtPrice) * 100)}% OFF
                </Badge>
              )}
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

const Index = () => {
  // Featured bundle (shown separately at top)
  const allKitsBundle = sampleKits.find(kit => kit.id === 'all-kits-bundle-2025');
  
  // Show all products except the bundle on homepage
  const otherKits = sampleKits.filter(kit => kit.id !== 'all-kits-bundle-2025');

  const { visibleItems, hasMore, isLoading, loaderRef } = useInfiniteScroll({
    items: otherKits,
    initialCount: 12,
    incrementCount: 4,
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
                className="w-full h-full object-cover dark:invert-0 invert"
                style={{ objectPosition: 'center 85%' }}
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

      {/* Featured Bundle Section */}
      {allKitsBundle && (
        <section className="relative z-10 container mx-auto px-4 py-8">
          <FeaturedBundleCard kit={allKitsBundle} />
        </section>
      )}
      
      {/* Products Section */}
      <section className="relative z-10 container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold uppercase tracking-tight md:text-3xl">New Releases</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse our collection of premium sample packs
          </p>
        </div>
        
        {/* 4-column grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
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
