import React, { useState } from 'react';
import { Users, Search, Filter, Eye, Edit, Trash2, UserPlus, Shield, UserCheck, UserX } from 'lucide-react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/useUsers';
import { useAuthStore } from '../../stores/authStore';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { SkeletonTable, SkeletonStats } from '../../components/ui/Skeleton';
import { formatDate } from '../../utils';
import { User, FilterOptions } from '../../types';
import { useUIStore } from '../../stores/uiStore';

const UsersPage: React.FC = () => {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  const { data: usersData, isLoading } = useUsers(filters);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleCreateUser = async (data: Partial<User>) => {
    try {
      await createUserMutation.mutateAsync(data);
      addNotification({
        type: 'success',
        title: 'User Created',
        message: 'User has been created successfully',
      });
      setIsCreateModalOpen(false);
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: error.message || 'Failed to create user',
      });
    }
  };

  const handleUpdateUser = async (data: Partial<User>) => {
    if (!selectedUser) return;
    try {
      await updateUserMutation.mutateAsync({ id: selectedUser.id, data });
      addNotification({
        type: 'success',
        title: 'User Updated',
        message: 'User has been updated successfully',
      });
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update user',
      });
    }
  };

  const handleDeleteUser = async (user: User) => {
    // eslint-disable-next-line no-restricted-globals
    if (!window.confirm(`Are you sure you want to delete "${user.firstName} ${user.lastName}"?`)) return;
    try {
      await deleteUserMutation.mutateAsync(user.id);
      addNotification({
        type: 'success',
        title: 'User Deleted',
        message: 'User has been deleted successfully',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Deletion Failed',
        message: error.message || 'Failed to delete user',
      });
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const getRoleIcon = (role: string) => {
    const roleConfig = {
      admin: { icon: Shield, color: 'text-red-500' },
      manager: { icon: UserCheck, color: 'text-blue-500' },
      user: { icon: Users, color: 'text-gray-500' },
    };
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    const Icon = config.icon;
    return <Icon className={`h-4 w-4 ${config.color}`} />;
  };

  const getRoleColor = (role: string) => {
    const roleConfig = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800',
    };
    return roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      title: 'User',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {(row.firstName?.charAt(0) || '').toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.firstName} {row.lastName}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          {getRoleIcon(row.role)}
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(row.role)}`}>
            {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
          </span>
        </div>
      ),
    },
    {
      key: 'isActive',
      title: 'Status',
      render: (_, row) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          row.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created',
      sortable: true,
      render: (_, row) => (
        <span className="text-sm text-gray-500">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      key: 'updatedAt',
      title: 'Updated',
      render: (_, row) => (
        <span className="text-sm text-gray-500">{formatDate(row.updatedAt)}</span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewUser(row)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEditUser(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(row)} className="text-red-600 hover:text-red-700">
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage user accounts and permissions</p>
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <SkeletonStats cards={4} />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <SkeletonTable rows={5} columns={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage user accounts and permissions</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<UserPlus className="h-4 w-4" />}
        >
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search users..."
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
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {usersData?.meta?.pagination?.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {usersData?.data?.filter(user => user.isActive).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admins</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {usersData?.data?.filter(user => user.role === 'admin').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <UserX className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {usersData?.data?.filter(user => !user.isActive).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <DataTable
          data={usersData?.data || []}
          columns={columns}
          searchable={false}
          selectable={true}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          pagination={{
            page: filters.page || 1,
            pageSize: filters.pageSize || 10,
            total: usersData?.meta?.pagination?.total || 0,
            onPageChange: (page) => setFilters(prev => ({ ...prev, page })),
            onPageSizeChange: (pageSize) => setFilters(prev => ({ ...prev, pageSize, page: 1 })),
          }}
        />
      </div>

      {/* Modals */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
        size="lg"
      >
        <div className="p-6">
          <p className="text-gray-600">User creation form will be implemented here.</p>
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        title="Edit User"
        size="lg"
      >
        <div className="p-6">
          <p className="text-gray-600">User edit form will be implemented here.</p>
        </div>
      </Modal>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedUser(null);
        }}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-medium text-gray-600">
                    {selectedUser.firstName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {getRoleIcon(selectedUser.role)}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-sm">{selectedUser.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="text-sm">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Updated</p>
                  <p className="text-sm">{formatDate(selectedUser.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UsersPage;
