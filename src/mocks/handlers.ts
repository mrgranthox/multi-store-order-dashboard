import { rest } from 'msw';
import { API_CONFIG } from '../constants';

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'manager',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    lastLoginAt: '2024-01-14T14:20:00Z',
  },
];

const mockStores = [
  {
    id: '1',
    name: 'Main Store',
    address: '123 Main St, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'main@store.com',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Branch Store',
    address: '456 Branch Ave, City, State 12345',
    phone: '+1 (555) 987-6543',
    email: 'branch@store.com',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

const mockProducts = [
  {
    id: '1',
    name: 'Product 1',
    description: 'Description for product 1',
    price: 29.99,
    sku: 'PROD-001',
    stockStatus: 'in_stock',
    featured: true,
    isActive: true,
    images: ['https://via.placeholder.com/300x200'],
    category: { id: '1', name: 'Category 1' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Product 2',
    description: 'Description for product 2',
    price: 49.99,
    sku: 'PROD-002',
    stockStatus: 'out_of_stock',
    featured: false,
    isActive: true,
    images: ['https://via.placeholder.com/300x200'],
    category: { id: '2', name: 'Category 2' },
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    status: 'pending',
    total: 79.98,
    customer: { name: 'John Doe', email: 'john@example.com' },
    store: { name: 'Main Store' },
    items: [
      { name: 'Product 1', quantity: 2, price: 29.99 },
      { name: 'Product 2', quantity: 1, price: 49.99 },
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    status: 'delivered',
    total: 29.99,
    customer: { name: 'Jane Smith', email: 'jane@example.com' },
    store: { name: 'Branch Store' },
    items: [
      { name: 'Product 1', quantity: 1, price: 29.99 },
    ],
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
  },
];

const mockDashboardStats = {
  totalRevenue: 125000,
  totalOrders: 1250,
  activeStores: 5,
  averageOrderValue: 100,
  totalProducts: 150,
  activeUsers: 75,
};

export const handlers = [
  // Auth endpoints
  rest.post(`${API_CONFIG.BASE_URL}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          user: mockUsers[0],
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      })
    );
  }),

  rest.post(`${API_CONFIG.BASE_URL}/auth/register`, (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          user: mockUsers[0],
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      })
    );
  }),

  rest.post(`${API_CONFIG.BASE_URL}/auth/refresh`, (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          accessToken: 'new-mock-access-token',
          refreshToken: 'new-mock-refresh-token',
        },
      })
    );
  }),

  // Users endpoints
  rest.get(`${API_CONFIG.BASE_URL}/users`, (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: mockUsers,
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            total: mockUsers.length,
            totalPages: 1,
          },
        },
      })
    );
  }),

  rest.get(`${API_CONFIG.BASE_URL}/users/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const user = mockUsers.find(u => u.id === id);
    
    if (!user) {
      return res(
        ctx.status(404),
        ctx.json({ success: false, message: 'User not found' })
      );
    }

    return res(
      ctx.json({
        success: true,
        data: user,
      })
    );
  }),

  // Stores endpoints
  rest.get(`${API_CONFIG.BASE_URL}/stores`, (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: mockStores,
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            total: mockStores.length,
            totalPages: 1,
          },
        },
      })
    );
  }),

  rest.get(`${API_CONFIG.BASE_URL}/stores/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const store = mockStores.find(s => s.id === id);
    
    if (!store) {
      return res(
        ctx.status(404),
        ctx.json({ success: false, message: 'Store not found' })
      );
    }

    return res(
      ctx.json({
        success: true,
        data: store,
      })
    );
  }),

  // Products endpoints
  rest.get(`${API_CONFIG.BASE_URL}/products`, (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: mockProducts,
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            total: mockProducts.length,
            totalPages: 1,
          },
        },
      })
    );
  }),

  rest.get(`${API_CONFIG.BASE_URL}/products/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const product = mockProducts.find(p => p.id === id);
    
    if (!product) {
      return res(
        ctx.status(404),
        ctx.json({ success: false, message: 'Product not found' })
      );
    }

    return res(
      ctx.json({
        success: true,
        data: product,
      })
    );
  }),

  // Orders endpoints
  rest.get(`${API_CONFIG.BASE_URL}/orders`, (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: mockOrders,
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            total: mockOrders.length,
            totalPages: 1,
          },
        },
      })
    );
  }),

  rest.get(`${API_CONFIG.BASE_URL}/orders/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const order = mockOrders.find(o => o.id === id);
    
    if (!order) {
      return res(
        ctx.status(404),
        ctx.json({ success: false, message: 'Order not found' })
      );
    }

    return res(
      ctx.json({
        success: true,
        data: order,
      })
    );
  }),

  // Dashboard endpoints
  rest.get(`${API_CONFIG.BASE_URL}/dashboard/stats`, (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: mockDashboardStats,
      })
    );
  }),

  rest.get(`${API_CONFIG.BASE_URL}/dashboard/analytics`, (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          salesTrend: [
            { date: '2024-01-01', revenue: 1000 },
            { date: '2024-01-02', revenue: 1200 },
            { date: '2024-01-03', revenue: 800 },
          ],
          ordersByStatus: [
            { status: 'pending', count: 5 },
            { status: 'processing', count: 3 },
            { status: 'delivered', count: 12 },
          ],
          topProducts: [
            { name: 'Product 1', sales: 100 },
            { name: 'Product 2', sales: 80 },
            { name: 'Product 3', sales: 60 },
          ],
          storePerformance: [
            { name: 'Main Store', revenue: 50000 },
            { name: 'Branch Store', revenue: 30000 },
          ],
        },
      })
    );
  }),

  // Settings endpoints
  rest.get(`${API_CONFIG.BASE_URL}/settings`, (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          appName: 'MultiStore Admin',
          appDescription: 'Admin dashboard for multi-store management',
          appUrl: 'https://admin.multistore.com',
          supportEmail: 'support@multistore.com',
          supportPhone: '+1 (555) 123-4567',
          timezone: 'UTC',
          currency: 'USD',
          language: 'en',
          theme: 'light',
        },
      })
    );
  }),

  rest.put(`${API_CONFIG.BASE_URL}/settings`, (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: req.body,
      })
    );
  }),

  // Catch-all handler for unhandled requests
  rest.get('*', (req, res, ctx) => {
    console.warn(`Unhandled request: ${req.method} ${req.url}`);
    return res(
      ctx.status(404),
      ctx.json({ success: false, message: 'Not found' })
    );
  }),
];
