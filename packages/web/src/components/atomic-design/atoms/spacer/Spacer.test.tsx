import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Spacer } from './Spacer';
import type { SpacerProps } from './Spacer.types';

expect.extend(toHaveNoViolations);

describe('Spacer Atom', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<Spacer />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with default props', () => {
      const { container } = render(<Spacer />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toHaveAttribute('data-spacing-size', 'md');
      expect(spacer).toHaveAttribute('data-spacing-direction', 'vertical');
    });

    it('applies correct display name', () => {
      expect(Spacer.displayName).toBe('Spacer');
    });
  });

  // 2. SIZE TESTS
  describe('Sizes', () => {
    it.each([
      ['xs', 'xs'],
      ['sm', 'sm'],
      ['md', 'md'],
      ['lg', 'lg'],
      ['xl', 'xl'],
      ['2xl', '2xl'],
    ] as const)('applies %s size correctly', (size, expectedDataAttr) => {
      const { container } = render(<Spacer size={size} />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toHaveAttribute('data-spacing-size', expectedDataAttr);
    });

    it('renders with xs size and calculates correct spacing', () => {
      const { container } = render(<Spacer size="xs" />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer.style.height).toContain('calc(var(--spacing, 2.2rem) * 0.5)');
    });

    it('renders with 2xl size and calculates correct spacing', () => {
      const { container } = render(<Spacer size="2xl" />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer.style.height).toContain('calc(var(--spacing, 2.2rem) * 8)');
    });
  });

  // 3. DIRECTION TESTS
  describe('Directions', () => {
    it('applies vertical direction by default', () => {
      const { container } = render(<Spacer />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toHaveAttribute('data-spacing-direction', 'vertical');
      expect(spacer.style.width).toBe('1px');
      expect(spacer.style.minHeight).toBeTruthy();
    });

    it('applies horizontal direction correctly', () => {
      const { container } = render(<Spacer direction="horizontal" />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toHaveAttribute('data-spacing-direction', 'horizontal');
      expect(spacer.style.height).toBe('1px');
      expect(spacer.style.minWidth).toBeTruthy();
    });

    it('applies both direction correctly', () => {
      const { container } = render(<Spacer direction="both" />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toHaveAttribute('data-spacing-direction', 'both');
      expect(spacer.style.minWidth).toBeTruthy();
      expect(spacer.style.minHeight).toBeTruthy();
    });
  });

  // 4. CUSTOM SPACING TESTS
  describe('Custom Spacing', () => {
    it('accepts custom spacing value in pixels', () => {
      const { container } = render(<Spacer spacing="32px" />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toHaveAttribute('data-spacing-value', '32px');
      expect(spacer.style.height).toBe('32px');
    });

    it('accepts custom spacing value in rem', () => {
      const { container } = render(<Spacer spacing="2rem" />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toHaveAttribute('data-spacing-value', '2rem');
      expect(spacer.style.height).toBe('2rem');
    });

    it('custom spacing overrides size prop', () => {
      const { container } = render(<Spacer size="lg" spacing="50px" />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toHaveAttribute('data-spacing-value', '50px');
      expect(spacer.style.height).toBe('50px');
    });
  });

  // 5. PROPS TESTS
  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Spacer className="custom-spacer" />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toHaveClass('custom-spacer');
      expect(spacer).toHaveClass('spacer');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Spacer ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom inline styles', () => {
      const { container } = render(
        <Spacer style={{ backgroundColor: 'red', opacity: 0.5 }} />,
      );
      const spacer = container.firstChild as HTMLElement;
      expect(spacer.style.backgroundColor).toBe('red');
      expect(spacer.style.opacity).toBe('0.5');
    });

    it('applies data-testid attribute', () => {
      const { container } = render(<Spacer data-testid="test-spacer" />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toHaveAttribute('data-testid', 'test-spacer');
    });

    it('applies flexShrink: 0 to prevent shrinking', () => {
      const { container } = render(<Spacer />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer.style.flexShrink).toBe('0');
    });
  });

  // 6. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Spacer />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has aria-hidden attribute', () => {
      const { container } = render(<Spacer />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toHaveAttribute('aria-hidden', 'true');
    });

    it('is hidden from screen readers', () => {
      const { container } = render(<Spacer />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer.getAttribute('aria-hidden')).toBe('true');
    });
  });

  // 7. THEME INTEGRATION TESTS
  describe('Theme Integration', () => {
    it('uses CSS variables for spacing calculation', () => {
      const { container } = render(<Spacer size="md" />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer.style.height).toContain('var(--spacing, 2.2rem)');
    });

    it('provides fallback value when CSS variable is not defined', () => {
      const { container } = render(<Spacer size="sm" />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer.style.height).toContain('2.2rem'); // fallback value
    });

    it('stores spacing value in data attribute for debugging', () => {
      const { container } = render(<Spacer size="lg" />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toHaveAttribute('data-spacing-value');
    });
  });

  // 8. COMBINATION TESTS
  describe('Combinations', () => {
    it('combines size and direction correctly', () => {
      const { container } = render(<Spacer size="xl" direction="horizontal" />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toHaveAttribute('data-spacing-size', 'xl');
      expect(spacer).toHaveAttribute('data-spacing-direction', 'horizontal');
    });

    it('combines custom spacing with horizontal direction', () => {
      const { container } = render(
        <Spacer spacing="64px" direction="horizontal" />,
      );
      const spacer = container.firstChild as HTMLElement;
      expect(spacer.style.width).toBe('64px');
      expect(spacer.style.height).toBe('1px');
    });

    it('combines className with custom styles', () => {
      const { container } = render(
        <Spacer
          className="bg-primary"
          style={{ borderRadius: '4px' }}
        />,
      );
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toHaveClass('bg-primary');
      expect(spacer.style.borderRadius).toBe('4px');
    });
  });

  // 9. EDGE CASES
  describe('Edge Cases', () => {
    it('handles missing size prop (uses default)', () => {
      const { container } = render(<Spacer />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toHaveAttribute('data-spacing-size', 'md');
    });

    it('handles missing direction prop (uses default)', () => {
      const { container } = render(<Spacer />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toHaveAttribute('data-spacing-direction', 'vertical');
    });

    it('handles all props being undefined', () => {
      const { container } = render(<Spacer />);
      const spacer = container.firstChild as HTMLElement;
      expect(spacer).toBeInTheDocument();
    });

    it('handles both direction with custom spacing', () => {
      const { container } = render(
        <Spacer spacing="100px" direction="both" />,
      );
      const spacer = container.firstChild as HTMLElement;
      expect(spacer.style.width).toBe('100px');
      expect(spacer.style.height).toBe('100px');
    });
  });

  // 10. RESPONSIVE BEHAVIOR TESTS
  describe('Responsive Behavior', () => {
    it('maintains dimensions in flex container', () => {
      const { container } = render(
        <div style={{ display: 'flex' }}>
          <Spacer size="md" />
        </div>,
      );
      const spacer = container.querySelector('.spacer') as HTMLElement;
      expect(spacer.style.flexShrink).toBe('0');
    });

    it('works correctly with different spacing units', () => {
      const testCases = ['10px', '1rem', '2em', '5%'] as const;

      testCases.forEach((spacing) => {
        const { container } = render(<Spacer spacing={spacing} />);
        const spacer = container.firstChild as HTMLElement;
        expect(spacer.style.height).toBe(spacing);
      });
    });
  });
});
