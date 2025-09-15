// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "manager";
  storeId?: string;
  isActive: boolean;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
  message: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// Store Types
export interface Store {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  openingHours?: Record<string, { open: string; close: string }>;
  isActive: boolean;
  storeImage?: string;
  deliveryRadius: number;
  minOrderAmount: number;
  createdAt: string;
  updatedAt: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  sku: string;
  stockStatus: "in_stock" | "out_of_stock" | "preorder";
  images?: string[];
  category?: Category;
  featured: boolean;
  attributes?: Record<string, any>;
  nutritionInfo?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  storeId: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";
  totalAmount: number;
  taxAmount: number;
  deliveryFee: number;
  discountAmount: number;
  paymentMethod?: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  deliveryType?: "pickup" | "delivery";
  deliveryAddress?: Record<string, any>;
  estimatedPickupTime?: string;
  actualPickupTime?: string;
  specialInstructions?: string;
  items: OrderItem[];
  user: User;
  store: Store;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
}

// Promotion Types
export interface Promotion {
  id: string;
  title: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Banner Types
export interface Banner {
  id: string;
  title: string;
  image: string;
  link?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Inventory Types
export interface StoreInventory {
  id: string;
  storeId: string;
  productId: string;
  quantityAvailable: number;
  reservedQuantity: number;
  reorderLevel?: number;
  maxStockLevel?: number;
  lastRestocked?: string;
  isAvailable: boolean;
  priceOverride?: number;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  requestId?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
  requestId?: string;
  timestamp?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  requestId?: string;
  timestamp?: string;
  statusCode?: number;
}

// UI State Types
export interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  notifications: Notification[];
  loading: boolean;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  createdAt: string;
  readAt?: string;
}

// Chart Data Types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

export interface StorePerformance {
  storeId: string;
  storeName: string;
  sales: number;
  orders: number;
  growth: number;
}

// Form Types
export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  sku: string;
  stockStatus: "in_stock" | "out_of_stock" | "preorder";
  categoryId?: string;
  featured: boolean;
  attributes?: Record<string, any>;
  isActive: boolean;
}

export interface StoreFormData {
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  deliveryRadius: number;
  minOrderAmount: number;
  isActive: boolean;
}

export interface PromotionFormData {
  title: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

// Filter and Search Types
export interface FilterOptions {
  search?: string;
  status?: string;
  category?: string;
  store?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Socket.IO Types
export interface SocketEvents {
  "order:created": (order: Order) => void;
  "order:updated": (order: Order) => void;
  "inventory:updated": (inventory: StoreInventory) => void;
  "product:updated": (product: Product) => void;
  "notification:new": (notification: Notification) => void;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalOrders: number,
    totalRevenue: number,
    totalProducts: number,
    totalStores: number,
    activeUsers: number,
    pendingOrders: number,
    ordersGrowth: number,
    revenueGrowth: number,
    productsGrowth: number,
    storesGrowth: number,
    usersGrowth: number,
    chartData: [],
    ordersByStatus: [],
}

// Settings Types
export interface AppSettings {
  webhookSecret: string;
  apiKeys: {
    googleMaps?: string;
    paymentProvider?: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme: "light" | "dark" | "auto";
  language: string;
  timezone: string;
}

export interface Settings {
  appName: string;
  appDescription: string;
  appUrl: string;
  supportEmail: string;
  supportPhone: string;
  timezone: string;
  currency: string;
  language: string;
  theme: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
    passwordPolicy: string;
  };
  features: {
    analytics: boolean;
    reports: boolean;
    apiAccess: boolean;
    webhooks: boolean;
  };
}
