import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { DashboardStats, FilterOptions } from '../types';

// Analytics Query Keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
  sales: (filters: FilterOptions) => [...analyticsKeys.all, 'sales', filters] as const,
  orders: (filters: FilterOptions) => [...analyticsKeys.all, 'orders', filters] as const,
  products: (filters: FilterOptions) => [...analyticsKeys.all, 'products', filters] as const,
  stores: (filters: FilterOptions) => [...analyticsKeys.all, 'stores', filters] as const,
};

// Get dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: async () => {
      const response = await apiService.getDashboardStats();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get sales analytics
export const useSalesAnalytics = (filters?: FilterOptions) => {
  return useQuery({
    queryKey: analyticsKeys.sales(filters || {}),
    queryFn: async () => {
      const response = await apiService.getSalesAnalytics(filters);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
