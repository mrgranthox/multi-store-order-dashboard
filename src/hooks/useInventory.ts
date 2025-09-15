import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { StoreInventory, FilterOptions } from '../types';

// Inventory Query Keys
export const inventoryKeys = {
  all: ['inventory'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  list: (filters: FilterOptions) => [...inventoryKeys.lists(), filters] as const,
  lowStock: () => [...inventoryKeys.all, 'lowStock'] as const,
};

// Get inventory with filters
export const useInventory = (filters?: FilterOptions) => {
  return useQuery({
    queryKey: inventoryKeys.list(filters || {}),
    queryFn: async () => {
      const response = await apiService.getInventory(filters);
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get low stock items
export const useLowStockItems = () => {
  return useQuery({
    queryKey: inventoryKeys.lowStock(),
    queryFn: async () => {
      const response = await apiService.getLowStockItems();
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Update inventory mutation
export const useUpdateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StoreInventory> }) => {
      const response = await apiService.updateInventory(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lowStock() });
    },
    onError: (error) => {
      console.error('Update inventory failed:', error);
    },
  });
};
