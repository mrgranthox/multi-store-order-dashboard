import React, { useState } from 'react';
import { ShoppingCart, Search, Filter, Eye, Package, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useOrders, useUpdateOrderStatus } from '../../hooks/useOrders';
import { useAuthStore } from '../../stores/authStore';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
//import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { SkeletonTable, SkeletonStats } from '../../components/ui/Skeleton';
import { formatCurrency, formatDate } from '../../utils';
import { Order, FilterOptions } from '../../types';
import { useUIStore } from '../../stores/uiStore';

const OrdersPage: React.FC = () => {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Order[]>([]);

  const { data: ordersData, isLoading } = useOrders(filters);
  const updateOrderStatusMutation = useUpdateOrderStatus();

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatusMutation.mutateAsync({ orderId, status });
      addNotification({
        type: 'success',
        title: 'Order Updated',
        message: 'Order status has been updated successfully',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update order status',
      });
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const getStatusIcon = (status: string) => {
    const statusConfig = {
      pending: { icon: Clock, color: 'text-yellow-500' },
      confirmed: { icon: CheckCircle, color: 'text-blue-500' },
      processing: { icon: Package, color: 'text-purple-500' },
      shipped: { icon: Package, color: 'text-indigo-500' },
      delivered: { icon: CheckCircle, color: 'text-green-500' },
      cancelled: { icon: XCircle, color: 'text-red-500' },
      refunded: { icon: AlertCircle, color: 'text-orange-500' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    return <Icon className={`h-4 w-4 ${config.color}`} />;
  };

  const getStatusColor = (status: string) => {
    const statusConfig = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-orange-100 text-orange-800',
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      title: 'Order #',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-blue-600">#{value}</span>
      ),
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (value) => (
        <div>
          <div className="font-medium text-gray-900">{(value as any).name}</div>
          <div className="text-sm text-gray-500">{(value as any).email}</div>
        </div>
      ),
    },
    {
      key: 'total',
      title: 'Total',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{formatCurrency(value as number)}</span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => {
        const status = value as string;
        return (
          <div className="flex items-center space-x-2">
            {getStatusIcon(status)}
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        );
      },
    },
    {
      key: 'store',
      title: 'Store',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value ? (value as any).name : 'N/A'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Date',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500">{formatDate(value as string)}</span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewOrder(row)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <select
            value={row.status}
            onChange={(e) => handleUpdateOrderStatus(row.id, e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage customer orders</p>
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <SkeletonStats cards={4} />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <SkeletonTable rows={5} columns={7} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer orders</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
          Filters
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {ordersData?.meta?.pagination?.total || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {ordersData?.data?.filter(order => order.status === 'pending').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {ordersData?.data?.filter(order => order.status === 'delivered').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Processing Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {ordersData?.data?.filter(order => order.status === 'processing').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <DataTable
          data={ordersData?.data || []}
          columns={columns}
          searchable={false}
          selectable={true}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          pagination={{
            page: filters.page || 1,
            pageSize: filters.pageSize || 10,
            total: ordersData?.meta?.pagination?.total || 0,
            onPageChange: (page) => setFilters(prev => ({ ...prev, page })),
            onPageSizeChange: (pageSize) => setFilters(prev => ({ ...prev, pageSize, page: 1 })),
          }}
        />
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="p-6">
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Order #{selectedOrder.orderNumber}</h3>
                  <p className="text-gray-600">Placed on {formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedOrder.status)}
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{(selectedOrder.customer as any).name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{(selectedOrder.customer as any).email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{(selectedOrder.customer as any).phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Store</p>
                    <p className="font-medium">{(selectedOrder.store as any).name || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">{(item as any).name}</p>
                          <p className="text-sm text-gray-600">Qty: {(item as any).quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">{formatCurrency((item as any).price)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
