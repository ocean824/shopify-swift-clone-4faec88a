import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { ShoppingCart, Loader2, Package } from 'lucide-react';
import { ShopifyProduct } from '@/lib/shopify';
import { useMemo } from 'react';

export default function AllKitsBundlePage() {
  const { products, isLoading, error } = useShopifyProducts({ limit: 50 });

  const { addItem, isLoading: cartLoading, openCart } = useCartStore();

  // Filter for bundle products
  const bundles = useMemo(() => {
    return products.filter(p => 
      p.node.title.toLowerCase().includes('bundle')
    );
  }, [products]);

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = product.node.variants?.edges?.[0]?.node;
    if (!variant) return;

    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    openCart();
  };

  // Find the All Kits Bundle product
  const allKitsBundle = bundles.find(p => 
    p.node.title.toLowerCase().includes('all kits')
  );

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">
            All Kits Bundle 2025
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Get access to all of our sample kits, MIDI packs, and drum kits in one massive bundle. 
            Save big and unlock your full production potential.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : allKitsBundle ? (
          <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-8 text-center">
            <div className="aspect-square w-full max-w-md mx-auto overflow-hidden rounded-lg mb-6">
              {allKitsBundle.node.images?.edges?.[0]?.node && (
                <img
                  src={allKitsBundle.node.images.edges[0].node.url}
                  alt={allKitsBundle.node.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <h2 className="text-2xl font-bold">{allKitsBundle.node.title}</h2>
            <p className="mt-2 text-muted-foreground">{allKitsBundle.node.description}</p>
            <p className="mt-4 text-3xl font-bold text-primary">
              ${parseFloat(allKitsBundle.node.priceRange.minVariantPrice.amount).toFixed(2)}
            </p>
            <Button 
              size="lg" 
              className="mt-6 gap-2"
              onClick={() => handleAddToCart(allKitsBundle)}
              disabled={cartLoading}
            >
              {cartLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        ) : bundles.length > 0 ? (
          <ProductGrid products={bundles} isLoading={isLoading} />
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No bundles found</p>
          </div>
        )}

        {/* Show other bundles if any */}
        {bundles.length > 1 && allKitsBundle && (
          <div className="mt-16">
            <h3 className="mb-6 text-xl font-bold uppercase">Other Bundles</h3>
            <ProductGrid 
              products={bundles.filter(p => p.node.id !== allKitsBundle?.node.id)} 
              isLoading={isLoading} 
            />
          </div>
        )}
      </section>
    </Layout>
  );
}