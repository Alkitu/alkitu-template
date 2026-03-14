import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Package, X } from 'lucide-react';
import { Input } from '@/components/atoms-alianza/Input';
import { ServiceSelectionItem } from '@/components/molecules-alianza/ServiceSelectionItem';
import type {
  CategorizedServiceSelectorProps,
  CategoryGroup,
  SelectableService,
} from './CategorizedServiceSelector.types';

const FAVORITES_STORAGE_KEY = 'alkitu-favorite-services';

export const CategorizedServiceSelector: React.FC<CategorizedServiceSelectorProps> = ({
  services,
  selectedServiceId,
  onServiceSelect,
  isLoading = false,
  searchPlaceholder = 'Search services...',
  noResultsText = 'No services found',
  emptyText = 'No services available',
  className = '',
  favoritesCategoryText,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage on mount (SSR-safe)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        if (Array.isArray(ids)) {
          setFavorites(new Set(ids));
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const toggleFavorite = useCallback((serviceId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(serviceId)) {
        next.delete(serviceId);
      } else {
        next.add(serviceId);
      }
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // Ignore localStorage errors
      }
      return next;
    });
  }, []);

  const filteredGroups = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const filtered = query
      ? services.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.categoryName.toLowerCase().includes(query)
      )
      : services;

    const groupMap = new Map<string, CategoryGroup>();
    for (const service of filtered) {
      const existing = groupMap.get(service.categoryId);
      if (existing) {
        existing.services.push(service);
      } else {
        groupMap.set(service.categoryId, {
          categoryId: service.categoryId,
          categoryName: service.categoryName,
          services: [service],
        });
      }
    }

    // Build favorites group from filtered services
    const favoriteServices = filtered.filter((s) => favorites.has(s.id));
    const favoritesGroup: CategoryGroup | null =
      favoriteServices.length > 0
        ? {
            categoryId: '__favorites__',
            categoryName: favoritesCategoryText || 'Favorites',
            services: favoriteServices,
          }
        : null;

    const sortedGroups = Array.from(groupMap.values()).sort((a, b) =>
      a.categoryName.localeCompare(b.categoryName)
    );

    // Favorites always first
    if (favoritesGroup) {
      return [favoritesGroup, ...sortedGroups];
    }

    return sortedGroups;
  }, [services, searchQuery, favorites, favoritesCategoryText]);

  const renderServiceItem = (service: SelectableService, groupId: string) => (
    <ServiceSelectionItem
      key={`${groupId}-${service.id}`}
      service={{
        id: service.id,
        name: service.name,
        description: service.description,
        thumbnail: service.thumbnail,
        iconColor: service.iconColor,
        categoryName: service.categoryName,
      }}
      isSelected={selectedServiceId === service.id}
      onSelect={() => onServiceSelect(service)}
      isFavorite={favorites.has(service.id)}
      onToggleFavorite={toggleFavorite}
    />
  );

  // Loading state
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="h-10 animate-pulse rounded-md bg-muted" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state (no services at all)
  if (services.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
        <Package className="mb-3 h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search bar */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
        />
      </div>

      {/* No search results */}
      {filteredGroups.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Search className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="mb-2 text-muted-foreground">{noResultsText}</p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <X className="h-3 w-3" />
            Clear search
          </button>
        </div>
      )}

      {/* Categorized services */}
      <div className="space-y-2">
        {filteredGroups.map((group) => (
          <div key={group.categoryId}>
            {/* Category separator */}
            <div className="flex items-center gap-2 py-2">
              <span className="shrink-0 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {group.categoryName}
              </span>
              <div className="h-px flex-1 bg-border" />
              <span className="shrink-0 text-[11px] text-muted-foreground">
                {group.services.length}
              </span>
            </div>
            {/* Services in this category */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.services.map((s) => renderServiceItem(s, group.categoryId))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
