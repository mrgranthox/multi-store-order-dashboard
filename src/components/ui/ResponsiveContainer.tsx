import React from 'react';
import { cn } from '../../utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  breakpoints?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
  spacing?: {
    padding?: string;
    margin?: string;
    gap?: string;
  };
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  as: Component = 'div',
  breakpoints = {},
  spacing = {},
}) => {
  const {
    sm = 'w-full',
    md = 'md:w-full',
    lg = 'lg:w-full',
    xl = 'xl:w-full',
    '2xl': xl2 = '2xl:w-full',
  } = breakpoints;

  const {
    padding = 'p-4',
    margin = 'm-0',
    gap = 'gap-4',
  } = spacing;

  return (
    <Component
      className={cn(
        'w-full',
        sm,
        md,
        lg,
        xl,
        xl2,
        padding,
        margin,
        gap,
        className
      )}
    >
      {children}
    </Component>
  );
};

// Predefined responsive containers
export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  className?: string;
}> = ({ children, cols = {}, className }) => {
  const {
    sm = 1,
    md = 2,
    lg = 3,
    xl = 4,
    '2xl': xl2 = 5,
  } = cols;

  return (
    <div
      className={cn(
        'grid',
        `grid-cols-${sm}`,
        `md:grid-cols-${md}`,
        `lg:grid-cols-${lg}`,
        `xl:grid-cols-${xl}`,
        `2xl:grid-cols-${xl2}`,
        'gap-4',
        className
      )}
    >
      {children}
    </div>
  );
};

export const ResponsiveFlex: React.FC<{
  children: React.ReactNode;
  direction?: {
    sm?: 'row' | 'col';
    md?: 'row' | 'col';
    lg?: 'row' | 'col';
    xl?: 'row' | 'col';
    '2xl'?: 'row' | 'col';
  };
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: boolean;
  className?: string;
}> = ({ 
  children, 
  direction = {}, 
  justify = 'start', 
  align = 'start', 
  wrap = false,
  className 
}) => {
  const {
    sm = 'row',
    md = 'row',
    lg = 'row',
    xl = 'row',
    '2xl': xl2 = 'row',
  } = direction;

  return (
    <div
      className={cn(
        'flex',
        `flex-${sm}`,
        `md:flex-${md}`,
        `lg:flex-${lg}`,
        `xl:flex-${xl}`,
        `2xl:flex-${xl2}`,
        `justify-${justify}`,
        `items-${align}`,
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
};

export const ResponsiveCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
}> = ({ children, className, padding = {} }) => {
  const {
    sm = 'p-4',
    md = 'md:p-6',
    lg = 'lg:p-8',
    xl = 'xl:p-8',
    '2xl': xl2 = '2xl:p-8',
  } = padding;

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow',
        sm,
        md,
        lg,
        xl,
        xl2,
        className
      )}
    >
      {children}
    </div>
  );
};

export const ResponsiveText: React.FC<{
  children: React.ReactNode;
  size?: {
    sm?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    md?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    lg?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    xl?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    '2xl'?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  };
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  color?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}> = ({ 
  children, 
  size = {}, 
  weight = 'normal', 
  color = 'text-gray-900 dark:text-white',
  className,
  as: Component = 'p'
}) => {
  const {
    sm = 'base',
    md = 'base',
    lg = 'lg',
    xl = 'xl',
    '2xl': xl2 = 'xl',
  } = size;

  return (
    <Component
      className={cn(
        `text-${sm}`,
        `md:text-${md}`,
        `lg:text-${lg}`,
        `xl:text-${xl}`,
        `2xl:text-${xl2}`,
        `font-${weight}`,
        color,
        className
      )}
    >
      {children}
    </Component>
  );
};

// Mobile-first responsive utilities
export const MobileOnly: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn('block md:hidden', className)}>
    {children}
  </div>
);

export const DesktopOnly: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn('hidden md:block', className)}>
    {children}
  </div>
);

export const TabletOnly: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn('hidden md:block lg:hidden', className)}>
    {children}
  </div>
);

export const MobileAndTablet: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn('block lg:hidden', className)}>
    {children}
  </div>
);

export const TabletAndDesktop: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn('hidden md:block', className)}>
    {children}
  </div>
);
