import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatNumber, formatDate } from '../../utils';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface OrdersChartProps {
  data?: any;
  loading?: boolean;
  height?: number;
}

export const OrdersChart: React.FC<OrdersChartProps> = ({
  data,
  loading = false,
  height = 300,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const chartData = data?.chartData || [
    { date: '2024-01-01', orders: 45, completed: 40, pending: 5 },
    { date: '2024-01-02', orders: 67, completed: 60, pending: 7 },
    { date: '2024-01-03', orders: 12, completed: 10, pending: 2 },
    { date: '2024-01-04', orders: 23, completed: 20, pending: 3 },
    { date: '2024-01-05', orders: 8, completed: 6, pending: 2 },
    { date: '2024-01-06', orders: 15, completed: 12, pending: 3 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatDate(label, 'MMM dd, yyyy')}
          </p>
          <p className="text-sm text-blue-600">
            Total Orders: {payload[0]?.value || 0}
          </p>
          <p className="text-sm text-green-600">
            Completed: {payload[1]?.value || 0}
          </p>
          <p className="text-sm text-orange-600">
            Pending: {payload[2]?.value || 0}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => formatDate(value, 'MMM dd')}
            className="text-xs"
          />
          <YAxis 
            tickFormatter={(value) => formatNumber(value)}
            className="text-xs"
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="pending"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
