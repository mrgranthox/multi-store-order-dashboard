import React from 'react';
import { Warehouse } from 'lucide-react';

const InventoryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Inventory</h1>
        <p className="text-secondary-600">Track and manage store inventory levels</p>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="text-center py-12">
            <Warehouse className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">Inventory Management</h3>
            <p className="text-secondary-600">This page will contain the inventory management interface</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
