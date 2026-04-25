/**
 * useCart Hook
 * Custom React hook for cart management
 */

import { useState, useCallback, useEffect } from "react";
import { apiService } from "../services/apiService";
import { Cart, CartItem, AddToCartRequest } from "../services/types/apiTypes";
import {
  getUserFriendlyMessage,
  ErrorHandlers,
} from "../services/errorHandler";

interface UseCartReturn {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
  refetch: () => Promise<void>;
}

/**
 * useCart - Hook for managing shopping cart
 */
export function useCart(): UseCartReturn {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const cartData = await apiService.getCart();
      setCart(cartData);
    } catch (err) {
      const message = ErrorHandlers.handleCartError(err);
      setError(message);
      console.error("Failed to load cart:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addItem = useCallback(async (productId: string, quantity = 1) => {
    setError(null);

    try {
      const data: AddToCartRequest = { productId, quantity };
      const updatedCart = await apiService.addToCart(data);
      setCart(updatedCart);
    } catch (err) {
      const message = ErrorHandlers.handleCartError(err);
      setError(message);
      throw err;
    }
  }, []);

  const updateItemQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      setError(null);

      if (quantity < 1) {
        await removeItem(itemId);
        return;
      }

      try {
        const updatedCart = await apiService.updateCartItem(itemId, {
          quantity,
        });
        setCart(updatedCart);
      } catch (err) {
        const message = ErrorHandlers.handleCartError(err);
        setError(message);
        throw err;
      }
    },
    [],
  );

  const removeItem = useCallback(async (itemId: string) => {
    setError(null);

    try {
      const updatedCart = await apiService.removeCartItem(itemId);
      setCart(updatedCart);
    } catch (err) {
      const message = ErrorHandlers.handleCartError(err);
      setError(message);
      throw err;
    }
  }, []);

  const clearCartHandler = useCallback(async () => {
    setError(null);

    try {
      await apiService.clearCart();
      setCart(null);
    } catch (err) {
      const message = ErrorHandlers.handleCartError(err);
      setError(message);
      throw err;
    }
  }, []);

  const getTotal = useCallback((): number => {
    if (!cart || !cart.items) return 0;

    return cart.items.reduce((total, item) => {
      const price = (item.product as any).pricePaise || 0;
      return total + price * item.quantity;
    }, 0);
  }, [cart]);

  const getItemCount = useCallback((): number => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const refetch = useCallback(async () => {
    await loadCart();
  }, [loadCart]);

  return {
    cart,
    isLoading,
    error,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart: clearCartHandler,
    getTotal,
    getItemCount,
    refetch,
  };
}

export default useCart;
