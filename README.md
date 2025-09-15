# Multi-Store Admin Dashboard

A comprehensive React-based admin dashboard for managing multi-store e-commerce operations. Built with modern technologies and designed for scalability, performance, and user experience.

## 🚀 Features

### Core Functionality
- **Role-based Access Control**: Admin and Manager roles with different permissions
- **Real-time Updates**: Socket.IO integration for live data synchronization
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Dark Mode**: Built-in theme switching capability
- **Comprehensive Analytics**: Charts and metrics using Recharts
- **Advanced Data Management**: Full CRUD operations with React Query

### Modules
- **Dashboard**: Overview with KPIs, charts, and real-time metrics
- **Stores Management**: Create, edit, and manage store locations
- **Products & Categories**: Complete product catalog management
- **Orders Management**: Order processing and status tracking
- **Inventory Management**: Stock tracking and low-stock alerts
- **Users Management**: User accounts and role assignment
- **Promotions & Banners**: Marketing campaign management
- **Settings**: System configuration and preferences

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **React Router v6** for navigation
- **Zustand** for state management
- **React Query (TanStack Query)** for data fetching
- **React Hook Form** with Zod validation
- **TailwindCSS** for styling
- **Recharts** for data visualization
- **Socket.IO Client** for real-time updates

### UI Components
- **Radix UI** primitives for accessible components
- **Lucide React** for icons
- **Framer Motion** for animations
- **React Hot Toast** for notifications

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Jest** for testing
- **React Testing Library** for component testing

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:4000`
- Strapi CMS running on `http://localhost:1337`

### Setup
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admin-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env.local
   ```
   
   Update the environment variables in `.env.local`:
   ```env
   REACT_APP_API_URL=http://localhost:4000/api
   REACT_APP_STRAPI_URL=http://localhost:1337/api
   REACT_APP_SOCKET_URL=http://localhost:4000
   REACT_APP_APP_NAME=Multi-Store Admin
   REACT_APP_APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── charts/          # Chart components
│   ├── dashboard/       # Dashboard-specific components
│   ├── forms/           # Form components
│   ├── layout/          # Layout components
│   └── ui/              # Base UI components
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hooks
│   ├── useStores.ts     # Store management hooks
│   ├── useProducts.ts   # Product management hooks
│   └── ...
├── pages/               # Page components
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # Dashboard pages
│   ├── stores/          # Store management pages
│   └── ...
├── schemas/             # Zod validation schemas
├── services/            # API services
├── stores/              # Zustand stores
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── constants/           # Application constants
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:4000/api` |
| `REACT_APP_STRAPI_URL` | Strapi CMS URL | `http://localhost:1337/api` |
| `REACT_APP_SOCKET_URL` | Socket.IO server URL | `http://localhost:4000` |
| `REACT_APP_APP_NAME` | Application name | `Multi-Store Admin` |
| `REACT_APP_APP_VERSION` | Application version | `1.0.0` |
| `REACT_APP_ENABLE_MONITORING` | Enable monitoring | `true` |
| `REACT_APP_ENABLE_CSRF_PROTECTION` | Enable CSRF protection | `true` |
| `REACT_APP_ENABLE_XSS_PROTECTION` | Enable XSS protection | `true` |
| `REACT_APP_ENABLE_CACHING` | Enable caching | `true` |
| `REACT_APP_CACHE_TTL` | Cache TTL in milliseconds | `300000` |

### API Integration

The dashboard integrates with two main APIs:

1. **Multi-Store Backend API** (`/api`)
- Authentication and user management
   - Store, product, and order management
- Analytics and reporting
- Real-time updates via Socket.IO

2. **Strapi CMS API** (`/api`)
   - Content management
   - Media handling
   - Product and category content

## 🎨 Theming

The application supports both light and dark themes:

```typescript
// Toggle theme programmatically
const { theme, setTheme } = useUIStore();
setTheme('dark'); // or 'light'
```

### Customizing Colors

Update the TailwindCSS configuration in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        // ... other colors
      },
    },
  },
};
```

## 📊 State Management

### Zustand Stores

1. **Auth Store** (`stores/authStore.ts`)
   - User authentication state
   - Token management
   - Login/logout functionality

2. **UI Store** (`stores/uiStore.ts`)
   - Theme management
   - Sidebar state
   - Notifications

3. **Socket Store** (`stores/socketStore.ts`)
   - Real-time connection management
   - Event handling

### React Query

- **Query Keys**: Centralized key management for caching
- **Mutations**: Optimistic updates and error handling
- **Background Refetching**: Automatic data synchronization
- **Cache Management**: Intelligent cache invalidation

## 🔐 Authentication

### Role-based Access Control

- **Admin**: Full system access
  - Manage all stores, products, and users
  - Access system settings
  - View all analytics

- **Manager**: Store-specific access
  - Manage assigned store products
  - Process store orders
  - View store analytics

### Security Features

- JWT token authentication
- Refresh token rotation
- CSRF protection
- XSS protection
- Rate limiting
- Input sanitization

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Features

- Collapsible sidebar
- Touch-friendly interactions
- Optimized data tables
- Mobile-specific navigation

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm test

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

### Test Structure

```
src/
├── __tests__/           # Test files
├── components/
│   └── __tests__/       # Component tests
└── utils/
    └── __tests__/       # Utility tests
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Docker Deployment

```bash
# Build Docker image
docker build -f Dockerfile.prod -t admin-dashboard .

# Run container
docker run -p 3000:80 admin-dashboard
```

### Environment-specific Builds

```bash
# Development
npm run build:dev

# Staging
npm run build:staging

# Production
npm run build:prod
```

## 📈 Performance

### Optimization Features

- **Code Splitting**: Lazy loading of routes and components
- **Memoization**: React.memo and useMemo for expensive operations
- **Virtual Scrolling**: For large data sets
- **Image Optimization**: WebP format and lazy loading
- **Bundle Analysis**: Webpack bundle analyzer integration

### Monitoring

- **Performance Metrics**: Core Web Vitals tracking
- **Error Tracking**: Sentry integration
- **Analytics**: User behavior tracking
- **Real-time Monitoring**: Socket.IO connection status

## 🔧 Development

### Code Style

- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Automatic code formatting
- **Husky**: Git hooks for pre-commit checks
- **Lint-staged**: Run linters on staged files

### Git Workflow

1. Create feature branch from `main`
2. Make changes and commit with conventional commits
3. Push branch and create pull request
4. Code review and merge to `main`

### Conventional Commits

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check the `/docs` folder
- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Email**: Contact the development team

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete admin dashboard functionality
- Role-based access control
- Real-time updates
- Responsive design
- Dark mode support

---

**Built with ❤️ for modern e-commerce management**