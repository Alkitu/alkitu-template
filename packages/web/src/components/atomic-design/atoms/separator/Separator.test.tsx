import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Separator } from './Separator';
import type { SeparatorProps } from './Separator.types';

expect.extend(toHaveNoViolations);

describe('Separator Atom', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Separator data-testid="separator" />);
      const separator = screen.getByTestId('separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('role', 'separator');
    });

    it('renders horizontal separator by default', () => {
      render(<Separator data-testid="separator" />);
      const separator = screen.getByTestId('separator');
      expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('renders vertical separator', () => {
      render(<Separator orientation="vertical" data-testid="separator" />);
      const separator = screen.getByTestId('separator');
      expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  // 2. ORIENTATION TESTS
  describe('Orientations', () => {
    it('applies horizontal styles correctly', () => {
      const { container } = render(<Separator orientation="horizontal" />);
      const separator = container.querySelector('.separator-atom') as HTMLElement;
      expect(separator?.style.width).toBe('100%');
      expect(separator?.style.borderTop).toContain('1px solid');
    });

    it('applies vertical styles correctly', () => {
      const { container } = render(<Separator orientation="vertical" length="40px" />);
      const separator = container.querySelector('.separator-atom') as HTMLElement;
      expect(separator?.style.height).toBe('40px');
      expect(separator?.style.borderLeft).toContain('1px solid');
    });

    it('uses 100% height for vertical separator without length', () => {
      const { container } = render(<Separator orientation="vertical" />);
      const separator = container.querySelector('.separator-atom') as HTMLElement;
      expect(separator?.style.height).toBe('100%');
    });
  });

  // 3. SIZE TESTS
  describe('Sizes', () => {
    it.each([
      ['thin', '1px'],
      ['medium', '2px'],
      ['thick', '4px'],
    ])('applies %s size correctly', (size, expectedThickness) => {
      const { container } = render(<Separator size={size as any} />);
      const separator = container.querySelector('.separator-atom') as HTMLElement;
      expect(separator?.style.borderTop).toContain(expectedThickness);
    });

    it('defaults to thin size', () => {
      const { container } = render(<Separator />);
      const separator = container.querySelector('.separator-atom') as HTMLElement;
      expect(separator?.style.borderTop).toContain('1px');
    });
  });

  // 4. VARIANT TESTS
  describe('Variants', () => {
    it.each([
      ['default', 'var(--color-border)'],
      ['muted', 'var(--color-muted)'],
      ['primary', 'var(--color-primary)'],
      ['secondary', 'var(--color-secondary)'],
    ])('applies %s variant correctly', (variant, expectedColor) => {
      const { container } = render(<Separator variant={variant as any} />);
      const separator = container.querySelector('.separator-atom') as HTMLElement;
      expect(separator?.style.borderTop).toContain(expectedColor);
    });
  });

  // 5. BORDER STYLE TESTS
  describe('Border Styles', () => {
    it.each([
      ['solid', 'solid'],
      ['dashed', 'dashed'],
      ['dotted', 'dotted'],
    ])('applies %s border style correctly', (borderStyle, expectedStyle) => {
      const { container } = render(<Separator borderStyle={borderStyle as any} />);
      const separator = container.querySelector('.separator-atom') as HTMLElement;
      expect(separator?.style.borderTop).toContain(expectedStyle);
    });
  });

  // 6. DECORATIVE SEPARATOR TESTS
  describe('Decorative Separators', () => {
    it('renders decorative separator with label', () => {
      render(<Separator decorative label="OR" />);
      expect(screen.getByText('OR')).toBeInTheDocument();
      expect(screen.getByRole('separator')).toHaveAttribute('aria-label', 'Section separator: OR');
    });

    it('renders decorative separator with dots only', () => {
      const { container } = render(<Separator decorative />);
      const separator = container.querySelector('.separator-decorative');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('aria-hidden', 'true');

      // Should have 3 dots
      const dots = container.querySelectorAll('.separator-decorative > div > div');
      expect(dots).toHaveLength(3);
    });

    it('applies variant to decorative label separator', () => {
      const { container } = render(<Separator decorative label="Test" variant="primary" />);
      const lines = container.querySelectorAll('.separator-decorative > div');
      const firstLine = lines[0] as HTMLElement;
      expect(firstLine?.style.borderTop).toContain('var(--color-primary)');
    });
  });

  // 7. PROPS TESTS
  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Separator className="custom-class" />);
      const separator = container.querySelector('.separator-atom');
      expect(separator).toHaveClass('custom-class');
    });

    it('applies custom styles', () => {
      const customStyle = { margin: '20px' };
      const { container } = render(<Separator customStyle={customStyle} />);
      const separator = container.querySelector('.separator-atom') as HTMLElement;
      expect(separator?.style.margin).toBe('20px');
    });

    it('supports data-testid', () => {
      render(<Separator data-testid="test-separator" />);
      expect(screen.getByTestId('test-separator')).toBeInTheDocument();
    });

    it('forwards additional HTML attributes', () => {
      render(<Separator data-custom="value" data-testid="separator" />);
      const separator = screen.getByTestId('separator');
      expect(separator).toHaveAttribute('data-custom', 'value');
    });
  });

  // 8. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations - horizontal', async () => {
      const { container } = render(<Separator />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - vertical', async () => {
      const { container } = render(<Separator orientation="vertical" length="40px" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - decorative with label', async () => {
      const { container } = render(<Separator decorative label="Section" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper role attribute', () => {
      render(<Separator data-testid="separator" />);
      expect(screen.getByTestId('separator')).toHaveAttribute('role', 'separator');
    });

    it('has proper aria-orientation', () => {
      render(<Separator orientation="vertical" data-testid="separator" />);
      expect(screen.getByTestId('separator')).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('has aria-hidden for decorative dots', () => {
      const { container } = render(<Separator decorative />);
      const separator = container.querySelector('.separator-decorative');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // 9. THEME INTEGRATION TESTS
  describe('Theme Integration', () => {
    it('uses CSS variables for colors', () => {
      const { container } = render(<Separator variant="primary" />);
      const separator = container.querySelector('.separator-atom') as HTMLElement;
      expect(separator?.style.borderTop).toContain('var(--color-primary)');
    });

    it('uses CSS variables for muted foreground in labels', () => {
      const { container } = render(<Separator decorative label="Test" />);
      const label = screen.getByText('Test') as HTMLElement;
      expect(label?.style.color).toBe('var(--color-muted-foreground)');
    });
  });

  // 10. EDGE CASES
  describe('Edge Cases', () => {
    it('handles numeric length value', () => {
      const { container } = render(<Separator orientation="vertical" length={100} />);
      const separator = container.querySelector('.separator-atom') as HTMLElement;
      // React automatically adds 'px' to numeric values
      expect(separator?.style.height).toBe('100px');
    });

    it('renders with all props combined', () => {
      render(
        <Separator
          orientation="horizontal"
          size="thick"
          variant="primary"
          borderStyle="dashed"
          className="custom"
          data-testid="full-separator"
        />
      );
      const separator = screen.getByTestId('full-separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveClass('custom');
      expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('handles empty label string', () => {
      const { container } = render(<Separator decorative label="" />);
      // Should render as dots-only since label is empty/falsy
      expect(container.querySelector('.separator-decorative')).toBeInTheDocument();
    });
  });
});
