import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Store, FilterOptions } from '../types';

// Store Query Keys
export const storeKeys = {
  all: ['stores'] as const,
  lists: () => [...storeKeys.all, 'list'] as const,
  list: (filters: FilterOptions) => [...storeKeys.lists(), filters] as const,
  details: () => [...storeKeys.all, 'detail'] as const,
  detail: (id: string) => [...storeKeys.details(), id] as const,
};

// Get stores with filters
export const useStores = (filters?: FilterOptions) => {
  return useQuery({
    queryKey: storeKeys.list(filters || {}),
    queryFn: async () => {
      const response = await apiService.getStores(filters);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single store
export const useStore = (id: string) => {
  return useQuery({
    queryKey: storeKeys.detail(id),
    queryFn: async () => {
      const response = await apiService.getStore(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create store mutation
export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Store>) => {
      const response = await apiService.createStore(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
    },
    onError: (error) => {
      console.error('Create store failed:', error);
    },
  });
};

// Update store mutation
export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Store> }) => {
      const response = await apiService.updateStore(id, data);
      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeKeys.detail(id) });
    },
    onError: (error) => {
      console.error('Update store failed:', error);
    },
  });
};

// Delete store mutation
export const useDeleteStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiService.deleteStore(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
    },
    onError: (error) => {
      console.error('Delete store failed:', error);
    },
  });
};
