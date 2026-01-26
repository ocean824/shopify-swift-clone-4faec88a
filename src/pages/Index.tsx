import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';

const Index = () => {
  // Get all products, then filter on client side
  const { products, isLoading, error } = useShopifyProducts({ limit: 50 });

  // Filter to show only sample kits (Samplesociety vendor, not Printify merch)
  const sampleKits = useMemo(() => {
    return products.filter(p => 
      p.node.vendor?.toLowerCase() === 'samplesociety' ||
      p.node.vendor?.toLowerCase() === 'sample society'
    );
  }, [products]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-tight md:text-5xl lg:text-6xl">
            SAMPLE SOCIETY
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Premium sample packs, MIDI kits, and production resources for the modern music producer. 
            100% royalty-free.
          </p>
        </div>
      </section>
      
      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold uppercase tracking-tight">Sample Kits</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse our collection of premium sample packs
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
          <ProductGrid products={sampleKits} isLoading={isLoading} />
        )}
      </section>
    </Layout>
  );
};

export default Index;