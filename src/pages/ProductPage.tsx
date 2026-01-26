import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cartStore';

// Sample product data - will come from Shopify when connected
const sampleProduct = {
  id: '1',
  handle: 'sample-kit-1',
  title: 'Premium Sample Kit Vol. 1',
  description: 'A comprehensive collection of high-quality samples perfect for modern music production. This kit includes 100+ sounds ranging from crisp drums to atmospheric textures, all meticulously crafted to inspire your next hit.',
  productType: 'Sample Kit',
  price: 24.99,
  compareAtPrice: 29.99,
  images: [
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800&fit=crop',
  ],
  variantId: 'variant-1',
  features: [
    '100+ Premium Samples',
    'Royalty-Free License',
    '24-bit WAV Quality',
    'Instant Download',
    'Compatible with all DAWs',
  ],
};

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCartStore();

  // TODO: Fetch product by handle from Shopify
  const product = sampleProduct;

  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const salePercentage = isOnSale
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        variantId: product.variantId,
        productId: product.id,
        title: product.title,
        variantTitle: 'Default Title',
        price: product.price,
        compareAtPrice: product.compareAtPrice || null,
        image: product.images[0] || null,
        handle: product.handle,
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square overflow-hidden rounded-xl bg-muted"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </motion.div>
            
            {product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-muted-foreground/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              {product.productType && (
                <Badge variant="secondary">{product.productType}</Badge>
              )}
              {isOnSale && (
                <Badge variant="destructive">{salePercentage}% OFF</Badge>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-bold md:text-4xl">{product.title}</h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {isOnSale && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>

            <p className="mt-6 text-muted-foreground">{product.description}</p>

            {/* Features */}
            {product.features && (
              <ul className="mt-6 space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-primary">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            {/* Quantity & Add to Cart */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <div className="flex items-center rounded-lg border border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
