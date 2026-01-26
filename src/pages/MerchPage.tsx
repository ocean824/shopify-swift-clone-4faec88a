import { Layout } from '@/components/layout/Layout';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { Loader2, ShoppingCart, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cartStore';
import { cn } from '@/lib/utils';
import { ShopifyProduct } from '@/lib/shopify';
import { ThundercloudBackground } from '@/components/effects/ThundercloudBackground';

function MerchProductCard({ product }: { product: ShopifyProduct }) {
  const { addItem, isLoading: cartLoading } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  
  const { node } = product;
  const image = node.images?.edges?.[0]?.node;
  const variant = node.variants?.edges?.[0]?.node;
  const price = parseFloat(node.priceRange.minVariantPrice.amount);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: node.priceRange.minVariantPrice.currencyCode || 'USD',
    }).format(amount);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!variant) return;
    
    setIsAdding(true);
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    
    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/product/${node.handle}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-card border border-border transition-all duration-200 hover:border-primary/50">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || node.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-4xl text-muted-foreground/30">👕</span>
            </div>
          )}

          {/* Quick Add Button */}
          {variant && (
            <div className="absolute bottom-3 left-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Button
                className={cn("w-full gap-2", isAdding && "bg-brand-success")}
                size="sm"
                onClick={handleAddToCart}
                disabled={isAdding || cartLoading || !variant.availableForSale}
              >
                {isAdding ? (
                  <>
                    <Check className="h-4 w-4" />
                    Added!
                  </>
                ) : !variant.availableForSale ? (
                  'Sold Out'
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {node.productType && (
            <Badge variant="secondary" className="text-xs font-medium uppercase tracking-wider">
              {node.productType}
            </Badge>
          )}
          <h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
            {node.title}
          </h3>
          <p className="text-lg font-bold text-foreground">
            {formatPrice(price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function MerchPage() {
  const { products, isLoading, error } = useShopifyProducts({ limit: 50 });

  const merchProducts = useMemo(() => {
    return products.filter(p => 
      p.node.vendor?.toLowerCase() === 'printify'
    );
  }, [products]);

  return (
    <Layout>
      <ThundercloudBackground />
      
      {/* Hero Banner */}
      <section className="relative z-10 bg-gradient-to-b from-primary/10 to-transparent py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-tight md:text-5xl">
            Official Merch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Rep Sample Society with our exclusive merchandise collection
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative z-10 container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : merchProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-6xl">👕</span>
            <h3 className="mt-4 text-xl font-semibold">No merch available</h3>
            <p className="mt-2 text-muted-foreground">
              Check back soon for new drops!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
            {merchProducts.map((product) => (
              <MerchProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
