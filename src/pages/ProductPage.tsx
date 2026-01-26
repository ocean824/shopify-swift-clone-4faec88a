import { useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, ArrowLeft, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useCartStore } from '@/stores/cartStore';
import { findKitByHandle, sampleKits, SampleKit } from '@/data/sampleKits';
import { cn } from '@/lib/utils';
import { BeamsBackground } from '@/components/effects/BeamsBackground';

// Local Audio Player for Product Page
function WaveformPlayer({ audioUrl, title }: { audioUrl?: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bars] = useState(() => 
    Array.from({ length: 50 }, () => Math.random() * 0.6 + 0.2)
  );

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const prog = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(prog || 0);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
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
        preload="metadata"
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

// Bundle Item Audio Player
function BundleItemPlayer({ audioUrl }: { audioUrl?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  if (!audioUrl) {
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" disabled>
        <Play className="h-4 w-4 ml-0.5 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
        preload="none"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 flex-shrink-0"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 ml-0.5" />
        )}
      </Button>
    </>
  );
}

// Bundle Item Component - matches reference layout
function BundleItem({ 
  kit, 
  isSelected, 
  selectedFormat,
  onToggle,
  onFormatChange,
  isCurrentProduct,
}: { 
  kit: SampleKit;
  isSelected: boolean;
  selectedFormat: 'wav' | 'stems';
  onToggle: () => void;
  onFormatChange: (format: 'wav' | 'stems') => void;
  isCurrentProduct?: boolean;
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
        className="border-primary data-[state=checked]:bg-primary flex-shrink-0"
      />
      
      <BundleItemPlayer audioUrl={kit.audioPreviewUrl} />

      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
        <img src={kit.image} alt={kit.title} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isCurrentProduct && (
            <span className="text-xs text-muted-foreground">This item:</span>
          )}
          <Link 
            to={`/product/${kit.wavHandle}`}
            className={cn(
              "font-medium text-sm transition-colors line-clamp-1",
              isCurrentProduct ? "text-primary" : "hover:text-primary"
            )}
          >
            {kit.title}
          </Link>
        </div>
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
  const { addItem, isLoading: cartLoading, openCart } = useCartStore();
  
  // Bundle state
  const [bundleItems, setBundleItems] = useState<{
    kit: SampleKit;
    selected: boolean;
    format: 'wav' | 'stems';
  }[]>([]);

  // Find kit from local data
  const kit = handle ? findKitByHandle(handle) : undefined;

  // Initialize bundle items - current product first, then others
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
    openCart();
  };

  const handleAddBundleToCart = async () => {
    for (const item of selectedBundleItems) {
      const format = item.format;
      const price = format === 'stems' && item.kit.stemsPrice ? item.kit.stemsPrice : item.kit.wavPrice;
      const productHandle = format === 'stems' && item.kit.stemsHandle ? item.kit.stemsHandle : item.kit.wavHandle;

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
    openCart();
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

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Product Image (large, like reference) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24"
          >
            <div className="aspect-square overflow-hidden rounded-xl border border-border bg-card">
              <img
                src={kit.image}
                alt={kit.title}
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Audio Player below image */}
            <div className="mt-4">
              <WaveformPlayer audioUrl={kit.audioPreviewUrl} title={kit.title} />
            </div>
          </motion.div>

          {/* Right Column - Product Info & Bundle Builder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            {/* Add to Cart Button - Primary CTA at top like reference */}
            <Button
              size="lg"
              className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
              onClick={handleAddToCart}
              disabled={cartLoading}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>

            {/* Create Your Own Bundle Section */}
            <section className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">
                  Create Your Own Bundle
                </h2>
              </div>

              {/* Bundle Preview Thumbnails with + signs */}
              <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
                {selectedBundleItems.map((item, index) => (
                  <div key={item.kit.id} className="flex items-center">
                    <div className="w-14 h-14 rounded overflow-hidden border border-border flex-shrink-0">
                      <img 
                        src={item.kit.image} 
                        alt={item.kit.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {index < selectedBundleItems.length - 1 && (
                      <span className="mx-1 text-muted-foreground text-lg">+</span>
                    )}
                  </div>
                ))}
                <div className="ml-auto text-right pl-4">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <p className="text-xl font-bold text-primary">${bundleTotal.toFixed(2)}</p>
                </div>
              </div>

              {/* Add Bundle to Cart - Outline style like reference */}
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 mb-6 border-foreground text-foreground hover:bg-foreground hover:text-background"
                onClick={handleAddBundleToCart}
                disabled={cartLoading || selectedBundleItems.length === 0}
              >
                <ShoppingCart className="h-5 w-5" />
                ADD TO CART
              </Button>

              {/* Bundle Items List */}
              <div className="space-y-2">
                {bundleItems.map((item, index) => (
                  <BundleItem
                    key={item.kit.id}
                    kit={item.kit}
                    isSelected={item.selected}
                    selectedFormat={item.format}
                    onToggle={() => toggleBundleItem(item.kit.id)}
                    onFormatChange={(format) => updateBundleFormat(item.kit.id, format)}
                    isCurrentProduct={index === 0}
                  />
                ))}
              </div>
            </section>

            {/* Product Description below bundle */}
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">About This Kit</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {kit.description}
              </p>
              
              {/* License Info */}
              <p className="mt-6 text-xs text-muted-foreground">
                By purchasing, you agree to our{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Master Use License Agreement
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
