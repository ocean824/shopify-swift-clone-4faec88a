import { X, Minus, Plus, ShoppingBag, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useEffect } from 'react';

export function CartDrawer() {
  const { 
    items, 
    isOpen, 
    isLoading, 
    isSyncing,
    closeCart, 
    updateQuantity, 
    removeItem, 
    subtotal,
    bundleDiscount,
    discountedSubtotal,
    bundleDiscountPercent,
    totalItems,
    getCheckoutUrl,
    syncCart,
  } = useCartStore();

  // Sync cart when drawer opens
  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      closeCart();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-border bg-background shadow-xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold">Your Cart</h2>
                <Button variant="ghost" size="icon" onClick={closeCart}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium">Your cart is empty</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Add some products to get started!
                    </p>
                    <Button className="mt-6" onClick={closeCart}>
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {items.map((item) => {
                      const image = item.product.node.images?.edges?.[0]?.node;
                      const price = parseFloat(item.price.amount);
                      
                      return (
                        <li
                          key={item.variantId}
                          className="flex gap-4 rounded-lg border border-border p-4"
                        >
                          {/* Product Image */}
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                            {image ? (
                              <img
                                src={image.url}
                                alt={item.product.node.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex flex-1 flex-col">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-sm font-medium line-clamp-2">
                                  {item.product.node.title}
                                </h3>
                                {item.variantTitle !== 'Default Title' && (
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {item.variantTitle}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeItem(item.variantId)}
                                disabled={isLoading}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="mt-auto flex items-center justify-between">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                  disabled={isLoading}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                  disabled={isLoading}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {formatPrice(price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-border px-6 py-4">
                  {/* Subtotal */}
                  <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Subtotal ({totalItems()} items)</span>
                    <span>{formatPrice(subtotal())}</span>
                  </div>
                  
                  {/* Bundle Discount */}
                  {bundleDiscountPercent() > 0 && (
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-green-500 font-medium">
                        Bundle Discount ({Math.round(bundleDiscountPercent() * 100)}% off)
                      </span>
                      <span className="text-green-500 font-medium">
                        -{formatPrice(bundleDiscount())}
                      </span>
                    </div>
                  )}
                  
                  {/* Total */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-base font-medium">Total</span>
                    <span className="text-lg font-bold">{formatPrice(discountedSubtotal())}</span>
                  </div>
                  
                  {bundleDiscountPercent() < 0.50 && totalItems() >= 2 && (
                    <p className="mb-3 text-center text-xs text-primary">
                      Add {5 - totalItems()} more item{5 - totalItems() !== 1 ? 's' : ''} for 50% off!
                    </p>
                  )}
                  
                  <p className="mb-4 text-center text-xs text-muted-foreground">
                    Shipping and taxes calculated at checkout
                  </p>
                  <Button 
                    className="w-full gap-2" 
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isLoading || isSyncing || items.length === 0}
                  >
                    {isLoading || isSyncing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4" />
                        Checkout
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}