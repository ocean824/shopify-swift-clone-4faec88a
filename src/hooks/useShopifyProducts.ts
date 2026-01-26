import { useState, useEffect } from 'react';
import { getProducts, ShopifyProduct } from '@/lib/shopify';

interface UseShopifyProductsOptions {
  limit?: number;
  query?: string;
}

export function useShopifyProducts(options: UseShopifyProductsOptions = {}) {
  const { limit = 20, query } = options;
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProducts(limit, query);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        console.error('Failed to fetch products:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [limit, query]);

  return { products, isLoading, error };
}