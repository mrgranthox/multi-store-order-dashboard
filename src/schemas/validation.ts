import { z } from 'zod';

// Authentication Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Store Schemas
export const storeSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters'),
  description: z.string().optional(),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  deliveryRadius: z.number().min(0, 'Delivery radius must be positive'),
  minOrderAmount: z.number().min(0, 'Minimum order amount must be positive'),
  isActive: z.boolean().default(true),
});

// Product Schemas
export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  sku: z.string().min(1, 'SKU is required'),
  stockStatus: z.enum(['in_stock', 'out_of_stock', 'preorder']),
  categoryId: z.string().optional(),
  featured: z.boolean().default(false),
  attributes: z.record(z.any()).optional(),
  nutritionInfo: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
});

// Category Schemas
export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Order Schemas
export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  specialInstructions: z.string().optional(),
});

export const orderSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  storeId: z.string().min(1, 'Store ID is required'),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  deliveryType: z.enum(['pickup', 'delivery']).optional(),
  deliveryAddress: z.record(z.any()).optional(),
  specialInstructions: z.string().optional(),
  paymentMethod: z.string().optional(),
});

// Promotion Schemas
export const promotionSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(0, 'Discount value must be positive'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  active: z.boolean().default(true),
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return endDate > startDate;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

// Banner Schemas
export const bannerSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  image: z.string().min(1, 'Image URL is required'),
  link: z.string().url('Invalid URL').optional(),
  isActive: z.boolean().default(true),
});

// User Schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  role: z.enum(['admin', 'manager']),
  storeId: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Inventory Schemas
export const inventorySchema = z.object({
  storeId: z.string().min(1, 'Store ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
  quantityAvailable: z.number().min(0, 'Quantity must be positive'),
  reservedQuantity: z.number().min(0, 'Reserved quantity must be positive'),
  reorderLevel: z.number().min(0, 'Reorder level must be positive').optional(),
  maxStockLevel: z.number().min(0, 'Max stock level must be positive').optional(),
  isAvailable: z.boolean().default(true),
  priceOverride: z.number().min(0, 'Price override must be positive').optional(),
});

// Settings Schemas
export const settingsSchema = z.object({
  webhookSecret: z.string().min(1, 'Webhook secret is required'),
  apiKeys: z.object({
    googleMaps: z.string().optional(),
    paymentProvider: z.string().optional(),
  }).optional(),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sms: z.boolean().default(false),
  }).optional(),
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  language: z.string().default('en'),
  timezone: z.string().default('UTC'),
});

// Filter Schemas
export const filterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  store: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// File Upload Schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['image', 'document']),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type StoreFormData = z.infer<typeof storeSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type OrderStatusFormData = z.infer<typeof orderStatusSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type PromotionFormData = z.infer<typeof promotionSchema>;
export type BannerFormData = z.infer<typeof bannerSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type InventoryFormData = z.infer<typeof inventorySchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
export type FilterFormData = z.infer<typeof filterSchema>;
export type FileUploadFormData = z.infer<typeof fileUploadSchema>;
