import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Home, Settings, User, Bell, Mail } from 'lucide-react';
import { TabsAlianza } from './TabsAlianza';
import type { TabItem } from './TabsAlianza.types';

expect.extend(toHaveNoViolations);

describe('TabsAlianza - Molecule (Alianza)', () => {
  // Sample tab items
  const basicTabs: TabItem[] = [
    {
      value: 'tab1',
      label: 'Tab 1',
      content: 'Content for Tab 1',
    },
    {
      value: 'tab2',
      label: 'Tab 2',
      content: 'Content for Tab 2',
    },
    {
      value: 'tab3',
      label: 'Tab 3',
      content: 'Content for Tab 3',
    },
  ];

  describe('Basic Rendering', () => {
    it('renders correctly with tabs', () => {
      render(<TabsAlianza tabs={basicTabs} />);
      expect(screen.getByTestId('tabs-alianza')).toBeInTheDocument();
    });

    it('renders all tab triggers', () => {
      render(<TabsAlianza tabs={basicTabs} />);
      expect(screen.getByTestId('tab-trigger-tab1')).toBeInTheDocument();
      expect(screen.getByTestId('tab-trigger-tab2')).toBeInTheDocument();
      expect(screen.getByTestId('tab-trigger-tab3')).toBeInTheDocument();
    });

    it('renders all tab labels', () => {
      render(<TabsAlianza tabs={basicTabs} />);
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Tab 3')).toBeInTheDocument();
    });

    it('renders tabs list', () => {
      render(<TabsAlianza tabs={basicTabs} />);
      expect(screen.getByTestId('tabs-list')).toBeInTheDocument();
    });

    it('renders all tab content panels', () => {
      render(<TabsAlianza tabs={basicTabs} />);
      expect(screen.getByTestId('tab-content-tab1')).toBeInTheDocument();
      expect(screen.getByTestId('tab-content-tab2')).toBeInTheDocument();
      expect(screen.getByTestId('tab-content-tab3')).toBeInTheDocument();
    });

    it('has displayName set', () => {
      expect(TabsAlianza.displayName).toBe('TabsAlianza');
    });

    it('renders with custom className', () => {
      render(<TabsAlianza tabs={basicTabs} className="custom-class" />);
      expect(screen.getByTestId('tabs-alianza')).toHaveClass('custom-class');
    });

    it('renders with single tab', () => {
      render(<TabsAlianza tabs={[basicTabs[0]]} />);
      expect(screen.getByTestId('tab-trigger-tab1')).toBeInTheDocument();
    });

    it('renders empty tabs array gracefully', () => {
      render(<TabsAlianza tabs={[]} />);
      expect(screen.getByTestId('tabs-alianza')).toBeInTheDocument();
    });

    it('renders many tabs (stress test)', () => {
      const manyTabs: TabItem[] = Array.from({ length: 20 }, (_, i) => ({
        value: `tab${i}`,
        label: `Tab ${i}`,
        content: `Content ${i}`,
      }));

      render(<TabsAlianza tabs={manyTabs} />);
      expect(screen.getByTestId('tab-trigger-tab0')).toBeInTheDocument();
      expect(screen.getByTestId('tab-trigger-tab19')).toBeInTheDocument();
    });
  });

  describe('Tab Switching Behavior', () => {
    it('shows first tab content by default', () => {
      render(<TabsAlianza tabs={basicTabs} />);
      const content1 = screen.getByTestId('tab-content-tab1');
      expect(content1).toHaveAttribute('data-state', 'active');
    });

    it('switches to second tab when clicked', async () => {
      const user = userEvent.setup();
      render(<TabsAlianza tabs={basicTabs} />);

      const trigger2 = screen.getByTestId('tab-trigger-tab2');
      await user.click(trigger2);

      expect(trigger2).toHaveAttribute('data-state', 'active');
    });

    it('hides previous tab content when switching', async () => {
      const user = userEvent.setup();
      render(<TabsAlianza tabs={basicTabs} />);

      const trigger2 = screen.getByTestId('tab-trigger-tab2');
      await user.click(trigger2);

      const content1 = screen.getByTestId('tab-content-tab1');
      expect(content1).toHaveAttribute('data-state', 'inactive');
    });

    it('shows new tab content when switching', async () => {
      const user = userEvent.setup();
      render(<TabsAlianza tabs={basicTabs} />);

      const trigger2 = screen.getByTestId('tab-trigger-tab2');
      await user.click(trigger2);

      const content2 = screen.getByTestId('tab-content-tab2');
      expect(content2).toHaveAttribute('data-state', 'active');
    });

    it('switches between multiple tabs correctly', async () => {
      const user = userEvent.setup();
      render(<TabsAlianza tabs={basicTabs} />);

      await user.click(screen.getByTestId('tab-trigger-tab2'));
      expect(screen.getByTestId('tab-trigger-tab2')).toHaveAttribute('data-state', 'active');

      await user.click(screen.getByTestId('tab-trigger-tab3'));
      expect(screen.getByTestId('tab-trigger-tab3')).toHaveAttribute('data-state', 'active');

      await user.click(screen.getByTestId('tab-trigger-tab1'));
      expect(screen.getByTestId('tab-trigger-tab1')).toHaveAttribute('data-state', 'active');
    });

    it('updates trigger active state correctly', async () => {
      const user = userEvent.setup();
      render(<TabsAlianza tabs={basicTabs} />);

      const trigger1 = screen.getByTestId('tab-trigger-tab1');
      const trigger2 = screen.getByTestId('tab-trigger-tab2');

      expect(trigger1).toHaveAttribute('data-state', 'active');
      expect(trigger2).toHaveAttribute('data-state', 'inactive');

      await user.click(trigger2);

      expect(trigger1).toHaveAttribute('data-state', 'inactive');
      expect(trigger2).toHaveAttribute('data-state', 'active');
    });
  });

  describe('Default Tab', () => {
    it('uses first tab as default when no defaultValue provided', () => {
      render(<TabsAlianza tabs={basicTabs} />);
      const trigger1 = screen.getByTestId('tab-trigger-tab1');
      expect(trigger1).toHaveAttribute('data-state', 'active');
    });

    it('respects defaultValue prop', () => {
      render(<TabsAlianza tabs={basicTabs} defaultValue="tab2" />);
      const trigger2 = screen.getByTestId('tab-trigger-tab2');
      expect(trigger2).toHaveAttribute('data-state', 'active');
    });

    it('shows correct content for default tab', () => {
      render(<TabsAlianza tabs={basicTabs} defaultValue="tab3" />);
      const content3 = screen.getByTestId('tab-content-tab3');
      expect(content3).toHaveAttribute('data-state', 'active');
    });

    it('handles invalid defaultValue gracefully', () => {
      render(<TabsAlianza tabs={basicTabs} defaultValue="invalid" />);
      expect(screen.getByTestId('tabs-alianza')).toBeInTheDocument();
    });
  });

  describe('Controlled Mode', () => {
    it('uses value prop in controlled mode', () => {
      render(<TabsAlianza tabs={basicTabs} value="tab2" />);
      const trigger2 = screen.getByTestId('tab-trigger-tab2');
      expect(trigger2).toHaveAttribute('data-state', 'active');
    });

    it('calls onValueChange when tab is clicked', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<TabsAlianza tabs={basicTabs} onValueChange={onValueChange} />);

      const trigger2 = screen.getByTestId('tab-trigger-tab2');
      await user.click(trigger2);

      expect(onValueChange).toHaveBeenCalledWith('tab2');
    });

    it('calls onValueChange multiple times when switching tabs', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<TabsAlianza tabs={basicTabs} onValueChange={onValueChange} />);

      await user.click(screen.getByTestId('tab-trigger-tab2'));
      await user.click(screen.getByTestId('tab-trigger-tab3'));
      await user.click(screen.getByTestId('tab-trigger-tab1'));

      expect(onValueChange).toHaveBeenCalledTimes(3);
      expect(onValueChange).toHaveBeenNthCalledWith(1, 'tab2');
      expect(onValueChange).toHaveBeenNthCalledWith(2, 'tab3');
      expect(onValueChange).toHaveBeenNthCalledWith(3, 'tab1');
    });

    it('stays on same tab when value prop does not change', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<TabsAlianza tabs={basicTabs} value="tab1" />);

      await user.click(screen.getByTestId('tab-trigger-tab2'));

      rerender(<TabsAlianza tabs={basicTabs} value="tab1" />);
      expect(screen.getByTestId('tab-trigger-tab1')).toHaveAttribute('data-state', 'active');
    });

    it('updates when value prop changes externally', () => {
      const { rerender } = render(<TabsAlianza tabs={basicTabs} value="tab1" />);
      expect(screen.getByTestId('tab-trigger-tab1')).toHaveAttribute('data-state', 'active');

      rerender(<TabsAlianza tabs={basicTabs} value="tab3" />);
      expect(screen.getByTestId('tab-trigger-tab3')).toHaveAttribute('data-state', 'active');
    });
  });

  describe('Disabled Tabs', () => {
    const tabsWithDisabled: TabItem[] = [
      { value: 'tab1', label: 'Enabled Tab 1', content: 'Content 1' },
      { value: 'tab2', label: 'Disabled Tab', content: 'Content 2', disabled: true },
      { value: 'tab3', label: 'Enabled Tab 2', content: 'Content 3' },
    ];

    it('renders disabled tab with disabled attribute', () => {
      render(<TabsAlianza tabs={tabsWithDisabled} />);
      const trigger2 = screen.getByTestId('tab-trigger-tab2');
      expect(trigger2).toBeDisabled();
    });

    it('applies disabled styles', () => {
      render(<TabsAlianza tabs={tabsWithDisabled} />);
      const trigger2 = screen.getByTestId('tab-trigger-tab2');
      expect(trigger2).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });

    it('does not switch to disabled tab when clicked', async () => {
      const user = userEvent.setup();
      render(<TabsAlianza tabs={tabsWithDisabled} />);

      const trigger2 = screen.getByTestId('tab-trigger-tab2');
      await user.click(trigger2);

      expect(trigger2).toHaveAttribute('data-state', 'inactive');
    });

    it('allows clicking enabled tabs', async () => {
      const user = userEvent.setup();
      render(<TabsAlianza tabs={tabsWithDisabled} />);

      const trigger3 = screen.getByTestId('tab-trigger-tab3');
      await user.click(trigger3);

      expect(trigger3).toHaveAttribute('data-state', 'active');
    });

    it('does not call onValueChange for disabled tabs', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<TabsAlianza tabs={tabsWithDisabled} onValueChange={onValueChange} />);

      await user.click(screen.getByTestId('tab-trigger-tab2'));

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Tab Icons', () => {
    const tabsWithIcons: TabItem[] = [
      { value: 'home', label: 'Home', content: 'Home content', icon: <Home data-testid="icon-home" /> },
      { value: 'settings', label: 'Settings', content: 'Settings content', icon: <Settings data-testid="icon-settings" /> },
      { value: 'profile', label: 'Profile', content: 'Profile content', icon: <User data-testid="icon-user" /> },
    ];

    it('renders icon when provided', () => {
      render(<TabsAlianza tabs={tabsWithIcons} />);
      expect(screen.getByTestId('icon-home')).toBeInTheDocument();
      expect(screen.getByTestId('icon-settings')).toBeInTheDocument();
      expect(screen.getByTestId('icon-user')).toBeInTheDocument();
    });

    it('renders icon with correct testid wrapper', () => {
      render(<TabsAlianza tabs={tabsWithIcons} />);
      expect(screen.getByTestId('tab-icon-home')).toBeInTheDocument();
      expect(screen.getByTestId('tab-icon-settings')).toBeInTheDocument();
      expect(screen.getByTestId('tab-icon-profile')).toBeInTheDocument();
    });

    it('renders icon before label', () => {
      render(<TabsAlianza tabs={tabsWithIcons} />);
      const trigger = screen.getByTestId('tab-trigger-home');
      const icon = within(trigger).getByTestId('tab-icon-home');
      const label = within(trigger).getByTestId('tab-label-home');

      // Icon should appear before label in DOM
      expect(icon.compareDocumentPosition(label)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('renders tabs without icons correctly', () => {
      const mixedTabs: TabItem[] = [
        { value: 'tab1', label: 'With Icon', content: 'Content', icon: <Home /> },
        { value: 'tab2', label: 'No Icon', content: 'Content' },
      ];

      render(<TabsAlianza tabs={mixedTabs} />);
      expect(screen.getByTestId('tab-icon-tab1')).toBeInTheDocument();
      expect(screen.queryByTestId('tab-icon-tab2')).not.toBeInTheDocument();
    });
  });

  describe('Tab Badges', () => {
    const tabsWithBadges: TabItem[] = [
      {
        value: 'tab1',
        label: 'New Features',
        content: 'Content',
        badge: { text: 'New' },
      },
      {
        value: 'tab2',
        label: 'Alerts',
        content: 'Content',
        badge: { text: '5', variant: 'destructive' },
      },
      {
        value: 'tab3',
        label: 'Messages',
        content: 'Content',
        badge: { text: '12', variant: 'secondary' },
      },
      {
        value: 'tab4',
        label: 'No Badge',
        content: 'Content',
      },
    ];

    it('renders badge when provided', () => {
      render(<TabsAlianza tabs={tabsWithBadges} />);
      expect(screen.getByTestId('tab-badge-tab1')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('does not render badge when not provided', () => {
      render(<TabsAlianza tabs={tabsWithBadges} />);
      expect(screen.queryByTestId('tab-badge-tab4')).not.toBeInTheDocument();
    });

    it('renders badge with default variant', () => {
      render(<TabsAlianza tabs={tabsWithBadges} />);
      const badge = screen.getByTestId('tab-badge-tab1');
      expect(badge).toBeInTheDocument();
    });

    it('renders badge with destructive variant', () => {
      render(<TabsAlianza tabs={tabsWithBadges} />);
      const badge = screen.getByTestId('tab-badge-tab2');
      expect(badge).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders badge with secondary variant', () => {
      render(<TabsAlianza tabs={tabsWithBadges} />);
      const badge = screen.getByTestId('tab-badge-tab3');
      expect(badge).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('renders badge after label', () => {
      render(<TabsAlianza tabs={tabsWithBadges} />);
      const trigger = screen.getByTestId('tab-trigger-tab1');
      const label = within(trigger).getByTestId('tab-label-tab1');
      const badge = within(trigger).getByTestId('tab-badge-tab1');

      // Badge should appear after label in DOM
      expect(label.compareDocumentPosition(badge)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
  });

  describe('Icons and Badges Combined', () => {
    const tabsWithIconsAndBadges: TabItem[] = [
      {
        value: 'notifications',
        label: 'Notifications',
        content: 'Content',
        icon: <Bell data-testid="icon-bell" />,
        badge: { text: '3', variant: 'destructive' },
      },
      {
        value: 'messages',
        label: 'Messages',
        content: 'Content',
        icon: <Mail data-testid="icon-mail" />,
        badge: { text: '10', variant: 'secondary' },
      },
    ];

    it('renders both icon and badge', () => {
      render(<TabsAlianza tabs={tabsWithIconsAndBadges} />);
      expect(screen.getByTestId('icon-bell')).toBeInTheDocument();
      expect(screen.getByTestId('tab-badge-notifications')).toBeInTheDocument();
    });

    it('renders in correct order: icon, label, badge', () => {
      render(<TabsAlianza tabs={tabsWithIconsAndBadges} />);
      const trigger = screen.getByTestId('tab-trigger-notifications');
      const icon = within(trigger).getByTestId('tab-icon-notifications');
      const label = within(trigger).getByTestId('tab-label-notifications');
      const badge = within(trigger).getByTestId('tab-badge-notifications');

      // Icon before label
      expect(icon.compareDocumentPosition(label)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      // Label before badge
      expect(label.compareDocumentPosition(badge)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
  });

  describe('Horizontal Orientation', () => {
    it('applies horizontal layout by default', () => {
      render(<TabsAlianza tabs={basicTabs} />);
      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass('flex-row', 'gap-6');
    });

    it('applies horizontal border styling', () => {
      render(<TabsAlianza tabs={basicTabs} orientation="horizontal" />);
      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass('border-b');
    });

    it('applies horizontal active border to triggers', () => {
      render(<TabsAlianza tabs={basicTabs} orientation="horizontal" />);
      const trigger = screen.getByTestId('tab-trigger-tab1');
      expect(trigger).toHaveClass('border-b-2');
    });
  });

  describe('Vertical Orientation', () => {
    it('applies vertical layout when specified', () => {
      render(<TabsAlianza tabs={basicTabs} orientation="vertical" />);
      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass('flex-col', 'gap-2');
    });

    it('applies vertical border styling', () => {
      render(<TabsAlianza tabs={basicTabs} orientation="vertical" />);
      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass('border-r', 'border-b-0');
    });

    it('applies vertical active border to triggers', () => {
      render(<TabsAlianza tabs={basicTabs} orientation="vertical" />);
      const trigger = screen.getByTestId('tab-trigger-tab1');
      expect(trigger).toHaveClass('border-r-2');
    });

    it('applies full width to vertical tabs', () => {
      render(<TabsAlianza tabs={basicTabs} orientation="vertical" />);
      const trigger = screen.getByTestId('tab-trigger-tab1');
      expect(trigger).toHaveClass('w-full', 'justify-start');
    });

    it('switches tabs correctly in vertical mode', async () => {
      const user = userEvent.setup();
      render(<TabsAlianza tabs={basicTabs} orientation="vertical" />);

      const trigger2 = screen.getByTestId('tab-trigger-tab2');
      await user.click(trigger2);

      expect(trigger2).toHaveAttribute('data-state', 'active');
    });
  });

  describe('Content Types', () => {
    const tabsWithMixedContent: TabItem[] = [
      { value: 'tab1', label: 'String', content: 'Simple string content' },
      {
        value: 'tab2',
        label: 'JSX',
        content: (
          <div data-testid="custom-content">
            <h2>Custom Heading</h2>
            <p>Custom paragraph</p>
          </div>
        ),
      },
      {
        value: 'tab3',
        label: 'Component',
        content: <button data-testid="custom-button">Click me</button>,
      },
    ];

    it('renders string content', async () => {
      const user = userEvent.setup();
      render(<TabsAlianza tabs={tabsWithMixedContent} defaultValue="tab1" />);

      const content = screen.getByTestId('tab-content-tab1');
      expect(content).toHaveTextContent('Simple string content');
    });

    it('renders JSX content', async () => {
      const user = userEvent.setup();
      render(<TabsAlianza tabs={tabsWithMixedContent} defaultValue="tab2" />);

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom Heading')).toBeInTheDocument();
      expect(screen.getByText('Custom paragraph')).toBeInTheDocument();
    });

    it('renders component content', async () => {
      const user = userEvent.setup();
      render(<TabsAlianza tabs={tabsWithMixedContent} defaultValue="tab3" />);

      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('allows focusing on tab triggers', () => {
      render(<TabsAlianza tabs={basicTabs} />);

      const trigger1 = screen.getByTestId('tab-trigger-tab1');
      const trigger2 = screen.getByTestId('tab-trigger-tab2');

      trigger1.focus();
      expect(trigger1).toHaveFocus();

      trigger2.focus();
      expect(trigger2).toHaveFocus();
    });

    it('activates tab with Enter key', async () => {
      const user = userEvent.setup();
      render(<TabsAlianza tabs={basicTabs} />);

      const trigger2 = screen.getByTestId('tab-trigger-tab2');
      trigger2.focus();

      await user.keyboard('{Enter}');
      expect(trigger2).toHaveAttribute('data-state', 'active');
    });

    it('activates tab with Space key', async () => {
      const user = userEvent.setup();
      render(<TabsAlianza tabs={basicTabs} />);

      const trigger2 = screen.getByTestId('tab-trigger-tab2');
      trigger2.focus();

      await user.keyboard(' ');
      expect(trigger2).toHaveAttribute('data-state', 'active');
    });

    it('disabled tabs cannot be focused and activated', () => {
      const tabsWithDisabled: TabItem[] = [
        { value: 'tab1', label: 'Tab 1', content: 'Content 1' },
        { value: 'tab2', label: 'Tab 2', content: 'Content 2', disabled: true },
        { value: 'tab3', label: 'Tab 3', content: 'Content 3' },
      ];

      render(<TabsAlianza tabs={tabsWithDisabled} />);

      const trigger2 = screen.getByTestId('tab-trigger-tab2');
      expect(trigger2).toBeDisabled();
      expect(trigger2).toHaveAttribute('data-state', 'inactive');
    });
  });

  describe('Styling and Classes', () => {
    it('applies base container classes', () => {
      render(<TabsAlianza tabs={basicTabs} />);
      const tabs = screen.getByTestId('tabs-alianza');
      expect(tabs).toHaveClass('w-full', 'space-y-6');
    });

    it('applies tabs list base classes', () => {
      render(<TabsAlianza tabs={basicTabs} />);
      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass('w-full', 'justify-start', 'bg-transparent', 'p-0', 'border-border', 'h-auto', 'rounded-none');
    });

    it('applies trigger base classes', () => {
      render(<TabsAlianza tabs={basicTabs} />);
      const trigger = screen.getByTestId('tab-trigger-tab1');
      expect(trigger).toHaveClass('rounded-none', 'px-0', 'py-3', 'font-medium', 'text-muted-foreground', 'bg-transparent', 'transition-all');
    });

    it('applies active state classes', () => {
      render(<TabsAlianza tabs={basicTabs} />);
      const trigger = screen.getByTestId('tab-trigger-tab1');
      expect(trigger).toHaveClass('data-[state=active]:bg-transparent', 'data-[state=active]:shadow-none', 'data-[state=active]:text-foreground');
    });

    it('applies content classes', () => {
      render(<TabsAlianza tabs={basicTabs} />);
      const content = screen.getByTestId('tab-content-tab1');
      expect(content).toHaveClass('mt-6');
    });

    it('merges custom className with default classes', () => {
      render(<TabsAlianza tabs={basicTabs} className="my-custom-class" />);
      const tabs = screen.getByTestId('tabs-alianza');
      expect(tabs).toHaveClass('w-full', 'space-y-6', 'my-custom-class');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations - basic tabs', async () => {
      const { container } = render(<TabsAlianza tabs={basicTabs} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - with icons', async () => {
      const tabsWithIcons: TabItem[] = [
        { value: 'tab1', label: 'Tab 1', content: 'Content', icon: <Home /> },
      ];
      const { container } = render(<TabsAlianza tabs={tabsWithIcons} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - with badges', async () => {
      const tabsWithBadges: TabItem[] = [
        { value: 'tab1', label: 'Tab 1', content: 'Content', badge: { text: 'New' } },
      ];
      const { container } = render(<TabsAlianza tabs={tabsWithBadges} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - disabled tabs', async () => {
      const tabsWithDisabled: TabItem[] = [
        { value: 'tab1', label: 'Enabled', content: 'Content' },
        { value: 'tab2', label: 'Disabled', content: 'Content', disabled: true },
      ];
      const { container } = render(<TabsAlianza tabs={tabsWithDisabled} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - vertical orientation', async () => {
      const { container } = render(<TabsAlianza tabs={basicTabs} orientation="vertical" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('applies proper ARIA attributes to tabs container', () => {
      render(<TabsAlianza tabs={basicTabs} />);
      const tabs = screen.getByTestId('tabs-alianza');
      expect(tabs).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('applies proper ARIA attributes to triggers', () => {
      render(<TabsAlianza tabs={basicTabs} />);
      const trigger1 = screen.getByTestId('tab-trigger-tab1');
      expect(trigger1).toHaveAttribute('role', 'tab');
      expect(trigger1).toHaveAttribute('data-state', 'active');
    });

    it('updates ARIA attributes when tab changes', async () => {
      const user = userEvent.setup();
      render(<TabsAlianza tabs={basicTabs} />);

      const trigger1 = screen.getByTestId('tab-trigger-tab1');
      const trigger2 = screen.getByTestId('tab-trigger-tab2');

      expect(trigger1).toHaveAttribute('data-state', 'active');
      expect(trigger2).toHaveAttribute('data-state', 'inactive');

      await user.click(trigger2);

      expect(trigger1).toHaveAttribute('data-state', 'inactive');
      expect(trigger2).toHaveAttribute('data-state', 'active');
    });
  });

  describe('Edge Cases', () => {
    it('handles very long tab labels', () => {
      const longLabel = 'A'.repeat(100);
      const tabs: TabItem[] = [{ value: 'tab1', label: longLabel, content: 'Content' }];

      render(<TabsAlianza tabs={tabs} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles very long content', () => {
      const longContent = 'B'.repeat(1000);
      const tabs: TabItem[] = [{ value: 'tab1', label: 'Tab', content: longContent }];

      render(<TabsAlianza tabs={tabs} />);
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('handles special characters in value', () => {
      const tabs: TabItem[] = [
        { value: 'tab-with-dash', label: 'Tab', content: 'Content' },
        { value: 'tab_with_underscore', label: 'Tab', content: 'Content' },
        { value: 'tab.with.dot', label: 'Tab', content: 'Content' },
      ];

      render(<TabsAlianza tabs={tabs} />);
      expect(screen.getByTestId('tab-trigger-tab-with-dash')).toBeInTheDocument();
      expect(screen.getByTestId('tab-trigger-tab_with_underscore')).toBeInTheDocument();
      expect(screen.getByTestId('tab-trigger-tab.with.dot')).toBeInTheDocument();
    });

    it('handles identical labels', () => {
      const tabs: TabItem[] = [
        { value: 'tab1', label: 'Same Label', content: 'Content 1' },
        { value: 'tab2', label: 'Same Label', content: 'Content 2' },
      ];

      render(<TabsAlianza tabs={tabs} />);
      const labels = screen.getAllByText('Same Label');
      expect(labels).toHaveLength(2);
    });

    it('handles rapid tab switching without errors', async () => {
      const user = userEvent.setup();
      render(<TabsAlianza tabs={basicTabs} />);

      // Rapidly switch tabs
      for (let i = 0; i < 10; i++) {
        await user.click(screen.getByTestId('tab-trigger-tab2'));
        await user.click(screen.getByTestId('tab-trigger-tab3'));
        await user.click(screen.getByTestId('tab-trigger-tab1'));
      }

      expect(screen.getByTestId('tab-trigger-tab1')).toHaveAttribute('data-state', 'active');
    });

    it('handles tab updates via rerender', () => {
      const { rerender } = render(<TabsAlianza tabs={basicTabs} />);

      const newTabs: TabItem[] = [
        { value: 'new1', label: 'New Tab 1', content: 'New Content 1' },
        { value: 'new2', label: 'New Tab 2', content: 'New Content 2' },
      ];

      rerender(<TabsAlianza tabs={newTabs} />);

      expect(screen.getByText('New Tab 1')).toBeInTheDocument();
      expect(screen.getByText('New Tab 2')).toBeInTheDocument();
      expect(screen.queryByText('Tab 1')).not.toBeInTheDocument();
    });

    it('handles orientation change via rerender', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<TabsAlianza tabs={basicTabs} orientation="horizontal" />);

      let list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass('flex-row');

      rerender(<TabsAlianza tabs={basicTabs} orientation="vertical" />);

      list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass('flex-col');
    });
  });
});
