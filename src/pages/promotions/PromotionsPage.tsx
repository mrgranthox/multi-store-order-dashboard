import React from 'react';
import { Percent, Plus } from 'lucide-react';

const PromotionsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Promotions</h1>
          <p className="text-secondary-600">Create and manage promotional offers</p>
        </div>
        <button className="btn-primary btn-md">
          <Plus className="w-4 h-4 mr-2" />
          Add Promotion
        </button>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="text-center py-12">
            <Percent className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">Promotions Management</h3>
            <p className="text-secondary-600">This page will contain the promotions management interface</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage;
