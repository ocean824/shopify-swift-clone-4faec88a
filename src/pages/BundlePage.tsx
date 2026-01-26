import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, X, Check, ShoppingCart, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { ShopifyProduct } from '@/lib/shopify';
import { cn } from '@/lib/utils';

interface BundleProduct extends ShopifyProduct {
  // Extended with selection state
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function BundlePage() {
  const { products, isLoading: productsLoading } = useShopifyProducts({ limit: 50 });
  const { addItem, openCart, isLoading: cartLoading } = useCartStore();
  
  const [selectedProducts, setSelectedProducts] = useState<ShopifyProduct[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const currentSize = selectedProducts.length;
  const canAddMore = currentSize < 5;

  const getDiscountPercentage = (size: number) => {
    if (size >= 5) return 40;
    if (size >= 3) return 25;
    return 0;
  };

  const discount = getDiscountPercentage(currentSize);

  const originalTotal = selectedProducts.reduce((total, p) => {
    const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
    return total + price;
  }, 0);

  const discountedTotal = originalTotal * (1 - discount / 100);
  const savings = originalTotal - discountedTotal;

  const isSelected = (productId: string) => 
    selectedProducts.some((p) => p.node.id === productId);

  const handleToggleProduct = (product: ShopifyProduct) => {
    if (isSelected(product.node.id)) {
      setSelectedProducts((prev) => prev.filter((p) => p.node.id !== product.node.id));
    } else if (canAddMore) {
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.node.id !== productId));
  };

  const handleAddBundleToCart = async () => {
    if (currentSize < 3) return;
    
    setIsAddingToCart(true);
    
    const discountMultiplier = 1 - discount / 100;
    
    for (const product of selectedProducts) {
      const variant = product.node.variants?.edges?.[0]?.node;
      if (!variant) continue;
      
      const originalPrice = parseFloat(variant.price.amount);
      const discountedPrice = originalPrice * discountMultiplier;
      
      await addItem({
        product,
        variantId: variant.id,
        variantTitle: `Bundle (${discount}% OFF)`,
        price: {
          amount: discountedPrice.toFixed(2),
          currencyCode: variant.price.currencyCode,
        },
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
      });
    }
    
    setSelectedProducts([]);
    setIsAddingToCart(false);
    openCart();
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
            {productsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {products.map((product) => {
                  const selected = isSelected(product.node.id);
                  const disabled = !selected && !canAddMore;
                  const image = product.node.images?.edges?.[0]?.node;
                  const price = parseFloat(product.node.priceRange.minVariantPrice.amount);

                  return (
                    <motion.div
                      key={product.node.id}
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
                        {image ? (
                          <img
                            src={image.url}
                            alt={image.altText || product.node.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <span className="text-4xl text-muted-foreground/30">📦</span>
                          </div>
                        )}
                        
                        {selected && (
                          <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-5 w-5" />
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        {product.node.productType && (
                          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {product.node.productType}
                          </span>
                        )}
                        <h3 className="mt-1 font-semibold text-foreground line-clamp-2 text-sm">
                          {product.node.title}
                        </h3>
                        <p className="mt-2 text-lg font-bold text-foreground">
                          {formatPrice(price)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
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
                    selectedProducts.map((product) => {
                      const image = product.node.images?.edges?.[0]?.node;
                      const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
                      
                      return (
                        <motion.div
                          key={product.node.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-3"
                        >
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                            {image && (
                              <img
                                src={image.url}
                                alt={product.node.title}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{product.node.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(price)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveProduct(product.node.id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>

              {currentSize > 0 && (
                <>
                  <div className="my-6 border-t border-border" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="line-through">{formatPrice(originalTotal)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-primary">Bundle Discount ({discount}%)</span>
                        <span className="text-primary">-{formatPrice(savings)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(discountedTotal)}</span>
                    </div>
                  </div>

                  <Button
                    className="mt-6 w-full gap-2"
                    size="lg"
                    disabled={currentSize < 3 || isAddingToCart || cartLoading}
                    onClick={handleAddBundleToCart}
                  >
                    {isAddingToCart || cartLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
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