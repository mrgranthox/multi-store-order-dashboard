import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../utils';

const Topbar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen, theme, setTheme, notifications } = useUIStore();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const unreadNotifications = notifications.filter(n => !n.readAt).length;

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-secondary-100 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-secondary-600" />
          </button>

          {/* Search */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-secondary-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="input pl-10 w-64"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-secondary-600" />
            ) : (
              <Sun className="w-5 h-5 text-secondary-600" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-secondary-100 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-secondary-600" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-secondary-200 z-50">
                <div className="p-4 border-b border-secondary-200">
                  <h3 className="text-lg font-semibold text-secondary-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-secondary-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 border-b border-secondary-100 hover:bg-secondary-50 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={cn(
                            'w-2 h-2 rounded-full mt-2',
                            notification.type === 'success' && 'bg-success-500',
                            notification.type === 'error' && 'bg-error-500',
                            notification.type === 'warning' && 'bg-warning-500',
                            notification.type === 'info' && 'bg-primary-500'
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-secondary-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-secondary-600 mt-1">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-secondary-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-secondary-500">
                  {user?.role === 'admin' ? 'Administrator' : 'Store Manager'}
                </p>
              </div>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 z-50">
                <div className="py-1">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors">
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
