import React, { useState } from 'react';
import { Plus, Search, Filter, MapPin, Phone, Mail, Edit, Trash2, Eye } from 'lucide-react';
import { useStores, useCreateStore, useUpdateStore, useDeleteStore } from '../../hooks/useStores';
import { useAuthStore } from '../../stores/authStore';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import  LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils';
import { Store, FilterOptions } from '../../types';
import { useUIStore } from '../../stores/uiStore';

const StoresPage: React.FC = () => {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Store[]>([]);

  const { data: storesData, isLoading } = useStores(filters);
  const createStoreMutation = useCreateStore();
  const updateStoreMutation = useUpdateStore();
  const deleteStoreMutation = useDeleteStore();

  const handleCreateStore = async (data: Partial<Store>) => {
    try {
      await createStoreMutation.mutateAsync(data);
      addNotification({
        type: 'success',
        title: 'Store Created',
        message: 'Store has been created successfully',
      });
      setIsCreateModalOpen(false);
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: error.message || 'Failed to create store',
      });
    }
  };

  const handleUpdateStore = async (data: Partial<Store>) => {
    if (!selectedStore) return;
    
    try {
      await updateStoreMutation.mutateAsync({ id: selectedStore.id, data });
      addNotification({
        type: 'success',
        title: 'Store Updated',
        message: 'Store has been updated successfully',
      });
      setIsEditModalOpen(false);
      setSelectedStore(null);
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update store',
      });
    }
  };

  const handleDeleteStore = async (store: Store) => {
    // eslint-disable-next-line no-restricted-globals
    if (!window.confirm(`Are you sure you want to delete "${store.name}"?`)) return;
    
    try {
      await deleteStoreMutation.mutateAsync(store.id);
      addNotification({
        type: 'success',
        title: 'Store Deleted',
        message: 'Store has been deleted successfully',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Deletion Failed',
        message: error.message || 'Failed to delete store',
      });
    }
  };

  const handleViewStore = (store: Store) => {
    setSelectedStore(store);
    setIsDetailsModalOpen(true);
  };

  const handleEditStore = (store: Store) => {
    setSelectedStore(store);
    setIsEditModalOpen(true);
  };

  const columns: Column<Store>[] = [
    {
      key: 'name',
      title: 'Store Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <MapPin className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.city}, {row.state}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'address',
      title: 'Address',
      render: (value, row) => (
        <div className="text-sm">
          <div className="text-gray-900">{value}</div>
          <div className="text-gray-500">{row.city}, {row.state} {row.zipCode}</div>
        </div>
      ),
    },
    {
      key: 'phone',
      title: 'Contact',
      render: (value, row) => (
        <div className="text-sm">
          {value && (
            <div className="flex items-center text-gray-600">
              <Phone className="h-4 w-4 mr-1" />
              {value}
            </div>
          )}
          {row.email && (
            <div className="flex items-center text-gray-600">
              <Mail className="h-4 w-4 mr-1" />
              {row.email}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'deliveryRadius',
      title: 'Delivery Radius',
      render: (value) => (
        <span className="text-sm text-gray-900">{value} miles</span>
      ),
    },
    {
      key: 'minOrderAmount',
      title: 'Min Order',
      render: (value) => (
        <span className="text-sm text-gray-900">{formatCurrency(value)}</span>
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
        <span className="text-sm text-gray-500">{formatDate(value)}</span>
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
            onClick={() => handleViewStore(row)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditStore(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteStore(row)}
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
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Stores Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your store locations and settings
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Store
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search stores..."
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
              <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Stores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {storesData?.meta?.pagination?.total || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Stores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {storesData?.data?.filter(store => store.isActive).length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <MapPin className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Delivery Radius</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(
                    (storesData?.data?.reduce((sum, store) => sum + store.deliveryRadius, 0) ?? 0) / 
                    (storesData?.data?.length || 1)
                  )}
                  mi
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Min Order</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(
                ((storesData?.data?.reduce((sum, store) => sum + store.minOrderAmount, 0) ?? 0) / 
                (storesData?.data?.length || 1))
              )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stores Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <DataTable
          data={storesData?.data || []}
          columns={columns}
          searchable={false}
          selectable={true}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          pagination={{
            page: filters.page || 1,
            pageSize: filters.pageSize || 10,
            total: storesData?.meta?.pagination?.total || 0,
            onPageChange: (page) => setFilters(prev => ({ ...prev, page })),
            onPageSizeChange: (pageSize) => setFilters(prev => ({ ...prev, pageSize, page: 1 })),
          }}
        />
      </div>

      {/* Modals */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Store"
        size="lg"
      >
        <div className="p-6">
          <p className="text-gray-600">Store creation form will be implemented here.</p>
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStore(null);
        }}
        title="Edit Store"
        size="lg"
      >
        <div className="p-6">
          <p className="text-gray-600">Store edit form will be implemented here.</p>
        </div>
      </Modal>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedStore(null);
        }}
        title="Store Details"
        size="lg"
      >
        {selectedStore && (
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedStore.name}</h3>
                <p className="text-gray-600">{selectedStore.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-sm">{selectedStore.address}</p>
                  <p className="text-sm">{selectedStore.city}, {selectedStore.state} {selectedStore.zipCode}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  {selectedStore.phone && <p className="text-sm">{selectedStore.phone}</p>}
                  {selectedStore.email && <p className="text-sm">{selectedStore.email}</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StoresPage;
