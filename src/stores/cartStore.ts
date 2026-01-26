import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  storefrontApiRequest,
  formatCheckoutUrl,
  isCartNotFoundError,
  CART_QUERY,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_DISCOUNT_CODES_UPDATE_MUTATION,
  ShopifyProduct,
  ShopifyPrice,
} from '@/lib/shopify';
import { calculateBundleDiscount } from '@/data/sampleKits';

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: ShopifyPrice;
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface AppliedDiscount {
  code: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
  discountDisplay: string;
  grantsLifetime?: boolean;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isOpen: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  appliedDiscount: AppliedDiscount | null;
  discountError: string | null;
  
  // Actions
  addItem: (item: Omit<CartItem, 'lineId'>) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyDiscountCode: (code: string) => Promise<boolean>;
  removeDiscountCode: () => Promise<void>;
  
  // Computed
  totalItems: () => number;
  subtotal: () => number;
  bundleDiscount: () => number;
  discountedSubtotal: () => number;
  bundleDiscountPercent: () => number;
  finalTotal: () => number;
}

async function createShopifyCart(item: CartItem): Promise<{ 
  cartId: string; 
  checkoutUrl: string; 
  lineId: string; 
} | null> {
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] },
  });

  if (data?.data?.cartCreate?.userErrors?.length > 0) {
    console.error('Cart creation failed:', data.data.cartCreate.userErrors);
    return null;
  }

  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;

  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;

  return { 
    cartId: cart.id, 
    checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), 
    lineId 
  };
}

async function addLineToShopifyCart(
  cartId: string, 
  item: CartItem
): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
  });

  const userErrors = data?.data?.cartLinesAdd?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error('Add line failed:', userErrors);
    return { success: false };
  }

  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const newLine = lines.find(
    (l: { node: { id: string; merchandise: { id: string } } }) => 
      l.node.merchandise.id === item.variantId
  );
  return { success: true, lineId: newLine?.node?.id };
}

async function updateShopifyCartLine(
  cartId: string, 
  lineId: string, 
  quantity: number
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  const userErrors = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error('Update line failed:', userErrors);
    return { success: false };
  }
  return { success: true };
}

async function removeLineFromShopifyCart(
  cartId: string, 
  lineId: string
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });

  const userErrors = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error('Remove line failed:', userErrors);
    return { success: false };
  }
  return { success: true };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isOpen: false,
      isLoading: false,
      isSyncing: false,
      appliedDiscount: null,
      discountError: null,

      addItem: async (item) => {
        const { items, cartId, clearCart } = get();
        const existingItem = items.find((i) => i.variantId === item.variantId);

        set({ isLoading: true });
        try {
          if (!cartId) {
            const result = await createShopifyCart({ ...item, lineId: null });
            if (result) {
              set({
                cartId: result.cartId,
                checkoutUrl: result.checkoutUrl,
                items: [{ ...item, lineId: result.lineId }],
                isOpen: true,
              });
            }
          } else if (existingItem) {
            const newQuantity = existingItem.quantity + item.quantity;
            if (!existingItem.lineId) {
              console.error('Cannot update quantity for item without lineId:', existingItem);
              return;
            }
            const result = await updateShopifyCartLine(cartId, existingItem.lineId, newQuantity);
            if (result.success) {
              const currentItems = get().items;
              set({
                items: currentItems.map((i) =>
                  i.variantId === item.variantId ? { ...i, quantity: newQuantity } : i
                ),
                isOpen: true,
              });
            } else if (result.cartNotFound) {
              clearCart();
            }
          } else {
            const result = await addLineToShopifyCart(cartId, { ...item, lineId: null });
            if (result.success) {
              const currentItems = get().items;
              set({
                items: [...currentItems, { ...item, lineId: result.lineId ?? null }],
                isOpen: true,
              });
            } else if (result.cartNotFound) {
              clearCart();
            }
          }
        } catch (error) {
          console.error('Failed to add item:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(variantId);
          return;
        }

        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;

        set({ isLoading: true });
        try {
          const result = await updateShopifyCartLine(cartId, item.lineId, quantity);
          if (result.success) {
            const currentItems = get().items;
            set({
              items: currentItems.map((i) =>
                i.variantId === variantId ? { ...i, quantity } : i
              ),
            });
          } else if (result.cartNotFound) {
            clearCart();
          }
        } catch (error) {
          console.error('Failed to update quantity:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (variantId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;

        set({ isLoading: true });
        try {
          const result = await removeLineFromShopifyCart(cartId, item.lineId);
          if (result.success) {
            const currentItems = get().items;
            const newItems = currentItems.filter((i) => i.variantId !== variantId);
            newItems.length === 0 ? clearCart() : set({ items: newItems });
          } else if (result.cartNotFound) {
            clearCart();
          }
        } catch (error) {
          console.error('Failed to remove item:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => set({ 
        items: [], 
        cartId: null, 
        checkoutUrl: null, 
        appliedDiscount: null, 
        discountError: null 
      }),

      getCheckoutUrl: () => get().checkoutUrl,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      applyDiscountCode: async (code: string) => {
        const { cartId } = get();
        set({ isLoading: true, discountError: null });
        
        try {
          // First validate with our database
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-discount`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({ 
              code, 
              cartSubtotal: get().discountedSubtotal() 
            }),
          });
          
          const result = await response.json();
          
          if (!result.valid) {
            set({ discountError: result.message || 'Invalid discount code' });
            return false;
          }
          
          // Apply to Shopify cart if we have one
          if (cartId) {
            const data = await storefrontApiRequest(CART_DISCOUNT_CODES_UPDATE_MUTATION, {
              cartId,
              discountCodes: [code.toUpperCase()],
            });
            
            const cart = data?.data?.cartDiscountCodesUpdate?.cart;
            if (cart?.checkoutUrl) {
              set({ checkoutUrl: formatCheckoutUrl(cart.checkoutUrl) });
            }
          }
          
          set({ 
            appliedDiscount: {
              code: result.code,
              discountType: result.discountType,
              discountValue: result.discountValue,
              discountAmount: result.discountAmount,
              discountDisplay: result.discountDisplay,
              grantsLifetime: result.grantsLifetime,
            },
            discountError: null,
          });
          
          return true;
        } catch (error) {
          console.error('Failed to apply discount:', error);
          set({ discountError: 'Failed to apply discount code' });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      removeDiscountCode: async () => {
        const { cartId } = get();
        set({ isLoading: true });
        
        try {
          if (cartId) {
            const data = await storefrontApiRequest(CART_DISCOUNT_CODES_UPDATE_MUTATION, {
              cartId,
              discountCodes: [],
            });
            
            const cart = data?.data?.cartDiscountCodesUpdate?.cart;
            if (cart?.checkoutUrl) {
              set({ checkoutUrl: formatCheckoutUrl(cart.checkoutUrl) });
            }
          }
          
          set({ appliedDiscount: null, discountError: null });
        } catch (error) {
          console.error('Failed to remove discount:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing) return;

        set({ isSyncing: true });
        try {
          const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
          if (!data) return;
          const cart = data?.data?.cart;
          if (!cart || cart.totalQuantity === 0) clearCart();
        } catch (error) {
          console.error('Failed to sync cart with Shopify:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce(
          (total, item) => total + parseFloat(item.price.amount) * item.quantity,
          0
        );
      },

      bundleDiscountPercent: () => {
        const itemCount = get().totalItems();
        return calculateBundleDiscount(itemCount);
      },

      bundleDiscount: () => {
        const subtotal = get().subtotal();
        const discountPercent = get().bundleDiscountPercent();
        return subtotal * discountPercent;
      },

      discountedSubtotal: () => {
        return get().subtotal() - get().bundleDiscount();
      },

      finalTotal: () => {
        const discountedSubtotal = get().discountedSubtotal();
        const appliedDiscount = get().appliedDiscount;
        
        if (!appliedDiscount) return discountedSubtotal;
        
        if (appliedDiscount.discountType === 'percentage') {
          return discountedSubtotal * (1 - appliedDiscount.discountValue / 100);
        } else if (appliedDiscount.discountType === 'fixed') {
          return Math.max(0, discountedSubtotal - appliedDiscount.discountValue);
        } else if (appliedDiscount.discountType === 'free') {
          return 0;
        }
        
        return discountedSubtotal;
      },
    }),
    {
      name: 'shopify-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
        appliedDiscount: state.appliedDiscount,
      }),
    }
  )
);