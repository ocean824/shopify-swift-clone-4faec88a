import { create } from 'zustand';

export interface BundleProduct {
  id: string;
  variantId: string;
  handle: string;
  title: string;
  price: number;
  image: string | null;
  productType?: string;
}

interface BundleState {
  selectedProducts: BundleProduct[];
  
  // Actions
  addProduct: (product: BundleProduct) => void;
  removeProduct: (productId: string) => void;
  clearBundle: () => void;
  isSelected: (productId: string) => boolean;
  
  // Computed
  bundleSize: () => number;
  discountPercentage: () => number;
  originalTotal: () => number;
  discountedTotal: () => number;
  savings: () => number;
}

export const useBundleStore = create<BundleState>()((set, get) => ({
  selectedProducts: [],

  addProduct: (product) => {
    const currentSize = get().selectedProducts.length;
    if (currentSize >= 5) return; // Max 5 products
    
    set((state) => ({
      selectedProducts: [...state.selectedProducts, product],
    }));
  },

  removeProduct: (productId) => {
    set((state) => ({
      selectedProducts: state.selectedProducts.filter((p) => p.id !== productId),
    }));
  },

  clearBundle: () => set({ selectedProducts: [] }),

  isSelected: (productId) => {
    return get().selectedProducts.some((p) => p.id === productId);
  },

  bundleSize: () => get().selectedProducts.length,

  discountPercentage: () => {
    const size = get().selectedProducts.length;
    if (size >= 5) return 40;
    if (size >= 3) return 25;
    return 0;
  },

  originalTotal: () => {
    return get().selectedProducts.reduce((total, p) => total + p.price, 0);
  },

  discountedTotal: () => {
    const original = get().originalTotal();
    const discount = get().discountPercentage();
    return original * (1 - discount / 100);
  },

  savings: () => {
    return get().originalTotal() - get().discountedTotal();
  },
}));