'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/primitives/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/primitives/ui/table';
import { Button } from '../atoms/Button';
import { Badge } from '@/components/atoms-alianza/Badge';
import { Input } from '../atoms/Input';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

export interface DataTableOrganismProps {
  variant?: 'users' | 'products' | 'orders' | 'analytics' | 'tasks';
  showSearch?: boolean;
  showFilters?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  className?: string;
}

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

interface TableRow {
  id: string;
  [key: string]: any;
}

const TABLE_CONFIGS = {
  users: {
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'role', label: 'Role', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'lastLogin', label: 'Last Login', sortable: true },
      { key: 'actions', label: 'Actions', width: '100px' }
    ] as TableColumn[],
    data: [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', lastLogin: '2 hours ago' },
      { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', role: 'Editor', status: 'Active', lastLogin: '1 day ago' },
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Viewer', status: 'Inactive', lastLogin: '1 week ago' },
      { id: '4', name: 'Emily Davis', email: 'emily@example.com', role: 'Admin', status: 'Active', lastLogin: '3 hours ago' },
      { id: '5', name: 'Chris Wilson', email: 'chris@example.com', role: 'Editor', status: 'Pending', lastLogin: 'Never' }
    ] as TableRow[]
  },
  products: {
    columns: [
      { key: 'name', label: 'Product', sortable: true },
      { key: 'category', label: 'Category', sortable: true },
      { key: 'price', label: 'Price', sortable: true },
      { key: 'stock', label: 'Stock', sortable: true },
      { key: 'rating', label: 'Rating', sortable: true },
      { key: 'actions', label: 'Actions', width: '120px' }
    ] as TableColumn[],
    data: [
      { id: '1', name: 'Wireless Headphones', category: 'Electronics', price: '$299.99', stock: 45, rating: 4.8 },
      { id: '2', name: 'Smart Watch', category: 'Electronics', price: '$199.99', stock: 23, rating: 4.5 },
      { id: '3', name: 'Laptop Stand', category: 'Accessories', price: '$89.99', stock: 12, rating: 4.3 },
      { id: '4', name: 'Bluetooth Speaker', category: 'Electronics', price: '$149.99', stock: 67, rating: 4.7 },
      { id: '5', name: 'USB-C Cable', category: 'Accessories', price: '$19.99', stock: 156, rating: 4.2 }
    ] as TableRow[]
  },
  orders: {
    columns: [
      { key: 'orderId', label: 'Order ID', sortable: true },
      { key: 'customer', label: 'Customer', sortable: true },
      { key: 'amount', label: 'Amount', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'date', label: 'Date', sortable: true },
      { key: 'actions', label: 'Actions', width: '100px' }
    ] as TableColumn[],
    data: [
      { id: '1', orderId: '#ORD-001', customer: 'John Doe', amount: '$599.98', status: 'Completed', date: '2024-01-15' },
      { id: '2', orderId: '#ORD-002', customer: 'Sarah Smith', amount: '$199.99', status: 'Processing', date: '2024-01-14' },
      { id: '3', orderId: '#ORD-003', customer: 'Mike Johnson', amount: '$89.99', status: 'Shipped', date: '2024-01-13' },
      { id: '4', orderId: '#ORD-004', customer: 'Emily Davis', amount: '$449.97', status: 'Pending', date: '2024-01-12' },
      { id: '5', orderId: '#ORD-005', customer: 'Chris Wilson', amount: '$299.99', status: 'Cancelled', date: '2024-01-11' }
    ] as TableRow[]
  },
  tasks: {
    columns: [
      { key: 'title', label: 'Task', sortable: true },
      { key: 'assignee', label: 'Assignee', sortable: true },
      { key: 'priority', label: 'Priority', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'dueDate', label: 'Due Date', sortable: true },
      { key: 'actions', label: 'Actions', width: '100px' }
    ] as TableColumn[],
    data: [
      { id: '1', title: 'Update user dashboard', assignee: 'John Doe', priority: 'High', status: 'In Progress', dueDate: '2024-01-20' },
      { id: '2', title: 'Fix login bug', assignee: 'Sarah Smith', priority: 'Critical', status: 'Open', dueDate: '2024-01-18' },
      { id: '3', title: 'Add payment integration', assignee: 'Mike Johnson', priority: 'Medium', status: 'Completed', dueDate: '2024-01-15' },
      { id: '4', title: 'Design mobile app', assignee: 'Emily Davis', priority: 'Low', status: 'On Hold', dueDate: '2024-01-25' },
      { id: '5', title: 'Database optimization', assignee: 'Chris Wilson', priority: 'High', status: 'Review', dueDate: '2024-01-22' }
    ] as TableRow[]
  }
};

/**
 * DataTableOrganism - Complex data table component with theme integration
 * 
 * Combines: Table + Card + Button + Badge + Input + Pagination + Search + Filter
 * Features: Sorting, searching, filtering, pagination, theme-responsive design
 * Spacing: Small (internal padding), Medium (component gaps), Large (section spacing)
 */
export function DataTableOrganism({
  variant = 'users',
  showSearch = true,
  showFilters = true,
  showPagination = true,
  pageSize = 5,
  className = ''
}: DataTableOrganismProps) {
  const { state } = useThemeEditor();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  
  // Theme integration
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;
  const shadows = state.currentTheme?.shadows;
  const spacing = state.currentTheme?.spacing;

  // Spacing system
  const baseSpacing = spacing?.spacing || '2.2rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16;
  const smallSpacing = `var(--spacing-small, ${baseValue}px)`;
  const mediumSpacing = `var(--spacing-medium, ${baseValue * 2}px)`;

  const config = (TABLE_CONFIGS as Record<string, { columns: TableColumn[]; data: TableRow[] }>)[variant] || TABLE_CONFIGS.users;

  // Data filtering and sorting
  const filteredData = useMemo(() => {
    let data = [...config.data];
    
    // Search filter
    if (searchTerm) {
      data = data.filter(row =>
        Object.values(row).some((value: unknown) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Sorting
    if (sortColumn) {
      data.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return data;
  }, [config.data, searchTerm, sortColumn, sortDirection]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!showPagination) return filteredData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize, showPagination]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const toggleRowSelection = (rowId: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const getStatusBadge = (status: string, type: string = 'status') => {
    const getStatusColor = (status: string) => {
      const statusColors = {
        // User statuses
        'Active': { bg: '#22c55e20', border: '#22c55e', text: '#22c55e' },
        'Inactive': { bg: '#6b728020', border: '#6b7280', text: '#6b7280' },
        'Pending': { bg: '#f59e0b20', border: '#f59e0b', text: '#f59e0b' },
        
        // Order statuses
        'Completed': { bg: '#22c55e20', border: '#22c55e', text: '#22c55e' },
        'Processing': { bg: '#3b82f620', border: '#3b82f6', text: '#3b82f6' },
        'Shipped': { bg: '#8b5cf620', border: '#8b5cf6', text: '#8b5cf6' },
        'Cancelled': { bg: '#ef444420', border: '#ef4444', text: '#ef4444' },
        
        // Task statuses
        'In Progress': { bg: '#3b82f620', border: '#3b82f6', text: '#3b82f6' },
        'Open': { bg: '#f59e0b20', border: '#f59e0b', text: '#f59e0b' },
        'On Hold': { bg: '#6b728020', border: '#6b7280', text: '#6b7280' },
        'Review': { bg: '#8b5cf620', border: '#8b5cf6', text: '#8b5cf6' },
        
        // Priority levels
        'Critical': { bg: '#ef444420', border: '#ef4444', text: '#ef4444' },
        'High': { bg: '#f59e0b20', border: '#f59e0b', text: '#f59e0b' },
        'Medium': { bg: '#3b82f620', border: '#3b82f6', text: '#3b82f6' },
        'Low': { bg: '#22c55e20', border: '#22c55e', text: '#22c55e' }
      };
      
      return statusColors[status as keyof typeof statusColors] || 
             { bg: '#6b728020', border: '#6b7280', text: '#6b7280' };
    };

    const colorConfig = getStatusColor(status);
    
    return (
      <Badge
        variant="outline"
        className="text-xs"
        style={{
          background: colorConfig.bg,
          borderColor: colorConfig.border,
          color: colorConfig.text
        }}
      >
        {status}
      </Badge>
    );
  };

  const renderCellContent = (row: TableRow, column: TableColumn) => {
    const value = row[column.key];
    
    if (column.key === 'actions') {
      return (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0"
            style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
          >
            <Eye size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0"
            style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
          >
            <Edit size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0"
            style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
          >
            <MoreHorizontal size={14} />
          </Button>
        </div>
      );
    }
    
    if (column.key === 'status' || column.key === 'priority') {
      return getStatusBadge(value, column.key);
    }
    
    if (column.key === 'rating') {
      return (
        <div className="flex items-center gap-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span>{value}</span>
        </div>
      );
    }
    
    if (column.key === 'stock' && typeof value === 'number') {
      const isLowStock = value < 20;
      return (
        <span style={{ 
          color: isLowStock ? '#ef4444' : (colors?.foreground?.value || 'var(--color-foreground)')
        }}>
          {value}
          {isLowStock && ' (Low)'}
        </span>
      );
    }
    
    return value;
  };

  const getVariantTitle = () => {
    const titles = {
      users: 'User Management',
      products: 'Product Catalog',
      orders: 'Order History',
      analytics: 'Analytics Data',
      tasks: 'Task Management'
    };
    return titles[variant];
  };

  const getVariantDescription = () => {
    const descriptions = {
      users: 'Manage users, roles, and access permissions',
      products: 'Browse and manage product inventory',
      orders: 'Track and manage customer orders',
      analytics: 'View performance metrics and data',
      tasks: 'Organize and track project tasks'
    };
    return descriptions[variant];
  };

  return (
    <Card 
      className={`w-full ${className}`}
      style={{
        background: `${colors?.card?.value || 'var(--color-card)'}`,
        border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
        boxShadow: shadows?.shadowMd || 'var(--shadow-md)'
      }}
    >
      {/* Header */}
      <CardHeader style={{ padding: mediumSpacing }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle 
              style={{ 
                color: colors?.foreground?.value || 'var(--color-foreground)',
                fontFamily: 'var(--typography-h3-font-family)',
                fontSize: 'var(--typography-h3-font-size)',
                marginBottom: '4px'
              }}
            >
              {getVariantTitle()}
            </CardTitle>
            <CardDescription 
              style={{ 
                color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                fontSize: '14px'
              }}
            >
              {getVariantDescription()} ({filteredData.length} items)
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              style={{
                background: colors?.primary?.value || 'var(--color-primary)',
                color: colors?.primaryForeground?.value || 'var(--color-primary-foreground)'
              }}
            >
              <Plus size={14} className="mr-1" />
              Add New
            </Button>
            <Button
              size="sm"
              variant="outline"
              style={{
                borderColor: colors?.border?.value || 'var(--color-border)',
                color: colors?.foreground?.value || 'var(--color-foreground)'
              }}
            >
              <Download size={14} />
            </Button>
          </div>
        </div>
        
        {/* Search and Filters */}
        {(showSearch || showFilters) && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {showSearch && (
              <div className="flex-1">
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search size={16} />}
                  className="w-full"
                />
              </div>
            )}
            
            {showFilters && (
              <Button
                variant="outline"
                size="sm"
                style={{
                  borderColor: colors?.border?.value || 'var(--color-border)',
                  color: colors?.foreground?.value || 'var(--color-foreground)'
                }}
              >
                <Filter size={14} className="mr-1" />
                Filter
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      {/* Table */}
      <CardContent style={{ padding: `0 ${mediumSpacing} ${mediumSpacing}` }}>
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns.map((column: TableColumn) => (
                <TableHead 
                  key={column.key}
                  style={{ 
                    width: column.width,
                    color: colors?.foreground?.value || 'var(--color-foreground)'
                  }}
                >
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort(column.key)}
                      style={{
                        color: colors?.foreground?.value || 'var(--color-foreground)'
                      }}
                    >
                      {column.label}
                      <ArrowUpDown size={14} className="ml-1" />
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow
                key={row.id}
                className={selectedRows.has(row.id) ? 'bg-accent/50' : ''}
                style={{
                  background: selectedRows.has(row.id) ? 
                    `${colors?.accent?.value || 'var(--color-accent)'}20` : 
                    'transparent'
                }}
              >
                {config.columns.map((column: TableColumn) => (
                  <TableCell 
                    key={`${row.id}-${column.key}`}
                    style={{ 
                      color: colors?.foreground?.value || 'var(--color-foreground)' 
                    }}
                  >
                    {renderCellContent(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <div 
            className="flex items-center justify-between mt-6 pt-4"
            style={{
              borderTop: `1px solid ${colors?.border?.value || 'var(--color-border)'}`
            }}
          >
            <p 
              className="text-sm"
              style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
            >
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} results
            </p>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                style={{
                  borderColor: colors?.border?.value || 'var(--color-border)',
                  color: colors?.foreground?.value || 'var(--color-foreground)'
                }}
              >
                <ChevronLeft size={14} />
              </Button>
              
              <span 
                className="text-sm px-2"
                style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
              >
                {currentPage} of {totalPages}
              </span>
              
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                style={{
                  borderColor: colors?.border?.value || 'var(--color-border)',
                  color: colors?.foreground?.value || 'var(--color-foreground)'
                }}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * DataTableOrganismShowcase - Demo component showing different table variants
 */
export function DataTableOrganismShowcase() {
  const { state } = useThemeEditor();
  
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;

  return (
    <div className="flex flex-col gap-8 w-full">
      <DataTableOrganism variant="users" />
      <DataTableOrganism variant="products" />
      <DataTableOrganism variant="orders" />
      <DataTableOrganism variant="tasks" />
    </div>
  );
}