import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ToggleGroup from './ToggleGroup';
import type { ToggleGroupItem } from './ToggleGroup.types';

const meta = {
  title: 'Alianza/Molecules/ToggleGroup',
  component: ToggleGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
ToggleGroup is a molecule component for creating groups of toggle buttons with single or multiple selection modes.

**Features:**
- Single and multiple selection modes
- Controlled and uncontrolled modes
- Icon support with Alianza Icon component
- Size variants (sm, md, lg)
- Visual variants (default, outline)
- Horizontal and vertical orientation
- Full keyboard navigation
- Disabled state support
- Theme integration

**Common Use Cases:**
- Text alignment toolbars
- View mode switchers (list/grid/card)
- Text formatting toolbars (bold/italic/underline)
- Filter toggles
- Tab-like navigation
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of toggle items with value, label, icon, and disabled properties',
      control: 'object',
    },
    type: {
      description: 'Selection type - single or multiple',
      control: 'radio',
      options: ['single', 'multiple'],
    },
    value: {
      description: 'Selected value(s) in controlled mode',
      control: 'object',
    },
    defaultValue: {
      description: 'Default selected value(s) in uncontrolled mode',
      control: 'object',
    },
    size: {
      description: 'Size variant',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      description: 'Visual variant',
      control: 'select',
      options: ['default', 'outline'],
    },
    orientation: {
      description: 'Layout orientation',
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    disabled: {
      description: 'Whether entire group is disabled',
      control: 'boolean',
    },
    onValueChange: {
      description: 'Callback when selection changes',
      action: 'valueChanged',
    },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Text alignment items
const textAlignItems: ToggleGroupItem[] = [
  { value: 'left', label: 'Left', icon: 'alignLeft' },
  { value: 'center', label: 'Center', icon: 'alignCenter' },
  { value: 'right', label: 'Right', icon: 'alignRight' },
  { value: 'justify', label: 'Justify', icon: 'alignJustify' },
];

// Text formatting items
const formatItems: ToggleGroupItem[] = [
  { value: 'bold', label: 'B', icon: 'bold' },
  { value: 'italic', label: 'I', icon: 'italic' },
  { value: 'underline', label: 'U', icon: 'underline' },
  { value: 'strikethrough', label: 'S', icon: 'strikethrough' },
];

// View mode items
const viewModeItems: ToggleGroupItem[] = [
  { value: 'list', label: 'List', icon: 'list' },
  { value: 'grid', label: 'Grid', icon: 'grid' },
  { value: 'card', label: 'Card', icon: 'creditCard' },
];

// Filter items
const filterItems: ToggleGroupItem[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

// Icon-only items
const iconOnlyItems: ToggleGroupItem[] = [
  { value: 'list', label: '', icon: 'list' },
  { value: 'grid', label: '', icon: 'grid' },
  { value: 'card', label: '', icon: 'creditCard' },
];

/**
 * Default story showing single selection mode with text alignment
 */
export const Default: Story = {
  args: {
    items: textAlignItems,
    defaultValue: 'left',
    'aria-label': 'Text alignment',
  },
};

/**
 * Multiple selection mode allows selecting multiple items at once
 */
export const MultipleSelection: Story = {
  args: {
    type: 'multiple',
    items: formatItems,
    defaultValue: ['bold', 'italic'],
    'aria-label': 'Text formatting',
  },
};

/**
 * Controlled single selection with React state
 */
export const ControlledSingle: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('center');

    return (
      <div className="space-y-4">
        <ToggleGroup
          {...args}
          items={textAlignItems}
          value={value}
          onValueChange={(newValue) => setValue(newValue as string)}
        />
        <p className="text-sm text-muted-foreground">
          Selected: <strong>{value || 'none'}</strong>
        </p>
      </div>
    );
  },
  args: {
    'aria-label': 'Text alignment',
  },
};

/**
 * Controlled multiple selection with React state
 */
export const ControlledMultiple: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(['bold', 'underline']);

    return (
      <div className="space-y-4">
        <ToggleGroup
          {...args}
          type="multiple"
          items={formatItems}
          value={value}
          onValueChange={(newValue) => setValue(newValue as string[])}
        />
        <p className="text-sm text-muted-foreground">
          Selected: <strong>{value.length > 0 ? value.join(', ') : 'none'}</strong>
        </p>
      </div>
    );
  },
  args: {
    'aria-label': 'Text formatting',
  },
};

/**
 * ToggleGroup with icons and text labels
 */
export const WithIcons: Story = {
  args: {
    items: textAlignItems,
    defaultValue: 'center',
    'aria-label': 'Text alignment',
  },
};

/**
 * Icon-only toggle buttons without text labels
 */
export const IconOnly: Story = {
  args: {
    items: iconOnlyItems,
    defaultValue: 'grid',
    'aria-label': 'View mode',
  },
};

/**
 * Small size variant
 */
export const SmallSize: Story = {
  args: {
    items: textAlignItems,
    size: 'sm',
    defaultValue: 'left',
    'aria-label': 'Text alignment',
  },
};

/**
 * Large size variant
 */
export const LargeSize: Story = {
  args: {
    items: textAlignItems,
    size: 'lg',
    defaultValue: 'left',
    'aria-label': 'Text alignment',
  },
};

/**
 * Outline variant provides a different visual style
 */
export const OutlineVariant: Story = {
  args: {
    items: textAlignItems,
    variant: 'outline',
    defaultValue: 'center',
    'aria-label': 'Text alignment',
  },
};

/**
 * Vertical orientation stacks buttons vertically
 */
export const VerticalOrientation: Story = {
  args: {
    items: viewModeItems,
    orientation: 'vertical',
    defaultValue: 'grid',
    'aria-label': 'View mode',
  },
};

/**
 * Disabled group prevents all interactions
 */
export const DisabledGroup: Story = {
  args: {
    items: textAlignItems,
    disabled: true,
    defaultValue: 'center',
    'aria-label': 'Text alignment',
  },
};

/**
 * Individual items can be disabled
 */
export const DisabledItems: Story = {
  args: {
    items: [
      { value: 'left', label: 'Left', icon: 'alignLeft' },
      { value: 'center', label: 'Center', icon: 'alignCenter', disabled: true },
      { value: 'right', label: 'Right', icon: 'alignRight' },
      { value: 'justify', label: 'Justify', icon: 'alignJustify', disabled: true },
    ],
    defaultValue: 'left',
    'aria-label': 'Text alignment',
  },
};

/**
 * Text alignment toolbar use case
 */
export const TextAlignmentToolbar: Story = {
  render: (args) => {
    const [alignment, setAlignment] = useState<string>('left');

    return (
      <div className="space-y-6 w-full max-w-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Document Editor</h3>
          <ToggleGroup
            {...args}
            items={textAlignItems}
            value={alignment}
            onValueChange={(value) => setAlignment(value as string)}
          />
        </div>
        <div
          className={`border rounded-md p-4 min-h-[200px] bg-background ${
            alignment === 'left'
              ? 'text-left'
              : alignment === 'center'
              ? 'text-center'
              : alignment === 'right'
              ? 'text-right'
              : 'text-justify'
          }`}
        >
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
    );
  },
  args: {
    'aria-label': 'Text alignment',
  },
};

/**
 * View mode switcher use case
 */
export const ViewModeSwitcher: Story = {
  render: (args) => {
    const [viewMode, setViewMode] = useState<string>('grid');

    return (
      <div className="space-y-6 w-full max-w-4xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Products ({12})</h3>
          <ToggleGroup
            {...args}
            items={viewModeItems}
            value={viewMode}
            onValueChange={(value) => setViewMode(value as string)}
          />
        </div>
        <div
          className={
            viewMode === 'list'
              ? 'flex flex-col gap-2'
              : viewMode === 'grid'
              ? 'grid grid-cols-3 gap-4'
              : 'flex gap-4 overflow-x-auto'
          }
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`border rounded-md p-4 bg-muted/20 ${
                viewMode === 'list'
                  ? 'flex items-center gap-4'
                  : viewMode === 'grid'
                  ? 'aspect-square'
                  : 'min-w-[200px] aspect-video'
              }`}
            >
              <div className="text-sm font-medium">Item {i}</div>
            </div>
          ))}
        </div>
      </div>
    );
  },
  args: {
    'aria-label': 'View mode',
  },
};

/**
 * Filter options with multiple selection
 */
export const FilterOptions: Story = {
  render: (args) => {
    const [filters, setFilters] = useState<string[]>(['active', 'pending']);

    return (
      <div className="space-y-6 w-full max-w-2xl">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Tasks</h3>
            <ToggleGroup
              {...args}
              type="multiple"
              items={filterItems}
              value={filters}
              onValueChange={(value) => setFilters(value as string[])}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Showing: {filters.length > 0 ? filters.join(', ') : 'none'}
          </p>
        </div>
        <div className="space-y-2">
          {['Task 1 (active)', 'Task 2 (pending)', 'Task 3 (completed)', 'Task 4 (active)'].map(
            (task, i) => {
              const status = task.match(/\((\w+)\)/)?.[1] || '';
              const isVisible =
                filters.length === 0 || filters.includes('all') || filters.includes(status);

              if (!isVisible) return null;

              return (
                <div
                  key={i}
                  className="border rounded-md p-3 bg-background flex items-center justify-between"
                >
                  <span className="text-sm">{task}</span>
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  },
  args: {
    'aria-label': 'Status filter',
  },
};

/**
 * All size variants comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Small</h4>
        <ToggleGroup
          items={textAlignItems}
          size="sm"
          defaultValue="left"
          aria-label="Text alignment"
        />
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Medium (default)</h4>
        <ToggleGroup
          items={textAlignItems}
          size="md"
          defaultValue="center"
          aria-label="Text alignment"
        />
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Large</h4>
        <ToggleGroup
          items={textAlignItems}
          size="lg"
          defaultValue="right"
          aria-label="Text alignment"
        />
      </div>
    </div>
  ),
};

/**
 * All variants comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Default</h4>
        <ToggleGroup
          items={textAlignItems}
          variant="default"
          defaultValue="left"
          aria-label="Text alignment"
        />
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Outline</h4>
        <ToggleGroup
          items={textAlignItems}
          variant="outline"
          defaultValue="center"
          aria-label="Text alignment"
        />
      </div>
    </div>
  ),
};

/**
 * Both orientations comparison
 */
export const AllOrientations: Story = {
  render: () => (
    <div className="flex gap-12">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Horizontal</h4>
        <ToggleGroup
          items={viewModeItems}
          orientation="horizontal"
          defaultValue="grid"
          aria-label="View mode"
        />
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Vertical</h4>
        <ToggleGroup
          items={viewModeItems}
          orientation="vertical"
          defaultValue="grid"
          aria-label="View mode"
        />
      </div>
    </div>
  ),
};
