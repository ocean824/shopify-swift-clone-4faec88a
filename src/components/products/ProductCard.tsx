import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cartStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ShopifyProduct, formatPrice as shopifyFormatPrice } from '@/lib/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

export function ProductCard({
  product,
  selectable = false,
  selected = false,
  onSelect,
}: ProductCardProps) {
  const { addItem, isLoading: cartLoading } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  
  const { node } = product;
  const image = node.images?.edges?.[0]?.node;
  const variant = node.variants?.edges?.[0]?.node;
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const compareAtPrice = node.compareAtPriceRange?.minVariantPrice 
    ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount) 
    : 0;
  
  const isOnSale = compareAtPrice > 0 && compareAtPrice > price;
  const salePercentage = isOnSale
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: node.priceRange.minVariantPrice.currencyCode || 'USD',
    }).format(amount);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!variant) return;
    
    setIsAdding(true);
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
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
    : { to: `/product/${node.handle}`, className: "block" };

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
              src={image.url}
              alt={image.altText || node.title}
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
          {!selectable && variant && (
            <div className="absolute bottom-3 left-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Button
                className={cn("w-full gap-2", isAdding && "bg-brand-success")}
                size="sm"
                onClick={handleAddToCart}
                disabled={isAdding || cartLoading || !variant.availableForSale}
              >
                {isAdding ? (
                  <>
                    <Check className="h-4 w-4" />
                    Added!
                  </>
                ) : !variant.availableForSale ? (
                  'Sold Out'
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
          {node.productType && (
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {node.productType}
            </p>
          )}
          <h3 className="font-semibold text-foreground line-clamp-2">
            {node.title}
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