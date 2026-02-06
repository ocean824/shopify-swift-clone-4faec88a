import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';

const ARTISTS: Record<string, { name: string; displayName: string; bio: string }> = {
  'ocean': {
    name: 'ØCEAN',
    displayName: 'ØCEAN',
    bio: 'Producer and sound designer crafting unique sonic landscapes.',
  },
  'niko-the-great': {
    name: 'NIKO THE GREAT',
    displayName: 'NIKO THE GREAT',
    bio: 'Beatmaker known for hard-hitting drums and melodic compositions.',
  },
  'vzn': {
    name: 'VZN',
    displayName: 'VZN',
    bio: 'Visionary producer pushing the boundaries of modern production.',
  },
};

const ArtistPage = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const artist = artistId ? ARTISTS[artistId] : null;
  const { products, isLoading } = useShopifyProducts();

  if (!artist) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Artist not found</h1>
          <Button asChild className="mt-4">
            <Link to="/society">Back to Society</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Filter products by artist name in vendor or title
  const artistProducts = products.filter(product => {
    const vendor = product.node.vendor?.toLowerCase() || '';
    const title = product.node.title?.toLowerCase() || '';
    const artistNameLower = artist.name.toLowerCase().replace('ø', 'o');
    return vendor.includes(artistNameLower) || title.includes(artistNameLower);
  });

  return (
    <Layout>
      <BeamsBackground />
      <section className="relative z-10 container mx-auto px-4 py-16">
        <Link to="/society" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Society
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Artist Logo Placeholder */}
          <div className="mx-auto w-32 h-32 bg-card border border-border rounded-xl flex items-center justify-center mb-6">
            <span className="text-3xl font-bold text-primary">{artist.displayName.charAt(0)}</span>
          </div>
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-4">{artist.displayName}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{artist.bio}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold uppercase tracking-tight mb-8 text-center">Kits by {artist.displayName}</h2>
          
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading kits...</div>
          ) : artistProducts.length > 0 ? (
            <ProductGrid products={artistProducts} />
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <p>No kits found for this artist yet.</p>
              <p className="text-sm mt-2">Check back soon for new releases!</p>
            </div>
          )}
        </motion.div>
      </section>
    </Layout>
  );
};

export default ArtistPage;
