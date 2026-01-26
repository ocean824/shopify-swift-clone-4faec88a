import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/home/Hero';
import { ProductGrid } from '@/components/products/ProductGrid';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { BundleCTA } from '@/components/home/BundleCTA';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';

const Index = () => {
  const { products, isLoading, error } = useShopifyProducts({ limit: 20 });

  return (
    <Layout>
      <Hero />
      
      <FeaturedCategories />
      
      <section className="container mx-auto px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold uppercase tracking-tight">Latest Releases</h2>
          <p className="mt-2 text-muted-foreground">
            Check out our newest sample packs and MIDI kits
          </p>
        </div>
        
        {error ? (
          <div className="py-16 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <ProductGrid products={products} isLoading={isLoading} />
        )}
      </section>

      <BundleCTA />
    </Layout>
  );
};

export default Index;