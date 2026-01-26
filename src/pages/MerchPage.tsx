import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';

export default function MerchPage() {
  // Get all products, then filter for merch (Printify)
  const { products, isLoading, error } = useShopifyProducts({ limit: 50 });

  const merchProducts = useMemo(() => {
    return products.filter(p => 
      p.node.vendor?.toLowerCase() === 'printify'
    );
  }, [products]);

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-tight">Merch</h1>
          <p className="mt-2 text-muted-foreground">
            Rep Sample Society with our exclusive merchandise
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
        ) : (
          <ProductGrid products={merchProducts} isLoading={isLoading} />
        )}
      </section>
    </Layout>
  );
}