import React, { useState, useMemo } from 'react';
import { Search, Package, X } from 'lucide-react';
import { Input } from '@/components/atoms-alianza/Input';
import { ServiceSelectionItem } from '@/components/molecules-alianza/ServiceSelectionItem';
import type {
  CategorizedServiceSelectorProps,
  CategoryGroup,
  SelectableService,
} from './CategorizedServiceSelector.types';

export const CategorizedServiceSelector: React.FC<CategorizedServiceSelectorProps> = ({
  services,
  selectedServiceId,
  onServiceSelect,
  isLoading = false,
  searchPlaceholder = 'Search services...',
  noResultsText = 'No services found',
  emptyText = 'No services available',
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

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

    return Array.from(groupMap.values()).sort((a, b) =>
      a.categoryName.localeCompare(b.categoryName)
    );
  }, [services, searchQuery]);

  const renderServiceItem = (service: SelectableService) => (
    <ServiceSelectionItem
      key={service.id}
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
            <div className="space-y-2">
              {group.services.map(renderServiceItem)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
