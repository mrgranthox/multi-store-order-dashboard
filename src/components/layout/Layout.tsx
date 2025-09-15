import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { ToastContainer } from '../ui/Toast';
import { useUIStore } from '../../stores/uiStore';
import { useSocket } from '../../hooks/useSocket';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarOpen, notifications, removeNotification } = useUIStore();
  
  // Initialize Socket.IO connection
  useSocket();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'lg:ml-64' : 'ml-0'
      }`}>
        {/* Topbar */}
        <Topbar />
        
        {/* Page Content */}
        <main className="p-4 lg:p-6 min-h-screen">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
};

export default Layout;
