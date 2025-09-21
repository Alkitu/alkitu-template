'use client';

import React, { useMemo } from 'react';
import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { Input } from '../atoms/Input';
import { Button } from '../primitives/button';

// Generic interface for searchable items
export interface SearchableItem {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  component?: React.ComponentType;
}

// Generic category mapping
export interface CategoryMapping {
  [key: string]: string;
}

// Props for the search filter component
interface ComponentSearchFilterProps<T extends SearchableItem> {
  // Data
  items: T[];
  categories: CategoryMapping;

  // Search state
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;

  // Group controls
  openGroups: Set<string>;
  onToggleGroup: (groupName: string) => void;
  onOpenAllGroups: () => void;
  onCloseAllGroups: () => void;

  // Rendering
  renderItem: (item: T) => React.ReactNode;
  groupBy?: (item: T) => string; // Function to group items (defaults to item.name)

  // Customization
  searchPlaceholder?: string;
  noResultsMessage?: string;
  className?: string;
  compact?: boolean; // For responsive adaptation
}

// Collapsible group component
interface CollapsibleGroupProps<T extends SearchableItem> {
  groupName: string;
  items: T[];
  isOpen: boolean;
  onToggle: () => void;
  renderItem: (item: T) => React.ReactNode;
  compact?: boolean;
}

function CollapsibleGroup<T extends SearchableItem>({
  groupName,
  items,
  isOpen,
  onToggle,
  renderItem,
  compact = false
}: CollapsibleGroupProps<T>) {
  return (
    <div
      className="border border-border overflow-visible"
      style={{ borderRadius: 'var(--radius-card, 8px)' }}
    >
      {/* Header del grupo */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between ${compact ? 'p-2' : 'p-4'} bg-muted/30 hover:bg-muted/50 transition-colors min-w-0`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-shrink-0">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <h3 className={`${compact ? 'text-base' : 'text-lg'} font-semibold text-foreground min-w-0 truncate`}>
            {groupName}
          </h3>
        </div>
      </button>

      {/* Contenido del grupo */}
      {isOpen && (
        <div className={`${compact ? 'p-2' : 'p-4'} border-t border-border bg-card/30`}>
          <div className={`flex flex-col ${compact ? 'gap-4' : 'gap-6'}`}>
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-4">
                {renderItem(item)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Main search filter component
export function ComponentSearchFilter<T extends SearchableItem>({
  items,
  categories,
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  openGroups,
  onToggleGroup,
  onOpenAllGroups,
  onCloseAllGroups,
  renderItem,
  groupBy = (item) => item.name,
  searchPlaceholder = "Buscar componentes por nombre o características...",
  noResultsMessage = "No se encontraron componentes con los filtros aplicados",
  className = "",
  compact = false
}: ComponentSearchFilterProps<T>) {

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return item.name.toLowerCase().includes(searchLower) ||
               item.keywords.some(keyword => keyword.toLowerCase().includes(searchLower));
      }

      return true;
    });
  }, [searchTerm, selectedCategory, items]);

  // Group filtered items
  const groupedItems = useMemo(() => {
    const groups = new Map<string, T[]>();

    filteredItems.forEach(item => {
      const groupName = groupBy(item);
      if (!groups.has(groupName)) {
        groups.set(groupName, []);
      }
      groups.get(groupName)!.push(item);
    });

    return groups;
  }, [filteredItems, groupBy]);

  // Clear filters function
  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
  };

  return (
    <div className={`flex flex-col ${compact ? 'gap-3' : 'gap-6'} w-full min-w-0 ${className}`}>

      {/* Search and filters */}
      <div className={`flex flex-col ${compact ? 'gap-2' : 'gap-4'}`}>
        {/* Search bar */}
        <div className="flex relative w-full">
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full flex-1 min-w-0"
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={searchTerm ? (
              <button
                onClick={() => onSearchChange('')}
                className="text-muted-foreground hover:text-foreground"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            ) : undefined}
          />
        </div>

        {/* Category filters */}
        <div className={`flex flex-wrap ${compact ? 'gap-1' : 'gap-2'} justify-start items-center`}>
          <Button
            size={compact ? "sm" : "sm"}
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => onCategoryChange('all')}
            className="flex-shrink-0"
          >
            Todas las categorías
          </Button>
          {Object.entries(categories).map(([key, label]) => (
            <Button
              key={key}
              size={compact ? "sm" : "sm"}
              variant={selectedCategory === key ? 'default' : 'outline'}
              onClick={() => onCategoryChange(key)}
              className="flex-shrink-0"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Active filters indicator */}
        {(searchTerm || selectedCategory !== 'all') && (
          <div className={`flex flex-col sm:flex-row sm:items-center ${compact ? 'gap-1' : 'gap-2'} text-sm text-muted-foreground`}>
            <span className="flex-1 min-w-0">
              Mostrando {filteredItems.length} de {items.length} componentes
            </span>
            <Button size="sm" variant="ghost" onClick={clearFilters} className="flex-shrink-0">
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Group controls */}
      {groupedItems.size > 0 && (
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${compact ? 'gap-2' : 'gap-3'}`}>
          <span className={`${compact ? 'text-xs' : 'text-sm'} text-muted-foreground flex-1 min-w-0`}>
            {groupedItems.size} {groupedItems.size === 1 ? 'tipo de componente' : 'tipos de componentes'} encontrados
          </span>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenAllGroups}
              className="flex-1 sm:flex-initial"
            >
              Abrir todos
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCloseAllGroups}
              className="flex-1 sm:flex-initial"
            >
              Cerrar todos
            </Button>
          </div>
        </div>
      )}

      {/* Groups */}
      <div className={`flex flex-col ${compact ? 'gap-2' : 'gap-4'} w-full`}>
        {groupedItems.size === 0 ? (
          <div className={`flex flex-col items-center justify-center ${compact ? 'py-8' : 'py-12'}`}>
            <div className="flex flex-col items-center text-muted-foreground">
              <Search className={`${compact ? 'h-8 w-8' : 'h-12 w-12'} mb-4 opacity-50`} />
              <p className={`text-center mb-2 ${compact ? 'text-sm' : ''}`}>{noResultsMessage}</p>
              <Button size="sm" variant="ghost" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          </div>
        ) : (
          Array.from(groupedItems.entries()).map(([groupName, groupItems]) => (
            <CollapsibleGroup
              key={groupName}
              groupName={groupName}
              items={groupItems}
              isOpen={openGroups.has(groupName)}
              onToggle={() => onToggleGroup(groupName)}
              renderItem={renderItem}
              compact={compact}
            />
          ))
        )}
      </div>
    </div>
  );
}