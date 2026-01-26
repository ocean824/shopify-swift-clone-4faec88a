import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import { useAudio } from '@/components/audio/AudioPlayer';
import { useDiscountStore } from '@/stores/discountStore';

// Global Audio Player for Product Page with auto-pause
function WaveformPlayer({ audioUrl, title }: { audioUrl?: string; title: string }) {
  const playerId = title; // Use title as unique ID for this player
  const { isPlaying, play, progress, duration, seek } = useAudio();
  const [bars] = useState(() => 
    Array.from({ length: 50 }, () => Math.random() * 0.6 + 0.2)
  );

  const togglePlay = () => {
    if (!audioUrl) return;
    play(playerId, audioUrl);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seek(percentage);
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

  const playing = isPlaying(playerId);
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card/50 p-4">
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full border-primary hover:bg-primary/20"
        onClick={togglePlay}
      >
        {playing ? (
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
          const isActive = (i / bars.length) * 100 < progressPercent;
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

// Bundle Item Audio Player with global audio control
function BundleItemPlayer({ audioUrl, kitId }: { audioUrl?: string; kitId: string }) {
  const playerId = `bundle-${kitId}`;
  const { isPlaying, play } = useAudio();

  const togglePlay = () => {
    if (!audioUrl) return;
    play(playerId, audioUrl);
  };

  if (!audioUrl) {
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" disabled>
        <Play className="h-4 w-4 ml-0.5 text-muted-foreground" />
      </Button>
    );
  }

  const playing = isPlaying(playerId);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 flex-shrink-0"
      onClick={togglePlay}
    >
      {playing ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4 ml-0.5" />
      )}
    </Button>
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
  
  // Calculate savings
  const wavSavings = kit.compareAtPrice ? kit.compareAtPrice - kit.wavPrice : 0;
  const stemsSavings = kit.compareAtPrice && kit.stemsPrice ? kit.compareAtPrice - kit.stemsPrice : 0;
  const currentSavings = selectedFormat === 'stems' ? stemsSavings : wavSavings;

  // Handle format change - also select the item if not already selected
  const handleFormatClick = (format: 'wav' | 'stems') => {
    onFormatChange(format);
    if (!isSelected) {
      onToggle();
    }
  };

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
      
      <BundleItemPlayer audioUrl={kit.audioPreviewUrl} kitId={kit.id} />

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
            onClick={() => handleFormatClick('wav')}
          >
            WAV
            {wavSavings > 0 && selectedFormat === 'wav' && (
              <span className="ml-1 text-green-400">(-${wavSavings.toFixed(0)})</span>
            )}
          </Badge>
          {hasStems && (
            <Badge 
              variant={selectedFormat === 'stems' ? 'default' : 'outline'}
              className={cn(
                "cursor-pointer text-xs px-2 py-0",
                selectedFormat === 'stems' ? 'bg-primary' : 'hover:bg-primary/20'
              )}
              onClick={() => handleFormatClick('stems')}
            >
              WAV + Stems
              {stemsSavings > 0 && selectedFormat === 'stems' && (
                <span className="ml-1 text-green-400">(-${stemsSavings.toFixed(0)})</span>
              )}
            </Badge>
          )}
        </div>
      </div>

      <div className="text-right">
        <span className="font-semibold text-sm whitespace-nowrap">
          ${currentPrice.toFixed(2)}
        </span>
        {currentSavings > 0 && (
          <p className="text-xs text-green-500">Save ${currentSavings.toFixed(0)}</p>
        )}
      </div>
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

  // Find kit from local data - redirect bundle to external URL
  const kit = handle ? findKitByHandle(handle) : undefined;
  
  // Redirect All Kits Bundle to external URL
  useEffect(() => {
    if (kit?.id === 'all-kits-bundle-2025') {
      window.location.href = 'https://my.flowlance.com/samplesociety';
    }
  }, [kit?.id]);

  // Initialize bundle items - current product first, then others
  useEffect(() => {
    if (kit && kit.id !== 'all-kits-bundle-2025') {
      const otherKits = sampleKits
        .filter(k => k.id !== kit.id && k.category === 'sample-kit' && k.id !== 'all-kits-bundle-2025')
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

  const { hasSignupDiscount } = useDiscountStore();

  // Calculate bundle total
  const selectedBundleItems = bundleItems.filter(item => item.selected);
  
  const bundleSubtotal = bundleItems
    .filter(item => item.selected)
    .reduce((total, item) => {
      const price = item.format === 'stems' && item.kit.stemsPrice 
        ? item.kit.stemsPrice 
        : item.kit.wavPrice;
      return total + price;
    }, 0);

  // 5% off for each extra kit (beyond the first one) + 10% if signed up
  const extraKitsCount = Math.max(0, selectedBundleItems.length - 1);
  const bundleKitDiscountPercent = extraKitsCount * 5;
  const signupDiscountPercent = hasSignupDiscount ? 10 : 0;
  const bundleDiscountPercent = bundleKitDiscountPercent + signupDiscountPercent;
  const bundleDiscountAmount = bundleSubtotal * (bundleDiscountPercent / 100);
  const bundleTotal = bundleSubtotal - bundleDiscountAmount;

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

        <div className="grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-12">
          {/* Left Column - Product Image (smaller, centered) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start justify-center lg:sticky lg:top-24"
          >
            <div className="w-full max-w-[400px] aspect-square overflow-hidden rounded-xl border border-border bg-card">
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
            <span className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {kit.category === 'sample-kit' ? 'Sample Kit' : kit.category === 'midi-kit' ? 'MIDI Kit' : 'Drum Kit'}
            </span>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{kit.title}</h1>

            {/* Price with Sale Badge */}
            <div className="flex items-center gap-3 mb-6">
              {isOnSale && (
                <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5">SALE</Badge>
              )}
              <span className="text-2xl font-bold text-primary">${currentPrice.toFixed(2)}</span>
              {isOnSale && kit.compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through">${kit.compareAtPrice.toFixed(2)}</span>
              )}
            </div>

            {/* Audio Waveform Player */}
            <div className="mb-6">
              <WaveformPlayer audioUrl={kit.audioPreviewUrl} title={kit.title} />
            </div>

            {/* Description Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {kit.description}
              </p>
            </div>

            {/* Format Selector */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-3">Format</h3>
              <div className="flex gap-2">
                <Badge 
                  variant={selectedFormat === 'wav' ? 'default' : 'outline'}
                  className={cn(
                    "cursor-pointer text-sm px-4 py-1.5",
                    selectedFormat === 'wav' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/20'
                  )}
                  onClick={() => setSelectedFormat('wav')}
                >
                  WAV
                </Badge>
                {kit.stemsHandle && (
                  <Badge 
                    variant={selectedFormat === 'stems' ? 'default' : 'outline'}
                    className={cn(
                      "cursor-pointer text-sm px-4 py-1.5",
                      selectedFormat === 'stems' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/20'
                    )}
                    onClick={() => setSelectedFormat('stems')}
                  >
                    WAV + Stems
                  </Badge>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 mb-8"
              onClick={handleAddToCart}
              disabled={cartLoading}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>

            {/* Create Your Own Bundle Section */}
            <section>
              <h2 className="text-lg font-bold mb-4">Create Your Own Bundle</h2>

              {/* Bundle Preview Thumbnails with + signs */}
              <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
                {selectedBundleItems.map((item, index) => (
                  <div key={item.kit.id} className="flex items-center">
                    <div className="w-12 h-12 rounded overflow-hidden border border-border flex-shrink-0">
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
                  {bundleKitDiscountPercent > 0 ? (
                    <>
                      <span className="text-xs text-muted-foreground line-through">${bundleSubtotal.toFixed(2)}</span>
                      <p className="text-xl font-bold text-primary">${bundleTotal.toFixed(2)}</p>
                      <span className="text-xs text-green-500 font-medium">
                        {bundleKitDiscountPercent}% off (-${(bundleSubtotal * bundleKitDiscountPercent / 100).toFixed(2)})
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-muted-foreground">Total</span>
                      <p className="text-xl font-bold text-primary">${bundleTotal.toFixed(2)}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Add Bundle to Cart */}
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

            {/* License Info */}
            <p className="mt-8 text-xs text-muted-foreground">
              By purchasing, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:underline">
                Master Use License Agreement
              </Link>
            </p>
          </motion.div>
        </div>

      </div>
    </Layout>
  );
}
