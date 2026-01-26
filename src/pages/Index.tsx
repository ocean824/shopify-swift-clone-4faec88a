import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/home/Hero';
import { ProductGrid } from '@/components/products/ProductGrid';

// Sample products for demo - these will come from Shopify when connected
const sampleProducts = [
  {
    id: '1',
    handle: 'sample-kit-1',
    title: 'Premium Sample Kit Vol. 1',
    productType: 'Sample Kit',
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
    productType: 'Sample Kit',
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
    productType: 'Bass Kit',
    price: 12.99,
    compareAtPrice: null,
    image: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=500&h=500&fit=crop',
    variantId: 'variant-8',
  },
];

const Index = () => {
  const [products, setProducts] = useState(sampleProducts);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Replace with actual Shopify product fetch when connected
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setIsLoading(true);
  //     try {
  //       const data = await getProducts();
  //       setProducts(data.map(p => ({
  //         id: p.id,
  //         handle: p.handle,
  //         title: p.title,
  //         productType: p.productType,
  //         price: parseFloat(p.priceRange.minVariantPrice.amount),
  //         compareAtPrice: parseFloat(p.compareAtPriceRange.minVariantPrice.amount) || null,
  //         image: p.featuredImage?.url || null,
  //         variantId: p.variants.edges[0]?.node.id || '',
  //       })));
  //     } catch (error) {
  //       console.error('Failed to fetch products:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchProducts();
  // }, []);

  return (
    <Layout>
      <Hero />
      
      <section className="container mx-auto px-4 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight">All Products</h2>
          <p className="mt-2 text-muted-foreground">
            Browse our complete collection of premium digital products
          </p>
        </div>
        
        <ProductGrid products={products} isLoading={isLoading} />
      </section>
    </Layout>
  );
};

export default Index;
