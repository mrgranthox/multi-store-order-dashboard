import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  API_CONFIG,
  API_ENDPOINTS,
  STRAPI_ENDPOINTS,
  STORAGE_KEYS,
} from "../constants";
import { storage } from "../utils";
import { 
  ApiResponse, 
  PaginatedResponse, 
  LoginResponse, 
  RefreshTokenResponse,
  User,
  Store,
  Product,
  Category,
  Order,
  Promotion,
  Banner,
  StoreInventory,
  DashboardStats,
  FilterOptions,
  ApiError,
  Settings
} from "../types";

class ApiService {
  private apiClient: AxiosInstance;
  private strapiClient: AxiosInstance;
  private refreshPromise: Promise<string | null> | null = null;

  constructor() {
    this.apiClient = this.createApiClient();
    this.strapiClient = this.createStrapiClient();
    this.setupInterceptors();
  }

  private createApiClient(): AxiosInstance {
    return axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: { "Content-Type": "application/json" },
    });
  }

  private createStrapiClient(): AxiosInstance {
    return axios.create({
      baseURL: API_CONFIG.STRAPI_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: { "Content-Type": "application/json" },
    });
  }

  public setAuthToken(token: string | null): void {
    if (token) {
      this.apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.apiClient.defaults.headers.common["Authorization"];
    }
  }

  private setupInterceptors(): void {
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await this.refreshToken();
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.apiClient(originalRequest);
            } else {
              this.clearAuth();
              window.location.href = "/login";
            }
          } catch (refreshError) {
            this.clearAuth();
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public async refreshToken(): Promise<string | null> {
    if (this.refreshPromise) return this.refreshPromise;
    
    this.refreshPromise = this.performRefreshToken();
    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefreshToken(): Promise<string | null> {
    try {
      const refreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post<RefreshTokenResponse>(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      storage.set(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      storage.set(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

      this.setAuthToken(accessToken);
      return accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  }

  private clearAuth(): void {
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    storage.remove(STORAGE_KEYS.USER_DATA);
    this.setAuthToken(null);
  }

  public async logout(): Promise<void> {
    const refreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
    try {
      if (refreshToken) {
        await this.request<void>(this.apiClient, {
          method: "POST",
          url: API_ENDPOINTS.AUTH.LOGOUT,
          data: { refreshToken },
        });
      }
    } finally {
      this.clearAuth();
    }
  }

  private async request<T>(
    client: AxiosInstance,
    config: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await client(config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || "An error occurred",
        errors: error.response.data?.errors,
        requestId: error.response.data?.requestId,
        timestamp: error.response.data?.timestamp,
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        message: "Network error. Please check your connection.",
        status: 0,
      };
    } else {
      return {
        success: false,
        message: error.message || "Unexpected error",
        status: 500,
      };
    }
  }

  private buildQueryParams(filters?: FilterOptions): string {
    if (!filters) return '';
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }

  // --- Authentication methods ---
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>(this.apiClient, {
      method: "POST",
      url: API_ENDPOINTS.AUTH.LOGIN,
      data: { email, password },
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(this.apiClient, {
      method: "GET",
      url: API_ENDPOINTS.AUTH.ME,
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(this.apiClient, {
      method: "POST",
      url: API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data: { email },
    });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(this.apiClient, {
      method: "POST",
      url: API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data: { token, password },
    });
  }

  // --- Store methods ---
  async getStores(filters?: FilterOptions): Promise<PaginatedResponse<Store>> {
    const queryParams = this.buildQueryParams(filters);
    return this.request<PaginatedResponse<Store>>(this.apiClient, {
      method: "GET",
      url: `${API_ENDPOINTS.STORES.LIST}${queryParams}`,
    });
  }

  async getStore(id: string): Promise<ApiResponse<Store>> {
    return this.request<ApiResponse<Store>>(this.apiClient, {
      method: "GET",
      url: API_ENDPOINTS.STORES.GET(id),
    });
  }

  async createStore(data: Partial<Store>): Promise<ApiResponse<Store>> {
    return this.request<ApiResponse<Store>>(this.apiClient, {
      method: "POST",
      url: API_ENDPOINTS.STORES.CREATE,
      data,
    });
  }

  async updateStore(id: string, data: Partial<Store>): Promise<ApiResponse<Store>> {
    return this.request<ApiResponse<Store>>(this.apiClient, {
      method: "PUT",
      url: API_ENDPOINTS.STORES.UPDATE(id),
      data,
    });
  }

  async deleteStore(id: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(this.apiClient, {
      method: "DELETE",
      url: API_ENDPOINTS.STORES.DELETE(id),
    });
  }

  // --- Product methods ---
  async getProducts(filters?: FilterOptions): Promise<PaginatedResponse<Product>> {
    const queryParams = this.buildQueryParams(filters);
    return this.request<PaginatedResponse<Product>>(this.apiClient, {
      method: "GET",
      url: `${API_ENDPOINTS.PRODUCTS.LIST}${queryParams}`,
    });
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.request<ApiResponse<Product>>(this.apiClient, {
      method: "GET",
      url: API_ENDPOINTS.PRODUCTS.GET(id),
    });
  }

  async createProduct(data: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request<ApiResponse<Product>>(this.apiClient, {
      method: "POST",
      url: API_ENDPOINTS.PRODUCTS.CREATE,
      data,
    });
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request<ApiResponse<Product>>(this.apiClient, {
      method: "PUT",
      url: API_ENDPOINTS.PRODUCTS.UPDATE(id),
      data,
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(this.apiClient, {
      method: "DELETE",
      url: API_ENDPOINTS.PRODUCTS.DELETE(id),
    });
  }

  async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    return this.request<ApiResponse<Product[]>>(this.apiClient, {
      method: "GET",
      url: `${API_ENDPOINTS.PRODUCTS.SEARCH}?q=${encodeURIComponent(query)}`,
    });
  }

  // --- Category methods ---
  async getCategories(filters?: FilterOptions): Promise<PaginatedResponse<Category>> {
    const queryParams = this.buildQueryParams(filters);
    return this.request<PaginatedResponse<Category>>(this.apiClient, {
      method: "GET",
      url: `${API_ENDPOINTS.CATEGORIES.LIST}${queryParams}`,
    });
  }

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return this.request<ApiResponse<Category>>(this.apiClient, {
      method: "GET",
      url: API_ENDPOINTS.CATEGORIES.GET(id),
    });
  }

  async createCategory(data: Partial<Category>): Promise<ApiResponse<Category>> {
    return this.request<ApiResponse<Category>>(this.apiClient, {
      method: "POST",
      url: API_ENDPOINTS.CATEGORIES.CREATE,
      data,
    });
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<ApiResponse<Category>> {
    return this.request<ApiResponse<Category>>(this.apiClient, {
      method: "PUT",
      url: API_ENDPOINTS.CATEGORIES.UPDATE(id),
      data,
    });
  }

  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(this.apiClient, {
      method: "DELETE",
      url: API_ENDPOINTS.CATEGORIES.DELETE(id),
    });
  }

  // --- Order methods ---
  async getOrders(filters?: FilterOptions): Promise<PaginatedResponse<Order>> {
    const queryParams = this.buildQueryParams(filters);
    return this.request<PaginatedResponse<Order>>(this.apiClient, {
      method: "GET",
      url: `${API_ENDPOINTS.ORDERS.LIST}${queryParams}`,
    });
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<ApiResponse<Order>>(this.apiClient, {
      method: "GET",
      url: API_ENDPOINTS.ORDERS.GET(id),
    });
  }

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<Order>> {
    return this.request<ApiResponse<Order>>(this.apiClient, {
      method: "PUT",
      url: API_ENDPOINTS.ORDERS.UPDATE_STATUS(id),
      data: { status },
    });
  }

  // --- User methods ---
  async getUsers(filters?: FilterOptions): Promise<PaginatedResponse<User>> {
    const queryParams = this.buildQueryParams(filters);
    return this.request<PaginatedResponse<User>>(this.apiClient, {
      method: "GET",
      url: `${API_ENDPOINTS.USERS.LIST}${queryParams}`,
    });
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(this.apiClient, {
      method: "GET",
      url: API_ENDPOINTS.USERS.GET(id),
    });
  }

  async createUser(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(this.apiClient, {
      method: "POST",
      url: API_ENDPOINTS.USERS.CREATE,
      data,
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(this.apiClient, {
      method: "PUT",
      url: API_ENDPOINTS.USERS.UPDATE(id),
      data,
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(this.apiClient, {
      method: "DELETE",
      url: API_ENDPOINTS.USERS.DELETE(id),
    });
  }

  // --- Inventory methods ---
  async getInventory(filters?: FilterOptions): Promise<PaginatedResponse<StoreInventory>> {
    const queryParams = this.buildQueryParams(filters);
    return this.request<PaginatedResponse<StoreInventory>>(this.apiClient, {
      method: "GET",
      url: `${API_ENDPOINTS.INVENTORY.LIST}${queryParams}`,
    });
  }

  async getLowStockItems(): Promise<ApiResponse<StoreInventory[]>> {
    return this.request<ApiResponse<StoreInventory[]>>(this.apiClient, {
      method: "GET",
      url: API_ENDPOINTS.INVENTORY.LOW_STOCK,
    });
  }

  async updateInventory(id: string, data: Partial<StoreInventory>): Promise<ApiResponse<StoreInventory>> {
    return this.request<ApiResponse<StoreInventory>>(this.apiClient, {
      method: "PUT",
      url: API_ENDPOINTS.INVENTORY.UPDATE(id),
      data,
    });
  }

  // --- Analytics methods ---
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<ApiResponse<DashboardStats>>(this.apiClient, {
      method: "GET",
      url: API_ENDPOINTS.ANALYTICS.DASHBOARD,
    });
  }

  async getSalesAnalytics(filters?: FilterOptions): Promise<ApiResponse<any>> {
    const queryParams = this.buildQueryParams(filters);
    return this.request<ApiResponse<any>>(this.apiClient, {
      method: "GET",
      url: `${API_ENDPOINTS.ANALYTICS.SALES}${queryParams}`,
    });
  }

  // Legacy method alias for backward compatibility
  async getSalesData(filters?: FilterOptions): Promise<ApiResponse<any>> {
    return this.getSalesAnalytics(filters);
  }

  // // Legacy method alias for backward compatibility
  // async getSalesData(filters?: FilterOptions): Promise<ApiResponse<any>> {
  //   return this.getSalesAnalytics(filters);
  // }

  // --- Settings methods ---
  async getSettings(): Promise<ApiResponse<Settings>> {
    return this.request<ApiResponse<Settings>>(this.apiClient, {
      method: "GET",
      url: API_ENDPOINTS.SETTINGS.GET,
    });
  }

  async updateSettings(data: Partial<Settings>): Promise<ApiResponse<Settings>> {
    return this.request<ApiResponse<Settings>>(this.apiClient, {
      method: "PUT",
      url: API_ENDPOINTS.SETTINGS.UPDATE,
      data,
    });
  }

  // --- File upload methods ---
  async uploadFile(file: File, type: 'image' | 'document'): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request<ApiResponse<{ url: string }>>(this.apiClient, {
      method: "POST",
      url: "/upload",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // --- Strapi methods ---
  async getStrapiProducts(filters?: FilterOptions): Promise<ApiResponse<Product[]>> {
    const queryParams = this.buildQueryParams(filters);
    return this.request<ApiResponse<Product[]>>(this.strapiClient, {
      method: "GET",
      url: `${STRAPI_ENDPOINTS.PRODUCTS}${queryParams}`,
    });
  }

  async getStrapiCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<ApiResponse<Category[]>>(this.strapiClient, {
      method: "GET",
      url: STRAPI_ENDPOINTS.CATEGORIES,
    });
  }

  async getStrapiBanners(): Promise<ApiResponse<Banner[]>> {
    return this.request<ApiResponse<Banner[]>>(this.strapiClient, {
      method: "GET",
      url: STRAPI_ENDPOINTS.BANNERS,
    });
  }

  async getStrapiPromotions(): Promise<ApiResponse<Promotion[]>> {
    return this.request<ApiResponse<Promotion[]>>(this.strapiClient, {
      method: "GET",
      url: STRAPI_ENDPOINTS.PROMOTIONS,
    });
  }
}

export const apiService = new ApiService();
export default apiService;