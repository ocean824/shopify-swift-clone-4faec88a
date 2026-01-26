import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { Loader2, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Index = () => {
  // Get all products, then filter on client side
  const { products, isLoading, error } = useShopifyProducts({ limit: 50 });

  // Filter to show only sample kits (exclude Printify merch products)
  const sampleKits = useMemo(() => {
    return products.filter(p => 
      p.node.vendor?.toLowerCase() !== 'printify'
    );
  }, [products]);

  // Check if only Printify products were returned (sample kits not published to Online Store)
  const onlyMerchProducts = products.length > 0 && sampleKits.length === 0;

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
        ) : onlyMerchProducts ? (
          <div className="space-y-6">
            <Alert variant="default" className="border-primary/50 bg-primary/5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Sample Kits Not Visible</AlertTitle>
              <AlertDescription>
                Your sample kit products need to be published to the "Online Store" sales channel in Shopify Admin. 
                Go to Products → Select your sample kits → Click "Manage" under Sales channels → Enable "Online Store".
              </AlertDescription>
            </Alert>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-6xl">🎵</span>
              <h3 className="mt-4 text-xl font-semibold">Sample kits coming soon!</h3>
              <p className="mt-2 text-muted-foreground">
                Check out our merch while you wait, or visit the main site at sample-society.com
              </p>
            </div>
          </div>
        ) : (
          <ProductGrid products={sampleKits} isLoading={isLoading} />
        )}
      </section>
    </Layout>
  );
};

export default Index;
