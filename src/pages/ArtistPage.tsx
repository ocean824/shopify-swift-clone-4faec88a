import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { sampleKits, SampleKit } from '@/data/sampleKits';
import { useCartStore } from '@/stores/cartStore';
import { useAudio } from '@/components/audio/AudioPlayer';

// Artist configuration with their specific kit IDs
const ARTISTS: Record<string, { 
  name: string; 
  displayName: string; 
  bio: string;
  kitIds: string[];
}> = {
  'ocean': {
    name: 'ØCEAN',
    displayName: 'ØCEAN',
    bio: 'Producer and sound designer crafting unique sonic landscapes.',
    kitIds: ['unrequited-love-vol-2', 'moonlight-drumkit'],
  },
  'niko-the-great': {
    name: 'NIKO THE GREAT',
    displayName: 'NIKO THE GREAT',
    bio: 'Beatmaker known for hard-hitting drums and melodic compositions.',
    // All kits except VZN's kits and moonlight-drumkit (which is Ocean's)
    kitIds: [
      'mana-vol-1',
      'haze-midi-phrases',
      'unrequited-love-vol-1',
      'abstract-minds',
      'vibrant-darkness',
      'stained-glass-vol-2',
      'stained-glass-vol-1',
      'vintage-vibes',
      'gray-area',
      'black-friday',
      'the-feels',
    ],
  },
  'vzn': {
    name: 'VZN',
    displayName: 'VZN',
    bio: 'Visionary producer pushing the boundaries of modern production.',
    kitIds: ['vzn-compositions', 'flood-szn-vol-1', 'flood-szn-vol-2'],
  },
};

// Reuse the same card component from the main page
function SampleKitCard({ kit, index }: { kit: SampleKit; index: number }) {
  const { addItem, openCart } = useCartStore();
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

const ArtistPage = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const artist = artistId ? ARTISTS[artistId] : null;

  if (!artist) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Artist not found</h1>
          <Button asChild className="mt-4">
            <Link to="/society">Back to Society</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Filter kits based on artist's specific kit IDs
  const artistKits = sampleKits.filter(kit => artist.kitIds.includes(kit.id));

  return (
    <Layout>
      <BeamsBackground />
      <section className="relative z-10 container mx-auto px-4 py-16">
        <Link to="/society" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Society
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Artist Logo Placeholder */}
          <div className="mx-auto w-32 h-32 bg-card border border-border rounded-xl flex items-center justify-center mb-6">
            <span className="text-3xl font-bold text-primary">{artist.displayName.charAt(0)}</span>
          </div>
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-4">{artist.displayName}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{artist.bio}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold uppercase tracking-tight mb-8 text-center">Kits by {artist.displayName}</h2>
          
          {artistKits.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {artistKits.map((kit, index) => (
                <SampleKitCard key={kit.id} kit={kit} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <p>No kits found for this artist yet.</p>
              <p className="text-sm mt-2">Check back soon for new releases!</p>
            </div>
          )}
        </motion.div>
      </section>
    </Layout>
  );
};

export default ArtistPage;
