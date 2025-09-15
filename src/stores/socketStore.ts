import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS, API_CONFIG } from '../constants';
import { useAuthStore } from './authStore';
import { useUIStore } from './uiStore';
import { Order, StoreInventory, Product, Notification } from '../types';

interface SocketState {
  socket: Socket | null;
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  connected: false,

  connect: () => {
    const { accessToken, isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated || !accessToken || get().socket) return;

    // Connect to Socket.IO server with JWT auth
    const socket = io(API_CONFIG.SOCKET_URL, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 20000,
      forceNew: true,
    });

    // Connection events
    socket.on('connect', () => {
      set({ connected: true });
      useUIStore.getState().addNotification({
        type: 'success',
        title: 'Connected',
        message: 'Real-time updates enabled.',
      });
    });
    socket.on('disconnect', () => {
      set({ connected: false });
      useUIStore.getState().addNotification({
        type: 'warning',
        title: 'Disconnected',
        message: 'Real-time updates lost. Reconnecting...',
      });
    });
    socket.on('connect_error', (err) => {
      set({ connected: false });
      useUIStore.getState().addNotification({
        type: 'error',
        title: 'Connection Error',
        message: err?.message || 'Could not connect to real-time server.',
      });
    });

    // Real-time event listeners
    socket.on(SOCKET_EVENTS.ORDER_CREATED, (order: Order) => {
      useUIStore.getState().addNotification({
        type: 'info',
        title: 'New Order',
        message: `Order #${order.orderNumber} created.`,
      });
      // TODO: Dispatch to order store/page if needed
    });
    socket.on(SOCKET_EVENTS.ORDER_UPDATED, (order: Order) => {
      useUIStore.getState().addNotification({
        type: 'info',
        title: 'Order Updated',
        message: `Order #${order.orderNumber} updated.`,
      });
      // TODO: Dispatch to order store/page if needed
    });
    socket.on(SOCKET_EVENTS.INVENTORY_UPDATED, (inventory: StoreInventory) => {
      useUIStore.getState().addNotification({
        type: 'warning',
        title: 'Inventory Updated',
        message: `Inventory for product ${inventory.productId} updated.`,
      });
      // TODO: Dispatch to inventory store/page if needed
    });
    socket.on(SOCKET_EVENTS.PRODUCT_UPDATED, (product: Product) => {
      useUIStore.getState().addNotification({
        type: 'info',
        title: 'Product Updated',
        message: `Product ${product.name} updated.`,
      });
      // TODO: Dispatch to product store/page if needed
    });
    socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, (notification: Notification) => {
      useUIStore.getState().addNotification(notification);
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, connected: false });
    }
  },
}));

// Auto-connect/disconnect on auth change
useAuthStore.subscribe((auth) => {
  const { connect, disconnect } = useSocketStore.getState();
  if (auth.isAuthenticated && auth.accessToken) {
    // Small delay to ensure auth state is fully updated
    setTimeout(() => {
      connect();
    }, 100);
  } else {
    disconnect();
  }
});
