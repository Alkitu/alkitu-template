import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';
import { GlobalThemeProvider } from '@/context/GlobalThemeProvider';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Atoms/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A circular button for toggling between light and dark theme modes with animated sun/moon icons.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <GlobalThemeProvider>
        <Story />
      </GlobalThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {};

export const LightMode: Story = {
  decorators: [
    (Story) => {
      // Set light mode in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme-mode', 'light');
      }
      return (
        <GlobalThemeProvider>
          <Story />
        </GlobalThemeProvider>
      );
    },
  ],
};

export const DarkMode: Story = {
  decorators: [
    (Story) => {
      // Set dark mode in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme-mode', 'dark');
      }
      return (
        <GlobalThemeProvider>
          <Story />
        </GlobalThemeProvider>
      );
    },
  ],
};

export const Interactive: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <p className="text-sm text-muted-foreground">
        Click the button to toggle between light and dark mode
      </p>
      <ThemeToggle />
      <p className="text-xs text-muted-foreground">
        Theme persists in localStorage
      </p>
    </div>
  ),
};
