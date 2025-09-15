import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../authStore';

// Mock the API service
jest.mock('../../services/api', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
  },
}));

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useAuthStore.getState().clearError();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set user and tokens on successful login', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const mockTokens = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    // Mock the API response
    const { authService } = require('../../services/api');
    authService.login.mockResolvedValue({
      user: mockUser,
      accessToken: mockTokens.accessToken,
      refreshToken: mockTokens.refreshToken,
    });

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('john@example.com', 'password');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.accessToken).toBe(mockTokens.accessToken);
    expect(result.current.refreshToken).toBe(mockTokens.refreshToken);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle login error', async () => {
    const { authService } = require('../../services/api');
    authService.login.mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('invalid@example.com', 'wrongpassword');
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe('Invalid credentials');
  });

  it('should logout and clear state', async () => {
    const { authService } = require('../../services/api');
    authService.logout.mockResolvedValue({});

    const { result } = renderHook(() => useAuthStore());

    // First set some state
    act(() => {
      result.current.setUser({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      });
      result.current.setTokens('access-token', 'refresh-token');
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setError('Some error');
    });

    expect(result.current.error).toBe('Some error');

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('should set user and tokens directly', () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser(mockUser);
      result.current.setTokens('access-token', 'refresh-token');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.accessToken).toBe('access-token');
    expect(result.current.refreshToken).toBe('refresh-token');
    expect(result.current.isAuthenticated).toBe(true);
  });
});
