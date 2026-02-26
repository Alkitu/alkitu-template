import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RequestFilterButtons } from './RequestFilterButtons';
import type { RequestFilterType } from './RequestFilterButtons.types';

/**
 * RequestFilterButtons - Filter buttons for request status filtering
 *
 * A molecule component that provides filtering UI for request lists with status,
 * priority, and assignment filters. Part of the Alianza Design System.
 *
 * ## Features
 * - 5 request status filters (All, Pending, In Progress, Completed, Cancelled)
 * - Active state highlighting with theme colors
 * - Click handler for filter changes
 * - Fully keyboard accessible
 * - Theme-aware styling
 * - Responsive layout
 */
const meta = {
  title: 'Molecules/Alianza/RequestFilterButtons',
  component: RequestFilterButtons,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Filter buttons for request status filtering. Displays all available request states (all, pending, ongoing, completed, cancelled) with active state highlighting.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    activeFilter: {
      control: 'select',
      options: ['all', 'pending', 'ongoing', 'completed', 'cancelled'],
      description: 'Currently active filter',
      table: {
        type: { summary: 'RequestFilterType' },
        defaultValue: { summary: 'all' },
      },
    },
    onFilterChange: {
      action: 'filter-changed',
      description: 'Callback when filter changes',
      table: {
        type: { summary: '(filter: RequestFilterType) => void' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof RequestFilterButtons>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

/**
 * Default state showing "All" as the active filter
 */
export const Default: Story = {
  args: {
    activeFilter: 'all',
    onFilterChange: (filter) => console.log('Filter changed to:', filter),
  },
};

/**
 * Pending filter active - shows pending requests
 */
export const PendingActive: Story = {
  args: {
    activeFilter: 'pending',
    onFilterChange: (filter) => console.log('Filter changed to:', filter),
  },
};

/**
 * Ongoing filter active - shows requests in progress
 */
export const OngoingActive: Story = {
  args: {
    activeFilter: 'ongoing',
    onFilterChange: (filter) => console.log('Filter changed to:', filter),
  },
};

/**
 * Completed filter active - shows completed requests
 */
export const CompletedActive: Story = {
  args: {
    activeFilter: 'completed',
    onFilterChange: (filter) => console.log('Filter changed to:', filter),
  },
};

/**
 * Cancelled filter active - shows cancelled requests
 */
export const CancelledActive: Story = {
  args: {
    activeFilter: 'cancelled',
    onFilterChange: (filter) => console.log('Filter changed to:', filter),
  },
};

/**
 * Interactive example with state management
 * Click buttons to see filter changes
 */
export const Interactive: Story = {
  render: () => {
    const [activeFilter, setActiveFilter] = useState<RequestFilterType>('all');

    return (
      <div className="space-y-4">
        <RequestFilterButtons
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <div className="text-sm text-muted-foreground">
          Active filter: <strong>{activeFilter}</strong>
        </div>
      </div>
    );
  },
};

/**
 * With custom styling - centered layout with max width
 */
export const CustomStyling: Story = {
  args: {
    activeFilter: 'all',
    onFilterChange: (filter) => console.log('Filter changed to:', filter),
    className: 'justify-center max-w-screen-lg mx-auto',
  },
};

/**
 * All filter states shown in a grid for comparison
 */
export const AllStates: Story = {
  render: () => {
    const filters: RequestFilterType[] = [
      'all',
      'pending',
      'ongoing',
      'completed',
      'cancelled',
    ];

    return (
      <div className="space-y-6 p-4">
        {filters.map((filter) => (
          <div key={filter} className="space-y-2">
            <div className="text-sm font-medium capitalize">{filter} Active</div>
            <RequestFilterButtons
              activeFilter={filter}
              onFilterChange={(f) => console.log('Changed to:', f)}
            />
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Responsive layout example - wraps on smaller screens
 */
export const ResponsiveLayout: Story = {
  render: () => {
    const [activeFilter, setActiveFilter] = useState<RequestFilterType>('all');

    return (
      <div className="w-full max-w-sm">
        <RequestFilterButtons
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          className="flex-wrap"
        />
      </div>
    );
  },
};

/**
 * With request counts - shows example integration with count badges
 */
export const WithCounts: Story = {
  render: () => {
    const [activeFilter, setActiveFilter] = useState<RequestFilterType>('all');

    const counts = {
      all: 42,
      pending: 8,
      ongoing: 12,
      completed: 20,
      cancelled: 2,
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Requests by Status</h3>
          <RequestFilterButtons
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
        <div className="rounded-lg border p-4 space-y-2">
          <div className="text-sm font-medium">Count Details</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(counts).map(([status, count]) => (
              <div
                key={status}
                className={`flex justify-between p-2 rounded ${
                  activeFilter === status ? 'bg-primary/10' : 'bg-muted'
                }`}
              >
                <span className="capitalize">{status}:</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Dark mode example - shows theme adaptation
 */
export const DarkMode: Story = {
  args: {
    activeFilter: 'pending',
    onFilterChange: (filter) => console.log('Filter changed to:', filter),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

/**
 * Compact layout with smaller gap
 */
export const CompactLayout: Story = {
  args: {
    activeFilter: 'all',
    onFilterChange: (filter) => console.log('Filter changed to:', filter),
    className: 'gap-1',
  },
};

/**
 * With custom spacing - larger gap between buttons
 */
export const LargerSpacing: Story = {
  args: {
    activeFilter: 'all',
    onFilterChange: (filter) => console.log('Filter changed to:', filter),
    className: 'gap-4',
  },
};

/**
 * Vertical layout example
 */
export const VerticalLayout: Story = {
  args: {
    activeFilter: 'pending',
    onFilterChange: (filter) => console.log('Filter changed to:', filter),
    className: 'flex-col',
  },
};

/**
 * Real-world usage example with request list header
 */
export const RequestListHeader: Story = {
  render: () => {
    const [activeFilter, setActiveFilter] = useState<RequestFilterType>('all');

    return (
      <div className="w-full max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Requests</h2>
          <div className="text-sm text-muted-foreground">
            Showing {activeFilter === 'all' ? 'all' : activeFilter} requests
          </div>
        </div>
        <RequestFilterButtons
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">
            Request list content would appear here...
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Keyboard navigation demo
 */
export const KeyboardNavigation: Story = {
  render: () => {
    const [activeFilter, setActiveFilter] = useState<RequestFilterType>('all');

    return (
      <div className="space-y-4">
        <RequestFilterButtons
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <div className="text-sm text-muted-foreground space-y-1">
          <div>
            <strong>Keyboard shortcuts:</strong>
          </div>
          <div>• Tab: Navigate between filters</div>
          <div>• Enter/Space: Activate filter</div>
          <div>• Shift+Tab: Navigate backwards</div>
        </div>
      </div>
    );
  },
};

/**
 * With loading state simulation
 */
export const WithLoadingState: Story = {
  render: () => {
    const [activeFilter, setActiveFilter] = useState<RequestFilterType>('all');
    const [isLoading, setIsLoading] = useState(false);

    const handleFilterChange = (filter: RequestFilterType) => {
      setIsLoading(true);
      setActiveFilter(filter);
      setTimeout(() => setIsLoading(false), 500);
    };

    return (
      <div className="space-y-4">
        <RequestFilterButtons
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
        {isLoading && (
          <div className="text-sm text-muted-foreground">Loading...</div>
        )}
      </div>
    );
  },
};

/**
 * Mobile responsive example
 */
export const MobileView: Story = {
  render: () => {
    const [activeFilter, setActiveFilter] = useState<RequestFilterType>('all');

    return (
      <div className="w-[375px] p-4">
        <RequestFilterButtons
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          className="flex-wrap gap-2"
        />
      </div>
    );
  },
};

/**
 * Accessibility features demonstration
 */
export const AccessibilityDemo: Story = {
  render: () => {
    const [activeFilter, setActiveFilter] = useState<RequestFilterType>('all');

    return (
      <div className="space-y-4">
        <RequestFilterButtons
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <div className="text-sm text-muted-foreground space-y-2 border p-4 rounded-lg">
          <div className="font-medium">Accessibility Features:</div>
          <ul className="list-disc list-inside space-y-1">
            <li>Full keyboard navigation support</li>
            <li>Proper button roles and semantics</li>
            <li>High contrast active/inactive states</li>
            <li>Theme-aware color contrast</li>
            <li>Focus visible indicators</li>
            <li>Screen reader friendly labels</li>
          </ul>
        </div>
      </div>
    );
  },
};
