import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: string;
  handle: string;
  title: string;
  productType?: string;
  price: number;
  compareAtPrice?: number | null;
  image?: string | null;
  variantId: string;
}

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
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

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
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
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
