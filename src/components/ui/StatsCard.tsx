
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn, formatPercentage } from '../../utils';
//import LoadingSpinner from './LoadingSpinner';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
  loading?: boolean;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change = 0,
  icon: Icon,
  color,
  loading = false,
  className,
}) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    error: 'bg-error-100 text-error-600',
    info: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
  };

  const changeColorClasses = {
    positive: 'text-success-600',
    negative: 'text-error-600',
    neutral: 'text-secondary-600',
  };

  const getChangeColor = () => {
    if (change > 0) return changeColorClasses.positive;
    if (change < 0) return changeColorClasses.negative;
    return changeColorClasses.neutral;
  };

  const getChangeIcon = () => {
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  };

  if (loading) {
    return (
      <div className={cn('card p-6', className)}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-secondary-200 rounded animate-pulse mb-2" />
            <div className="h-8 bg-secondary-200 rounded animate-pulse mb-2" />
            <div className="h-3 bg-secondary-200 rounded animate-pulse w-20" />
          </div>
          <div className="w-12 h-12 bg-secondary-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('card p-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-secondary-900 mb-2">{value}</p>
          {change !== 0 && (
            <div className="flex items-center space-x-1">
              <span className={cn('text-sm font-medium', getChangeColor())}>
                {getChangeIcon()} {formatPercentage(Math.abs(change))}
              </span>
              <span className="text-sm text-secondary-500">vs last period</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
