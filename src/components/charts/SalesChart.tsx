import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { formatCurrency, formatDate } from '../../utils';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface SalesChartProps {
  data?: any;
  loading?: boolean;
  height?: number;
}

export const SalesChart: React.FC<SalesChartProps> = ({
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
    { date: '2024-01-01', sales: 12000, orders: 45 },
    { date: '2024-01-02', sales: 19000, orders: 67 },
    { date: '2024-01-03', sales: 3000, orders: 12 },
    { date: '2024-01-04', sales: 5000, orders: 23 },
    { date: '2024-01-05', sales: 2000, orders: 8 },
    { date: '2024-01-06', sales: 3000, orders: 15 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatDate(label, 'MMM dd, yyyy')}
          </p>
          <p className="text-sm text-blue-600">
            Sales: {formatCurrency(payload[0]?.value || 0)}
          </p>
          <p className="text-sm text-green-600">
            Orders: {payload[1]?.value || 0}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => formatDate(value, 'MMM dd')}
            className="text-xs"
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value, '', 0)}
            className="text-xs"
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            fill="url(#salesGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
