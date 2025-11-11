import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from './Badge';
import type { BadgeVariant, BadgeSize } from './Badge.types';

expect.extend(toHaveNoViolations);

describe('Badge Component - PHASE 2 CONSOLIDATION', () => {
  describe('Basic Rendering', () => {
    it('renders correctly with children', () => {
      render(<Badge>Test Badge</Badge>);
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('renders as span by default', () => {
      const { container } = render(<Badge>Test</Badge>);
      expect(container.querySelector('span')).toBeInTheDocument();
    });

    it('has displayName set', () => {
      expect(Badge.displayName).toBe('Badge');
    });

    it('has data-slot attribute', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Variants - All 9 Consolidated Variants', () => {
    const variants: BadgeVariant[] = [
      'default',
      'primary',
      'secondary',
      'success',
      'warning',
      'error',
      'destructive',
      'outline',
      'ghost',
    ];

    it.each(variants)('renders %s variant with correct classes', (variant) => {
      const { container } = render(<Badge variant={variant}>Test</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toBeInTheDocument();

      // Verify variant-specific classes are applied
      if (variant === 'default') {
        expect(badge).toHaveClass('bg-muted', 'text-muted-foreground');
      } else if (variant === 'primary') {
        expect(badge).toHaveClass('bg-primary', 'text-primary-foreground');
      } else if (variant === 'secondary') {
        expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground');
      } else if (variant === 'success') {
        expect(badge).toHaveClass('bg-success', 'text-success-foreground');
      } else if (variant === 'warning') {
        expect(badge).toHaveClass('bg-warning', 'text-warning-foreground');
      } else if (variant === 'error' || variant === 'destructive') {
        expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground');
      } else if (variant === 'outline') {
        expect(badge).toHaveClass('border-2', 'border-input', 'bg-background');
      } else if (variant === 'ghost') {
        expect(badge).toHaveClass('bg-transparent', 'text-foreground');
      }
    });

    it('uses default variant when not specified', () => {
      const { container } = render(<Badge>Default</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toHaveClass('bg-muted');
    });
  });

  describe('Sizes - All 3 Sizes', () => {
    const sizes: BadgeSize[] = ['sm', 'md', 'lg'];

    it.each(sizes)('renders %s size with correct classes', (size) => {
      const { container } = render(<Badge size={size}>Test</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');

      if (size === 'sm') {
        expect(badge).toHaveClass('h-5', 'px-2', 'text-xs');
      } else if (size === 'md') {
        expect(badge).toHaveClass('h-6', 'px-2.5', 'text-sm');
      } else if (size === 'lg') {
        expect(badge).toHaveClass('h-7', 'px-3', 'text-base');
      }
    });

    it('uses md size by default', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toHaveClass('h-6', 'px-2.5');
    });
  });

  describe('Icon Support (From Theme Editor)', () => {
    it('renders with icon', () => {
      render(
        <Badge icon={<Star data-testid="star-icon" />}>
          Featured
        </Badge>,
      );
      expect(screen.getByTestId('star-icon')).toBeInTheDocument();
    });

    it('renders icon before content', () => {
      const { container } = render(
        <Badge icon={<Star data-testid="icon" />}>Content</Badge>,
      );
      const badge = container.querySelector('[data-slot="badge"]');
      const iconWrapper = container.querySelector('span[aria-hidden="true"]');
      const content = screen.getByText('Content');

      // Verify both icon wrapper and content exist
      expect(iconWrapper).toBeInTheDocument();
      expect(content).toBeInTheDocument();

      // Icon wrapper should come before content in the DOM
      const badgeChildren = Array.from(badge?.childNodes || []);
      const iconIndex = badgeChildren.indexOf(iconWrapper as ChildNode);
      const contentIndex = badgeChildren.findIndex((node) =>
        node.textContent?.includes('Content')
      );
      expect(iconIndex).toBeLessThan(contentIndex);
    });

    it('icon has aria-hidden attribute', () => {
      const { container } = render(
        <Badge icon={<Star />}>Test</Badge>,
      );
      const iconWrapper = container.querySelector('span[aria-hidden="true"]');
      expect(iconWrapper).toBeInTheDocument();
    });

    it('icon sizes correctly with badge size', () => {
      const { container, rerender } = render(
        <Badge size="sm" icon={<Star />}>Small</Badge>,
      );
      let icon = container.querySelector('svg');
      expect(icon).toHaveClass('size-2.5');

      rerender(<Badge size="md" icon={<Star />}>Medium</Badge>);
      icon = container.querySelector('svg');
      expect(icon).toHaveClass('size-3');

      rerender(<Badge size="lg" icon={<Star />}>Large</Badge>);
      icon = container.querySelector('svg');
      expect(icon).toHaveClass('size-3.5');
    });
  });

  describe('Removable Feature (From Theme Editor)', () => {
    it('renders remove button when removable=true', () => {
      render(
        <Badge removable onRemove={() => {}}>
          Removable
        </Badge>,
      );
      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toBeInTheDocument();
    });

    it('does not render remove button when removable=false', () => {
      render(<Badge removable={false}>Not Removable</Badge>);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('calls onRemove when remove button clicked', async () => {
      const user = userEvent.setup();
      const handleRemove = vi.fn();

      render(
        <Badge removable onRemove={handleRemove}>
          Remove Me
        </Badge>,
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      await user.click(removeButton);

      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('remove button stops event propagation', async () => {
      const user = userEvent.setup();
      const handleRemove = vi.fn();
      const handleBadgeClick = vi.fn();

      const { container } = render(
        <div onClick={handleBadgeClick}>
          <Badge removable onRemove={handleRemove}>
            Test
          </Badge>
        </div>,
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      await user.click(removeButton);

      expect(handleRemove).toHaveBeenCalledTimes(1);
      // Parent onClick should not be called
      expect(handleBadgeClick).not.toHaveBeenCalled();
    });

    it('remove button has proper aria-label', () => {
      render(
        <Badge removable onRemove={() => {}}>
          Tag Name
        </Badge>,
      );
      const removeButton = screen.getByRole('button', { name: 'Remove Tag Name' });
      expect(removeButton).toBeInTheDocument();
    });

    it('remove button keyboard navigation - Enter key', async () => {
      const user = userEvent.setup();
      const handleRemove = vi.fn();

      render(
        <Badge removable onRemove={handleRemove}>
          Test
        </Badge>,
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      removeButton.focus();
      await user.keyboard('{Enter}');

      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('remove button keyboard navigation - Space key', async () => {
      const user = userEvent.setup();
      const handleRemove = vi.fn();

      render(
        <Badge removable onRemove={handleRemove}>
          Test
        </Badge>,
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      removeButton.focus();
      await user.keyboard(' ');

      expect(handleRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('asChild Prop (From UI Badge)', () => {
    it('renders as child component when asChild=true', () => {
      const { container } = render(
        <Badge asChild>
          <a href="/test">Link Badge</a>
        </Badge>,
      );
      const link = container.querySelector('a[href="/test"]');
      expect(link).toBeInTheDocument();
      expect(link?.textContent).toContain('Link Badge');
    });

    it('applies badge classes to child component', () => {
      const { container } = render(
        <Badge asChild variant="primary">
          <a href="/test">Link</a>
        </Badge>,
      );
      const link = container.querySelector('a');
      expect(link).toHaveClass('bg-primary');
    });
  });

  describe('Theme Integration (CSS Variables)', () => {
    it('applies typography CSS variables', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('[data-slot="badge"]') as HTMLElement;

      expect(badge.style.fontFamily).toContain('var(--typography-emphasis-font-family');
      expect(badge.style.letterSpacing).toContain('var(--typography-emphasis-letter-spacing');
    });

    it('applies border radius CSS variable', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('[data-slot="badge"]') as HTMLElement;

      expect(badge.style.borderRadius).toContain('var(--radius-badge');
    });

    it('font size adjusts based on size prop', () => {
      const { container, rerender } = render(<Badge size="md">Medium</Badge>);
      let badge = container.querySelector('[data-slot="badge"]') as HTMLElement;
      expect(badge.style.fontSize).toContain('calc');

      rerender(<Badge size="lg">Large</Badge>);
      badge = container.querySelector('[data-slot="badge"]') as HTMLElement;
      expect(badge.style.fontSize).toContain('var(--typography-emphasis-font-size');
    });

    it('merges themeOverride with base styles', () => {
      const { container } = render(
        <Badge themeOverride={{ backgroundColor: 'purple', color: 'white' }}>
          Custom
        </Badge>,
      );
      const badge = container.querySelector('[data-slot="badge"]') as HTMLElement;

      expect(badge.style.backgroundColor).toBe('purple');
      expect(badge.style.color).toBe('white');
      // Base styles still applied
      expect(badge.style.fontFamily).toContain('var(--typography-emphasis-font-family');
    });

    it('data-use-system-colors attribute is set', () => {
      const { container } = render(<Badge useSystemColors={true}>Test</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toHaveAttribute('data-use-system-colors', 'true');
    });

    it('data-use-system-colors can be disabled', () => {
      const { container } = render(<Badge useSystemColors={false}>Test</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toHaveAttribute('data-use-system-colors', 'false');
    });
  });

  describe('Accessibility (From Theme Editor)', () => {
    it('has role="status" by default', () => {
      const { container } = render(<Badge>Status</Badge>);
      const badge = container.querySelector('[role="status"]');
      expect(badge).toBeInTheDocument();
    });

    it('accepts custom role', () => {
      const { container } = render(<Badge role="note">Note</Badge>);
      const badge = container.querySelector('[role="note"]');
      expect(badge).toBeInTheDocument();
    });

    it('auto-generates aria-label from children', () => {
      const { container } = render(<Badge>Test Label</Badge>);
      const badge = container.querySelector('[aria-label="Badge: Test Label"]');
      expect(badge).toBeInTheDocument();
    });

    it('uses custom aria-label when provided', () => {
      const { container } = render(<Badge aria-label="Custom Label">Test</Badge>);
      const badge = container.querySelector('[aria-label="Custom Label"]');
      expect(badge).toBeInTheDocument();
    });

    it('applies aria-describedby when provided', () => {
      const { container } = render(<Badge aria-describedby="description-id">Test</Badge>);
      const badge = container.querySelector('[aria-describedby="description-id"]');
      expect(badge).toBeInTheDocument();
    });

    it('adds aria-live="polite" for error variant', () => {
      const { container } = render(<Badge variant="error">Error</Badge>);
      const badge = container.querySelector('[aria-live="polite"]');
      expect(badge).toBeInTheDocument();
    });

    it('adds aria-live="polite" for destructive variant', () => {
      const { container } = render(<Badge variant="destructive">Error</Badge>);
      const badge = container.querySelector('[aria-live="polite"]');
      expect(badge).toBeInTheDocument();
    });

    it('adds aria-live="polite" for warning variant', () => {
      const { container } = render(<Badge variant="warning">Warning</Badge>);
      const badge = container.querySelector('[aria-live="polite"]');
      expect(badge).toBeInTheDocument();
    });

    it('does not add aria-live for non-alert variants', () => {
      const { container } = render(<Badge variant="success">Success</Badge>);
      const badge = container.querySelector('[aria-live]');
      expect(badge).not.toBeInTheDocument();
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<Badge>Accessible Badge</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('removable badge has no accessibility violations', async () => {
      const { container } = render(
        <Badge removable onRemove={() => {}}>
          Removable Badge
        </Badge>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Custom Props and Edge Cases', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Badge ref={ref}>Test</Badge>);
      expect(ref).toHaveBeenCalled();
    });

    it('accepts className prop', () => {
      const { container } = render(<Badge className="custom-class">Test</Badge>);
      const badge = container.querySelector('.custom-class');
      expect(badge).toBeInTheDocument();
    });

    it('merges custom className with variant classes', () => {
      const { container } = render(
        <Badge className="custom-class" variant="primary">
          Test
        </Badge>,
      );
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toHaveClass('custom-class', 'bg-primary');
    });

    it('accepts data-testid', () => {
      render(<Badge data-testid="my-badge">Test</Badge>);
      expect(screen.getByTestId('my-badge')).toBeInTheDocument();
    });

    it('spreads additional HTML attributes', () => {
      const { container } = render(<Badge id="test-id" title="Test Title">Test</Badge>);
      const badge = container.querySelector('#test-id');
      expect(badge).toHaveAttribute('title', 'Test Title');
    });

    it('renders with both icon and removable', () => {
      render(
        <Badge icon={<Star data-testid="icon" />} removable onRemove={() => {}}>
          Full Featured
        </Badge>,
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
      expect(screen.getByText('Full Featured')).toBeInTheDocument();
    });

    it('renders complex children', () => {
      render(
        <Badge>
          <span>Complex</span> <strong>Content</strong>
        </Badge>,
      );
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('CVA Integration', () => {
    it('uses CVA for variant and size classes', () => {
      const { container } = render(<Badge variant="primary" size="lg">Test</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');

      // CVA classes should be present
      expect(badge).toHaveClass('bg-primary', 'text-primary-foreground');
      expect(badge).toHaveClass('h-7', 'px-3', 'text-base');
    });

    it('includes base CVA classes', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');

      // Base classes from CVA
      expect(badge).toHaveClass('inline-flex', 'items-center', 'justify-center');
      expect(badge).toHaveClass('transition-colors', 'duration-200');
    });
  });

  describe('Visual Regression Prevention', () => {
    it('maintains consistent height across variants', () => {
      const sizes: BadgeSize[] = ['sm', 'md', 'lg'];
      const heights = ['h-5', 'h-6', 'h-7'];

      sizes.forEach((size, index) => {
        const { container } = render(<Badge size={size}>Test</Badge>);
        const badge = container.querySelector('[data-slot="badge"]');
        expect(badge).toHaveClass(heights[index]);
      });
    });

    it('applies hover classes correctly', () => {
      const { container } = render(<Badge variant="primary">Hover</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toHaveClass('hover:bg-primary/90');
    });

    it('applies focus-visible styles', () => {
      const { container } = render(<Badge>Focus</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toHaveClass('focus-visible:outline-none');
      expect(badge).toHaveClass('focus-visible:ring-2');
    });
  });
});
