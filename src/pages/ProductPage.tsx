import { useParams, Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { ShoppingCart, ArrowLeft, Play, Pause, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useCartStore } from '@/stores/cartStore';
import { findKitByHandle, getRelatedKits, sampleKits, SampleKit } from '@/data/sampleKits';
import { cn } from '@/lib/utils';

// Audio Player Component
function AudioPlayer({ audioUrl, title }: { audioUrl?: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(progress || 0);
  };

  const handleProgressChange = (value: number[]) => {
    if (!audioRef.current) return;
    const time = (value[0] / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
    setProgress(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value[0] / 100;
    setVolume(value[0]);
  };

  if (!audioUrl) {
    return (
      <div className="rounded-lg border border-border bg-card/50 p-4">
        <p className="text-center text-sm text-muted-foreground">
          Audio preview coming soon
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>

        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-foreground">{title} - Preview</p>
          <Slider
            value={[progress]}
            max={100}
            step={1}
            onValueChange={handleProgressChange}
            className="cursor-pointer"
          />
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-20 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

// Format Selector Component
function FormatSelector({ 
  kit, 
  selectedFormat, 
  onFormatChange 
}: { 
  kit: SampleKit; 
  selectedFormat: 'wav' | 'stems';
  onFormatChange: (format: 'wav' | 'stems') => void;
}) {
  const hasStems = !!kit.stemsHandle;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Format</label>
      <div className="flex gap-2">
        <Button
          variant={selectedFormat === 'wav' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFormatChange('wav')}
          className="flex-1"
        >
          WAV
        </Button>
        {hasStems && (
          <Button
            variant={selectedFormat === 'stems' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFormatChange('stems')}
            className="flex-1"
          >
            WAV + Stems
          </Button>
        )}
      </div>
    </div>
  );
}

// Related Product Card
function RelatedProductCard({ kit }: { kit: SampleKit }) {
  return (
    <Link to={`/product/${kit.wavHandle}`} className="group block">
      <div className="aspect-square overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/50">
        <img
          src={kit.image}
          alt={kit.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h4 className="mt-2 text-sm font-medium text-foreground line-clamp-2">
        {kit.title}
      </h4>
      <p className="text-sm text-muted-foreground">${kit.wavPrice}</p>
    </Link>
  );
}

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>();
  const [selectedFormat, setSelectedFormat] = useState<'wav' | 'stems'>('wav');
  const { addItem, isLoading: cartLoading } = useCartStore();

  // Find kit from local data
  const kit = handle ? findKitByHandle(handle) : undefined;

  if (!kit) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="mt-2 text-muted-foreground">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  const relatedKits = getRelatedKits(kit, 4);
  const currentPrice = selectedFormat === 'stems' && kit.stemsPrice ? kit.stemsPrice : kit.wavPrice;
  const isOnSale = kit.compareAtPrice && kit.compareAtPrice > kit.wavPrice;
  const salePercentage = isOnSale
    ? Math.round(((kit.compareAtPrice! - kit.wavPrice) / kit.compareAtPrice!) * 100)
    : 0;

  const handleAddToCart = async () => {
    // For now, we'll create a mock cart item
    // In production, this would use the actual Shopify variant
    const productHandle = selectedFormat === 'stems' && kit.stemsHandle ? kit.stemsHandle : kit.wavHandle;
    
    // Create a mock product structure for the cart
    const mockProduct = {
      node: {
        id: `gid://shopify/Product/${kit.id}`,
        title: kit.title,
        description: kit.description,
        handle: productHandle,
        productType: kit.category,
        vendor: 'Samplesociety',
        priceRange: {
          minVariantPrice: { amount: String(currentPrice), currencyCode: 'USD' },
          maxVariantPrice: { amount: String(currentPrice), currencyCode: 'USD' },
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
              id: `gid://shopify/ProductVariant/${kit.id}-${selectedFormat}`,
              title: selectedFormat === 'stems' ? 'WAV + Stems' : 'WAV',
              price: { amount: String(currentPrice), currencyCode: 'USD' },
              compareAtPrice: kit.compareAtPrice ? { amount: String(kit.compareAtPrice), currencyCode: 'USD' } : null,
              availableForSale: true,
              selectedOptions: [{ name: 'Format', value: selectedFormat === 'stems' ? 'WAV + Stems' : 'WAV' }],
            },
          }],
        },
        options: [{ name: 'Format', values: kit.stemsHandle ? ['WAV', 'WAV + Stems'] : ['WAV'] }],
      },
    };

    await addItem({
      product: mockProduct,
      variantId: `gid://shopify/ProductVariant/${kit.id}-${selectedFormat}`,
      variantTitle: selectedFormat === 'stems' ? 'WAV + Stems' : 'WAV',
      price: { amount: String(currentPrice), currencyCode: 'USD' },
      quantity: 1,
      selectedOptions: [{ name: 'Format', value: selectedFormat === 'stems' ? 'WAV + Stems' : 'WAV' }],
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-square overflow-hidden rounded-xl border border-border bg-card">
              <img
                src={kit.image}
                alt={kit.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Audio Preview */}
            <AudioPlayer audioUrl={kit.audioPreviewUrl} title={kit.title} />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            {/* Category Badge */}
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="capitalize">
                {kit.category.replace('-', ' ')}
              </Badge>
              {isOnSale && (
                <Badge variant="destructive">
                  {salePercentage}% OFF
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="mt-4 text-3xl font-bold md:text-4xl">{kit.title}</h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold">${currentPrice}</span>
              {isOnSale && selectedFormat === 'wav' && (
                <span className="text-xl text-muted-foreground line-through">
                  ${kit.compareAtPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {kit.description}
              </p>
            </div>

            {/* Artists Like */}
            {kit.artistsLike && kit.artistsLike.length > 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Perfect for artists like: </span>
                {kit.artistsLike.join(', ')}
              </p>
            )}

            {/* Format Selector */}
            <div className="mt-6">
              <FormatSelector
                kit={kit}
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
              />
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              className="mt-8 gap-2"
              onClick={handleAddToCart}
              disabled={cartLoading}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart - ${currentPrice}
            </Button>

            {/* License Info */}
            <p className="mt-4 text-xs text-muted-foreground">
              By purchasing, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:underline">
                License Agreement
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedKits.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold uppercase tracking-tight">
              You May Also Like
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              {relatedKits.map((relatedKit) => (
                <RelatedProductCard key={relatedKit.id} kit={relatedKit} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
