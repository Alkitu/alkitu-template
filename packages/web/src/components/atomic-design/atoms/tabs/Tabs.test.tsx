import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

describe('Tabs Atom', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders tabs with children correctly', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      render(
        <Tabs>
          <TabsList>
            <TabsTrigger value="test">Test</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('applies data-slot attributes', () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content</TabsContent>
        </Tabs>
      );

      expect(container.querySelector('[data-slot="tabs"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="tabs-list"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="tabs-trigger"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="tabs-content"]')).toBeInTheDocument();
    });
  });

  // 2. THEME INTEGRATION TESTS
  describe('Theme Integration', () => {
    it('uses theme CSS variables for TabsList', () => {
      const { container } = render(
        <Tabs>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tabsList = container.querySelector('[data-slot="tabs-list"]');
      expect(tabsList).toHaveClass('bg-muted', 'text-muted-foreground');
    });

    it('uses theme CSS variables for active TabsTrigger', () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const trigger = container.querySelector('[data-slot="tabs-trigger"]');
      expect(trigger).toHaveClass('data-[state=active]:bg-card');
    });
  });

  // 3. INTERACTION TESTS
  describe('Interactions', () => {
    it('changes active tab on click', async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Content 1')).toBeVisible();
      // Content 2 exists in the DOM but is not visible (hidden by Radix UI)
      const content2 = screen.queryByText('Content 2');
      if (content2) {
        expect(content2).not.toBeVisible();
      }

      await user.click(screen.getByText('Tab 2'));

      expect(screen.getByText('Content 2')).toBeVisible();
    });

    it('supports controlled value', async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();

      const { rerender } = render(
        <Tabs value="tab1" onValueChange={handleValueChange}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      await user.click(screen.getByText('Tab 2'));
      expect(handleValueChange).toHaveBeenCalledWith('tab2');

      // Simulate parent component updating value
      rerender(
        <Tabs value="tab2" onValueChange={handleValueChange}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Content 2')).toBeVisible();
    });
  });

  // 4. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      );

      const triggers = container.querySelectorAll('[role="tab"]');
      expect(triggers).toHaveLength(2);

      const tabpanel = container.querySelector('[role="tabpanel"]');
      expect(tabpanel).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      );

      const tab1 = screen.getByText('Tab 1');
      tab1.focus();

      await user.keyboard('{ArrowRight}');
      expect(screen.getByText('Tab 2')).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(screen.getByText('Tab 3')).toHaveFocus();
    });

    it('handles disabled state', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled>Tab 2 (Disabled)</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const disabledTab = screen.getByText('Tab 2 (Disabled)');
      expect(disabledTab).toBeDisabled();
      expect(disabledTab).toHaveClass('disabled:opacity-50', 'disabled:pointer-events-none');
    });
  });

  // 5. ORIENTATION TESTS
  describe('Orientation', () => {
    it('supports horizontal orientation (default)', () => {
      const { container } = render(
        <Tabs orientation="horizontal">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tabs = container.querySelector('[data-slot="tabs"]');
      expect(tabs).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('supports vertical orientation', () => {
      const { container } = render(
        <Tabs orientation="vertical">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tabs = container.querySelector('[data-slot="tabs"]');
      expect(tabs).toHaveAttribute('data-orientation', 'vertical');
    });
  });

  // 6. CUSTOM CLASSNAMES
  describe('Custom ClassNames', () => {
    it('applies custom className to Tabs', () => {
      const { container } = render(
        <Tabs className="custom-tabs">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tabs = container.querySelector('[data-slot="tabs"]');
      expect(tabs).toHaveClass('custom-tabs');
    });

    it('applies custom className to TabsList', () => {
      const { container } = render(
        <Tabs>
          <TabsList className="custom-list">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const list = container.querySelector('[data-slot="tabs-list"]');
      expect(list).toHaveClass('custom-list');
    });

    it('applies custom className to TabsTrigger', () => {
      const { container } = render(
        <Tabs>
          <TabsList>
            <TabsTrigger value="tab1" className="custom-trigger">
              Tab 1
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const trigger = container.querySelector('[data-slot="tabs-trigger"]');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('applies custom className to TabsContent', () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="custom-content">
            Content
          </TabsContent>
        </Tabs>
      );

      const content = container.querySelector('[data-slot="tabs-content"]');
      expect(content).toHaveClass('custom-content');
    });
  });

  // 7. REF FORWARDING
  describe('Ref Forwarding', () => {
    it('forwards ref to Tabs root', () => {
      const ref = vi.fn();
      render(
        <Tabs ref={ref}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(ref).toHaveBeenCalled();
    });

    it('forwards ref to TabsList', () => {
      const ref = vi.fn();
      render(
        <Tabs>
          <TabsList ref={ref}>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      expect(ref).toHaveBeenCalled();
    });
  });

  // 8. DISPLAY NAME
  describe('Display Name', () => {
    it('has correct displayName for Tabs', () => {
      expect(Tabs.displayName).toBe('Tabs');
    });

    it('has correct displayName for TabsList', () => {
      expect(TabsList.displayName).toBe('TabsList');
    });

    it('has correct displayName for TabsTrigger', () => {
      expect(TabsTrigger.displayName).toBe('TabsTrigger');
    });

    it('has correct displayName for TabsContent', () => {
      expect(TabsContent.displayName).toBe('TabsContent');
    });
  });
});
