import React, { useState } from 'react';
import { Plus, Search, Filter, Package, Edit, Trash2, Eye, Star, TrendingUp } from 'lucide-react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useProducts';
import { useAuthStore } from '../../stores/authStore';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
//import  LoadingSpinner  from '../../components/ui/LoadingSpinner';
import { SkeletonTable, SkeletonStats } from '../../components/ui/Skeleton';
import { formatCurrency, formatDate } from '../../utils';
import { Product, FilterOptions } from '../../types';
import { useUIStore } from '../../stores/uiStore';

const ProductsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Product[]>([]);

  const { data: productsData, isLoading } = useProducts(filters);
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const handleCreateProduct = async (data: Partial<Product>) => {
    try {
      await createProductMutation.mutateAsync(data);
      addNotification({
        type: 'success',
        title: 'Product Created',
        message: 'Product has been created successfully',
      });
      setIsCreateModalOpen(false);
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: error.message || 'Failed to create product',
      });
    }
  };

  const handleUpdateProduct = async (data: Partial<Product>) => {
    if (!selectedProduct) return;
    
    try {
      await updateProductMutation.mutateAsync({ id: selectedProduct.id, data });
      addNotification({
        type: 'success',
        title: 'Product Updated',
        message: 'Product has been updated successfully',
      });
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update product',
      });
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    
    try {
      await deleteProductMutation.mutateAsync(product.id);
      addNotification({
        type: 'success',
        title: 'Product Deleted',
        message: 'Product has been deleted successfully',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Deletion Failed',
        message: error.message || 'Failed to delete product',
      });
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const columns: Column<Product>[] = [
    {
      key: 'name',
      title: 'Product',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {row.images && row.images.length > 0 ? (
              <img 
                src={row.images[0]} 
                alt={value as string}
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <Package className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">SKU: {row.sku}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      title: 'Price',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{formatCurrency(value as number)}</span>
      ),
    },
    {
      key: 'category',
      title: 'Category',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value ? (value as any).name : 'Uncategorized'}
        </span>
      ),
    },
    {
      key: 'stockStatus',
      title: 'Stock',
      render: (value) => {
        const status = value as string;
        const statusConfig = {
          in_stock: { color: 'bg-green-100 text-green-800', label: 'In Stock' },
          out_of_stock: { color: 'bg-red-100 text-red-800', label: 'Out of Stock' },
          preorder: { color: 'bg-yellow-100 text-yellow-800', label: 'Pre-order' },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.in_stock;
        
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      key: 'featured',
      title: 'Featured',
      render: (value) => (
        <div className="flex items-center">
          {value ? (
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
          ) : (
            <div className="h-4 w-4" />
          )}
        </div>
      ),
    },
    {
      key: 'isActive',
      title: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500">{formatDate(value as string)}</span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewProduct(row)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditProduct(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteProduct(row)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your product catalog</p>
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <SkeletonStats cards={4} />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <SkeletonTable rows={5} columns={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your product catalog</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
          Filters
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {productsData?.meta?.pagination?.total || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {productsData?.data?.filter(product => product.isActive).length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Featured Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {productsData?.data?.filter(product => product.featured).length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Package className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {productsData?.data?.filter(product => product.stockStatus === 'out_of_stock').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <DataTable
          data={productsData?.data || []}
          columns={columns}
          searchable={false}
          selectable={true}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          pagination={{
            page: filters.page || 1,
            pageSize: filters.pageSize || 10,
            total: productsData?.meta?.pagination?.total || 0,
            onPageChange: (page) => setFilters(prev => ({ ...prev, page })),
            onPageSizeChange: (pageSize) => setFilters(prev => ({ ...prev, pageSize, page: 1 })),
          }}
        />
      </div>

      {/* Modals */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Product"
        size="lg"
      >
        <div className="p-6">
          <p className="text-gray-600">Product creation form will be implemented here.</p>
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        title="Edit Product"
        size="lg"
      >
        <div className="p-6">
          <p className="text-gray-600">Product edit form will be implemented here.</p>
        </div>
      </Modal>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedProduct(null);
        }}
        title="Product Details"
        size="lg"
      >
        {selectedProduct && (
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <img 
                      src={selectedProduct.images[0]} 
                      alt={selectedProduct.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedProduct.price)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">SKU</p>
                  <p className="text-sm">{selectedProduct.sku}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Stock Status</p>
                  <p className="text-sm capitalize">{selectedProduct.stockStatus.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-sm">{selectedProduct.category?.name || 'Uncategorized'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Featured</p>
                  <p className="text-sm">{selectedProduct.featured ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductsPage;
