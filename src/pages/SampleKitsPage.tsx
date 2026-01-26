import { useRef, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Play, Pause } from 'lucide-react';
import { sampleKits, SampleKit } from '@/data/sampleKits';
import { useCartStore } from '@/stores/cartStore';
import { useAudio } from '@/components/audio/AudioPlayer';

function SampleKitCard({ kit, index }: { kit: SampleKit; index: number }) {
  const { addItem, isLoading: cartLoading, openCart } = useCartStore();
  const { play, isPlaying, registerAudio, unregisterAudio } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const playing = isPlaying(kit.id);

  useEffect(() => {
    if (audioRef.current && kit.audioPreviewUrl) {
      registerAudio(kit.id, audioRef.current);
    }
    return () => {
      unregisterAudio(kit.id);
    };
  }, [kit.id, kit.audioPreviewUrl, registerAudio, unregisterAudio]);

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
      {kit.audioPreviewUrl && (
        <audio ref={audioRef} src={kit.audioPreviewUrl} preload="none" />
      )}
      
      <Link to={`/product/${kit.wavHandle}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-card border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
          <img
            src={kit.image}
            alt={kit.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {kit.isOnSale && (
            <Badge
              variant="destructive"
              className="absolute left-3 top-3 bg-primary text-primary-foreground"
            >
              Sale
            </Badge>
          )}

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

export default function SampleKitsPage() {
  // Filter for sample kits only (exclude drum-kits, midi-kits, bundles)
  const sampleKitsOnly = sampleKits.filter(kit => kit.category === 'sample-kit');

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-tight">Sample Kits</h1>
          <p className="mt-2 text-muted-foreground">
            Premium compositions and loops for your productions
          </p>
        </div>
        
        {sampleKitsOnly.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No sample kits available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {sampleKitsOnly.map((kit, index) => (
              <SampleKitCard key={kit.id} kit={kit} index={index} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
