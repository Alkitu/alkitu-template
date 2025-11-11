'use client';

import { create } from 'zustand';
import { DateRange } from 'react-day-picker';

export interface NotificationFilters {
  search: string;
  types: string[];
  status: 'all' | 'read' | 'unread';
  dateRange: DateRange | undefined;
  sortBy: 'newest' | 'oldest' | 'type';
}

interface NotificationFiltersState {
  // State
  filters: NotificationFilters;
  isLoading: boolean;
  isQuickFilterLoading: boolean;
  lastApiCall: string;
  
  // Actions
  setFilters: (filters: NotificationFilters) => void;
  updateFilter: (key: keyof NotificationFilters, value: any) => void;
  setStatus: (status: 'all' | 'read' | 'unread') => void;
  setSearch: (search: string) => void;
  setSortBy: (sortBy: 'newest' | 'oldest' | 'type') => void;
  setTypes: (types: string[]) => void;
  setDateRange: (dateRange: DateRange | undefined) => void;
  setLoading: (loading: boolean) => void;
  setQuickFilterLoading: (loading: boolean) => void;
  resetFilters: () => void;
  
  // Getters
  hasActiveFilters: () => boolean;
  getActiveFiltersCount: () => number;
}

const DEFAULT_FILTERS: NotificationFilters = {
  search: '',
  types: [],
  status: 'all',
  dateRange: undefined,
  sortBy: 'newest',
};

export const useNotificationFiltersStore = create<NotificationFiltersState>((set, get) => ({
  // Initial state
  filters: DEFAULT_FILTERS,
  isLoading: false,
  isQuickFilterLoading: false,
  lastApiCall: '',

  // Actions
  setFilters: (filters) => {
    const currentFilters = get().filters;
    
    // Only update if filters actually changed
    const hasChanged = 
      currentFilters.search !== filters.search ||
      currentFilters.status !== filters.status ||
      currentFilters.sortBy !== filters.sortBy ||
      currentFilters.types.length !== filters.types.length ||
      currentFilters.types.some((type, i) => type !== filters.types[i]) ||
      (currentFilters.dateRange?.from?.getTime() !== filters.dateRange?.from?.getTime()) ||
      (currentFilters.dateRange?.to?.getTime() !== filters.dateRange?.to?.getTime());
    
    if (hasChanged) {
      set({ filters });
    }
  },

  updateFilter: (key, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    }));
  },

  setStatus: (status) => {
    set((state) => ({
      filters: {
        ...state.filters,
        status,
      },
    }));
  },

  setSearch: (search) => {
    set((state) => ({
      filters: {
        ...state.filters,
        search,
      },
    }));
  },

  setSortBy: (sortBy) => {
    set((state) => ({
      filters: {
        ...state.filters,
        sortBy,
      },
    }));
  },

  setTypes: (types) => {
    set((state) => ({
      filters: {
        ...state.filters,
        types,
      },
    }));
  },

  setDateRange: (dateRange) => {
    set((state) => ({
      filters: {
        ...state.filters,
        dateRange,
      },
    }));
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setQuickFilterLoading: (isQuickFilterLoading) => {
    set({ isQuickFilterLoading });
  },

  resetFilters: () => {
    set({ filters: DEFAULT_FILTERS });
  },

  // Getters
  hasActiveFilters: () => {
    const { filters } = get();
    return (
      filters.search !== '' ||
      filters.types.length > 0 ||
      filters.status !== 'all' ||
      filters.dateRange !== undefined ||
      filters.sortBy !== 'newest'
    );
  },

  getActiveFiltersCount: () => {
    const { filters } = get();
    return (
      (filters.search ? 1 : 0) +
      (filters.types.length > 0 ? 1 : 0) +
      (filters.status !== 'all' ? 1 : 0) +
      (filters.dateRange ? 1 : 0) +
      (filters.sortBy !== 'newest' ? 1 : 0)
    );
  },
}));