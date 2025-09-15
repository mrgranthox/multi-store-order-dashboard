import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSocketStore } from '../stores/socketStore';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { useQueryClient } from '@tanstack/react-query';
import { API_CONFIG, SOCKET_EVENTS } from '../constants';
import { Order, StoreInventory, Product, Notification } from '../types';

export const useSocket = () => {
  const { socket, connected, connect, disconnect } = useSocketStore();
  const { isAuthenticated, accessToken } = useAuthStore();
  const { addNotification } = useUIStore();
  const queryClient = useQueryClient();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-connect when authenticated
  useEffect(() => {
    if (isAuthenticated && accessToken && !socket) {
      connect();
    } else if (!isAuthenticated && socket) {
      disconnect();
    }
  }, [isAuthenticated, accessToken, socket, connect, disconnect]);

  // Handle reconnection
  useEffect(() => {
    if (socket) {
      const handleDisconnect = () => {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isAuthenticated) {
            connect();
          }
        }, 5000);
      };

      socket.on('disconnect', handleDisconnect);
      
      return () => {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
      };
    }
  }, [socket, isAuthenticated, connect]);

  // Emit events
  const emit = useCallback((event: string, data?: any) => {
    if (socket && connected) {
      socket.emit(event, data);
    }
  }, [socket, connected]);

  // Listen to events
  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
      
      return () => {
        socket.off(event, callback);
      };
    }
  }, [socket]);

  // Real-time data invalidation
  useEffect(() => {
    if (!socket) return;

    const handleOrderCreated = (order: Order) => {
      addNotification({
        type: 'info',
        title: 'New Order',
        message: `Order #${order.orderNumber} has been created`,
        duration: 5000,
      });
      
      // Invalidate orders query
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    };

    const handleOrderUpdated = (order: Order) => {
      addNotification({
        type: 'info',
        title: 'Order Updated',
        message: `Order #${order.orderNumber} status changed to ${order.status}`,
        duration: 5000,
      });
      
      // Invalidate orders query
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    };

    const handleInventoryUpdated = (inventory: StoreInventory) => {
      if (inventory.quantityAvailable <= (inventory.reorderLevel || 0)) {
        addNotification({
          type: 'warning',
          title: 'Low Stock Alert',
          message: `Product inventory is running low`,
          duration: 10000,
        });
      }
      
      // Invalidate inventory query
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['low-stock-items'] });
    };

    const handleProductUpdated = (product: Product) => {
      addNotification({
        type: 'info',
        title: 'Product Updated',
        message: `Product "${product.name}" has been updated`,
        duration: 3000,
      });
      
      // Invalidate products query
      queryClient.invalidateQueries({ queryKey: ['products'] });
    };

    const handleNotification = (notification: Notification) => {
      addNotification(notification);
    };

    // Set up event listeners
    const unsubscribeOrderCreated = on(SOCKET_EVENTS.ORDER_CREATED, handleOrderCreated);
    const unsubscribeOrderUpdated = on(SOCKET_EVENTS.ORDER_UPDATED, handleOrderUpdated);
    const unsubscribeInventoryUpdated = on(SOCKET_EVENTS.INVENTORY_UPDATED, handleInventoryUpdated);
    const unsubscribeProductUpdated = on(SOCKET_EVENTS.PRODUCT_UPDATED, handleProductUpdated);
    const unsubscribeNotification = on(SOCKET_EVENTS.NOTIFICATION_NEW, handleNotification);

    return () => {
      unsubscribeOrderCreated?.();
      unsubscribeOrderUpdated?.();
      unsubscribeInventoryUpdated?.();
      unsubscribeProductUpdated?.();
      unsubscribeNotification?.();
    };
  }, [socket, on, addNotification, queryClient]);

  return {
    socket,
    connected,
    emit,
    on,
    connect,
    disconnect,
  };
};

// Hook for specific socket events
export const useSocketEvent = (event: string, callback: (data: any) => void, deps: any[] = []) => {
  const { on } = useSocket();

  useEffect(() => {
    const unsubscribe = on(event, callback);
    return unsubscribe;
  }, [on, event, ...deps]);
};

// Hook for real-time data updates
export const useRealtimeData = () => {
  const queryClient = useQueryClient();
  const { on } = useSocket();

  useEffect(() => {
    const handleDataUpdate = (data: { type: string; id: string }) => {
      // Invalidate relevant queries based on data type
      switch (data.type) {
        case 'order':
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          break;
        case 'product':
          queryClient.invalidateQueries({ queryKey: ['products'] });
          break;
        case 'store':
          queryClient.invalidateQueries({ queryKey: ['stores'] });
          break;
        case 'inventory':
          queryClient.invalidateQueries({ queryKey: ['inventory'] });
          queryClient.invalidateQueries({ queryKey: ['low-stock-items'] });
          break;
        default:
          break;
      }
    };

    const unsubscribe = on('data:updated', handleDataUpdate);
    return unsubscribe;
  }, [on, queryClient]);
};
