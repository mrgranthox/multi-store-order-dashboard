import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Order, FilterOptions } from '../types';

// Order Query Keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: FilterOptions) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

// Get orders with filters
export const useOrders = (filters?: FilterOptions) => {
  return useQuery({
    queryKey: orderKeys.list(filters || {}),
    queryFn: async () => {
      const response = await apiService.getOrders(filters);
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (orders change frequently)
  });
};

// Get single order
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const response = await apiService.getOrder(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Update order status mutation
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiService.updateOrderStatus(id, status);
      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
    onError: (error) => {
      console.error('Update order status failed:', error);
    },
  });
};
