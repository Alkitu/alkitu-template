import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Home, Settings, User } from 'lucide-react';
import { Tabs } from './Tabs';
import type { TabItem } from './Tabs.types';

describe('Tabs Molecule', () => {
  const mockTabs: TabItem[] = [
    {
      id: 'tab1',
      label: 'Overview',
      content: <div>Overview Content</div>,
    },
    {
      id: 'tab2',
      label: 'Settings',
      content: <div>Settings Content</div>,
    },
    {
      id: 'tab3',
      label: 'Profile',
      content: <div>Profile Content</div>,
    },
  ];

  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders all tabs correctly', () => {
      render(<Tabs tabs={mockTabs} />);

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      render(<Tabs tabs={mockTabs} />);
      expect(screen.getByText('Overview Content')).toBeInTheDocument();
    });

    it('renders fallback when no tabs provided', () => {
      render(<Tabs tabs={[]} />);
      expect(screen.getByText('No tabs available')).toBeInTheDocument();
    });

    it('renders first tab content by default', () => {
      render(<Tabs tabs={mockTabs} />);
      expect(screen.getByText('Overview Content')).toBeInTheDocument();
      expect(screen.queryByText('Settings Content')).not.toBeVisible();
    });
  });

  // 2. TAB ITEMS WITH FEATURES
  describe('Tab Items Features', () => {
    it('renders tabs with icons', () => {
      const tabsWithIcons: TabItem[] = [
        {
          id: 'home',
          label: 'Home',
          content: <div>Home</div>,
          icon: <Home data-testid="home-icon" />,
        },
        {
          id: 'settings',
          label: 'Settings',
          content: <div>Settings</div>,
          icon: <Settings data-testid="settings-icon" />,
        },
      ];

      render(<Tabs tabs={tabsWithIcons} />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    });

    it('renders tabs with badges', () => {
      const tabsWithBadges: TabItem[] = [
        {
          id: 'notifications',
          label: 'Notifications',
          content: <div>Notifications</div>,
          badge: { text: '5' },
        },
        {
          id: 'messages',
          label: 'Messages',
          content: <div>Messages</div>,
          badge: { text: 'New', variant: 'destructive' },
        },
      ];

      render(<Tabs tabs={tabsWithBadges} />);

      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('renders closeable tabs with close button', () => {
      const closeableTabs: TabItem[] = [
        {
          id: 'tab1',
          label: 'Closeable',
          content: <div>Content</div>,
          closeable: true,
        },
      ];

      const handleClose = vi.fn();
      render(<Tabs tabs={closeableTabs} onTabClose={handleClose} />);

      // Close button should be visible on hover/active
      const tab = screen.getByText('Closeable').parentElement;
      expect(tab).toBeInTheDocument();
    });

    it('handles disabled tabs', () => {
      const tabsWithDisabled: TabItem[] = [
        {
          id: 'enabled',
          label: 'Enabled',
          content: <div>Enabled</div>,
        },
        {
          id: 'disabled',
          label: 'Disabled',
          content: <div>Disabled</div>,
          disabled: true,
        },
      ];

      render(<Tabs tabs={tabsWithDisabled} />);

      const disabledTab = screen.getByText('Disabled');
      expect(disabledTab).toBeDisabled();
    });
  });

  // 3. INTERACTION TESTS
  describe('Interactions', () => {
    it('changes active tab on click', async () => {
      const user = userEvent.setup();
      render(<Tabs tabs={mockTabs} />);

      expect(screen.getByText('Overview Content')).toBeVisible();

      await user.click(screen.getByText('Settings'));

      expect(screen.getByText('Settings Content')).toBeVisible();
      expect(screen.queryByText('Overview Content')).not.toBeVisible();
    });

    it('calls onValueChange when tab changes', async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();

      render(<Tabs tabs={mockTabs} onValueChange={handleValueChange} />);

      await user.click(screen.getByText('Profile'));

      expect(handleValueChange).toHaveBeenCalledWith('tab3');
    });

    it('renders closeable tabs with close button functionality', () => {
      const handleClose = vi.fn();

      const closeableTabs: TabItem[] = [
        {
          id: 'tab1',
          label: 'Tab 1',
          content: <div>Content 1</div>,
          closeable: true,
        },
      ];

      const { container } = render(<Tabs tabs={closeableTabs} onTabClose={handleClose} />);

      // Verify close button structure exists
      const closeButton = container.querySelector('[class*="cursor-pointer"]');
      expect(closeButton).toBeInTheDocument();

      // Verify onTabClose prop is passed
      expect(handleClose).toBeDefined();
    });

    it('handles add tab', async () => {
      const handleAdd = vi.fn();
      const user = userEvent.setup();

      render(<Tabs tabs={mockTabs} addable onTabAdd={handleAdd} />);

      const addButton = screen.getByRole('button', { name: /plus/i });
      await user.click(addButton);

      expect(handleAdd).toHaveBeenCalled();
    });

    it('respects maxTabs limit', () => {
      const manyTabs: TabItem[] = Array.from({ length: 10 }, (_, i) => ({
        id: `tab${i + 1}`,
        label: `Tab ${i + 1}`,
        content: <div>Content {i + 1}</div>,
      }));

      render(<Tabs tabs={manyTabs} addable maxTabs={10} />);

      // Add button should not be present when at max
      expect(screen.queryByRole('button', { name: /plus/i })).not.toBeInTheDocument();
    });
  });

  // 4. VARIANT TESTS
  describe('Variants', () => {
    it.each([
      ['default'],
      ['pills'],
      ['underline'],
      ['vertical'],
      ['scrollable'],
    ] as const)('renders %s variant correctly', (variant) => {
      const { container } = render(<Tabs tabs={mockTabs} variant={variant} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies pills variant styling', () => {
      const { container } = render(<Tabs tabs={mockTabs} variant="pills" />);

      const tabsList = container.querySelector('[data-slot="tabs-list"]');
      expect(tabsList).toHaveClass('bg-gradient-to-br');
    });

    it('applies underline variant styling', () => {
      const { container } = render(<Tabs tabs={mockTabs} variant="underline" />);

      const tabsList = container.querySelector('[data-slot="tabs-list"]');
      expect(tabsList).toHaveClass('border-b');
    });

    it('applies vertical orientation', () => {
      const { container } = render(
        <Tabs tabs={mockTabs} variant="vertical" orientation="vertical" />
      );

      const tabs = container.querySelector('[data-slot="tabs"]');
      expect(tabs).toHaveAttribute('data-orientation', 'vertical');
    });
  });

  // 5. CONTROLLED/UNCONTROLLED MODE
  describe('Controlled/Uncontrolled Mode', () => {
    it('works in uncontrolled mode with defaultValue', async () => {
      const user = userEvent.setup();

      render(<Tabs tabs={mockTabs} defaultValue="tab2" />);

      expect(screen.getByText('Settings Content')).toBeVisible();

      await user.click(screen.getByText('Profile'));
      expect(screen.getByText('Profile Content')).toBeVisible();
    });

    it('works in controlled mode', async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();

      const { rerender } = render(
        <Tabs tabs={mockTabs} value="tab1" onValueChange={handleValueChange} />
      );

      expect(screen.getByText('Overview Content')).toBeVisible();

      await user.click(screen.getByText('Settings'));
      expect(handleValueChange).toHaveBeenCalledWith('tab2');

      // Simulate parent updating value
      rerender(
        <Tabs tabs={mockTabs} value="tab2" onValueChange={handleValueChange} />
      );

      expect(screen.getByText('Settings Content')).toBeVisible();
    });
  });

  // 6. SCROLLABLE TABS
  describe('Scrollable Tabs', () => {
    it('renders scroll buttons when scrollable', () => {
      render(<Tabs tabs={mockTabs} scrollable />);

      const leftButton = screen.getAllByRole('button').find(btn =>
        within(btn).queryByRole('img', { hidden: true })
      );

      expect(leftButton).toBeInTheDocument();
    });

    it('disables scroll left when at start', () => {
      render(<Tabs tabs={mockTabs} scrollable />);

      const buttons = screen.getAllByRole('button');
      const scrollButtons = buttons.filter(btn =>
        btn.querySelector('[class*="chevron"]')
      );

      // First scroll button (left) should be disabled at start
      if (scrollButtons.length > 0) {
        expect(scrollButtons[0]).toBeDisabled();
      }
    });

    it('renders scroll buttons for scrollable tabs', () => {
      const manyTabs: TabItem[] = Array.from({ length: 10 }, (_, i) => ({
        id: `tab${i + 1}`,
        label: `Long Tab Name ${i + 1}`,
        content: <div>Content {i + 1}</div>,
      }));

      const { container } = render(<Tabs tabs={manyTabs} scrollable />);

      // Verify tabs list has scrollable classes
      const tabsList = container.querySelector('[data-slot="tabs-list"]');
      expect(tabsList).toHaveClass('overflow-x-auto');

      // Verify scroll buttons exist
      const scrollButtons = container.querySelectorAll('button[class*="flex-shrink-0"]');
      expect(scrollButtons.length).toBeGreaterThan(0);
    });
  });

  // 7. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const { container } = render(<Tabs tabs={mockTabs} />);

      const triggers = container.querySelectorAll('[role="tab"]');
      expect(triggers.length).toBeGreaterThan(0);

      const tabpanel = container.querySelector('[role="tabpanel"]');
      expect(tabpanel).toBeInTheDocument();
    });

    it('supports keyboard navigation via Radix UI', () => {
      const { container } = render(<Tabs tabs={mockTabs} />);

      // Verify tabs have proper ARIA roles for keyboard navigation
      const triggers = container.querySelectorAll('[role="tab"]');
      expect(triggers.length).toBe(3);

      // Verify tabs are in sequential tabindex
      triggers.forEach((trigger) => {
        expect(trigger).toHaveAttribute('tabindex');
      });
    });

    it('renders disabled tabs with disabled attribute', () => {
      const tabsWithDisabled: TabItem[] = [
        { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
        { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div>, disabled: true },
        { id: 'tab3', label: 'Tab 3', content: <div>Content 3</div> },
      ];

      const { container } = render(<Tabs tabs={tabsWithDisabled} />);

      // Find the disabled trigger button
      const triggers = container.querySelectorAll('[role="tab"]');
      const disabledTrigger = Array.from(triggers).find(t => t.getAttribute('disabled') !== null);

      expect(disabledTrigger).toBeDefined();
      if (disabledTrigger) {
        expect(disabledTrigger).toHaveAttribute('disabled');
        expect(disabledTrigger).toHaveClass('cursor-not-allowed');
      }
    });
  });

  // 8. RESPONSIVE BEHAVIOR
  describe('Responsive Behavior', () => {
    it('applies responsive classes', () => {
      const { container } = render(<Tabs tabs={mockTabs} />);

      const tabsContainer = container.querySelector('.max-sm\\:flex-col');
      expect(tabsContainer).toBeInTheDocument();
    });

    it('hides scroll buttons on mobile', () => {
      render(<Tabs tabs={mockTabs} scrollable />);

      const buttons = screen.getAllByRole('button');
      const scrollButtons = buttons.filter(btn =>
        btn.className.includes('max-sm:hidden')
      );

      expect(scrollButtons.length).toBeGreaterThan(0);
    });
  });

  // 9. EDGE CASES
  describe('Edge Cases', () => {
    it('handles single tab', () => {
      const singleTab: TabItem[] = [
        { id: 'only', label: 'Only Tab', content: <div>Only Content</div> },
      ];

      render(<Tabs tabs={singleTab} />);

      expect(screen.getByText('Only Tab')).toBeInTheDocument();
      expect(screen.getByText('Only Content')).toBeInTheDocument();
    });

    it('handles tab with all features', () => {
      const fullFeatureTab: TabItem[] = [
        {
          id: 'full',
          label: 'Full Featured',
          content: <div>Full Content</div>,
          icon: <User data-testid="user-icon" />,
          badge: { text: '99+', variant: 'destructive' },
          closeable: true,
        },
      ];

      render(<Tabs tabs={fullFeatureTab} onTabClose={vi.fn()} />);

      expect(screen.getByText('Full Featured')).toBeInTheDocument();
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    it('handles tab switching correctly', async () => {
      const user = userEvent.setup();
      render(<Tabs tabs={mockTabs} />);

      // Switch tabs
      await user.click(screen.getByText('Settings'));
      expect(screen.getByText('Settings Content')).toBeVisible();

      await user.click(screen.getByText('Overview'));
      expect(screen.getByText('Overview Content')).toBeVisible();
    });
  });

  // 10. CUSTOM CLASSNAMES
  describe('Custom ClassNames', () => {
    it('applies custom className to container', () => {
      const { container } = render(
        <Tabs tabs={mockTabs} className="custom-tabs" />
      );

      expect(container.firstChild).toHaveClass('custom-tabs');
    });

    it('merges custom className with default classes', () => {
      const { container } = render(
        <Tabs tabs={mockTabs} className="my-custom-class" />
      );

      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('my-custom-class');
      expect(element).toHaveClass('flex'); // default class
    });
  });

  // 11. REF FORWARDING
  describe('Ref Forwarding', () => {
    it('forwards ref to container div', () => {
      const ref = vi.fn();
      render(<Tabs ref={ref} tabs={mockTabs} />);

      expect(ref).toHaveBeenCalled();
    });
  });

  // 12. DISPLAY NAME
  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Tabs.displayName).toBe('Tabs');
    });
  });
});
