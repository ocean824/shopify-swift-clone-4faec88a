import { useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, ArrowLeft, Play, Pause, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useCartStore } from '@/stores/cartStore';
import { findKitByHandle, sampleKits, SampleKit } from '@/data/sampleKits';
import { cn } from '@/lib/utils';
import { BeamsBackground } from '@/components/effects/BeamsBackground';

// Waveform Audio Player Component
function WaveformPlayer({ audioUrl, title }: { audioUrl?: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bars] = useState(() => 
    Array.from({ length: 50 }, () => Math.random() * 0.6 + 0.2)
  );

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
    const prog = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(prog || 0);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audioRef.current.currentTime = percentage * audioRef.current.duration;
  };

  if (!audioUrl) {
    return (
      <div className="flex items-center gap-4 rounded-lg border border-border bg-card/50 p-4">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-primary/50"
          disabled
        >
          <Play className="h-5 w-5 ml-0.5 text-muted-foreground" />
        </Button>
        <div className="flex-1 flex items-center justify-center h-10">
          <p className="text-sm text-muted-foreground">Audio preview coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card/50 p-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full border-primary hover:bg-primary/20"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 text-primary" />
        ) : (
          <Play className="h-5 w-5 ml-0.5 text-primary" />
        )}
      </Button>

      {/* Waveform visualization */}
      <div 
        className="flex-1 flex items-center gap-[2px] h-10 cursor-pointer"
        onClick={handleClick}
      >
        {bars.map((height, i) => {
          const isActive = (i / bars.length) * 100 < progress;
          return (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-full transition-colors duration-150",
                isActive ? "bg-primary" : "bg-muted-foreground/30"
              )}
              style={{ height: `${height * 100}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}

// Bundle Item Component
function BundleItem({ 
  kit, 
  isSelected, 
  selectedFormat,
  onToggle,
  onFormatChange,
  onPlay,
  isPlaying
}: { 
  kit: SampleKit;
  isSelected: boolean;
  selectedFormat: 'wav' | 'stems';
  onToggle: () => void;
  onFormatChange: (format: 'wav' | 'stems') => void;
  onPlay: () => void;
  isPlaying: boolean;
}) {
  const hasStems = !!kit.stemsHandle;
  const currentPrice = selectedFormat === 'stems' && kit.stemsPrice ? kit.stemsPrice : kit.wavPrice;

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border transition-colors",
      isSelected ? "border-primary/50 bg-card" : "border-border bg-card/30"
    )}>
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
        className="border-primary data-[state=checked]:bg-primary"
      />
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onPlay}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 ml-0.5" />
        )}
      </Button>

      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
        <img src={kit.image} alt={kit.title} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <Link 
          to={`/product/${kit.wavHandle}`}
          className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
        >
          {kit.title}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <Badge 
            variant={selectedFormat === 'wav' ? 'default' : 'outline'}
            className={cn(
              "cursor-pointer text-xs px-2 py-0",
              selectedFormat === 'wav' ? 'bg-primary' : 'hover:bg-primary/20'
            )}
            onClick={() => onFormatChange('wav')}
          >
            WAV
          </Badge>
          {hasStems && (
            <Badge 
              variant={selectedFormat === 'stems' ? 'default' : 'outline'}
              className={cn(
                "cursor-pointer text-xs px-2 py-0",
                selectedFormat === 'stems' ? 'bg-primary' : 'hover:bg-primary/20'
              )}
              onClick={() => onFormatChange('stems')}
            >
              WAV + Stems
            </Badge>
          )}
        </div>
      </div>

      <span className="font-semibold text-sm whitespace-nowrap">
        ${currentPrice.toFixed(2)}
      </span>
    </div>
  );
}

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>();
  const [selectedFormat, setSelectedFormat] = useState<'wav' | 'stems'>('wav');
  const { addItem, isLoading: cartLoading } = useCartStore();
  
  // Bundle state
  const [bundleItems, setBundleItems] = useState<{
    kit: SampleKit;
    selected: boolean;
    format: 'wav' | 'stems';
  }[]>([]);
  const [playingBundleId, setPlayingBundleId] = useState<string | null>(null);

  // Find kit from local data
  const kit = handle ? findKitByHandle(handle) : undefined;

  // Initialize bundle items
  useEffect(() => {
    if (kit) {
      const otherKits = sampleKits
        .filter(k => k.id !== kit.id && k.category === 'sample-kit')
        .slice(0, 4);
      
      setBundleItems([
        { kit, selected: true, format: 'wav' },
        ...otherKits.map(k => ({ kit: k, selected: false, format: 'wav' as const }))
      ]);
    }
  }, [kit?.id]);

  if (!kit) {
    return (
      <Layout>
        <BeamsBackground />
        <div className="relative z-10 container mx-auto px-4 py-8 text-center">
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

  const currentPrice = selectedFormat === 'stems' && kit.stemsPrice ? kit.stemsPrice : kit.wavPrice;
  const isOnSale = kit.compareAtPrice && kit.compareAtPrice > kit.wavPrice;

  // Calculate bundle total
  const bundleTotal = bundleItems
    .filter(item => item.selected)
    .reduce((total, item) => {
      const price = item.format === 'stems' && item.kit.stemsPrice 
        ? item.kit.stemsPrice 
        : item.kit.wavPrice;
      return total + price;
    }, 0);

  const selectedBundleItems = bundleItems.filter(item => item.selected);

  const handleAddToCart = async () => {
    // Use real Shopify variant IDs when available
    const variantId = selectedFormat === 'stems' && kit.shopifyStemsVariantId 
      ? kit.shopifyStemsVariantId 
      : kit.shopifyWavVariantId || `gid://shopify/ProductVariant/${kit.id}-${selectedFormat}`;
    
    const productId = selectedFormat === 'stems' && kit.shopifyStemsProductId
      ? kit.shopifyStemsProductId
      : kit.shopifyWavProductId || `gid://shopify/Product/${kit.id}`;
    
    const productHandle = selectedFormat === 'stems' && kit.stemsHandle ? kit.stemsHandle : kit.wavHandle;
    
    const productData = {
      node: {
        id: productId,
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
              id: variantId,
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
      product: productData,
      variantId: variantId,
      variantTitle: selectedFormat === 'stems' ? 'WAV + Stems' : 'WAV',
      price: { amount: String(currentPrice), currencyCode: 'USD' },
      quantity: 1,
      selectedOptions: [{ name: 'Format', value: selectedFormat === 'stems' ? 'WAV + Stems' : 'WAV' }],
    });
  };

  const handleAddBundleToCart = async () => {
    for (const item of selectedBundleItems) {
      const format = item.format;
      const price = format === 'stems' && item.kit.stemsPrice ? item.kit.stemsPrice : item.kit.wavPrice;
      const productHandle = format === 'stems' && item.kit.stemsHandle ? item.kit.stemsHandle : item.kit.wavHandle;

      // Use real Shopify variant IDs when available
      const variantId = format === 'stems' && item.kit.shopifyStemsVariantId
        ? item.kit.shopifyStemsVariantId
        : item.kit.shopifyWavVariantId || `gid://shopify/ProductVariant/${item.kit.id}-${format}`;
      
      const productId = format === 'stems' && item.kit.shopifyStemsProductId
        ? item.kit.shopifyStemsProductId
        : item.kit.shopifyWavProductId || `gid://shopify/Product/${item.kit.id}`;

      const productData = {
        node: {
          id: productId,
          title: item.kit.title,
          description: item.kit.description,
          handle: productHandle,
          productType: item.kit.category,
          vendor: 'Samplesociety',
          priceRange: {
            minVariantPrice: { amount: String(price), currencyCode: 'USD' },
            maxVariantPrice: { amount: String(price), currencyCode: 'USD' },
          },
          compareAtPriceRange: {
            minVariantPrice: { amount: String(item.kit.compareAtPrice || 0), currencyCode: 'USD' },
            maxVariantPrice: { amount: String(item.kit.compareAtPrice || 0), currencyCode: 'USD' },
          },
          images: {
            edges: [{ node: { url: item.kit.image, altText: item.kit.title } }],
          },
          variants: {
            edges: [{
              node: {
                id: variantId,
                title: format === 'stems' ? 'WAV + Stems' : 'WAV',
                price: { amount: String(price), currencyCode: 'USD' },
                compareAtPrice: item.kit.compareAtPrice ? { amount: String(item.kit.compareAtPrice), currencyCode: 'USD' } : null,
                availableForSale: true,
                selectedOptions: [{ name: 'Format', value: format === 'stems' ? 'WAV + Stems' : 'WAV' }],
              },
            }],
          },
          options: [{ name: 'Format', values: item.kit.stemsHandle ? ['WAV', 'WAV + Stems'] : ['WAV'] }],
        },
      };

      await addItem({
        product: productData,
        variantId: variantId,
        variantTitle: format === 'stems' ? 'WAV + Stems' : 'WAV',
        price: { amount: String(price), currencyCode: 'USD' },
        quantity: 1,
        selectedOptions: [{ name: 'Format', value: format === 'stems' ? 'WAV + Stems' : 'WAV' }],
      });
    }
  };

  const toggleBundleItem = (kitId: string) => {
    setBundleItems(items => 
      items.map(item => 
        item.kit.id === kitId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const updateBundleFormat = (kitId: string, format: 'wav' | 'stems') => {
    setBundleItems(items => 
      items.map(item => 
        item.kit.id === kitId ? { ...item, format } : item
      )
    );
  };

  return (
    <Layout>
      <BeamsBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Column - Product Image */}
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
          </motion.div>

          {/* Right Column - Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            {/* Category Label */}
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {kit.category.replace('-', ' ')}
            </span>

            {/* Title */}
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">{kit.title}</h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              {isOnSale && (
                <span className="text-sm font-semibold text-primary uppercase">Sale</span>
              )}
              <span className="text-3xl font-bold text-primary">${currentPrice.toFixed(2)}</span>
              {isOnSale && selectedFormat === 'wav' && (
                <span className="text-xl text-muted-foreground line-through">
                  ${kit.compareAtPrice?.toFixed(2)}
                </span>
              )}
            </div>

            {/* Audio Player */}
            <div className="mt-6">
              <WaveformPlayer audioUrl={kit.audioPreviewUrl} title={kit.title} />
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider">Description</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {kit.description}
              </p>
              {kit.artistsLike && kit.artistsLike.length > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Perfect for artists like {kit.artistsLike.join(', ')}.
                </p>
              )}
            </div>

            {/* Format Selector */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Format</h3>
              <div className="flex gap-3">
                <Button
                  variant={selectedFormat === 'wav' ? 'default' : 'outline'}
                  onClick={() => setSelectedFormat('wav')}
                  className={cn(
                    "px-6",
                    selectedFormat === 'wav' && "bg-primary hover:bg-primary/90"
                  )}
                >
                  WAV
                </Button>
                {kit.stemsHandle && (
                  <Button
                    variant={selectedFormat === 'stems' ? 'default' : 'outline'}
                    onClick={() => setSelectedFormat('stems')}
                    className={cn(
                      "px-6",
                      selectedFormat === 'stems' && "bg-primary hover:bg-primary/90"
                    )}
                  >
                    WAV + Stems
                  </Button>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="mt-8 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleAddToCart}
              disabled={cartLoading}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
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

        {/* Create Your Own Bundle Section */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Create Your Own Bundle
            </h2>
            <div className="text-right">
              <span className="text-xs text-muted-foreground uppercase">Total</span>
              <p className="text-2xl font-bold text-primary">${bundleTotal.toFixed(2)}</p>
            </div>
          </div>

          {/* Bundle Preview Thumbnails */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {selectedBundleItems.map((item, index) => (
              <div key={item.kit.id} className="flex items-center">
                <div className="w-16 h-16 rounded overflow-hidden border border-border flex-shrink-0">
                  <img 
                    src={item.kit.image} 
                    alt={item.kit.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {index < selectedBundleItems.length - 1 && (
                  <span className="mx-2 text-muted-foreground">+</span>
                )}
              </div>
            ))}
          </div>

          {/* Add Bundle to Cart */}
          <Button
            size="lg"
            className="w-full gap-2 mb-6 bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background"
            onClick={handleAddBundleToCart}
            disabled={cartLoading || selectedBundleItems.length === 0}
          >
            <ShoppingCart className="h-5 w-5" />
            ADD TO CART
          </Button>

          {/* Bundle Items List */}
          <div className="space-y-3">
            {bundleItems.map((item) => (
              <BundleItem
                key={item.kit.id}
                kit={item.kit}
                isSelected={item.selected}
                selectedFormat={item.format}
                onToggle={() => toggleBundleItem(item.kit.id)}
                onFormatChange={(format) => updateBundleFormat(item.kit.id, format)}
                onPlay={() => setPlayingBundleId(playingBundleId === item.kit.id ? null : item.kit.id)}
                isPlaying={playingBundleId === item.kit.id}
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
