import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Store, 
  TrendingUp, 
  Users,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { apiService } from '../../services/api';
import { formatCurrency } from '../../utils';
import StatsCard from '../../components/ui/StatsCard';
import Chart from '../../components/charts/Chart';
import RecentOrders from '../../components/dashboard/RecentOrders';
import LowStockAlert from '../../components/dashboard/LowStockAlert';
import { DashboardStats, Order, StoreInventory, FilterOptions } from '../../types';

const DashboardPage: React.FC = () => {
  // Fetch dashboard stats
  const { data: statsResponse, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        const response = await apiService.getDashboardStats();
        return response;
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        return { data: null, success: false };
      }
    },
  });

  const stats: DashboardStats | null = statsResponse?.data || null;

  // Fetch sales data for charts
  const { data: salesResponse, isLoading: salesLoading } = useQuery({
    queryKey: ['sales-data'],
    queryFn: async () => {
      try {
        const response = await apiService.getSalesData({ period: '30d' });
        return response;
      } catch (err) {
        console.error('Failed to fetch sales data:', err);
        return { data: null, success: false };
      }
    },
  });

  const salesData = salesResponse?.data || null;

  // Fetch recent orders with extended filter options
  const { data: ordersResponse, isLoading: ordersLoading } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      try {
        const extendedFilters: FilterOptions & { 
          pageSize?: number; 
          sortBy?: string; 
          sortOrder?: 'asc' | 'desc';
        } = { 
          pageSize: 5, 
          sortBy: 'createdAt', 
          sortOrder: 'desc' 
        };
        const response = await apiService.getOrders(extendedFilters);
        return response;
      } catch (err) {
        console.error('Failed to fetch recent orders:', err);
        return { data: [], meta: null, success: false };
      }
    },
  });

  const recentOrders: Order[] = ordersResponse?.data || [];

  // Fetch low stock items
  const { data: lowStockResponse, isLoading: lowStockLoading } = useQuery({
    queryKey: ['low-stock-items'],
    queryFn: async () => {
      try {
        const response = await apiService.getLowStockItems();
        return response;
      } catch (err) {
        console.error('Failed to fetch low stock items:', err);
        return { data: [], success: false };
      }
    },
  });

  const lowStockItems: StoreInventory[] = lowStockResponse?.data || [];

  // Default stats values with proper typing
  const defaultStats: DashboardStats = {
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalStores: 0,
    activeUsers: 0,
    pendingOrders: 0,
    ordersGrowth: 0,
    revenueGrowth: 0,
    productsGrowth: 0,
    storesGrowth: 0,
    usersGrowth: 0,
    chartData: [],
    ordersByStatus: [],
  };

  const displayStats = stats || defaultStats;

  const statsCards = [
    { 
      title: 'Total Orders', 
      value: displayStats.totalOrders, 
      change: displayStats.ordersGrowth, 
      icon: ShoppingCart, 
      color: 'primary' as const 
    },
    { 
      title: 'Total Revenue', 
      value: formatCurrency(displayStats.totalRevenue), 
      change: displayStats.revenueGrowth, 
      icon: DollarSign, 
      color: 'success' as const 
    },
    { 
      title: 'Total Products', 
      value: displayStats.totalProducts, 
      change: displayStats.productsGrowth, 
      icon: Package, 
      color: 'warning' as const 
    },
    { 
      title: 'Active Stores', 
      value: displayStats.totalStores, 
      change: displayStats.storesGrowth, 
      icon: Store, 
      color: 'info' as const 
    },
    { 
      title: 'Active Users', 
      value: displayStats.activeUsers, 
      change: displayStats.usersGrowth, 
      icon: Users, 
      color: 'secondary' as const 
    },
    { 
      title: 'Pending Orders', 
      value: displayStats.pendingOrders, 
      change: 0, 
      icon: Clock, 
      color: 'warning' as const 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-600">Welcome back! Here's what's happening with your stores.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
            loading={statsLoading}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900">Sales Overview</h3>
            <p className="text-sm text-secondary-600">Last 30 days</p>
          </div>
          <div className="card-body">
            <Chart
              data={salesData?.chartData || displayStats.chartData || []}
              type="line"
              height={300}
              loading={salesLoading}
            />
          </div>
        </div>

        {/* Orders Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900">Orders by Status</h3>
            <p className="text-sm text-secondary-600">Current distribution</p>
          </div>
          <div className="card-body">
            <Chart
              data={salesData?.ordersByStatus || displayStats.ordersByStatus || []}
              type="doughnut"
              height={300}
              loading={salesLoading}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <RecentOrders 
            orders={recentOrders} 
            loading={ordersLoading} 
          />
        </div>

        {/* Low Stock Alert */}
        <div>
          <LowStockAlert 
            items={lowStockItems} 
            loading={lowStockLoading} 
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;