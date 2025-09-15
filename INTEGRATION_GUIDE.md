# MultiStore Admin Dashboard Integration Guide

This guide explains how the Admin Dashboard integrates with both the MultiStore Backend and Strapi CMS.

## 🏗 Architecture Overview

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   Admin Dashboard   │    │  MultiStore Backend │    │   Strapi CMS        │
│   (React + TS)      │◄──►│   (Node.js + TS)    │◄──►│   (Headless CMS)    │
│   Port: 3000        │    │   Port: 4000        │    │   Port: 1337        │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

## 🔌 API Integration

### MultiStore Backend Integration

The dashboard communicates with the MultiStore Backend for:

#### Authentication
- **Login**: `POST /api/auth/login`
- **Refresh Token**: `POST /api/auth/refresh`
- **Current User**: `GET /api/auth/me`
- **Logout**: `POST /api/auth/logout`

#### Store Management
- **List Stores**: `GET /api/stores`
- **Get Store**: `GET /api/stores/:id`
- **Create Store**: `POST /api/stores`
- **Update Store**: `PUT /api/stores/:id`
- **Delete Store**: `DELETE /api/stores/:id`

#### Order Management
- **List Orders**: `GET /api/orders`
- **Get Order**: `GET /api/orders/:id`
- **Update Order Status**: `PATCH /api/orders/:id/status`

#### User Management
- **List Users**: `GET /api/users`
- **Get User**: `GET /api/users/:id`
- **Update User**: `PUT /api/users/:id`

#### Analytics
- **Dashboard Stats**: `GET /api/analytics/dashboard`
- **Sales Data**: `GET /api/analytics/sales`

### Strapi CMS Integration

The dashboard communicates with Strapi CMS for:

#### Product Management
- **List Products**: `GET /api/products`
- **Get Product**: `GET /api/products/:id`
- **Create Product**: `POST /api/products`
- **Update Product**: `PUT /api/products/:id`
- **Delete Product**: `DELETE /api/products/:id`

#### Category Management
- **List Categories**: `GET /api/categories`
- **Get Category**: `GET /api/categories/:id`
- **Create Category**: `POST /api/categories`
- **Update Category**: `PUT /api/categories/:id`
- **Delete Category**: `DELETE /api/categories/:id`

#### Content Management
- **Banners**: `GET /api/banners`
- **Promotions**: `GET /api/promotions`
- **Store Inventory**: `GET /api/store-inventories`

## 🔄 Real-time Integration

### Socket.IO Connection

The dashboard connects to the MultiStore Backend via Socket.IO for real-time updates:

```typescript
// Connection to MultiStore Backend
const socket = io('http://localhost:4000');

// Listen for real-time events
socket.on('order:created', (order) => {
  // Update orders list
});

socket.on('inventory:updated', (inventory) => {
  // Update inventory display
});

socket.on('product:updated', (product) => {
  // Update product catalog
});
```

### Webhook Integration

Strapi CMS sends webhooks to the MultiStore Backend when content changes:

1. **Product Updated** → MultiStore Backend → Dashboard (via Socket.IO)
2. **Inventory Updated** → MultiStore Backend → Dashboard (via Socket.IO)
3. **Promotion Updated** → MultiStore Backend → Dashboard (via Socket.IO)

## 🔐 Authentication Flow

### JWT Token Management

1. **Login**: User submits credentials
2. **Token Exchange**: Backend returns JWT + Refresh Token
3. **Token Storage**: Tokens stored in localStorage
4. **Auto Refresh**: Tokens automatically refreshed before expiry
5. **Logout**: Tokens cleared from storage

### Role-Based Access Control

```typescript
// Admin Role - Full Access
const adminPermissions = [
  'stores:read', 'stores:write', 'stores:delete',
  'products:read', 'products:write', 'products:delete',
  'orders:read', 'orders:write',
  'users:read', 'users:write', 'users:delete',
  'analytics:read', 'settings:read', 'settings:write'
];

// Manager Role - Limited Access
const managerPermissions = [
  'products:read', 'products:write',
  'orders:read', 'orders:write',
  'inventory:read', 'inventory:write',
  'analytics:read'
];
```

## 📊 Data Flow

### Dashboard Data Flow

1. **User Login** → MultiStore Backend → JWT Token
2. **Dashboard Load** → Fetch stats from MultiStore Backend
3. **Product List** → Fetch from Strapi CMS
4. **Real-time Updates** → Socket.IO from MultiStore Backend
5. **Content Changes** → Strapi Webhooks → MultiStore Backend → Socket.IO → Dashboard

### State Management

```typescript
// Zustand stores for state management
const useAuthStore = create<AuthState>()(/* auth logic */);
const useUIStore = create<UIState>()(/* UI state logic */);

// React Query for server state
const { data: products } = useQuery({
  queryKey: ['products'],
  queryFn: () => apiService.getProducts()
});
```

## 🎨 UI/UX Integration

### Design System

The dashboard uses a consistent design system:

- **Colors**: Primary (Blue), Success (Green), Warning (Yellow), Error (Red)
- **Typography**: Inter font family
- **Components**: Reusable UI components with TailwindCSS
- **Icons**: Lucide React icon library
- **Charts**: Recharts for data visualization

### Responsive Design

- **Desktop**: Full sidebar navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Bottom navigation

## 🔧 Configuration

### Environment Variables

```env
# API Endpoints
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_STRAPI_URL=http://localhost:1337/api
REACT_APP_SOCKET_URL=http://localhost:4000

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_REAL_TIME=true
```

### API Service Configuration

```typescript
// API client configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Strapi client configuration
const strapiClient = axios.create({
  baseURL: process.env.REACT_APP_STRAPI_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## 🚀 Deployment

### Development

1. Start MultiStore Backend: `npm run dev` (port 4000)
2. Start Strapi CMS: `npm run develop` (port 1337)
3. Start Admin Dashboard: `npm start` (port 3000)

### Production

1. Build the dashboard: `npm run build`
2. Serve static files with nginx or similar
3. Configure environment variables
4. Ensure backends are accessible

## 🧪 Testing Integration

### Manual Testing

1. **Authentication Flow**
   - Login with valid credentials
   - Verify token refresh
   - Test logout functionality

2. **Data Loading**
   - Verify dashboard stats load
   - Check product list from Strapi
   - Test real-time updates

3. **Role Permissions**
   - Test admin vs manager access
   - Verify restricted features

### Automated Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backends have proper CORS configuration
   - Check API URLs in environment variables

2. **Authentication Issues**
   - Verify JWT token format
   - Check token refresh logic
   - Ensure proper API headers

3. **Real-time Connection Issues**
   - Verify Socket.IO server is running
   - Check WebSocket connection
   - Review event listeners

4. **Data Loading Issues**
   - Check API endpoints
   - Verify data format
   - Review error handling

### Debug Tools

- **React DevTools**: Component inspection
- **Redux DevTools**: State management debugging
- **Network Tab**: API request monitoring
- **Console**: Error logging and debugging

## 📈 Performance Optimization

### Code Splitting

```typescript
// Lazy load components
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const ProductsPage = lazy(() => import('./pages/products/ProductsPage'));
```

### Caching Strategy

```typescript
// React Query caching
const { data } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

### Bundle Optimization

- Tree shaking for unused code
- Dynamic imports for large components
- Image optimization
- CSS purging with TailwindCSS

## 🔒 Security Considerations

### API Security

- JWT token validation
- HTTPS in production
- Input validation and sanitization
- Rate limiting

### Client Security

- XSS protection
- CSRF protection
- Secure token storage
- Content Security Policy

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Strapi Documentation](https://docs.strapi.io/)

---

**This integration guide ensures seamless communication between all three systems for optimal performance and user experience.**
