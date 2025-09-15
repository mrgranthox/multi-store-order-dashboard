import React from 'react';
import { Tags, Plus } from 'lucide-react';

const CategoriesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Categories</h1>
          <p className="text-secondary-600">Organize your products into categories</p>
        </div>
        <button className="btn-primary btn-md">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="text-center py-12">
            <Tags className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">Categories Management</h3>
            <p className="text-secondary-600">This page will contain the categories management interface</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
