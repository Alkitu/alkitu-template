'use client';
import React, { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  SearchIcon,
  Filter,
  MoreHorizontal,
  Plus,
  Trash2,
  UserCheck,
  UserX,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { UserRole } from '@alkitu/shared';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
  contactNumber: string | null;
  role: string;
  createdAt: string;
  lastLogin: string | null;
}

interface FilteredUsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface UserFilters {
  search: string;
  role: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const UsersPage = () => {
  const { lang } = useParams();
  const router = useRouter();
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Debounced filters for API calls
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce effect for search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [filters]);

  // Build query parameters, excluding empty values
  const queryParams = useMemo(() => {
    const params: any = {
      page: debouncedFilters.page,
      limit: debouncedFilters.limit,
      sortBy: debouncedFilters.sortBy,
      sortOrder: debouncedFilters.sortOrder,
    };
    if (debouncedFilters.search) params.search = debouncedFilters.search;
    if (debouncedFilters.role) params.role = debouncedFilters.role;
    return params;
  }, [debouncedFilters]);

  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = trpc.user.getFilteredUsers.useQuery(queryParams); // TODO: Implement this

  // Add mutations for bulk actions
  const bulkUpdateStatusMutation = trpc.user.bulkUpdateStatus.useMutation(); // TODO: Implement this
  const bulkDeleteUsersMutation = trpc.user.bulkDeleteUsers.useMutation(); // TODO: Implement this
  const bulkUpdateRoleMutation = trpc.user.bulkUpdateRole.useMutation(); // TODO: Implement this

  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 })); // Reset to page 1 when filtering
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleAddUser = () => {
    // Use Next.js router for proper navigation
    router.push(`/${lang}/dashboard/users/create`);
  };

  const handleUserSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && usersData?.users) {
      setSelectedUsers(usersData.users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'EMPLOYEE':
        return 'default';
      case 'CLIENT':
        return 'secondary';
      case 'LEAD':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleBulkActivate = async () => {
    try {
      await bulkUpdateStatusMutation.mutateAsync({
        userIds: selectedUsers,
        isActive: true,
      });
      toast.success(`${selectedUsers.length} user(s) activated successfully`);
      setSelectedUsers([]);
      refetch();
    } catch (error) {
      toast.error('Failed to activate users');
    }
  };

  const handleBulkDeactivate = async () => {
    try {
      await bulkUpdateStatusMutation.mutateAsync({
        userIds: selectedUsers,
        isActive: false,
      });
      toast.success(`${selectedUsers.length} user(s) deactivated successfully`);
      setSelectedUsers([]);
      refetch();
    } catch (error) {
      toast.error('Failed to deactivate users');
    }
  };

  const handleBulkDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await bulkDeleteUsersMutation.mutateAsync({
        userIds: selectedUsers,
      });
      toast.success(`${selectedUsers.length} user(s) deleted successfully`);
      setSelectedUsers([]);
      refetch();
    } catch (error) {
      toast.error('Failed to delete users');
    }
  };

  const handleUserAction = async (action: string, userId: string) => {
    try {
      switch (action) {
        case 'activate':
          await bulkUpdateStatusMutation.mutateAsync({
            userIds: [userId],
            isActive: true,
          });
          toast.success('User activated successfully');
          break;

        case 'deactivate':
          await bulkUpdateStatusMutation.mutateAsync({
            userIds: [userId],
            isActive: false,
          });
          toast.success('User deactivated successfully');
          break;

        case 'resetPassword':
          // Find user email for reset
          const userForReset = usersData?.users.find((u) => u.id === userId);
          if (userForReset) {
            // TODO: Implement reset password when available
            toast.success('Password reset email sent');
          }
          break;

        case 'delete':
          if (
            confirm(
              'Are you sure you want to delete this user? This action cannot be undone.',
            )
          ) {
            await bulkDeleteUsersMutation.mutateAsync({
              userIds: [userId],
            });
            toast.success('User deleted successfully');
          }
          break;
      }
      refetch();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Error loading users.</div>
      </div>
    );
  }

  const users = usersData?.users || [];
  const pagination = usersData?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage your application users. Total: {pagination?.total || 0}{' '}
                users
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button onClick={handleAddUser}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Filters */}
        {showFilters && (
          <CardContent className="border-t">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={filters.role}
                onValueChange={(value) => handleFilterChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  <SelectItem value="CLIENT">Client</SelectItem>
                  <SelectItem value="LEAD">Lead</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="lastLogin">Last Login</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.sortOrder}
                onValueChange={(value) =>
                  handleFilterChange('sortOrder', value as 'asc' | 'desc')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedUsers.length} user(s) selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkActivate}
                  disabled={bulkUpdateStatusMutation.isPending}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDeactivate}
                  disabled={bulkUpdateStatusMutation.isPending}
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Deactivate
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteUsersMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      users.length > 0 && selectedUsers.length === users.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) =>
                        handleUserSelect(user.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/${lang}/dashboard/users/${encodeURIComponent(user.email)}`}
                      className="text-blue-600 hover:underline"
                    >
                      {user.email}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {user.name || ''} {user.lastName || ''}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${lang}/dashboard/users/${encodeURIComponent(user.email)}`}
                          >
                            Edit User
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUserAction('resetPassword', user.id)
                          }
                        >
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUserAction('activate', user.id)}
                        >
                          Activate User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUserAction('deactivate', user.id)
                          }
                        >
                          Deactivate User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleUserAction('delete', user.id)}
                        >
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
                of {pagination.total} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
