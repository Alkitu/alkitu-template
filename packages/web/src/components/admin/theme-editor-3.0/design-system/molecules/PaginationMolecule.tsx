'use client';

import React, { useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  MoreHorizontal 
} from 'lucide-react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { Select } from '../atoms/Select';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '../primitives/pagination';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

export interface PaginationMoleculeProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'default' | 'compact' | 'detailed' | 'simple';
  showFirstLast?: boolean;
  showPageSize?: boolean;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showTotal?: boolean;
  totalItems?: number;
  siblingCount?: number;
  boundaryCount?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * PaginationMolecule - Advanced pagination component with theme integration
 * 
 * Combines: Pagination (primitive) + Button + Badge + Select + Typography
 * Features: Multiple variants, page size selection, totals display, theme-responsive
 * Spacing: Small (button padding), Medium (component gaps), Large (section spacing)
 */
export function PaginationMolecule({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'default',
  showFirstLast = true,
  showPageSize = false,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50, 100],
  showTotal = false,
  totalItems,
  siblingCount = 1,
  boundaryCount = 1,
  disabled = false,
  className = ''
}: PaginationMoleculeProps) {
  const { state } = useThemeEditor();
  
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
  const largeSpacing = `var(--spacing-large, ${baseValue * 4}px)`;

  // Calculate page range
  const pageRange = useMemo(() => {
    const range: (number | string)[] = [];
    const start = Math.max(1, currentPage - siblingCount);
    const end = Math.min(totalPages, currentPage + siblingCount);

    // Add first boundary
    for (let i = 1; i <= Math.min(boundaryCount, totalPages); i++) {
      range.push(i);
    }

    // Add ellipsis if needed
    if (start > boundaryCount + 2) {
      range.push('start-ellipsis');
    } else if (start === boundaryCount + 2) {
      range.push(boundaryCount + 1);
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      if (i > boundaryCount && i <= totalPages - boundaryCount) {
        range.push(i);
      }
    }

    // Add ellipsis if needed
    if (end < totalPages - boundaryCount - 1) {
      range.push('end-ellipsis');
    } else if (end === totalPages - boundaryCount - 1) {
      range.push(totalPages - boundaryCount);
    }

    // Add last boundary
    for (let i = Math.max(totalPages - boundaryCount + 1, boundaryCount + 1); i <= totalPages; i++) {
      range.push(i);
    }

    // Remove duplicates and sort
    return [...new Set(range)];
  }, [currentPage, totalPages, siblingCount, boundaryCount]);

  // Handlers
  const handlePageChange = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };

  // Styles
  const getContainerStyles = () => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: mediumSpacing,
    alignItems: 'center',
    marginBottom: largeSpacing
  });

  const getInfoStyles = () => ({
    fontFamily: 'var(--typography-paragraph-font-family)',
    fontSize: '14px',
    fontWeight: 500,
    color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
    textAlign: 'center' as const,
    background: `${colors?.accent?.value || 'var(--color-accent)'}30`,
    padding: '8px 16px',
    borderRadius: 'var(--radius, 8px)',
    border: `1px solid ${colors?.border?.value || 'var(--color-border)'}40`,
    backdropFilter: 'blur(4px)'
  });

  const getControlsStyles = () => ({
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    gap: mediumSpacing,
    justifyContent: 'center'
  });

  const getPageSizeStyles = () => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--typography-paragraph-font-family)',
    fontSize: 'var(--typography-paragraph-font-size)',
    color: colors?.foreground?.value || 'var(--color-foreground)'
  });

  // Calculate display info
  const startItem = totalItems ? ((currentPage - 1) * pageSize) + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : 0;

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={className} style={getContainerStyles()}>
        <div style={getControlsStyles()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={disabled || currentPage === 1}
            style={{
              borderRadius: 'var(--radius, 8px)',
              minWidth: '40px',
              minHeight: '40px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: colors?.background?.value || 'var(--color-background)',
              borderColor: colors?.border?.value || 'var(--color-border)'
            }}
            className={`
              group relative overflow-hidden
              ${!disabled && currentPage !== 1 ? 'hover:bg-accent/60 hover:scale-105 hover:shadow-md active:scale-95' : ''}
              transition-all duration-300 ease-out
            `}
          >
            <ChevronLeft 
              className="h-4 w-4" 
              style={{
                transition: 'transform 0.3s ease',
                color: (disabled || currentPage === 1) 
                  ? (colors?.mutedForeground?.value || 'var(--color-muted-foreground)') 
                  : (colors?.foreground?.value || 'var(--color-foreground)')
              }}
              className="group-hover:scale-110"
            />
          </Button>

          <Badge 
            variant="outline" 
            style={{ 
              minWidth: '90px', 
              textAlign: 'center' as const,
              fontSize: '14px',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: 'var(--radius, 8px)',
              background: `linear-gradient(135deg, ${colors?.primary?.value || 'var(--color-primary)'}15, ${colors?.primary?.value || 'var(--color-primary)'}05)`,
              borderColor: `${colors?.primary?.value || 'var(--color-primary)'}40`,
              color: colors?.primary?.value || 'var(--color-primary)',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(4px)'
            }}
            className="hover:scale-105 hover:shadow-sm"
          >
            <span style={{ color: colors?.primary?.value || 'var(--color-primary)' }}>
              {currentPage}
            </span>
            <span style={{ 
              color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
              margin: '0 4px' 
            }}>/</span>
            <span style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}>
              {totalPages}
            </span>
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={disabled || currentPage === totalPages}
            style={{
              borderRadius: 'var(--radius, 8px)',
              minWidth: '40px',
              minHeight: '40px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: colors?.background?.value || 'var(--color-background)',
              borderColor: colors?.border?.value || 'var(--color-border)'
            }}
            className={`
              group relative overflow-hidden
              ${!disabled && currentPage !== totalPages ? 'hover:bg-accent/60 hover:scale-105 hover:shadow-md active:scale-95' : ''}
              transition-all duration-300 ease-out
            `}
          >
            <ChevronRight 
              className="h-4 w-4" 
              style={{
                transition: 'transform 0.3s ease',
                color: (disabled || currentPage === totalPages) 
                  ? (colors?.mutedForeground?.value || 'var(--color-muted-foreground)') 
                  : (colors?.foreground?.value || 'var(--color-foreground)')
              }}
              className="group-hover:scale-110"
            />
          </Button>
        </div>
      </div>
    );
  }

  // Simple variant
  if (variant === 'simple') {
    return (
      <div className={className} style={getContainerStyles()}>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={disabled || currentPage === 1}
              />
            </PaginationItem>
            <PaginationItem>
              <span style={getInfoStyles()}>
                Página {currentPage} de {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={disabled || currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  }

  // Default and detailed variants
  return (
    <div className={className} style={getContainerStyles()}>
      {/* Total items info */}
      {(showTotal && totalItems) && (
        <div style={getInfoStyles()}>
          Mostrando {startItem} a {endItem} de {totalItems.toLocaleString()} resultados
        </div>
      )}

      {/* Main pagination */}
      <Pagination>
        <PaginationContent>
          {/* First page button */}
          {showFirstLast && currentPage > boundaryCount + 1 && (
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={disabled}
                style={{ 
                  padding: smallSpacing,
                  borderRadius: 'var(--radius, 8px)',
                  minWidth: '40px',
                  minHeight: '40px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: colors?.background?.value || 'var(--color-background)',
                  borderColor: colors?.border?.value || 'var(--color-border)'
                }}
                className={`
                  group relative overflow-hidden
                  ${!disabled ? 'hover:bg-primary/10 hover:scale-105 hover:shadow-md active:scale-95' : ''}
                  transition-all duration-300 ease-out
                `}
              >
                <ChevronsLeft 
                  className="h-4 w-4" 
                  style={{
                    transition: 'transform 0.3s ease',
                    color: disabled 
                      ? (colors?.mutedForeground?.value || 'var(--color-muted-foreground)') 
                      : (colors?.primary?.value || 'var(--color-primary)')
                  }}
                  className="group-hover:scale-110"
                />
              </Button>
            </PaginationItem>
          )}

          {/* Previous button */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={disabled || currentPage === 1}
            />
          </PaginationItem>

          {/* Page numbers */}
          {pageRange.map((page, index) => (
            <PaginationItem key={index}>
              {typeof page === 'number' ? (
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={page === currentPage}
                  disabled={disabled}
                >
                  {page}
                </PaginationLink>
              ) : (
                <PaginationEllipsis />
              )}
            </PaginationItem>
          ))}

          {/* Next button */}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={disabled || currentPage === totalPages}
            />
          </PaginationItem>

          {/* Last page button */}
          {showFirstLast && currentPage < totalPages - boundaryCount && (
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={disabled}
                style={{ padding: smallSpacing }}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>

      {/* Page size selector */}
      {showPageSize && variant === 'detailed' && (
        <div style={getPageSizeStyles()}>
          <span>Mostrar:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            disabled={disabled}
            style={{
              padding: '4px 8px',
              border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
              borderRadius: 'var(--radius, 4px)',
              background: colors?.background?.value || 'var(--color-background)',
              color: colors?.foreground?.value || 'var(--color-foreground)',
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: 'var(--typography-paragraph-font-size)'
            }}
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span>por página</span>
        </div>
      )}

      {/* Additional info for detailed variant */}
      {variant === 'detailed' && totalItems && (
        <div style={getInfoStyles()}>
          <Badge variant="outline" style={{ marginRight: '8px' }}>
            Total: {totalItems.toLocaleString()}
          </Badge>
          <Badge variant="outline">
            Páginas: {totalPages}
          </Badge>
        </div>
      )}
    </div>
  );
}

// Export preset configurations
export const PaginationPresets = {
  basic: {
    variant: 'default' as const,
    showFirstLast: true,
    showPageSize: false,
    showTotal: false,
    siblingCount: 1,
    boundaryCount: 1
  },
  
  compact: {
    variant: 'compact' as const,
    showFirstLast: false,
    showPageSize: false,
    showTotal: false
  },
  
  detailed: {
    variant: 'detailed' as const,
    showFirstLast: true,
    showPageSize: true,
    showTotal: true,
    siblingCount: 2,
    boundaryCount: 1
  },
  
  simple: {
    variant: 'simple' as const,
    showFirstLast: false,
    showPageSize: false,
    showTotal: false
  }
};