import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingCart, Minus, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cartStore';
import { getProductByHandle, ShopifyProductNode } from '@/lib/shopify';

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProductNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const { addItem, isLoading: cartLoading } = useCartStore();

  useEffect(() => {
    async function fetchProduct() {
      if (!handle) return;
      setIsLoading(true);
      try {
        const data = await getProductByHandle(handle);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [handle]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  const images = product.images?.edges?.map((e) => e.node) || [];
  const variants = product.variants?.edges?.map((e) => e.node) || [];
  const selectedVariant = variants[selectedVariantIndex] || variants[0];
  
  const price = selectedVariant ? parseFloat(selectedVariant.price.amount) : 0;
  const compareAtPrice = selectedVariant?.compareAtPrice 
    ? parseFloat(selectedVariant.compareAtPrice.amount) 
    : 0;
  
  const isOnSale = compareAtPrice > 0 && compareAtPrice > price;
  const salePercentage = isOnSale
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedVariant?.price.currencyCode || 'USD',
    }).format(amount);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    for (let i = 0; i < quantity; i++) {
      await addItem({
        product: { node: product },
        variantId: selectedVariant.id,
        variantTitle: selectedVariant.title,
        price: selectedVariant.price,
        quantity: 1,
        selectedOptions: selectedVariant.selectedOptions || [],
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
              className="aspect-square overflow-hidden rounded-xl bg-card border border-border"
            >
              {images[selectedImage] ? (
                <img
                  src={images[selectedImage].url}
                  alt={images[selectedImage].altText || product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <span className="text-6xl text-muted-foreground/30">📦</span>
                </div>
              )}
            </motion.div>
            
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-muted-foreground/50'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || `${product.title} ${index + 1}`}
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
              <span className="text-3xl font-bold">{formatPrice(price)}</span>
              {isOnSale && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              )}
            </div>

            <p className="mt-6 text-muted-foreground">{product.description}</p>

            {/* Variant Selection */}
            {variants.length > 1 && (
              <div className="mt-6 space-y-4">
                {product.options?.map((option) => (
                  <div key={option.name}>
                    <label className="text-sm font-medium">{option.name}</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {option.values.map((value) => {
                        const variantIndex = variants.findIndex((v) =>
                          v.selectedOptions?.some(
                            (o) => o.name === option.name && o.value === value
                          )
                        );
                        const isSelected = selectedVariantIndex === variantIndex;
                        
                        return (
                          <Button
                            key={value}
                            variant={isSelected ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedVariantIndex(variantIndex)}
                          >
                            {value}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
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
                disabled={cartLoading || !selectedVariant?.availableForSale}
              >
                {cartLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : !selectedVariant?.availableForSale ? (
                  'Sold Out'
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}