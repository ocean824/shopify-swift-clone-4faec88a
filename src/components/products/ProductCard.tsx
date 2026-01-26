import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cartStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  handle: string;
  title: string;
  productType?: string;
  price: number;
  compareAtPrice?: number | null;
  image?: string | null;
  variantId: string;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
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
  selectable = false,
  selected = false,
  onSelect,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
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
    
    setIsAdding(true);
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
    
    setTimeout(() => setIsAdding(false), 1500);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (selectable && onSelect) {
      e.preventDefault();
      onSelect();
    }
  };

  const CardWrapper = selectable ? 'div' : Link;
  const cardProps = selectable 
    ? { onClick: handleClick, className: "block cursor-pointer" }
    : { to: `/product/${handle}`, className: "block" };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <CardWrapper {...cardProps as any}>
        <div className={cn(
          "relative aspect-square overflow-hidden rounded-lg bg-card border transition-all duration-200",
          selected ? "border-primary ring-2 ring-primary/50" : "border-border",
          selectable && "hover:border-primary/50"
        )}>
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-4xl text-muted-foreground/30">📦</span>
            </div>
          )}

          {/* Selection Indicator */}
          {selectable && selected && (
            <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-5 w-5" />
            </div>
          )}

          {/* Sale Badge */}
          {isOnSale && !selectable && (
            <Badge
              variant="destructive"
              className="absolute left-3 top-3"
            >
              {salePercentage}% OFF
            </Badge>
          )}

          {/* Quick Add Button - Only show when not in selectable mode */}
          {!selectable && (
            <div className="absolute bottom-3 left-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Button
                className={cn("w-full gap-2", isAdding && "bg-brand-success")}
                size="sm"
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <Check className="h-4 w-4" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          )}
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
      </CardWrapper>
    </motion.div>
  );
}