import React from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils';
import { Order } from '../../types';
//import LoadingSpinner from '../ui/LoadingSpinner';

interface RecentOrdersProps {
  orders: Order[];
  loading?: boolean;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders, loading = false }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-error-500" />;
      default:
        return <Clock className="w-4 h-4 text-warning-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'cancelled':
        return 'badge-error';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-secondary-900">Recent Orders</h3>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-secondary-200 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-secondary-200 rounded animate-pulse w-1/3" />
                  <div className="h-3 bg-secondary-200 rounded animate-pulse w-1/4" />
                </div>
                <div className="h-6 bg-secondary-200 rounded animate-pulse w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-secondary-900">Recent Orders</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all
          </button>
        </div>
      </div>
      <div className="card-body">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-500">No recent orders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-secondary-50 transition-colors">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-secondary-900 truncate">
                      Order #{order.orderNumber}
                    </p>
                    {getStatusIcon(order.status)}
                  </div>
                  <p className="text-sm text-secondary-500">
                    {order.user?.firstName} {order.user?.lastName} • {formatDate(order.createdAt, 'MMM dd, HH:mm')}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-semibold text-secondary-900">
                    {formatCurrency(order.totalAmount)}
                  </span>
                  <span className={`badge ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
