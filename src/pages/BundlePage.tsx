import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ArrowRight, X, Check, ShoppingCart } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBundleStore } from '@/stores/bundleStore';
import { useCartStore } from '@/stores/cartStore';
import { cn } from '@/lib/utils';

// Sample products for the bundle builder
const bundleProducts = [
  {
    id: '1',
    handle: 'sample-kit-1',
    title: 'Premium Sample Kit Vol. 1',
    productType: 'Sample Pack',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&h=500&fit=crop',
    variantId: 'variant-1',
  },
  {
    id: '2',
    handle: 'midi-pack-1',
    title: 'MIDI Melodies Pack',
    productType: 'MIDI Kit',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop',
    variantId: 'variant-2',
  },
  {
    id: '3',
    handle: 'loop-collection',
    title: 'Ambient Loop Collection',
    productType: 'Loop Kit',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
    variantId: 'variant-3',
  },
  {
    id: '4',
    handle: 'drum-kit-1',
    title: 'Hard Hitting Drums Vol. 1',
    productType: 'Drum Kit',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=500&h=500&fit=crop',
    variantId: 'variant-4',
  },
  {
    id: '5',
    handle: 'sample-kit-2',
    title: 'Lo-Fi Dreams Sample Pack',
    productType: 'Sample Pack',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
    variantId: 'variant-5',
  },
  {
    id: '6',
    handle: 'preset-pack',
    title: 'Synth Preset Collection',
    productType: 'Preset Pack',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    variantId: 'variant-6',
  },
  {
    id: '7',
    handle: 'vocal-samples',
    title: 'Vocal Chops & Phrases',
    productType: 'Vocal Kit',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&h=500&fit=crop',
    variantId: 'variant-7',
  },
  {
    id: '8',
    handle: 'bass-collection',
    title: '808 Bass Collection',
    productType: 'Drum Kit',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=500&h=500&fit=crop',
    variantId: 'variant-8',
  },
  {
    id: '9',
    handle: 'trap-melodies',
    title: 'Trap Melodies Vol. 2',
    productType: 'MIDI Kit',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
    variantId: 'variant-9',
  },
  {
    id: '10',
    handle: 'fx-collection',
    title: 'FX & Transitions Pack',
    productType: 'Sample Pack',
    price: 17.99,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&h=500&fit=crop',
    variantId: 'variant-10',
  },
];

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function BundlePage() {
  const {
    selectedProducts,
    addProduct,
    removeProduct,
    isSelected,
    bundleSize,
    discountPercentage,
    originalTotal,
    discountedTotal,
    savings,
    clearBundle,
  } = useBundleStore();
  
  const { addItem, openCart } = useCartStore();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const currentSize = bundleSize();
  const discount = discountPercentage();
  const canAddMore = currentSize < 5;

  const handleToggleProduct = (product: typeof bundleProducts[0]) => {
    if (isSelected(product.id)) {
      removeProduct(product.id);
    } else if (canAddMore) {
      addProduct({
        id: product.id,
        variantId: product.variantId,
        handle: product.handle,
        title: product.title,
        price: product.price,
        image: product.image,
        productType: product.productType,
      });
    }
  };

  const handleAddBundleToCart = () => {
    if (currentSize < 3) return;
    
    setIsAddingToCart(true);
    
    // Calculate the discounted price per item
    const discountMultiplier = 1 - discount / 100;
    
    selectedProducts.forEach((product) => {
      addItem({
        id: product.id,
        variantId: product.variantId,
        productId: product.id,
        title: product.title,
        variantTitle: `Bundle (${discount}% OFF)`,
        price: product.price * discountMultiplier,
        compareAtPrice: product.price,
        image: product.image,
        handle: product.handle,
      });
    });
    
    clearBundle();
    
    setTimeout(() => {
      setIsAddingToCart(false);
      openCart();
    }, 500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-tight md:text-4xl lg:text-5xl">
            Build Your Bundle
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Select 3-5 products to unlock exclusive bundle discounts. 
            Pick 3 for 25% off, or pick 5 for 40% off!
          </p>
        </div>

        {/* Bundle Progress */}
        <div className="mb-8 rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Progress indicators */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-all",
                    num <= currentSize
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted text-muted-foreground",
                    num === 3 && currentSize >= 3 && currentSize < 5 && "ring-2 ring-primary/50",
                    num === 5 && currentSize >= 5 && "ring-2 ring-primary/50"
                  )}
                >
                  {num <= currentSize ? <Check className="h-5 w-5" /> : num}
                </div>
              ))}
            </div>

            {/* Discount tiers */}
            <div className="flex gap-4">
              <div className={cn(
                "rounded-lg border px-4 py-2 text-center transition-all",
                currentSize >= 3 ? "border-primary bg-primary/10" : "border-border"
              )}>
                <span className="block text-xs font-medium uppercase text-muted-foreground">3 Products</span>
                <span className={cn(
                  "text-lg font-bold",
                  currentSize >= 3 ? "text-primary" : "text-foreground"
                )}>25% OFF</span>
              </div>
              <div className={cn(
                "rounded-lg border px-4 py-2 text-center transition-all",
                currentSize >= 5 ? "border-primary bg-primary/10" : "border-border"
              )}>
                <span className="block text-xs font-medium uppercase text-muted-foreground">5 Products</span>
                <span className={cn(
                  "text-lg font-bold",
                  currentSize >= 5 ? "text-primary" : "text-foreground"
                )}>40% OFF</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Product Grid */}
          <div className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {bundleProducts.map((product) => {
                const selected = isSelected(product.id);
                const disabled = !selected && !canAddMore;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    whileHover={{ scale: disabled ? 1 : 1.02 }}
                    className={cn(
                      "group cursor-pointer rounded-lg border bg-card transition-all",
                      selected ? "border-primary ring-2 ring-primary/50" : "border-border",
                      disabled && "cursor-not-allowed opacity-50"
                    )}
                    onClick={() => !disabled && handleToggleProduct(product)}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      
                      {selected && (
                        <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      {product.productType && (
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {product.productType}
                        </span>
                      )}
                      <h3 className="mt-1 font-semibold text-foreground line-clamp-2 text-sm">
                        {product.title}
                      </h3>
                      <p className="mt-2 text-lg font-bold text-foreground">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bundle Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-bold uppercase">Your Bundle</h2>
              
              <div className="mt-4 space-y-3">
                <AnimatePresence mode="popLayout">
                  {selectedProducts.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      Select products to start building your bundle
                    </p>
                  ) : (
                    selectedProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-3"
                      >
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{product.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {currentSize > 0 && (
                <>
                  <div className="my-6 border-t border-border" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="line-through">{formatPrice(originalTotal())}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-primary">Bundle Discount ({discount}%)</span>
                        <span className="text-primary">-{formatPrice(savings())}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(discountedTotal())}</span>
                    </div>
                  </div>

                  <Button
                    className="mt-6 w-full gap-2"
                    size="lg"
                    disabled={currentSize < 3 || isAddingToCart}
                    onClick={handleAddBundleToCart}
                  >
                    {isAddingToCart ? (
                      <>Adding...</>
                    ) : currentSize < 3 ? (
                      <>Select {3 - currentSize} more for 25% off</>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4" />
                        Add Bundle to Cart
                      </>
                    )}
                  </Button>

                  {currentSize >= 3 && currentSize < 5 && (
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      Add {5 - currentSize} more to unlock 40% off!
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}