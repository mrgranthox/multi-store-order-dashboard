import React from 'react';
import { Settings } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-600">Configure system settings and preferences</p>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">System Settings</h3>
            <p className="text-secondary-600">This page will contain the system settings interface</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
