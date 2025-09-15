import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, LoginResponse } from "../types";
import { apiService } from "../services/api";
import { storage } from "../utils";
import { STORAGE_KEYS } from "../constants";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiService.login(email, password);

          if (!response?.success || !response?.data) {
            throw new Error(response?.message || "Invalid login response");
          }

          const { user, tokens } = response.data;

          storage.set(STORAGE_KEYS.AUTH_TOKEN, tokens.accessToken);
          storage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
          storage.set(STORAGE_KEYS.USER_DATA, user);

          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.message || "Login failed",
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          const refreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
          if (refreshToken) {
            await apiService.logout(); // pass refresh token to backend
          }
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          storage.remove(STORAGE_KEYS.AUTH_TOKEN);
          storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
          storage.remove(STORAGE_KEYS.USER_DATA);

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      refreshAuth: async () => {
        const refreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          get().logout();
          return;
        }

        try {
          const newToken = await apiService.refreshToken();
          if (newToken) {
            const newRefreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
            set((state) => ({
              ...state,
              accessToken: newToken,
              refreshToken: newRefreshToken,
              isAuthenticated: true,
              error: null,
            }));
          } else {
            get().logout();
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
          get().logout();
        }
      },

      checkAuth: async () => {
        const token = storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
        const user = storage.get<User>(STORAGE_KEYS.USER_DATA);

        if (!token || !user) {
          get().logout();
          return false;
        }

        set({ 
          user, 
          accessToken: token, 
          isAuthenticated: true,
          error: null,
        });
        return true;
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user: User) => {
        set({ user });
        storage.set(STORAGE_KEYS.USER_DATA, user);
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
        storage.set(STORAGE_KEYS.AUTH_TOKEN, accessToken);
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
