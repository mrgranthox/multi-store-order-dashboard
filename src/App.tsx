import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryProvider } from "./hooks/useQueryClient";
import { useAuthStore } from "./stores/authStore";
import { useUIStore } from "./stores/uiStore";

// Pages
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import StoresPage from "./pages/stores/StoresPage";
import ProductsPage from "./pages/products/ProductsPage";
import CategoriesPage from "./pages/products/CategoriesPage";
import OrdersPage from "./pages/orders/OrdersPage";
import PromotionsPage from "./pages/promotions/PromotionsPage";
import BannersPage from "./pages/promotions/BannersPage";
import InventoryPage from "./pages/inventory/InventoryPage";
import UsersPage from "./pages/users/UsersPage";
import SettingsPage from "./pages/settings/SettingsPage";

// Components
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const { theme } = useUIStore();

  useEffect(() => {
    // Check authentication on app load
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <QueryProvider>
      <Router>
        <div className="min-h-screen bg-secondary-50">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage />
                )
              }
            />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                      />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/stores" element={<StoresPage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/promotions" element={<PromotionsPage />} />
                      <Route path="/banners" element={<BannersPage />} />
                      <Route path="/inventory" element={<InventoryPage />} />
                      <Route path="/users" element={<UsersPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route
                        path="*"
                        element={<Navigate to="/dashboard" replace />}
                      />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </QueryProvider>
  );
}

export default App;
