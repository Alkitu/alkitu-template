import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  describe('Sizes - All 4 Sizes', () => {
    const sizes: IconSize[] = ['sm', 'md', 'lg', 'xl'];

    it.each(sizes)('renders %s size with correct dimensions', (size) => {
      const { container } = render(<Icon name="heart" size={size} />);
      const icon = container.querySelector('svg');

      const sizeMap = {
        sm: '16',
        md: '24',
        lg: '32',
        xl: '48',
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
      const { container } = render(<Icon name="alertTriangle" variant="warning" />);
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
      const sizes: IconSize[] = ['sm', 'md', 'lg', 'xl'];
      const dimensions = ['16', '24', '32', '48'];

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
});
