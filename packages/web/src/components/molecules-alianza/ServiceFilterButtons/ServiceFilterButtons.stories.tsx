import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ServiceFilterButtons } from './ServiceFilterButtons';
import type { ServiceFilterType } from './ServiceFilterButtons.types';

const meta = {
  title: 'Molecules/ServiceFilterButtons',
  component: ServiceFilterButtons,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ServiceFilterButtons provides a filter UI for service catalogs and lists. Supports single/multi-select, count badges, and responsive layouts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    activeFilter: {
      control: 'radio',
      options: ['all', 'active', 'inactive'],
      description: 'Currently active filter',
    },
    onFilterChange: {
      description: 'Callback when filter changes',
    },
    showCounts: {
      control: 'boolean',
      description: 'Show count badges on filters',
    },
    showClearAll: {
      control: 'boolean',
      description: 'Show clear all button',
    },
    multiSelect: {
      control: 'boolean',
      description: 'Enable multi-selection mode',
    },
    variant: {
      control: 'radio',
      options: ['default', 'compact', 'pill'],
      description: 'Button variant style',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    responsive: {
      control: 'radio',
      options: ['wrap', 'scroll'],
      description: 'Responsive behavior',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all filters',
    },
  },
  args: {
    onFilterChange: () => {},
  },
} satisfies Meta<typeof ServiceFilterButtons>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

/**
 * Default single-selection filter buttons
 */
export const Default: Story = {
  render: (args) => {
    const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('all');

    return (
      <div className="w-[600px]">
        <ServiceFilterButtons {...args} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>
    );
  },
  args: {
    activeFilter: 'all',
  },
};

/**
 * Filter buttons with count badges showing number of items in each category
 */
export const WithCounts: Story = {
  render: (args) => {
    const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('all');

    return (
      <div className="w-[600px]">
        <ServiceFilterButtons
          {...args}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          showCounts
          counts={{ all: 150, active: 95, inactive: 55 }}
        />
      </div>
    );
  },
  args: {
    activeFilter: 'all',
  },
};

/**
 * Multi-select mode allowing multiple filters to be active simultaneously
 */
export const MultiSelect: Story = {
  render: (args) => {
    const [selectedFilters, setSelectedFilters] = useState<ServiceFilterType[]>(['active']);

    const handleFilterChange = (filter: ServiceFilterType) => {
      setSelectedFilters((prev) => {
        if (prev.includes(filter)) {
          return prev.filter((f) => f !== filter);
        }
        return [...prev, filter];
      });
    };

    return (
      <div className="w-[600px]">
        <ServiceFilterButtons
          {...args}
          activeFilter="all"
          onFilterChange={handleFilterChange}
          multiSelect
          selectedFilters={selectedFilters}
        />
      </div>
    );
  },
};

/**
 * Filter buttons with clear all functionality
 */
export const WithClearAll: Story = {
  render: (args) => {
    const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('active');

    const handleClearAll = () => {
      setActiveFilter('all');
    };

    return (
      <div className="w-[600px]">
        <ServiceFilterButtons
          {...args}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          showClearAll
          onClearAll={handleClearAll}
        />
      </div>
    );
  },
};

/**
 * Some filters can be disabled to prevent user interaction
 */
export const WithDisabledFilters: Story = {
  render: (args) => {
    const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('all');

    return (
      <div className="w-[600px]">
        <ServiceFilterButtons
          {...args}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          disabledFilters={['inactive']}
        />
      </div>
    );
  },
};

/**
 * All filters can be disabled at once
 */
export const AllDisabled: Story = {
  render: (args) => {
    const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('all');

    return (
      <div className="w-[600px]">
        <ServiceFilterButtons
          {...args}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          disabled
        />
      </div>
    );
  },
};

/**
 * Compact variant with smaller border radius
 */
export const CompactVariant: Story = {
  render: (args) => {
    const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('all');

    return (
      <div className="w-[600px]">
        <ServiceFilterButtons
          {...args}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          variant="compact"
          showCounts
          counts={{ all: 150, active: 95, inactive: 55 }}
        />
      </div>
    );
  },
};

/**
 * Pill variant with fully rounded buttons
 */
export const PillVariant: Story = {
  render: (args) => {
    const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('all');

    return (
      <div className="w-[600px]">
        <ServiceFilterButtons
          {...args}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          variant="pill"
          showCounts
          counts={{ all: 150, active: 95, inactive: 55 }}
        />
      </div>
    );
  },
};

/**
 * Small size buttons for compact UIs
 */
export const SmallSize: Story = {
  render: (args) => {
    const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('all');

    return (
      <div className="w-[600px]">
        <ServiceFilterButtons
          {...args}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          size="sm"
          showCounts
          counts={{ all: 150, active: 95, inactive: 55 }}
        />
      </div>
    );
  },
};

/**
 * Large size buttons for emphasis
 */
export const LargeSize: Story = {
  render: (args) => {
    const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('all');

    return (
      <div className="w-[600px]">
        <ServiceFilterButtons
          {...args}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          size="lg"
          showCounts
          counts={{ all: 150, active: 95, inactive: 55 }}
        />
      </div>
    );
  },
};

/**
 * Scroll mode for horizontal scrolling on narrow screens
 */
export const ScrollMode: Story = {
  render: (args) => {
    const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('all');

    return (
      <div className="w-[300px] border p-4 rounded">
        <ServiceFilterButtons
          {...args}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          responsive="scroll"
        />
      </div>
    );
  },
};

/**
 * Wrap mode for wrapping buttons on narrow screens (default)
 */
export const WrapMode: Story = {
  render: (args) => {
    const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('all');

    return (
      <div className="w-[300px] border p-4 rounded">
        <ServiceFilterButtons
          {...args}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          responsive="wrap"
        />
      </div>
    );
  },
};

/**
 * Custom filter options with different labels
 */
export const CustomOptions: Story = {
  render: (args) => {
    const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('all');

    return (
      <div className="w-[600px]">
        <ServiceFilterButtons
          {...args}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          filterOptions={[
            { id: 'all', label: 'All Services' },
            { id: 'active', label: 'Running' },
            { id: 'inactive', label: 'Stopped' },
          ]}
        />
      </div>
    );
  },
};

/**
 * Complete example with all features enabled
 */
export const CompleteExample: Story = {
  render: (args) => {
    const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('active');

    const handleClearAll = () => {
      setActiveFilter('all');
    };

    return (
      <div className="w-[600px] space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">Service Status</h3>
          <ServiceFilterButtons
            {...args}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            showCounts
            counts={{ all: 150, active: 95, inactive: 55 }}
            showClearAll
            onClearAll={handleClearAll}
            variant="pill"
            size="md"
            aria-label="Filter services by status"
          />
        </div>
      </div>
    );
  },
};

/**
 * Interactive playground for testing all combinations
 */
export const Playground: Story = {
  render: (args) => {
    const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('all');
    const [selectedFilters, setSelectedFilters] = useState<ServiceFilterType[]>([]);

    const handleFilterChange = (filter: ServiceFilterType) => {
      if (args.multiSelect) {
        setSelectedFilters((prev) => {
          if (prev.includes(filter)) {
            return prev.filter((f) => f !== filter);
          }
          return [...prev, filter];
        });
      } else {
        setActiveFilter(filter);
      }
    };

    const handleClearAll = () => {
      if (args.multiSelect) {
        setSelectedFilters([]);
      } else {
        setActiveFilter('all');
      }
    };

    return (
      <div className="w-[600px]">
        <ServiceFilterButtons
          {...args}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          selectedFilters={selectedFilters}
          onClearAll={handleClearAll}
        />
      </div>
    );
  },
  args: {
    activeFilter: 'all',
    showCounts: true,
    counts: { all: 150, active: 95, inactive: 55 },
    showClearAll: true,
    variant: 'default',
    size: 'md',
    responsive: 'wrap',
    disabled: false,
    multiSelect: false,
  },
};
