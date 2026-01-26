import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cartStore';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  handle: string;
  title: string;
  productType?: string;
  price: number;
  compareAtPrice?: number | null;
  image?: string | null;
  variantId: string;
}

export function ProductCard({
  id,
  handle,
  title,
  productType,
  price,
  compareAtPrice,
  image,
  variantId,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const isOnSale = compareAtPrice && compareAtPrice > price;
  const salePercentage = isOnSale
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id,
      variantId,
      productId: id,
      title,
      variantTitle: 'Default Title',
      price,
      compareAtPrice: compareAtPrice || null,
      image: image || null,
      handle,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link to={`/product/${handle}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-4xl text-muted-foreground/30">📦</span>
            </div>
          )}

          {/* Sale Badge */}
          {isOnSale && (
            <Badge
              variant="destructive"
              className="absolute left-3 top-3"
            >
              {salePercentage}% OFF
            </Badge>
          )}

          {/* Quick Add Button */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Button
              className="w-full gap-2"
              size="sm"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          {productType && (
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {productType}
            </p>
          )}
          <h3 className="font-semibold text-foreground line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(price)}
            </span>
            {isOnSale && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
