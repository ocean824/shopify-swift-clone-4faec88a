import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/home/Hero';
import { ProductGrid } from '@/components/products/ProductGrid';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { BundleCTA } from '@/components/home/BundleCTA';

// Sample products for demo - these will come from Shopify when connected
const sampleProducts = [
  {
    id: '1',
    handle: 'sample-kit-1',
    title: 'Premium Sample Kit Vol. 1',
    productType: 'Sample Pack',
    price: 24.99,
    compareAtPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&h=500&fit=crop',
    variantId: 'variant-1',
  },
  {
    id: '2',
    handle: 'midi-pack-1',
    title: 'MIDI Melodies Pack',
    productType: 'MIDI Kit',
    price: 19.99,
    compareAtPrice: 24.99,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop',
    variantId: 'variant-2',
  },
  {
    id: '3',
    handle: 'loop-collection',
    title: 'Ambient Loop Collection',
    productType: 'Loop Kit',
    price: 29.99,
    compareAtPrice: null,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
    variantId: 'variant-3',
  },
  {
    id: '4',
    handle: 'drum-kit-1',
    title: 'Hard Hitting Drums Vol. 1',
    productType: 'Drum Kit',
    price: 14.99,
    compareAtPrice: 19.99,
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=500&h=500&fit=crop',
    variantId: 'variant-4',
  },
  {
    id: '5',
    handle: 'sample-kit-2',
    title: 'Lo-Fi Dreams Sample Pack',
    productType: 'Sample Pack',
    price: 24.99,
    compareAtPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
    variantId: 'variant-5',
  },
  {
    id: '6',
    handle: 'preset-pack',
    title: 'Synth Preset Collection',
    productType: 'Preset Pack',
    price: 39.99,
    compareAtPrice: null,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    variantId: 'variant-6',
  },
  {
    id: '7',
    handle: 'vocal-samples',
    title: 'Vocal Chops & Phrases',
    productType: 'Vocal Kit',
    price: 19.99,
    compareAtPrice: 24.99,
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&h=500&fit=crop',
    variantId: 'variant-7',
  },
  {
    id: '8',
    handle: 'bass-collection',
    title: '808 Bass Collection',
    productType: 'Drum Kit',
    price: 12.99,
    compareAtPrice: null,
    image: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=500&h=500&fit=crop',
    variantId: 'variant-8',
  },
];

const Index = () => {
  const products = sampleProducts;
  const isLoading = false;

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
        
        <ProductGrid products={products} isLoading={isLoading} />
      </section>

      <BundleCTA />
    </Layout>
  );
};

export default Index;