'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/atomic-design/atoms/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atomic-design/atoms/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Settings,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
  pageSize: number;
}

interface EnhancedPaginationProps {
  pagination: PaginationInfo;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  infiniteScrollEnabled: boolean;
  onInfiniteScrollToggle: (enabled: boolean) => void;
  loadMore?: () => void;
  className?: string;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function EnhancedPagination({
  pagination,
  loading,
  onPageChange,
  onPageSizeChange,
  infiniteScrollEnabled,
  onInfiniteScrollToggle,
  loadMore,
  className = '',
}: EnhancedPaginationProps) {
  const [showSettings, setShowSettings] = useState(false);

  const { currentPage, totalPages, totalCount, hasMore, pageSize } = pagination;

  // Calculate visible page range
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = totalPages > 1 ? getVisiblePages() : [];

  // Don't render pagination if infinite scroll is enabled or no pages
  if (infiniteScrollEnabled || totalPages <= 1) {
    return infiniteScrollEnabled && hasMore ? (
      <div className={`flex items-center justify-center py-6 ${className}`}>
        <Button
          variant="outline"
          onClick={loadMore}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load More'}
        </Button>
      </div>
    ) : null;
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Results info */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{' '}
          notifications
        </div>

        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <Label htmlFor="page-size" className="text-sm">
            Per page:
          </Label>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(parseInt(value))}
          >
            <SelectTrigger id="page-size" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Settings popover */}
        <Popover open={showSettings} onOpenChange={setShowSettings}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Pagination Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Configure how notifications are loaded and displayed.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="infinite-scroll">Infinite Scroll</Label>
                  <div className="text-sm text-muted-foreground">
                    Load more notifications automatically as you scroll
                  </div>
                </div>
                <Switch
                  id="infinite-scroll"
                  checked={infiniteScrollEnabled}
                  onCheckedChange={onInfiniteScrollToggle}
                />
              </div>

              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  <p>
                    <strong>Traditional Pagination:</strong> Navigate through
                    pages with numbered controls.
                  </p>
                  <p className="mt-1">
                    <strong>Infinite Scroll:</strong> Automatically loads more
                    content as you reach the bottom.
                  </p>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* First page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || loading}
          className="hidden sm:flex"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 text-muted-foreground">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  disabled={loading}
                  className="w-10 h-8 p-0"
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || loading}
          className="hidden sm:flex"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center gap-2 ml-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact version for mobile or limited space
export function CompactPagination({
  pagination,
  loading,
  onPageChange,
  className = '',
}: {
  pagination: PaginationInfo;
  loading: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const { currentPage, totalPages } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Badge variant="outline" className="px-3 py-1">
        {currentPage} / {totalPages}
      </Badge>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
