import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ShopifyProduct } from '@/lib/shopify';

interface ProductGridProps {
  products: ShopifyProduct[];
  isLoading?: boolean;
  selectable?: boolean;
  selectedIds?: string[];
  onSelect?: (product: ShopifyProduct) => void;
}

function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
}

export function ProductGrid({ 
  products, 
  isLoading = false,
  selectable = false,
  selectedIds = [],
  onSelect,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-6xl">🔍</span>
        <h3 className="mt-4 text-xl font-semibold">No products found</h3>
        <p className="mt-2 text-muted-foreground">
          Check back soon for new releases!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.node.id}
          product={product}
          selectable={selectable}
          selected={selectedIds.includes(product.node.id)}
          onSelect={() => onSelect?.(product)}
        />
      ))}
    </div>
  );
}