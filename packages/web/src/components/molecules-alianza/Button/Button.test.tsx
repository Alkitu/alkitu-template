import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Heart, ChevronRight } from 'lucide-react';
import Button from './Button';
import type { ButtonVariant, ButtonSize } from './Button.types';

expect.extend(toHaveNoViolations);

describe('Button - Molecule (Alianza)', () => {
  describe('Basic Rendering', () => {
    it('renders correctly with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('renders as button by default', () => {
      const { container } = render(<Button>Test</Button>);
      expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('has displayName set', () => {
      expect(Button.displayName).toBe('Button');
    });

    it('has data-testid attribute', () => {
      render(<Button>Test</Button>);
      expect(screen.getByTestId('button')).toBeInTheDocument();
    });
  });

  describe('Variants - All Alianza Variants', () => {
    const variants: ButtonVariant[] = [
      'main',
      'active',
      'outline',
      'nude',
      'destructive',
    ];

    it.each(variants)('renders %s variant with correct classes', (variant) => {
      render(<Button variant={variant}>Test</Button>);
      const button = screen.getByRole('button');

      if (variant === 'main') {
        expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
      } else if (variant === 'active') {
        expect(button).toHaveClass('bg-accent', 'text-accent-foreground');
      } else if (variant === 'outline') {
        expect(button).toHaveClass('border-primary', 'text-primary', 'bg-background');
      } else if (variant === 'nude') {
        expect(button).toHaveClass('bg-transparent', 'text-primary');
      } else if (variant === 'destructive') {
        expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground');
      }
    });

    it('uses main variant by default', () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary');
    });
  });

  describe('Variant Mapping - Standard Compatibility', () => {
    it('maps "primary" to "main"', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary');
    });

    it('maps "solid" to "main"', () => {
      render(<Button variant="solid">Solid</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary');
    });

    it('maps "ghost" to "nude"', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent', 'text-primary');
    });

    it('maps "secondary" to "outline"', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-primary');
    });
  });

  describe('Sizes - All 3 Sizes', () => {
    const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

    it.each(sizes)('renders %s size with correct classes', (size) => {
      render(<Button size={size}>Test</Button>);
      const button = screen.getByRole('button');

      if (size === 'sm') {
        expect(button).toHaveClass('h-8', 'px-3', 'text-xs');
      } else if (size === 'md') {
        expect(button).toHaveClass('h-10', 'px-4', 'text-sm');
      } else if (size === 'lg') {
        expect(button).toHaveClass('h-12', 'px-6', 'text-base');
      }
    });

    it('uses md size by default', () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'px-4');
    });
  });

  describe('Icon Support - Alianza API (iconLeft/iconRight)', () => {
    it('renders with iconLeft', () => {
      render(
        <Button iconLeft={<Heart data-testid="icon-left" />}>
          With Icon Left
        </Button>
      );
      expect(screen.getByTestId('icon-left')).toBeInTheDocument();
      expect(screen.getByText('With Icon Left')).toBeInTheDocument();
    });

    it('renders with iconRight', () => {
      render(
        <Button iconRight={<ChevronRight data-testid="icon-right" />}>
          With Icon Right
        </Button>
      );
      expect(screen.getByTestId('icon-right')).toBeInTheDocument();
      expect(screen.getByText('With Icon Right')).toBeInTheDocument();
    });

    it('renders with both iconLeft and iconRight', () => {
      render(
        <Button
          iconLeft={<Heart data-testid="icon-left" />}
          iconRight={<ChevronRight data-testid="icon-right" />}
        >
          Both Icons
        </Button>
      );
      expect(screen.getByTestId('icon-left')).toBeInTheDocument();
      expect(screen.getByTestId('icon-right')).toBeInTheDocument();
    });

    it('icon sizes scale with button size - small', () => {
      const { container } = render(
        <Button size="sm" iconLeft={<Heart />}>
          Small
        </Button>
      );
      const iconWrapper = container.querySelector('span');
      expect(iconWrapper).toHaveClass('[&>svg]:size-3.5');
    });

    it('icon sizes scale with button size - medium and large', () => {
      const { container, rerender } = render(
        <Button size="md" iconLeft={<Heart />}>
          Medium
        </Button>
      );
      let iconWrapper = container.querySelector('span');
      expect(iconWrapper).toHaveClass('[&>svg]:size-4');

      rerender(
        <Button size="lg" iconLeft={<Heart />}>
          Large
        </Button>
      );
      iconWrapper = container.querySelector('span');
      expect(iconWrapper).toHaveClass('[&>svg]:size-4');
    });
  });

  describe('Icon Only Mode', () => {
    it('renders icon-only button with square aspect ratio', () => {
      render(
        <Button iconOnly iconLeft={<Heart data-testid="icon" />}>
          <span className="sr-only">Like</span>
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('aspect-square', 'px-0');
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('icon-only button has correct width for each size', () => {
      const { rerender } = render(
        <Button iconOnly size="sm" iconLeft={<Heart />}>
          <span className="sr-only">Like</span>
        </Button>
      );
      let button = screen.getByRole('button');
      expect(button).toHaveClass('w-8');

      rerender(
        <Button iconOnly size="md" iconLeft={<Heart />}>
          <span className="sr-only">Like</span>
        </Button>
      );
      button = screen.getByRole('button');
      expect(button).toHaveClass('w-10');

      rerender(
        <Button iconOnly size="lg" iconLeft={<Heart />}>
          <span className="sr-only">Like</span>
        </Button>
      );
      button = screen.getByRole('button');
      expect(button).toHaveClass('w-12');
    });
  });

  describe('Loading State', () => {
    it('renders loading spinner when loading=true', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      // Spinner should be rendered
      const spinner = button.querySelector('svg');
      expect(spinner).toBeInTheDocument();
    });

    it('disables button when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not call onClick when loading', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Loading
        </Button>
      );

      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('hides icons when loading', () => {
      render(
        <Button loading iconLeft={<Heart data-testid="icon" />}>
          Loading
        </Button>
      );
      // Icon should not be visible when loading
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('renders disabled button', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('has disabled opacity', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:opacity-50');
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Disabled
        </Button>
      );

      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Full Width', () => {
    it('renders full width when fullWidth=true', () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('does not render full width by default', () => {
      render(<Button>Normal Width</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('w-full');
    });
  });

  describe('Events', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);

      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('passes event object to onClick handler', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);

      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it('supports keyboard activation - Enter key', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Press Enter</Button>);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('supports keyboard activation - Space key', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Press Space</Button>);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('asChild Prop - Radix Slot', () => {
    it('renders as child component when asChild=true', () => {
      const { container } = render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      const link = container.querySelector('a[href="/test"]');
      expect(link).toBeInTheDocument();
      expect(link?.textContent).toContain('Link Button');
    });

    it('applies button classes to child component', () => {
      const { container } = render(
        <Button asChild variant="main">
          <a href="/test">Link</a>
        </Button>
      );
      const link = container.querySelector('a');
      expect(link).toHaveClass('bg-primary');
    });

    it('does not use asChild when button has iconLeft', () => {
      const { container } = render(
        <Button asChild iconLeft={<Heart />}>
          <a href="/test">Link</a>
        </Button>
      );
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('does not use asChild when button has iconRight', () => {
      const { container } = render(
        <Button asChild iconRight={<ChevronRight />}>
          <a href="/test">Link</a>
        </Button>
      );
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('does not use asChild when button is loading', () => {
      const { container } = render(
        <Button asChild loading>
          <a href="/test">Link</a>
        </Button>
      );
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    it('applies themeOverride styles', () => {
      const themeOverride = {
        '--primary': '#ff0000',
        backgroundColor: 'blue',
      };
      render(<Button themeOverride={themeOverride}>Themed</Button>);
      const button = screen.getByRole('button');

      expect(button.style.getPropertyValue('--primary')).toBe('#ff0000');
      expect(button.style.getPropertyValue('--backgroundColor')).toBe('blue');
    });
  });

  describe('Accessibility', () => {
    it('has proper button role', () => {
      render(<Button>Accessible</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('accepts aria-label', () => {
      render(<Button aria-label="Custom Label">Icon Only</Button>);
      expect(
        screen.getByRole('button', { name: 'Custom Label' })
      ).toBeInTheDocument();
    });

    it('accepts aria-describedby', () => {
      render(<Button aria-describedby="description-id">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'description-id');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<Button>Accessible Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('disabled button has no accessibility violations', async () => {
      const { container } = render(<Button disabled>Disabled Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('loading button has no accessibility violations', async () => {
      const { container } = render(<Button loading>Loading Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('icon-only button with sr-only text has no violations', async () => {
      const { container } = render(
        <Button iconOnly iconLeft={<Heart />}>
          <span className="sr-only">Like</span>
        </Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Custom Props and Edge Cases', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Test</Button>);
      expect(ref).toHaveBeenCalled();
    });

    it('accepts className prop', () => {
      render(<Button className="custom-class">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('merges custom className with variant classes', () => {
      render(
        <Button className="custom-class" variant="main">
          Test
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class', 'bg-primary');
    });

    it('accepts type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('accepts form attribute', () => {
      render(<Button form="my-form">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('form', 'my-form');
    });

    it('accepts name attribute', () => {
      render(<Button name="action">Action</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('name', 'action');
    });

    it('accepts value attribute', () => {
      render(<Button value="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('value', 'submit');
    });

    it('spreads additional HTML attributes', () => {
      render(
        <Button id="test-id" title="Test Title">
          Test
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'test-id');
      expect(button).toHaveAttribute('title', 'Test Title');
    });

    it('renders with both icons and complex children', () => {
      render(
        <Button iconLeft={<Heart />} iconRight={<ChevronRight />}>
          <span>Complex</span> <strong>Content</strong>
        </Button>
      );
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders without children (icon-only without iconOnly prop)', () => {
      render(<Button iconLeft={<Heart data-testid="icon" />} />);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('Visual Regression Prevention', () => {
    it('maintains consistent height across variants', () => {
      const sizes: ButtonSize[] = ['sm', 'md', 'lg'];
      const heights = ['h-8', 'h-10', 'h-12'];

      sizes.forEach((size, index) => {
        const { container } = render(<Button size={size}>Test</Button>);
        const button = container.querySelector('button');
        expect(button).toHaveClass(heights[index]);
      });
    });

    it('applies hover classes correctly for main variant', () => {
      render(<Button variant="main">Hover</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-primary/90');
    });

    it('applies hover classes correctly for nude variant', () => {
      render(<Button variant="nude">Hover</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-primary/10');
    });

    it('applies focus-visible styles', () => {
      render(<Button>Focus</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:outline-none');
      expect(button).toHaveClass('focus-visible:ring-2');
    });

    it('applies transition classes', () => {
      render(<Button>Transition</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-all', 'duration-200');
    });

    it('applies rounded corners from CSS variable', () => {
      render(<Button>Rounded</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-[var(--radius-button)]');
    });
  });
});
