import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Download, Filter, RefreshCw } from 'lucide-react';
import { useDashboardStats, useSalesAnalytics } from '../../hooks/useAnalytics';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { SkeletonTable, SkeletonStats } from '../../components/ui/Skeleton';
import { SalesChart } from '../../components/charts/SalesChart';
import { OrdersChart } from '../../components/charts/OrdersChart';
import { TopProductsChart } from '../../components/charts/TopProductsChart';
import { StorePerformanceChart } from '../../components/charts/StorePerformanceChart';
import { formatCurrency, formatDate } from '../../utils';
import { useUIStore } from '../../stores/uiStore';

const AnalyticsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const [dateRange, setDateRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: salesData, isLoading: salesLoading } = useSalesAnalytics({ period: dateRange });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      addNotification({
        type: 'success',
        title: 'Data Refreshed',
        message: 'Analytics data has been refreshed successfully',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Refresh Failed',
        message: error.message || 'Failed to refresh data',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    addNotification({
      type: 'info',
      title: 'Export Started',
      message: 'Analytics report is being prepared for download',
    });
  };

  if (statsLoading || salesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">View detailed analytics and reports</p>
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <SkeletonStats cards={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <SkeletonTable rows={3} columns={1} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <SkeletonTable rows={3} columns={1} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">View detailed analytics and reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-2"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            leftIcon={<RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
          <Button
            onClick={handleExport}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(statsData?.totalRevenue || 0)}
              </p>
              <p className="text-sm text-green-600">+12.5% from last month</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {statsData?.totalOrders || 0}
              </p>
              <p className="text-sm text-green-600">+8.2% from last month</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Stores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {statsData?.activeStores || 0}
              </p>
              <p className="text-sm text-gray-500">Across all locations</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(statsData?.averageOrderValue || 0)}
              </p>
              <p className="text-sm text-green-600">+5.3% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Trend</h3>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <SalesChart data={salesData?.salesTrend || []} />
        </div>

        {/* Orders Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Orders by Status</h3>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <OrdersChart data={salesData?.ordersByStatus || []} />
        </div>

        {/* Top Products Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Products</h3>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <TopProductsChart data={salesData?.topProducts || []} />
        </div>

        {/* Store Performance Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Store Performance</h3>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <StorePerformanceChart data={salesData?.storePerformance || []} />
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue by Store */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue by Store</h3>
          <div className="space-y-3">
            {salesData?.revenueByStore?.map((store, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {(store as any).name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency((store as any).revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {salesData?.recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">{(activity as any).description}</p>
                  <p className="text-xs text-gray-500">{formatDate((activity as any).timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">3.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Customer Retention</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">78%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">2.4h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Score</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">4.8/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
