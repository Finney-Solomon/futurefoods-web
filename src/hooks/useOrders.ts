/**
 * useOrders Hook
 * Custom React hook for order management
 */

import { useState, useCallback, useEffect } from "react";
import { apiService } from "../services/apiService";
import {
  Order,
  OrderListResponse,
  CreateOrderRequest,
} from "../services/types/apiTypes";
import { getUserFriendlyMessage } from "../services/errorHandler";

interface UseOrdersReturn {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  loadOrders: () => Promise<void>;
  loadOrderById: (id: string) => Promise<Order | null>;
  createOrder: (data: CreateOrderRequest) => Promise<Order>;
  getOrderStatus: (status: string) => string;
}

/**
 * useOrders - Hook for managing user orders
 */
export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getMyOrders();
      setOrders(response.items || []);
    } catch (err) {
      const message = getUserFriendlyMessage(err);
      setError(message);
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadOrderById = useCallback(
    async (id: string): Promise<Order | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const order = await apiService.getOrderById(id);
        setCurrentOrder(order);
        return order;
      } catch (err) {
        const message = getUserFriendlyMessage(err);
        setError(message);
        console.error("Failed to load order:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const createOrder = useCallback(
    async (data: CreateOrderRequest): Promise<Order> => {
      setIsCreating(true);
      setError(null);

      try {
        const newOrder = await apiService.createOrder(data);
        setCurrentOrder(newOrder);
        // Refresh orders list
        await loadOrders();
        return newOrder;
      } catch (err) {
        const message = getUserFriendlyMessage(err);
        setError(message);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [loadOrders],
  );

  const getOrderStatus = useCallback((status: string): string => {
    const statusMap: Record<string, string> = {
      created: "Order Created",
      paid: "Payment Confirmed",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return statusMap[status] || status;
  }, []);

  const getOrderStatusColor = useCallback((status: string): string => {
    const colorMap: Record<string, string> = {
      created: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  }, []);

  return {
    orders,
    currentOrder,
    isLoading,
    isCreating,
    error,
    loadOrders,
    loadOrderById,
    createOrder,
    getOrderStatus,
  };
}

export default useOrders;
