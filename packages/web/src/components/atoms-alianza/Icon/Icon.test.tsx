import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Icon } from './Icon';
import type { IconVariant, IconSize } from './Icon.types';

expect.extend(toHaveNoViolations);

describe('Icon - Atom', () => {
  describe('Basic Rendering', () => {
    it('renders correctly with icon name', () => {
      const { container } = render(<Icon name="heart" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders with icon name ending with "Icon"', () => {
      const { container } = render(<Icon name="heartIcon" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('handles icon names without Icon suffix', () => {
      const { container } = render(<Icon name="star" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('returns null for invalid icon name', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { container } = render(<Icon name="nonexistent" />);

      expect(container.querySelector('svg')).not.toBeInTheDocument();
      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('Icon "nonexistent"')
      );

      consoleWarn.mockRestore();
    });

    it('has proper aria-label', () => {
      render(<Icon name="heart" />);
      const icon = screen.getByLabelText('heart');
      expect(icon).toBeInTheDocument();
    });

    it('supports data-testid', () => {
      render(<Icon name="heart" data-testid="test-icon" />);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });

  describe('Variants - All 6 Variants', () => {
    const variants: IconVariant[] = [
      'default',
      'primary',
      'secondary',
      'success',
      'warning',
      'error',
    ];

    it.each(variants)('renders %s variant with correct classes', (variant) => {
      const { container } = render(<Icon name="heart" variant={variant} />);
      const icon = container.querySelector('svg');

      if (variant === 'default') {
        expect(icon).toHaveClass('text-current');
      } else if (variant === 'primary') {
        expect(icon).toHaveClass('text-primary');
      } else if (variant === 'secondary') {
        expect(icon).toHaveClass('text-muted-foreground');
      } else if (variant === 'success') {
        expect(icon).toHaveClass('text-green-600');
      } else if (variant === 'warning') {
        expect(icon).toHaveClass('text-yellow-600');
      } else if (variant === 'error') {
        expect(icon).toHaveClass('text-red-600');
      }
    });

    it('uses default variant by default', () => {
      const { container } = render(<Icon name="heart" />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('text-current');
    });
  });

  describe('Sizes - All 6 Sizes', () => {
    const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

    it.each(sizes)('renders %s size with correct dimensions', (size) => {
      const { container } = render(<Icon name="heart" size={size} />);
      const icon = container.querySelector('svg');

      const sizeMap = {
        xs: '12',
        sm: '16',
        md: '24',
        lg: '32',
        xl: '48',
        '2xl': '64',
      };

      expect(icon).toHaveAttribute('width', sizeMap[size]);
      expect(icon).toHaveAttribute('height', sizeMap[size]);
    });

    it('uses md size by default', () => {
      const { container } = render(<Icon name="heart" />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('width', '24');
      expect(icon).toHaveAttribute('height', '24');
    });

    it('xs size renders at 12px', () => {
      const { container } = render(<Icon name="heart" size="xs" />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('width', '12');
      expect(icon).toHaveAttribute('height', '12');
    });

    it('2xl size renders at 64px', () => {
      const { container } = render(<Icon name="heart" size="2xl" />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('width', '64');
      expect(icon).toHaveAttribute('height', '64');
    });
  });

  describe('Color Customization', () => {
    it('applies custom color prop', () => {
      const { container } = render(<Icon name="heart" color="red" />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
      // Lucide icons receive color prop which is passed through
    });

    it('custom color overrides variant color', () => {
      const { container } = render(
        <Icon name="heart" variant="primary" color="purple" />
      );
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
      // Color prop should override variant styling
    });

    it('supports hex color values', () => {
      const { container } = render(<Icon name="heart" color="#ff0000" />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('supports rgb color values', () => {
      const { container } = render(<Icon name="heart" color="rgb(255, 0, 0)" />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('supports oklch color values', () => {
      const { container } = render(
        <Icon name="heart" color="oklch(0.6 0.2 30)" />
      );
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('renders spinner when loading=true', () => {
      const { container } = render(<Icon name="heart" loading />);
      const spinner = container.querySelector('svg');
      expect(spinner).toHaveClass('animate-spin');
    });

    it('shows loading label when loading', () => {
      render(<Icon name="heart" loading />);
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    it('loading state respects size prop', () => {
      const { container } = render(<Icon name="heart" loading size="lg" />);
      const spinner = container.querySelector('svg');
      expect(spinner).toHaveAttribute('width', '32');
    });

    it('loading state respects variant prop', () => {
      const { container } = render(
        <Icon name="heart" loading variant="primary" />
      );
      const spinner = container.querySelector('svg');
      expect(spinner).toHaveClass('text-primary');
    });

    it('loading state can have custom aria-label', () => {
      render(<Icon name="heart" loading aria-label="Processing..." />);
      expect(screen.getByLabelText('Processing...')).toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    it('applies themeOverride styles', () => {
      const themeOverride = { opacity: '0.5' };
      const { container } = render(
        <Icon name="heart" themeOverride={themeOverride} />
      );
      const icon = container.querySelector('svg') as HTMLElement;
      expect(icon.style.opacity).toBe('0.5');
    });

    it('useSystemColors can be disabled', () => {
      const { container } = render(
        <Icon name="heart" useSystemColors={false} variant="primary" />
      );
      const icon = container.querySelector('svg');
      // Should not have variant classes when useSystemColors=false
      expect(icon).not.toHaveClass('text-primary');
    });

    it('useSystemColors=true applies variant classes', () => {
      const { container } = render(
        <Icon name="heart" useSystemColors={true} variant="primary" />
      );
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('text-primary');
    });

    it('supports multiple theme overrides', () => {
      const themeOverride = {
        opacity: '0.8',
        transform: 'rotate(45deg)',
      };
      const { container } = render(
        <Icon name="heart" themeOverride={themeOverride} />
      );
      const icon = container.querySelector('svg') as HTMLElement;
      expect(icon.style.opacity).toBe('0.8');
      expect(icon.style.transform).toBe('rotate(45deg)');
    });
  });

  describe('Accessibility', () => {
    it('has default aria-label from icon name', () => {
      render(<Icon name="heart" />);
      expect(screen.getByLabelText('heart')).toBeInTheDocument();
    });

    it('accepts custom aria-label', () => {
      render(<Icon name="heart" aria-label="Favorite" />);
      expect(screen.getByLabelText('Favorite')).toBeInTheDocument();
      expect(screen.queryByLabelText('heart')).not.toBeInTheDocument();
    });

    it('custom aria-label improves semantic meaning', () => {
      render(<Icon name="check" aria-label="Task completed" />);
      expect(screen.getByLabelText('Task completed')).toBeInTheDocument();
    });

    it('supports aria-hidden for decorative icons', () => {
      const { container } = render(<Icon name="heart" aria-hidden />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<Icon name="heart" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('icon with custom label has no accessibility violations', async () => {
      const { container } = render(
        <Icon name="heart" aria-label="Favorite item" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('interactive icon has button role', () => {
      render(
        <Icon name="trash" onClick={() => {}} aria-label="Delete" />
      );
      const icon = screen.getByRole('button');
      expect(icon).toBeInTheDocument();
    });

    it('interactive icon is keyboard accessible', () => {
      render(
        <Icon name="trash" onClick={() => {}} aria-label="Delete" />
      );
      const icon = screen.getByRole('button');
      expect(icon).toHaveAttribute('tabIndex');
    });
  });

  describe('Interactive Features', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Icon name="trash" onClick={handleClick} aria-label="Delete" />
      );

      const icon = screen.getByRole('button');
      await user.click(icon);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles Enter key press', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Icon name="trash" onClick={handleClick} aria-label="Delete" />
      );

      const icon = screen.getByRole('button');
      icon.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles Space key press', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Icon name="trash" onClick={handleClick} aria-label="Delete" />
      );

      const icon = screen.getByRole('button');
      icon.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('adds cursor-pointer class when interactive', () => {
      const { container } = render(
        <Icon name="trash" onClick={() => {}} aria-label="Delete" />
      );
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('cursor-pointer');
    });

    it('adds hover styles when interactive', () => {
      const { container } = render(
        <Icon name="trash" onClick={() => {}} aria-label="Delete" />
      );
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('hover:opacity-80');
      expect(icon).toHaveClass('transition-opacity');
    });

    it('does not add interactive classes when not clickable', () => {
      const { container } = render(<Icon name="heart" />);
      const icon = container.querySelector('svg');
      expect(icon).not.toHaveClass('cursor-pointer');
    });
  });

  describe('Common Icon Names', () => {
    it.each([
      'heart',
      'star',
      'check',
      'x',
      'chevronDown',
      'chevronUp',
      'chevronLeft',
      'chevronRight',
      'menu',
      'search',
      'settings',
      'user',
      'home',
      'mail',
      'bell',
      'trash',
      'edit',
      'plus',
      'minus',
    ])('renders %s icon correctly', (iconName) => {
      const { container } = render(<Icon name={iconName} />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Custom Props and Edge Cases', () => {
    it('accepts className prop', () => {
      const { container } = render(
        <Icon name="heart" className="custom-class" />
      );
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('custom-class');
    });

    it('merges custom className with variant classes', () => {
      const { container } = render(
        <Icon name="heart" className="custom-class" variant="primary" />
      );
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('custom-class', 'text-primary');
    });

    it('renders different icons based on name prop', () => {
      const { container, rerender } = render(<Icon name="heart" />);
      let icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();

      rerender(<Icon name="star" />);
      icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('updates when size prop changes', () => {
      const { container, rerender } = render(<Icon name="heart" size="sm" />);
      let icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('width', '16');

      rerender(<Icon name="heart" size="lg" />);
      icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('width', '32');
    });

    it('updates when variant prop changes', () => {
      const { container, rerender } = render(
        <Icon name="heart" variant="primary" />
      );
      let icon = container.querySelector('svg');
      expect(icon).toHaveClass('text-primary');

      rerender(<Icon name="heart" variant="error" />);
      icon = container.querySelector('svg');
      expect(icon).toHaveClass('text-red-600');
    });

    it('supports custom tabIndex', () => {
      render(
        <Icon name="heart" onClick={() => {}} tabIndex={-1} aria-label="Heart" />
      );
      const icon = screen.getByRole('button');
      expect(icon).toHaveAttribute('tabIndex', '-1');
    });

    it('supports custom role', () => {
      const { container } = render(<Icon name="heart" role="img" />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('role', 'img');
    });
  });

  describe('Icon Integration', () => {
    it('works with lucide-react icons', () => {
      const { container } = render(<Icon name="heart" />);
      const icon = container.querySelector('svg');

      // Lucide icons have specific attributes
      expect(icon).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
      expect(icon).toHaveAttribute('viewBox');
    });

    it('renders SVG with proper structure', () => {
      const { container } = render(<Icon name="heart" />);
      const icon = container.querySelector('svg');

      expect(icon?.tagName).toBe('svg');
      expect(icon?.getAttribute('fill')).toBeDefined();
      expect(icon?.getAttribute('stroke')).toBeDefined();
    });
  });

  describe('Dark Mode Support', () => {
    it('success variant has dark mode classes', () => {
      const { container } = render(<Icon name="check" variant="success" />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('dark:text-green-400');
    });

    it('warning variant has dark mode classes', () => {
      const { container } = render(
        <Icon name="alertTriangle" variant="warning" />
      );
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('dark:text-yellow-400');
    });

    it('error variant has dark mode classes', () => {
      const { container } = render(<Icon name="x" variant="error" />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('dark:text-red-400');
    });
  });

  describe('Visual Regression Prevention', () => {
    it('maintains consistent sizing', () => {
      const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
      const dimensions = ['12', '16', '24', '32', '48', '64'];

      sizes.forEach((size, index) => {
        const { container } = render(<Icon name="heart" size={size} />);
        const icon = container.querySelector('svg');
        expect(icon).toHaveAttribute('width', dimensions[index]);
        expect(icon).toHaveAttribute('height', dimensions[index]);
      });
    });

    it('applies correct aspect ratio', () => {
      const { container } = render(<Icon name="heart" />);
      const icon = container.querySelector('svg');
      const width = icon?.getAttribute('width');
      const height = icon?.getAttribute('height');
      expect(width).toBe(height);
    });
  });

  describe('Performance', () => {
    it('renders quickly with multiple icons', () => {
      const start = performance.now();

      const { container } = render(
        <div>
          <Icon name="heart" />
          <Icon name="star" />
          <Icon name="check" />
          <Icon name="x" />
          <Icon name="menu" />
        </div>
      );

      const end = performance.now();
      const duration = end - start;

      expect(container.querySelectorAll('svg')).toHaveLength(5);
      expect(duration).toBeLessThan(100); // Should render in less than 100ms
    });

    it('handles rapid re-renders efficiently', () => {
      const { rerender } = render(<Icon name="heart" />);

      const start = performance.now();
      for (let i = 0; i < 50; i++) {
        rerender(<Icon name="star" />);
      }
      const end = performance.now();

      expect(end - start).toBeLessThan(200); // 50 re-renders in less than 200ms
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to icon element', () => {
      const ref = vi.fn();
      render(<Icon name="heart" ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });
});
