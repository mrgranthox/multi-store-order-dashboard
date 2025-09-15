import React from 'react';
import { cn } from '../../utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded',
    circular: 'rounded-full',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    none: '',
  };

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
};

// Predefined skeleton components for common use cases
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 space-y-4', className)}>
    <div className="flex items-center space-x-4">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="space-y-2 flex-1">
        <Skeleton width="60%" height={16} />
        <Skeleton width="40%" height={12} />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton width="100%" height={14} />
      <Skeleton width="80%" height={14} />
      <Skeleton width="60%" height={14} />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ 
  rows?: number; 
  columns?: number; 
  className?: string;
}> = ({ rows = 5, columns = 4, className }) => (
  <div className={cn('space-y-4', className)}>
    {/* Table Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} height={20} />
      ))}
    </div>
    
    {/* Table Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} height={16} />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonList: React.FC<{ 
  items?: number; 
  className?: string;
}> = ({ items = 3, className }) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="space-y-2 flex-1">
          <Skeleton width="70%" height={14} />
          <Skeleton width="50%" height={12} />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonChart: React.FC<{ 
  className?: string;
  height?: number;
}> = ({ className, height = 200 }) => (
  <div className={cn('space-y-4', className)}>
    <div className="flex justify-between items-center">
      <Skeleton width={120} height={20} />
      <Skeleton width={80} height={16} />
    </div>
    <div className="relative" style={{ height: `${height}px` }}>
      <Skeleton width="100%" height="100%" />
      {/* Overlay some chart-like elements */}
      <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton
            key={index}
            width={8}
            height={`${Math.random() * 60 + 20}%`}
            className="opacity-50"
          />
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonForm: React.FC<{ 
  fields?: number; 
  className?: string;
}> = ({ fields = 4, className }) => (
  <div className={cn('space-y-6', className)}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="space-y-2">
        <Skeleton width="25%" height={16} />
        <Skeleton width="100%" height={40} />
      </div>
    ))}
    <div className="flex space-x-4">
      <Skeleton width={100} height={40} />
      <Skeleton width={80} height={40} />
    </div>
  </div>
);

export const SkeletonStats: React.FC<{ 
  cards?: number; 
  className?: string;
}> = ({ cards = 4, className }) => (
  <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
    {Array.from({ length: cards }).map((_, index) => (
      <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="ml-4 space-y-2 flex-1">
            <Skeleton width="60%" height={14} />
            <Skeleton width="40%" height={20} />
          </div>
        </div>
      </div>
    ))}
  </div>
);
