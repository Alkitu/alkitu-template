import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination, PaginationPresets } from './Pagination';

const meta = {
  title: 'Molecules/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Advanced pagination molecule with multiple variants, theme integration, and comprehensive features. Composes buttons and badges to create a complete pagination control for tables and data lists.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed', 'simple'],
      description: 'Visual variant of the pagination',
    },
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'Current active page number',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages',
    },
    showFirstLast: {
      control: 'boolean',
      description: 'Show first/last page navigation buttons',
    },
    showPageSize: {
      control: 'boolean',
      description: 'Show page size selector',
    },
    showTotal: {
      control: 'boolean',
      description: 'Show total items count',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    siblingCount: {
      control: { type: 'number', min: 0, max: 5 },
      description: 'Number of page buttons to show on each side',
    },
    boundaryCount: {
      control: { type: 'number', min: 1, max: 3 },
      description: 'Number of page buttons to show at start and end',
    },
  },
  args: {
    onPageChange: () => {},
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

// Interactive wrapper for stories
const InteractivePagination = (args: any) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage || 1);
  const [pageSize, setPageSize] = useState(args.pageSize || 10);

  return (
    <div className="w-full max-w-4xl">
      <Pagination
        {...args}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

/**
 * Default pagination variant with all features enabled
 */
export const Default: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 1,
    totalPages: 10,
    variant: 'default',
    showFirstLast: true,
  },
};

/**
 * Compact variant - minimalist design with prev/current/next
 */
export const Compact: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 5,
    totalPages: 10,
    variant: 'compact',
  },
};

/**
 * Simple variant - basic pagination with text labels
 */
export const Simple: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 3,
    totalPages: 10,
    variant: 'simple',
  },
};

/**
 * Detailed variant - all features including page size and totals
 */
export const Detailed: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 5,
    totalPages: 20,
    variant: 'detailed',
    showFirstLast: true,
    showPageSize: true,
    showTotal: true,
    totalItems: 200,
    pageSize: 10,
    siblingCount: 2,
  },
};

/**
 * With many pages - demonstrates ellipsis behavior
 */
export const ManyPages: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 25,
    totalPages: 50,
    showFirstLast: true,
    siblingCount: 1,
    boundaryCount: 1,
  },
};

/**
 * With custom sibling count - shows more surrounding pages
 */
export const CustomSiblingCount: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 10,
    totalPages: 20,
    siblingCount: 3,
    boundaryCount: 2,
  },
};

/**
 * First page state - previous disabled
 */
export const FirstPage: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 1,
    totalPages: 10,
    showFirstLast: true,
  },
};

/**
 * Last page state - next disabled
 */
export const LastPage: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 10,
    totalPages: 10,
    showFirstLast: true,
  },
};

/**
 * Single page - both navigation buttons disabled
 */
export const SinglePage: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 1,
    totalPages: 1,
  },
};

/**
 * Disabled state - all interactions disabled
 */
export const Disabled: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 5,
    totalPages: 10,
    disabled: true,
  },
};

/**
 * With page size selector
 */
export const WithPageSize: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 1,
    totalPages: 20,
    variant: 'detailed',
    showPageSize: true,
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
  },
};

/**
 * With total items display
 */
export const WithTotalItems: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 3,
    totalPages: 10,
    showTotal: true,
    totalItems: 95,
    pageSize: 10,
  },
};

/**
 * Custom page size options
 */
export const CustomPageSizeOptions: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 1,
    totalPages: 10,
    variant: 'detailed',
    showPageSize: true,
    pageSize: 25,
    pageSizeOptions: [10, 25, 50],
  },
};

/**
 * With custom labels (internationalization example)
 */
export const CustomLabels: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 3,
    totalPages: 10,
    variant: 'simple',
    previousText: 'Anterior',
    nextText: 'Siguiente',
    pageLabel: 'Página',
    ofLabel: 'de',
  },
};

/**
 * Detailed with Spanish labels
 */
export const DetailedSpanish: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 5,
    totalPages: 20,
    variant: 'detailed',
    showTotal: true,
    showPageSize: true,
    totalItems: 200,
    pageSize: 10,
    previousText: 'Anterior',
    nextText: 'Siguiente',
    showingLabel: 'Mostrando',
    toLabel: 'a',
    ofLabel: 'de',
    resultsLabel: 'resultados',
    perPageLabel: 'por página',
    totalLabel: 'Total:',
    pagesLabel: 'Páginas:',
  },
};

/**
 * Using basic preset
 */
export const BasicPreset: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    ...PaginationPresets.basic,
    currentPage: 5,
    totalPages: 10,
  },
};

/**
 * Using compact preset
 */
export const CompactPreset: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    ...PaginationPresets.compact,
    currentPage: 3,
    totalPages: 10,
  },
};

/**
 * Using detailed preset
 */
export const DetailedPreset: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    ...PaginationPresets.detailed,
    currentPage: 5,
    totalPages: 20,
    totalItems: 200,
    pageSize: 10,
  },
};

/**
 * Using simple preset
 */
export const SimplePreset: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    ...PaginationPresets.simple,
    currentPage: 7,
    totalPages: 15,
  },
};

/**
 * Mobile responsive - compact for small screens
 */
export const MobileResponsive: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 5,
    totalPages: 10,
    variant: 'compact',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Large dataset example
 */
export const LargeDataset: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 150,
    totalPages: 300,
    variant: 'detailed',
    showFirstLast: true,
    showTotal: true,
    showPageSize: true,
    totalItems: 3000,
    pageSize: 10,
    siblingCount: 1,
    boundaryCount: 1,
  },
};

/**
 * Table pagination example - typical use case
 */
export const TablePaginationExample: Story = {
  render: (args) => (
    <div className="space-y-4 w-full max-w-4xl">
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-lg font-semibold mb-4">Users Table</h3>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-2 border-b border-border">
              <span>User {i + (args.currentPage - 1) * 10}</span>
              <span className="text-muted-foreground">user{i}@example.com</span>
            </div>
          ))}
        </div>
      </div>
      <InteractivePagination {...args} />
    </div>
  ),
  args: {
    currentPage: 1,
    totalPages: 20,
    variant: 'detailed',
    showFirstLast: true,
    showTotal: true,
    showPageSize: true,
    totalItems: 195,
    pageSize: 10,
  },
};

/**
 * All variants comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Default Variant</h3>
        <InteractivePagination
          currentPage={5}
          totalPages={10}
          variant="default"
          showFirstLast
        />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Compact Variant</h3>
        <InteractivePagination
          currentPage={5}
          totalPages={10}
          variant="compact"
        />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Simple Variant</h3>
        <InteractivePagination
          currentPage={5}
          totalPages={10}
          variant="simple"
        />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Detailed Variant</h3>
        <InteractivePagination
          currentPage={5}
          totalPages={20}
          variant="detailed"
          showTotal
          showPageSize
          totalItems={200}
          pageSize={10}
        />
      </div>
    </div>
  ),
};

/**
 * Few pages - no ellipsis needed
 */
export const FewPages: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 2,
    totalPages: 5,
    showFirstLast: true,
  },
};

/**
 * Extreme case - 1000 pages
 */
export const ExtremePagination: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: {
    currentPage: 500,
    totalPages: 1000,
    showFirstLast: true,
    siblingCount: 1,
    boundaryCount: 1,
  },
};
