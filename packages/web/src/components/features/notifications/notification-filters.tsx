'use client';

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  startTransition,
} from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/primitives/Card';
import { Badge } from '@/components/atoms-alianza/Badge';
import { Button } from '@/components/primitives/ui/button';
import { Checkbox } from '@/components/primitives/ui/checkbox';
import { Switch } from '@/components/primitives/ui/switch';
import { Label } from '@/components/primitives/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/Select';
import { Input } from '@/components/primitives/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/primitives/ui/popover';
import { Calendar } from '@/components/primitives/ui/calendar';
import {
  CalendarIcon,
  Filter,
  Search,
  X,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  TrendingUp,
  Archive,
  Check,
  Trash2,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { useTranslations } from '@/context/TranslationsContext';
import {
  useNotificationFiltersStore,
  type NotificationFilters,
} from '@/stores/notification-filters';

interface NotificationFiltersProps {
  onFiltersChange: (
    filters: NotificationFilters,
    isQuickFilter?: boolean,
  ) => void;
  totalCount: number;
  filteredCount: number;
}

const DEFAULT_FILTERS: NotificationFilters = {
  search: '',
  types: [],
  status: 'all',
  dateRange: undefined,
  sortBy: 'newest',
};

const SAVED_FILTERS_KEY = 'notification-saved-filters';

interface SavedFilter {
  id: string;
  name: string;
  filters: NotificationFilters;
  createdAt: string;
}

export function NotificationFilters({
  onFiltersChange,
  totalCount,
  filteredCount,
}: NotificationFiltersProps) {
  const t = useTranslations('notifications');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Zustand store
  const {
    filters,
    setFilters,
    setStatus,
    setSearch,
    setSortBy,
    setTypes,
    setDateRange,
    hasActiveFilters,
    getActiveFiltersCount,
    resetFilters,
    isQuickFilterLoading,
    setQuickFilterLoading,
  } = useNotificationFiltersStore();

  // Memoized arrays with translations
  const NOTIFICATION_TYPES = useMemo(
    () => [
      {
        id: 'welcome',
        label: t('types.welcome'),
        color: 'bg-green-100 text-green-800',
        icon: '👋',
      },
      {
        id: 'security',
        label: t('types.security'),
        color: 'bg-red-100 text-red-800',
        icon: '🔒',
      },
      {
        id: 'system',
        label: t('types.system'),
        color: 'bg-blue-100 text-blue-800',
        icon: '⚙️',
      },
      {
        id: 'report',
        label: t('types.report'),
        color: 'bg-purple-100 text-purple-800',
        icon: '📊',
      },
      {
        id: 'feature',
        label: t('types.feature'),
        color: 'bg-indigo-100 text-indigo-800',
        icon: '✨',
      },
      {
        id: 'maintenance',
        label: t('types.maintenance'),
        color: 'bg-orange-100 text-orange-800',
        icon: '🔧',
      },
      {
        id: 'urgent',
        label: t('types.urgent'),
        color: 'bg-red-100 text-red-800',
        icon: '🚨',
      },
      {
        id: 'info',
        label: t('types.info'),
        color: 'bg-gray-100 text-gray-800',
        icon: 'ℹ️',
      },
    ],
    [t],
  );

  const QUICK_DATE_RANGES = useMemo(
    () => [
      { label: t('filters.today'), value: 'today' },
      { label: t('filters.yesterday'), value: 'yesterday' },
      { label: t('filters.last7Days'), value: 'last7days' },
      { label: t('filters.last30Days'), value: 'last30days' },
      { label: t('filters.thisMonth'), value: 'thismonth' },
      { label: t('filters.lastMonth'), value: 'lastmonth' },
    ],
    [t],
  );

  const ADVANCED_SEARCH_TIPS = useMemo(
    () => [
      t('filters.advancedTip1'),
      t('filters.advancedTip2'),
      t('filters.advancedTip3'),
      t('filters.advancedTip4'),
    ],
    [t],
  );

  // Local UI state only
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [filterToSave, setFilterToSave] = useState<string>('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Refs
  const mountedRef = useRef(true);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingFromUrlRef = useRef(false);

  // Parse URL parameters to filters
  const parseUrlToFilters = useCallback(
    (searchParams: URLSearchParams): NotificationFilters => {
      return {
        search: searchParams.get('search') || '',
        types: searchParams.get('types')?.split(',').filter(Boolean) || [],
        status:
          (searchParams.get('status') as 'all' | 'read' | 'unread') || 'all',
        dateRange: (() => {
          const dateFrom = searchParams.get('dateFrom');
          const dateTo = searchParams.get('dateTo');
          if (dateFrom && dateTo) {
            return {
              from: new Date(dateFrom),
              to: new Date(dateTo),
            };
          }
          return undefined;
        })(),
        sortBy:
          (searchParams.get('sortBy') as 'newest' | 'oldest' | 'type') ||
          'newest',
      };
    },
    [],
  );

  // Convert filters to URL parameters
  const filtersToUrl = useCallback(
    (filters: NotificationFilters): string => {
      const params = new URLSearchParams();

      if (filters.search) params.set('search', filters.search);
      if (filters.types.length > 0)
        params.set('types', filters.types.join(','));
      if (filters.status !== 'all') params.set('status', filters.status);
      if (filters.sortBy !== 'newest') params.set('sortBy', filters.sortBy);
      if (filters.dateRange?.from) {
        params.set('dateFrom', filters.dateRange.from.toISOString());
      }
      if (filters.dateRange?.to) {
        params.set('dateTo', filters.dateRange.to.toISOString());
      }

      const queryString = params.toString();
      return queryString ? `${pathname}?${queryString}` : pathname;
    },
    [pathname],
  );

  // Debounced URL update
  const updateUrl = useCallback(
    (filters: NotificationFilters) => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }

      urlUpdateTimeoutRef.current = setTimeout(() => {
        if (!mountedRef.current) return;

        const newUrl = filtersToUrl(filters);
        const currentUrl = window.location.pathname + window.location.search;

        if (newUrl !== currentUrl) {
          isUpdatingFromUrlRef.current = true;
          router.replace(newUrl);
          // Reset flag after navigation
          setTimeout(() => {
            isUpdatingFromUrlRef.current = false;
          }, 100);
        }
      }, 300);
    },
    [filtersToUrl, router],
  );

  // Main filter change handler with optimistic updates
  const handleFiltersChange = useCallback(
    (newFilters: NotificationFilters) => {
      if (!mountedRef.current) return;

      // Immediately update local state for instant UI feedback
      setFilters(newFilters);

      // Then batch the slower operations
      startTransition(() => {
        onFiltersChange(newFilters);
        updateUrl(newFilters);
      });
    },
    [onFiltersChange, updateUrl, setFilters],
  );

  // Debounced search handler
  const handleSearchChange = useCallback(
    (value: string) => {
      // Update store immediately for UI feedback
      setSearch(value);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          const newFilters = { ...filters, search: value };
          onFiltersChange(newFilters);
          updateUrl(newFilters);
        }
      }, 800);
    },
    [setSearch, filters, onFiltersChange, updateUrl],
  );

  // Type toggle handler
  const handleTypeToggle = useCallback(
    (typeId: string, checked: boolean) => {
      const newTypes = checked
        ? [...filters.types, typeId]
        : filters.types.filter((t) => t !== typeId);

      setTypes(newTypes);
      const newFilters = { ...filters, types: newTypes };
      handleFiltersChange(newFilters);
    },
    [filters, setTypes, handleFiltersChange],
  );

  // Status change handler - optimized for quick filters
  const handleStatusChange = useCallback(
    (status: 'all' | 'read' | 'unread') => {
      // Set loading state for smooth transition
      setQuickFilterLoading(true);

      // Prevent URL updates temporarily to avoid loops
      isUpdatingFromUrlRef.current = true;

      // Update Zustand store first
      setStatus(status);

      // Create new filters with the new status using current filters as base
      const newFilters = {
        search: filters.search,
        types: filters.types,
        status: status, // Use the new status directly
        dateRange: filters.dateRange,
        sortBy: filters.sortBy,
      };

      // Notify parent immediately for API call
      onFiltersChange(newFilters, true);

      // Clear loading state after a delay for smooth UX
      setTimeout(() => {
        setQuickFilterLoading(false);
      }, 500);

      // Update URL with delay and re-enable URL updates
      setTimeout(() => {
        updateUrl(newFilters);
        // Re-enable URL updates after a short delay
        setTimeout(() => {
          isUpdatingFromUrlRef.current = false;
        }, 100);
      }, 100);
    },
    [filters, setStatus, onFiltersChange, updateUrl, setQuickFilterLoading],
  );

  // Sort change handler
  const handleSortChange = useCallback(
    (sortBy: 'newest' | 'oldest' | 'type') => {
      setSortBy(sortBy);
      const newFilters = { ...filters, sortBy };
      handleFiltersChange(newFilters);
    },
    [filters, setSortBy, handleFiltersChange],
  );

  // Date range change handler
  const handleDateRangeChange = useCallback(
    (dateRange: DateRange | undefined) => {
      setDateRange(dateRange);
      const newFilters = { ...filters, dateRange };
      handleFiltersChange(newFilters);
    },
    [filters, setDateRange, handleFiltersChange],
  );

  const handleQuickDateRange = useCallback(
    (value: string) => {
      const now = new Date();
      let dateRange: DateRange | undefined;

      switch (value) {
        case 'today':
          dateRange = { from: now, to: now };
          break;
        case 'yesterday':
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          dateRange = { from: yesterday, to: yesterday };
          break;
        case 'last7days':
          const week = new Date(now);
          week.setDate(week.getDate() - 7);
          dateRange = { from: week, to: now };
          break;
        case 'last30days':
          const month = new Date(now);
          month.setDate(month.getDate() - 30);
          dateRange = { from: month, to: now };
          break;
        case 'thismonth':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          dateRange = { from: monthStart, to: now };
          break;
        case 'lastmonth':
          const lastMonthStart = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1,
          );
          const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
          dateRange = { from: lastMonthStart, to: lastMonthEnd };
          break;
      }

      if (dateRange) {
        handleDateRangeChange(dateRange);
      }
    },
    [handleDateRangeChange],
  );

  const clearAllFilters = useCallback(() => {
    resetFilters();
    const defaultFilters = {
      search: '',
      types: [],
      status: 'all' as const,
      dateRange: undefined,
      sortBy: 'newest' as const,
    };
    onFiltersChange(defaultFilters);
    setIsFiltersOpen(false);
    setShowAdvancedSearch(false);
  }, [resetFilters, onFiltersChange]);

  // Saved filters functionality
  const saveCurrentFilters = useCallback(() => {
    if (!filterToSave.trim()) return;

    const newSavedFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterToSave.trim(),
      filters: { ...filters },
      createdAt: new Date().toISOString(),
    };

    const updatedSavedFilters = [...savedFilters, newSavedFilter];
    setSavedFilters(updatedSavedFilters);
    localStorage.setItem(
      SAVED_FILTERS_KEY,
      JSON.stringify(updatedSavedFilters),
    );
    setFilterToSave('');
    setShowSaveDialog(false);
  }, [filterToSave, filters, savedFilters]);

  const applySavedFilter = useCallback(
    (savedFilter: SavedFilter) => {
      setFilters(savedFilter.filters);
      onFiltersChange(savedFilter.filters);
    },
    [setFilters, onFiltersChange],
  );

  const deleteSavedFilter = useCallback(
    (id: string) => {
      const updatedSavedFilters = savedFilters.filter((f) => f.id !== id);
      setSavedFilters(updatedSavedFilters);
      localStorage.setItem(
        SAVED_FILTERS_KEY,
        JSON.stringify(updatedSavedFilters),
      );
    },
    [savedFilters],
  );

  // Use Zustand computed values
  const activeFilters = hasActiveFilters();
  const activeFiltersCount = getActiveFiltersCount();

  // Load saved filters on mount
  useEffect(() => {
    const saved = localStorage.getItem(SAVED_FILTERS_KEY);
    if (saved) {
      try {
        setSavedFilters(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved filters:', error);
      }
    }
  }, []);

  // Initialize from URL on mount only
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      const urlFilters = parseUrlToFilters(searchParams);

      // Update Zustand store with URL filters
      setFilters(urlFilters);

      // Notify parent component
      onFiltersChange(urlFilters);
    }

    return () => {
      mountedRef.current = false;
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }
    };
  }, [onFiltersChange, parseUrlToFilters, searchParams, setFilters]); // Only on mount - no dependencies to prevent re-runs

  // Handle URL changes from external navigation only
  useEffect(() => {
    if (isUpdatingFromUrlRef.current || !mountedRef.current) return; // Skip if we're updating the URL or not mounted

    const urlFilters = parseUrlToFilters(searchParams);

    // Only update if there are significant changes (not just status for quick filters)
    const hasSignificantChanges =
      filters.search !== urlFilters.search ||
      filters.sortBy !== urlFilters.sortBy ||
      filters.types.length !== urlFilters.types.length ||
      filters.types.some((type, i) => type !== urlFilters.types[i]) ||
      filters.dateRange?.from?.getTime() !==
        urlFilters.dateRange?.from?.getTime() ||
      filters.dateRange?.to?.getTime() !== urlFilters.dateRange?.to?.getTime();

    if (hasSignificantChanges) {
      setFilters(urlFilters);
      onFiltersChange(urlFilters);
    }
  }, [
    filters.dateRange?.from,
    filters.dateRange?.to,
    filters.search,
    filters.sortBy,
    filters.types,
    onFiltersChange,
    parseUrlToFilters,
    searchParams,
    setFilters,
  ]); // Only depend on searchParams to avoid infinite loops

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              {t('filters.title')}
            </CardTitle>
            <CardDescription>
              {filteredCount === totalCount
                ? `${t('filters.showingAll')} ${totalCount} ${t('filters.notifications')}`
                : `${t('filters.showing')} ${filteredCount} ${t('filters.of')} ${totalCount} ${t('filters.notifications')}`}
              {activeFilters && (
                <span className="ml-2">
                  ({activeFiltersCount} {t('filters.filter')}
                  {activeFiltersCount !== 1 ? 's' : ''} {t('filters.active')})
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {activeFilters && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSaveDialog(!showSaveDialog)}
                  className="flex items-center gap-1"
                >
                  <Bookmark className="w-4 h-4" />
                  {t('filters.save')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t('filters.clearAll')}
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-1"
            >
              <Filter className="w-4 h-4" />
              {t('filters.filters')}
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
              {isFiltersOpen ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Bar with Advanced Options */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('filters.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-12"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-2"
            >
              <Zap className="w-4 h-4" />
            </Button>
          </div>

          {showAdvancedSearch && (
            <Card className="p-3 bg-muted/50">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t('filters.advancedTips')}
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {ADVANCED_SEARCH_TIPS.map((tip, index) => (
                    <div
                      key={index}
                      className="text-xs text-muted-foreground flex items-center gap-1"
                    >
                      <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-sm font-medium">
            {t('filters.quickFilters')}
          </Label>
          <Button
            variant={filters.status === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('unread')}
            disabled={isQuickFilterLoading}
            className={cn(
              'flex items-center gap-1 transition-all duration-200',
              isQuickFilterLoading && 'opacity-70',
            )}
          >
            {isQuickFilterLoading && filters.status === 'unread' ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
            {t('filters.unread')}
          </Button>
          <Button
            variant={filters.status === 'read' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('read')}
            disabled={isQuickFilterLoading}
            className={cn(
              'flex items-center gap-1 transition-all duration-200',
              isQuickFilterLoading && 'opacity-70',
            )}
          >
            {isQuickFilterLoading && filters.status === 'read' ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {t('filters.read')}
          </Button>
          <Button
            variant={filters.status === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('all')}
            disabled={isQuickFilterLoading}
            className={cn(
              'flex items-center gap-1 transition-all duration-200',
              isQuickFilterLoading && 'opacity-70',
            )}
          >
            {isQuickFilterLoading && filters.status === 'all' ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : null}
            {t('filters.all')}
          </Button>
        </div>

        {/* Saved Filters */}
        {savedFilters.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <BookmarkCheck className="w-4 h-4" />
              {t('filters.savedFilters')}
            </Label>
            <div className="flex flex-wrap gap-2">
              {savedFilters.map((savedFilter) => (
                <div key={savedFilter.id} className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applySavedFilter(savedFilter)}
                    className="flex items-center gap-1"
                  >
                    <Bookmark className="w-3 h-3" />
                    {savedFilter.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSavedFilter(savedFilter.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Filter Dialog */}
        {showSaveDialog && (
          <Card className="p-3 border-blue-200 bg-blue-50/50">
            <div className="flex items-center gap-2">
              <Input
                placeholder={t('filters.filterName')}
                value={filterToSave}
                onChange={(e) => setFilterToSave(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveCurrentFilters();
                  } else if (e.key === 'Escape') {
                    setShowSaveDialog(false);
                    setFilterToSave('');
                  }
                }}
              />
              <Button
                size="sm"
                onClick={saveCurrentFilters}
                disabled={!filterToSave.trim()}
              >
                {t('filters.save')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowSaveDialog(false);
                  setFilterToSave('');
                }}
              >
                {t('filters.cancel')}
              </Button>
            </div>
          </Card>
        )}

        {/* Advanced Filters (Collapsible) */}
        {isFiltersOpen && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Notification Types */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {t('filters.notificationTypes')}
                </Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {NOTIFICATION_TYPES.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.id}
                        checked={filters.types.includes(type.id)}
                        onCheckedChange={(checked) =>
                          handleTypeToggle(type.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={type.id}
                        className="text-sm cursor-pointer flex items-center gap-2"
                      >
                        <span className="text-sm">{type.icon}</span>
                        <Badge className={type.color} variant="secondary">
                          {type.label}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {t('filters.dateRange')}
                </Label>

                {/* Quick Date Range Buttons */}
                <div className="grid grid-cols-2 gap-1 mb-2">
                  {QUICK_DATE_RANGES.map((range) => (
                    <Button
                      key={range.value}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickDateRange(range.value)}
                      className="text-xs"
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !filters.dateRange && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange?.from ? (
                        filters.dateRange.to ? (
                          <>
                            {format(filters.dateRange.from, 'LLL dd, y')} -{' '}
                            {format(filters.dateRange.to, 'LLL dd, y')}
                          </>
                        ) : (
                          format(filters.dateRange.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>{t('filters.pickDate')}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={filters.dateRange?.from}
                      selected={filters.dateRange}
                      onSelect={handleDateRangeChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                {filters.dateRange && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDateRangeChange(undefined)}
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-1" />
                    {t('filters.clearDateRange')}
                  </Button>
                )}
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t('filters.sortBy')}
                </Label>
                <Select value={filters.sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filters.selectSorting')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">
                      {t('filters.newest')}
                    </SelectItem>
                    <SelectItem value="oldest">
                      {t('filters.oldest')}
                    </SelectItem>
                    <SelectItem value="type">{t('filters.type')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
            <Label className="text-sm font-medium">
              {t('filters.activeFilters')}
            </Label>
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {t('filters.search')} &quot;{filters.search}&quot;
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleSearchChange('')}
                />
              </Badge>
            )}
            {filters.status !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {t('filters.status')} {filters.status}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleStatusChange('all')}
                />
              </Badge>
            )}
            {filters.types.map((typeId) => {
              const type = NOTIFICATION_TYPES.find((t) => t.id === typeId);
              return (
                <Badge
                  key={typeId}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {type?.icon} {type?.label}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleTypeToggle(typeId, false)}
                  />
                </Badge>
              );
            })}
            {filters.dateRange && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {t('filters.dateRangeSelected')}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleDateRangeChange(undefined)}
                />
              </Badge>
            )}
            {filters.sortBy !== 'newest' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {t('filters.sort')} {filters.sortBy}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleSortChange('newest')}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
