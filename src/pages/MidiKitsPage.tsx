import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';

export default function MidiKitsPage() {
  const { products, isLoading, error } = useShopifyProducts({ limit: 50 });

  // Filter for MIDI-related products
  const midiKits = useMemo(() => {
    return products.filter(p => {
      const title = p.node.title.toLowerCase();
      return title.includes('midi') || title.includes('haze');
    });
  }, [products]);

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-tight">MIDI Kits</h1>
          <p className="mt-2 text-muted-foreground">
            Melody and chord progressions to inspire your next hit
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
          <ProductGrid products={midiKits} isLoading={isLoading} />
        )}
      </section>
    </Layout>
  );
}