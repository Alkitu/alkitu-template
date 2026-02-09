import type { Meta, StoryObj } from '@storybook/react';
import { Home, Settings, User, Bell, Mail, FileText, Calendar } from 'lucide-react';
import { TabsAlianza } from './TabsAlianza';
import type { TabItem } from './TabsAlianza.types';

const meta: Meta<typeof TabsAlianza> = {
  title: 'Molecules/Alianza/TabsAlianza',
  component: TabsAlianza,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'The value of the tab that should be active by default',
    },
    value: {
      control: 'text',
      description: 'The controlled value of the active tab',
    },
    onValueChange: {
      action: 'valueChanged',
      description: 'Callback fired when the active tab changes',
    },
    tabs: {
      description: 'Array of tab items to render',
    },
    className: {
      control: 'text',
      description: 'Optional CSS class name',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the tabs',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabsAlianza>;

// Basic tabs
const basicTabs: TabItem[] = [
  {
    value: 'overview',
    label: 'Overview',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Overview</h3>
        <p className="text-muted-foreground">
          This is the overview tab content. It provides a summary of the most important information.
        </p>
      </div>
    ),
  },
  {
    value: 'details',
    label: 'Details',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Details</h3>
        <p className="text-muted-foreground">
          This is the details tab content. It contains more specific and detailed information.
        </p>
      </div>
    ),
  },
  {
    value: 'settings',
    label: 'Settings',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Settings</h3>
        <p className="text-muted-foreground">
          This is the settings tab content. Here you can configure various options.
        </p>
      </div>
    ),
  },
];

export const Default: Story = {
  args: {
    tabs: basicTabs,
  },
};

export const WithDefaultValue: Story = {
  args: {
    tabs: basicTabs,
    defaultValue: 'details',
  },
};

// Tabs with icons
const tabsWithIcons: TabItem[] = [
  {
    value: 'home',
    label: 'Home',
    icon: <Home className="size-4" />,
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Home</h3>
        <p className="text-muted-foreground">Welcome to your home page.</p>
      </div>
    ),
  },
  {
    value: 'profile',
    label: 'Profile',
    icon: <User className="size-4" />,
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Profile</h3>
        <p className="text-muted-foreground">View and edit your profile information.</p>
      </div>
    ),
  },
  {
    value: 'settings',
    label: 'Settings',
    icon: <Settings className="size-4" />,
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Settings</h3>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </div>
    ),
  },
];

export const WithIcons: Story = {
  args: {
    tabs: tabsWithIcons,
  },
};

// Tabs with badges
const tabsWithBadges: TabItem[] = [
  {
    value: 'all',
    label: 'All',
    badge: { text: '24', variant: 'secondary' },
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">All Items</h3>
        <p className="text-muted-foreground">View all 24 items.</p>
      </div>
    ),
  },
  {
    value: 'unread',
    label: 'Unread',
    badge: { text: '5', variant: 'destructive' },
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Unread Items</h3>
        <p className="text-muted-foreground">You have 5 unread items.</p>
      </div>
    ),
  },
  {
    value: 'archived',
    label: 'Archived',
    badge: { text: '12', variant: 'outline' },
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Archived Items</h3>
        <p className="text-muted-foreground">View 12 archived items.</p>
      </div>
    ),
  },
];

export const WithBadges: Story = {
  args: {
    tabs: tabsWithBadges,
  },
};

// Tabs with icons and badges
const tabsWithIconsAndBadges: TabItem[] = [
  {
    value: 'notifications',
    label: 'Notifications',
    icon: <Bell className="size-4" />,
    badge: { text: '3', variant: 'destructive' },
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
        <p className="text-muted-foreground">You have 3 unread notifications.</p>
      </div>
    ),
  },
  {
    value: 'messages',
    label: 'Messages',
    icon: <Mail className="size-4" />,
    badge: { text: '10', variant: 'secondary' },
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Messages</h3>
        <p className="text-muted-foreground">You have 10 unread messages.</p>
      </div>
    ),
  },
  {
    value: 'documents',
    label: 'Documents',
    icon: <FileText className="size-4" />,
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Documents</h3>
        <p className="text-muted-foreground">View your documents.</p>
      </div>
    ),
  },
];

export const WithIconsAndBadges: Story = {
  args: {
    tabs: tabsWithIconsAndBadges,
  },
};

// Disabled tabs
const tabsWithDisabled: TabItem[] = [
  {
    value: 'available',
    label: 'Available',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Available</h3>
        <p className="text-muted-foreground">This tab is available.</p>
      </div>
    ),
  },
  {
    value: 'disabled',
    label: 'Disabled',
    disabled: true,
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Disabled</h3>
        <p className="text-muted-foreground">This tab is disabled.</p>
      </div>
    ),
  },
  {
    value: 'also-available',
    label: 'Also Available',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Also Available</h3>
        <p className="text-muted-foreground">This tab is also available.</p>
      </div>
    ),
  },
];

export const WithDisabledTab: Story = {
  args: {
    tabs: tabsWithDisabled,
  },
};

// Vertical orientation
export const VerticalOrientation: Story = {
  args: {
    tabs: tabsWithIcons,
    orientation: 'vertical',
  },
};

// Many tabs
const manyTabs: TabItem[] = Array.from({ length: 10 }, (_, i) => ({
  value: `tab${i + 1}`,
  label: `Tab ${i + 1}`,
  content: (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Tab {i + 1}</h3>
      <p className="text-muted-foreground">Content for tab {i + 1}.</p>
    </div>
  ),
}));

export const ManyTabs: Story = {
  args: {
    tabs: manyTabs,
  },
};

// Complex content
const tabsWithComplexContent: TabItem[] = [
  {
    value: 'dashboard',
    label: 'Dashboard',
    icon: <Home className="size-4" />,
    content: (
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Metric {i}</div>
              <div className="text-2xl font-bold">{i * 1234}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    value: 'calendar',
    label: 'Calendar',
    icon: <Calendar className="size-4" />,
    badge: { text: '2 events', variant: 'secondary' },
    content: (
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <div className="space-y-2">
          {['Meeting at 10:00 AM', 'Lunch at 12:30 PM'].map((event, i) => (
            <div key={i} className="p-3 border rounded-lg">
              {event}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    value: 'tasks',
    label: 'Tasks',
    icon: <FileText className="size-4" />,
    badge: { text: '5', variant: 'destructive' },
    content: (
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <div className="space-y-2">
          {['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'].map((task, i) => (
            <div key={i} className="flex items-center gap-2 p-3 border rounded-lg">
              <input type="checkbox" />
              <span>{task}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export const ComplexContent: Story = {
  args: {
    tabs: tabsWithComplexContent,
  },
};

// Custom styling
export const CustomStyling: Story = {
  args: {
    tabs: basicTabs,
    className: 'max-w-4xl mx-auto border rounded-lg p-6 shadow-lg',
  },
};

// Controlled mode example
export const Controlled: Story = {
  args: {
    tabs: basicTabs,
    value: 'details',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of controlled tabs using the `value` prop and `onValueChange` callback.',
      },
    },
  },
};
