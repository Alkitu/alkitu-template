import type { Meta, StoryObj } from '@storybook/react';
import { PriorityIcon } from './PriorityIcon';

const meta: Meta<typeof PriorityIcon> = {
  title: 'Atoms/PriorityIcon',
  component: PriorityIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A visual indicator for displaying request or task priority levels with color-coded icons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    priority: {
      control: 'select',
      options: ['LOW', 'MEDIUM', 'HIGH'],
      description: 'The priority level to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PriorityIcon>;

export const High: Story = {
  args: {
    priority: 'HIGH',
  },
};

export const Medium: Story = {
  args: {
    priority: 'MEDIUM',
  },
};

export const Low: Story = {
  args: {
    priority: 'LOW',
  },
};

export const CustomSize: Story = {
  args: {
    priority: 'HIGH',
    className: 'h-8 w-8',
  },
};

export const AllPriorities: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <PriorityIcon priority="HIGH" />
        <span className="text-sm">High Priority</span>
      </div>
      <div className="flex items-center gap-2">
        <PriorityIcon priority="MEDIUM" />
        <span className="text-sm">Medium Priority</span>
      </div>
      <div className="flex items-center gap-2">
        <PriorityIcon priority="LOW" />
        <span className="text-sm">Low Priority</span>
      </div>
    </div>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <PriorityIcon priority="HIGH" className="h-3 w-3" />
        <span className="text-xs">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PriorityIcon priority="HIGH" />
        <span className="text-xs">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PriorityIcon priority="HIGH" className="h-6 w-6" />
        <span className="text-xs">Large</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PriorityIcon priority="HIGH" className="h-8 w-8" />
        <span className="text-xs">XLarge</span>
      </div>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="w-64 p-4 border rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Critical Bug Fix</span>
        <PriorityIcon priority="HIGH" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Feature Request</span>
        <PriorityIcon priority="MEDIUM" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Documentation Update</span>
        <PriorityIcon priority="LOW" />
      </div>
    </div>
  ),
};

export const SmallSize: Story = {
  args: {
    priority: 'HIGH',
    className: 'h-3 w-3',
  },
};

export const LargeSize: Story = {
  args: {
    priority: 'MEDIUM',
    className: 'h-6 w-6',
  },
};

export const ExtraLargeSize: Story = {
  args: {
    priority: 'LOW',
    className: 'h-10 w-10',
  },
};

export const InTaskList: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      {[
        { title: 'Fix critical production bug', priority: 'HIGH' as const },
        { title: 'Update user documentation', priority: 'LOW' as const },
        { title: 'Implement new feature', priority: 'MEDIUM' as const },
        { title: 'Refactor authentication', priority: 'HIGH' as const },
      ].map((task, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border rounded hover:bg-accent transition-colors">
          <PriorityIcon priority={task.priority} />
          <span className="text-sm flex-1">{task.title}</span>
        </div>
      ))}
    </div>
  ),
};

export const WithColorVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6 bg-background">
      <div>
        <h3 className="text-sm font-semibold mb-3">Light Background</h3>
        <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded">
          <PriorityIcon priority="HIGH" />
          <PriorityIcon priority="MEDIUM" />
          <PriorityIcon priority="LOW" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3">Dark Background</h3>
        <div className="flex items-center gap-4 p-4 bg-gray-900 dark:bg-gray-100 rounded">
          <PriorityIcon priority="HIGH" />
          <PriorityIcon priority="MEDIUM" />
          <PriorityIcon priority="LOW" />
        </div>
      </div>
    </div>
  ),
};

export const InDashboardCard: Story = {
  render: () => (
    <div className="w-96 p-6 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Recent Requests</h3>
      <div className="space-y-3">
        {[
          { id: 'REQ-001', title: 'Server downtime issue', priority: 'HIGH' as const, time: '2 hours ago' },
          { id: 'REQ-002', title: 'Feature enhancement', priority: 'MEDIUM' as const, time: '5 hours ago' },
          { id: 'REQ-003', title: 'UI improvement', priority: 'LOW' as const, time: '1 day ago' },
        ].map((request) => (
          <div key={request.id} className="flex items-start gap-3 p-3 hover:bg-accent rounded transition-colors">
            <PriorityIcon priority={request.priority} className="mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{request.title}</span>
                <span className="text-xs text-muted-foreground">{request.id}</span>
              </div>
              <span className="text-xs text-muted-foreground">{request.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const ResponsiveSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <PriorityIcon priority="HIGH" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        <span className="text-sm">Responsive sizing example</span>
      </div>
      <p className="text-xs text-muted-foreground">Resize the viewport to see the icon scale</p>
    </div>
  ),
};
