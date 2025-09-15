import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatNumber } from '../../utils';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface StorePerformanceChartProps {
  data?: any;
  loading?: boolean;
  height?: number;
}

export const StorePerformanceChart: React.FC<StorePerformanceChartProps> = ({
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

  const chartData = data?.storePerformance || [
    { storeName: 'Store A', sales: 12000, orders: 45, growth: 12 },
    { storeName: 'Store B', sales: 10000, orders: 38, growth: 8 },
    { storeName: 'Store C', sales: 8000, orders: 30, growth: 15 },
    { storeName: 'Store D', sales: 6000, orders: 22, growth: -2 },
    { storeName: 'Store E', sales: 4000, orders: 15, growth: 5 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </p>
          <p className="text-sm text-blue-600">
            Sales: {formatCurrency(data.sales)}
          </p>
          <p className="text-sm text-green-600">
            Orders: {formatNumber(data.orders)}
          </p>
          <p className={`text-sm ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Growth: {data.growth >= 0 ? '+' : ''}{data.growth}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="storeName" 
            className="text-xs"
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value, '', 0)}
            className="text-xs"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="sales" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
