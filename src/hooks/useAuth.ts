import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { LoginCredentials, ForgotPasswordRequest, ResetPasswordRequest } from '../types';

// Auth Query Keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

// Login mutation
export const useLogin = () => {
  const { login: loginStore } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiService.login(credentials.email, credentials.password);
      return response;
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, tokens } = response.data;
        loginStore({ email: credentials.email, password: credentials.password });
        queryClient.setQueryData(authKeys.me(), user);
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

// Get current user
export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const response = await apiService.getCurrentUser();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.statusCode === 401) return false;
      return failureCount < 3;
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const { logout: logoutStore } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiService.logout();
    },
    onSuccess: () => {
      queryClient.clear();
      logoutStore();
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Still clear local state even if API call fails
      queryClient.clear();
      logoutStore();
    },
  });
};

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      const response = await apiService.forgotPassword(data.email);
      return response;
    },
    onError: (error) => {
      console.error('Forgot password failed:', error);
    },
  });
};

// Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await apiService.resetPassword(data.token, data.password);
      return response;
    },
    onError: (error) => {
      console.error('Reset password failed:', error);
    },
  });
};
