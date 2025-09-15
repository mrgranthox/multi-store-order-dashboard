import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { DashboardPage } from '../dashboard/DashboardPage';

// Mock the hooks
jest.mock('../../hooks/useDashboardStats', () => ({
  useDashboardStats: () => ({
    data: {
      totalRevenue: 125000,
      totalOrders: 1250,
      activeStores: 5,
      averageOrderValue: 100,
    },
    isLoading: false,
    error: null,
  }),
}));

jest.mock('../../hooks/useSalesAnalytics', () => ({
  useSalesAnalytics: () => ({
    data: {
      salesTrend: [
        { date: '2024-01-01', revenue: 1000 },
        { date: '2024-01-02', revenue: 1200 },
      ],
      ordersByStatus: [
        { status: 'pending', count: 5 },
        { status: 'delivered', count: 12 },
      ],
      topProducts: [
        { name: 'Product 1', sales: 100 },
        { name: 'Product 2', sales: 80 },
      ],
      storePerformance: [
        { name: 'Main Store', revenue: 50000 },
        { name: 'Branch Store', revenue: 30000 },
      ],
    },
    isLoading: false,
    error: null,
  }),
}));

jest.mock('../../stores/authStore', () => ({
  useAuthStore: () => ({
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
    },
    isAuthenticated: true,
  }),
}));

jest.mock('../../stores/uiStore', () => ({
  useUIStore: () => ({
    addNotification: jest.fn(),
  }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('DashboardPage', () => {
  it('renders dashboard title and description', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Welcome to your admin dashboard')).toBeInTheDocument();
  });

  it('renders stats cards with correct data', async () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('$125,000.00')).toBeInTheDocument();
      expect(screen.getByText('Total Orders')).toBeInTheDocument();
      expect(screen.getByText('1,250')).toBeInTheDocument();
      expect(screen.getByText('Active Stores')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Avg Order Value')).toBeInTheDocument();
      expect(screen.getByText('$100.00')).toBeInTheDocument();
    });
  });

  it('renders charts section', async () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Sales Trend')).toBeInTheDocument();
      expect(screen.getByText('Orders by Status')).toBeInTheDocument();
      expect(screen.getByText('Top Products')).toBeInTheDocument();
      expect(screen.getByText('Store Performance')).toBeInTheDocument();
    });
  });

  it('renders recent activity section', async () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });
  });

  it('renders quick actions section', async () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });
  });
});
