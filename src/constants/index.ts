// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  STRAPI_URL: process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337/api',
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
  },
  
  // Stores
  STORES: {
    LIST: '/stores',
    CREATE: '/stores',
    UPDATE: (id: string) => `/stores/${id}`,
    DELETE: (id: string) => `/stores/${id}`,
    GET: (id: string) => `/stores/${id}`,
  },
  
  // Products
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    GET: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
  },
  
  // Categories
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
    GET: (id: string) => `/categories/${id}`,
  },
  
  // Orders
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    UPDATE: (id: string) => `/orders/${id}`,
    DELETE: (id: string) => `/orders/${id}`,
    GET: (id: string) => `/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  },
  
  // Users
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    GET: (id: string) => `/users/${id}`,
  },
  
  // Inventory
  INVENTORY: {
    LIST: '/inventory',
    UPDATE: (id: string) => `/inventory/${id}`,
    GET: (id: string) => `/inventory/${id}`,
    LOW_STOCK: '/inventory/low-stock',
  },
  
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    SALES: '/analytics/sales',
    ORDERS: '/analytics/orders',
    PRODUCTS: '/analytics/products',
    STORES: '/analytics/stores',
  },
  
  // Settings
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
  },
} as const;

// Strapi Endpoints
export const STRAPI_ENDPOINTS = {
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  BANNERS: '/banners',
  PROMOTIONS: '/promotions',
  STORES: '/stores',
  STORE_INVENTORY: '/store-inventories',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
} as const;

// Order Statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Payment Statuses
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// Stock Statuses
export const STOCK_STATUSES = {
  IN_STOCK: 'in_stock',
  OUT_OF_STOCK: 'out_of_stock',
  PREORDER: 'preorder',
} as const;

// Discount Types
export const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_STATE: 'sidebar_state',
} as const;

// Socket Events
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ORDER_CREATED: 'order:created',
  ORDER_UPDATED: 'order:updated',
  INVENTORY_UPDATED: 'inventory:updated',
  PRODUCT_UPDATED: 'product:updated',
  NOTIFICATION_NEW: 'notification:new',
} as const;

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#64748b',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#06b6d4',
  GRADIENT: ['#3b82f6', '#1d4ed8', '#1e40af'],
} as const;

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created.',
  UPDATED: 'Successfully updated.',
  DELETED: 'Successfully deleted.',
  SAVED: 'Successfully saved.',
  SENT: 'Successfully sent.',
} as const;

// Navigation Items
export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    id: 'stores',
    label: 'Stores',
    path: '/stores',
    icon: 'Store',
    roles: [USER_ROLES.ADMIN],
  },
  {
    id: 'products',
    label: 'Products',
    path: '/products',
    icon: 'Package',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: 'Tags',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    id: 'orders',
    label: 'Orders',
    path: '/orders',
    icon: 'ShoppingCart',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    id: 'promotions',
    label: 'Promotions',
    path: '/promotions',
    icon: 'Percent',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    id: 'banners',
    label: 'Banners',
    path: '/banners',
    icon: 'Image',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    path: '/inventory',
    icon: 'Warehouse',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    id: 'users',
    label: 'Users',
    path: '/users',
    icon: 'Users',
    roles: [USER_ROLES.ADMIN],
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    roles: [USER_ROLES.ADMIN],
  },
] as const;
