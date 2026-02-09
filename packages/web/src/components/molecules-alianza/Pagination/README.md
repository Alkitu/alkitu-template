# Pagination Molecule

Advanced pagination component for tables and data lists with multiple variants and comprehensive features.

## Overview

The Pagination molecule provides a complete navigation control for paginated content with support for:
- Multiple visual variants (default, compact, detailed, simple)
- First/Last page navigation
- Page size selection
- Total items display
- Configurable sibling and boundary counts
- Full keyboard navigation
- Theme integration
- Internationalization support

## Usage

### Basic Usage

```tsx
import { Pagination } from '@/components/molecules-alianza/Pagination';

function MyTable() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={10}
      onPageChange={setCurrentPage}
    />
  );
}
```

### With Page Size Selector

```tsx
import { Pagination } from '@/components/molecules-alianza/Pagination';

function MyTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <Pagination
      variant="detailed"
      currentPage={currentPage}
      totalPages={20}
      totalItems={200}
      pageSize={pageSize}
      showPageSize
      showTotal
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    />
  );
}
```

### Using Presets

```tsx
import { Pagination, PaginationPresets } from '@/components/molecules-alianza/Pagination';

function MyTable() {
  return (
    <Pagination
      {...PaginationPresets.detailed}
      currentPage={5}
      totalPages={20}
      totalItems={200}
      pageSize={10}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}
```

## Variants

### Default
Standard pagination with page numbers, prev/next, and first/last buttons.

### Compact
Minimalist design showing only prev/current/next - ideal for mobile.

### Simple
Basic pagination with text labels (e.g., "Page 1 of 10").

### Detailed
Full-featured variant with page size selector and total items display.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | - | Current active page (required) |
| `totalPages` | `number` | - | Total number of pages (required) |
| `onPageChange` | `(page: number) => void` | - | Page change callback (required) |
| `variant` | `'default' \| 'compact' \| 'detailed' \| 'simple'` | `'default'` | Visual variant |
| `showFirstLast` | `boolean` | `true` | Show first/last page buttons |
| `showPageSize` | `boolean` | `false` | Show page size selector |
| `pageSize` | `number` | `10` | Current page size |
| `onPageSizeChange` | `(size: number) => void` | - | Page size change callback |
| `pageSizeOptions` | `number[]` | `[5, 10, 20, 50, 100]` | Available page sizes |
| `showTotal` | `boolean` | `false` | Show total items count |
| `totalItems` | `number` | - | Total number of items |
| `siblingCount` | `number` | `1` | Pages to show on each side |
| `boundaryCount` | `number` | `1` | Pages to show at start/end |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `className` | `string` | - | Custom CSS classes |

## Internationalization

All text labels can be customized:

```tsx
<Pagination
  currentPage={5}
  totalPages={20}
  variant="detailed"
  previousText="Anterior"
  nextText="Siguiente"
  pageLabel="Página"
  ofLabel="de"
  showingLabel="Mostrando"
  toLabel="a"
  resultsLabel="resultados"
  perPageLabel="por página"
  totalLabel="Total:"
  pagesLabel="Páginas:"
  onPageChange={handlePageChange}
/>
```

## Presets

Pre-configured settings for common use cases:

### Basic
```tsx
PaginationPresets.basic = {
  variant: 'default',
  showFirstLast: true,
  showPageSize: false,
  showTotal: false,
  siblingCount: 1,
  boundaryCount: 1,
}
```

### Compact
```tsx
PaginationPresets.compact = {
  variant: 'compact',
  showFirstLast: false,
  showPageSize: false,
  showTotal: false,
}
```

### Detailed
```tsx
PaginationPresets.detailed = {
  variant: 'detailed',
  showFirstLast: true,
  showPageSize: true,
  showTotal: true,
  siblingCount: 2,
  boundaryCount: 1,
}
```

### Simple
```tsx
PaginationPresets.simple = {
  variant: 'simple',
  showFirstLast: false,
  showPageSize: false,
  showTotal: false,
}
```

## Accessibility

The component follows WAI-ARIA best practices:
- Proper ARIA labels on all buttons
- `aria-current="page"` on active page
- `aria-hidden` on ellipsis elements
- Full keyboard navigation support
- Screen reader friendly text

## Testing

The component has 99.45% test coverage with 94 tests covering:
- All variants
- Page navigation
- Disabled states
- Page range calculation
- First/Last navigation
- Total items display
- Page size selector
- Keyboard navigation
- Custom labels
- Edge cases
- Accessibility

Run tests:
```bash
npm run test -- molecules-alianza/Pagination --run
```

## Implementation Notes

- Uses `useMemo` for efficient page range calculation
- Automatically handles ellipsis insertion
- Prevents navigation beyond boundaries
- Responsive design with mobile-friendly variants
- Theme-aware using CSS variables

## Related Components

- Used in: UsersTable, RequestsTable, ServicesTable
- Composes: Button patterns, Typography
- Works with: Table organisms

## Migration

Migrated from `/molecules/pagination/PaginationMolecule` to maintain backward compatibility while following Atomic Design principles.
