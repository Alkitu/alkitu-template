import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Typography, { Heading } from './Typography';
import type {
  TypographyVariant,
  TypographySize,
  TypographyWeight,
  TypographyColor,
  TypographyAlign,
} from './Typography.types';

expect.extend(toHaveNoViolations);

describe('Typography - Atom', () => {
  describe('Basic Rendering', () => {
    it('renders correctly with children', () => {
      render(<Typography>Test content</Typography>);
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders as paragraph by default', () => {
      const { container } = render(<Typography>Test</Typography>);
      expect(container.querySelector('p')).toBeInTheDocument();
    });

    it('has displayName set', () => {
      expect(Typography.displayName).toBe('Typography');
    });

    it('has data-testid attribute', () => {
      render(<Typography>Test</Typography>);
      expect(screen.getByTestId('typography')).toBeInTheDocument();
    });
  });

  describe('Variants - All 13 Variants', () => {
    const variants: TypographyVariant[] = [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'span',
      'label',
      'caption',
      'overline',
      'lead',
      'blockquote',
    ];

    it.each(variants)('renders %s variant with correct element', (variant) => {
      const { container } = render(<Typography variant={variant}>Test</Typography>);

      // Determine expected element
      let expectedElement = variant;
      if (variant === 'caption' || variant === 'overline') {
        expectedElement = 'span';
      } else if (variant === 'lead') {
        expectedElement = 'p';
      }

      expect(container.querySelector(expectedElement)).toBeInTheDocument();
    });

    it.each(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as TypographyVariant[])(
      '%s has heading-specific classes',
      (variant) => {
        render(<Typography variant={variant}>Heading</Typography>);
        const element = screen.getByTestId('typography');
        expect(element).toHaveClass('scroll-m-20', 'tracking-tight');
      },
    );

    it('paragraph has leading-7 class', () => {
      render(<Typography variant="p">Paragraph</Typography>);
      const element = screen.getByTestId('typography');
      expect(element).toHaveClass('leading-7');
    });

    it('label has label-specific classes', () => {
      render(<Typography variant="label">Label</Typography>);
      const element = screen.getByTestId('typography');
      expect(element).toHaveClass(
        'leading-none',
        'peer-disabled:cursor-not-allowed',
        'peer-disabled:opacity-70',
      );
    });

    it('caption has opacity-75 class', () => {
      render(<Typography variant="caption">Caption</Typography>);
      const element = screen.getByTestId('typography');
      expect(element).toHaveClass('opacity-75');
    });

    it('overline has uppercase and tracking-wide classes', () => {
      render(<Typography variant="overline">Overline</Typography>);
      const element = screen.getByTestId('typography');
      expect(element).toHaveClass('uppercase', 'tracking-wide', 'opacity-75');
    });

    it('blockquote has border and padding classes', () => {
      render(<Typography variant="blockquote">Quote</Typography>);
      const element = screen.getByTestId('typography');
      expect(element).toHaveClass('border-l-2', 'border-muted', 'pl-6', 'italic');
    });
  });

  describe('Sizes - All 9 Sizes', () => {
    const sizes: TypographySize[] = [
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
    ];

    it.each(sizes)('renders %s size with correct classes', (size) => {
      render(<Typography size={size}>Test</Typography>);
      const element = screen.getByTestId('typography');

      const sizeClassMap: Record<TypographySize, string> = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
      };

      expect(element).toHaveClass(sizeClassMap[size]);
    });

    it('uses variant default size when size not specified', () => {
      render(<Typography variant="h1">Heading</Typography>);
      const element = screen.getByTestId('typography');
      expect(element).toHaveClass('text-4xl'); // h1 default
    });

    it('size prop overrides variant default', () => {
      render(
        <Typography variant="h1" size="sm">
          Small Heading
        </Typography>,
      );
      const element = screen.getByTestId('typography');
      expect(element).toHaveClass('text-sm');
      expect(element).not.toHaveClass('text-4xl');
    });
  });

  describe('Weights - All 6 Weights', () => {
    const weights: TypographyWeight[] = [
      'light',
      'normal',
      'medium',
      'semibold',
      'bold',
      'extrabold',
    ];

    it.each(weights)('renders %s weight with correct classes', (weight) => {
      render(<Typography weight={weight}>Test</Typography>);
      const element = screen.getByTestId('typography');

      const weightClassMap: Record<TypographyWeight, string> = {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
      };

      expect(element).toHaveClass(weightClassMap[weight]);
    });

    it('uses variant default weight when weight not specified', () => {
      render(<Typography variant="h1">Heading</Typography>);
      const element = screen.getByTestId('typography');
      expect(element).toHaveClass('font-extrabold'); // h1 default
    });

    it('weight prop overrides variant default', () => {
      render(
        <Typography variant="h1" weight="light">
          Light Heading
        </Typography>,
      );
      const element = screen.getByTestId('typography');
      expect(element).toHaveClass('font-light');
      expect(element).not.toHaveClass('font-extrabold');
    });
  });

  describe('Colors - All 7 Colors', () => {
    const colors: TypographyColor[] = [
      'foreground',
      'muted',
      'accent',
      'primary',
      'secondary',
      'destructive',
      'inherit',
    ];

    it.each(colors)('renders %s color with correct classes', (color) => {
      render(<Typography color={color}>Test</Typography>);
      const element = screen.getByTestId('typography');

      const colorClassMap: Record<TypographyColor, string | null> = {
        foreground: 'text-foreground',
        muted: 'text-muted-foreground',
        accent: 'text-accent-foreground',
        primary: 'text-primary',
        secondary: 'text-secondary-foreground',
        destructive: 'text-destructive',
        inherit: null,
      };

      const expectedClass = colorClassMap[color];
      if (expectedClass) {
        expect(element).toHaveClass(expectedClass);
      } else {
        // inherit should not add a color class
        expect(element.className).not.toMatch(/text-foreground|text-primary/);
      }
    });

    it('uses inherit color by default', () => {
      render(<Typography>Test</Typography>);
      const element = screen.getByTestId('typography');
      // Should not have specific color classes by default
      expect(element).not.toHaveClass('text-foreground');
    });
  });

  describe('Alignment - All 4 Alignments', () => {
    const alignments: TypographyAlign[] = ['left', 'center', 'right', 'justify'];

    it.each(alignments)('renders %s alignment with correct classes', (align) => {
      render(<Typography align={align}>Test</Typography>);
      const element = screen.getByTestId('typography');

      const alignClassMap: Record<TypographyAlign, string> = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
      };

      expect(element).toHaveClass(alignClassMap[align]);
    });

    it('uses left alignment by default', () => {
      render(<Typography>Test</Typography>);
      const element = screen.getByTestId('typography');
      expect(element).toHaveClass('text-left');
    });
  });

  describe('Truncate', () => {
    it('applies truncate class when truncate=true', () => {
      render(<Typography truncate>Long text that should truncate</Typography>);
      const element = screen.getByTestId('typography');
      expect(element).toHaveClass('truncate');
    });

    it('does not apply truncate class by default', () => {
      render(<Typography>Normal text</Typography>);
      const element = screen.getByTestId('typography');
      expect(element).not.toHaveClass('truncate');
    });
  });

  describe('Custom HTML Element (as prop)', () => {
    it('renders custom element when as prop is provided', () => {
      const { container } = render(
        <Typography variant="p" as="div">
          Custom div
        </Typography>,
      );
      expect(container.querySelector('div')).toBeInTheDocument();
      expect(container.querySelector('p')).not.toBeInTheDocument();
    });

    it('renders paragraph as span', () => {
      const { container } = render(
        <Typography variant="p" as="span">
          Span text
        </Typography>,
      );
      expect(container.querySelector('span')).toBeInTheDocument();
    });

    it('renders heading as div', () => {
      const { container } = render(
        <Typography variant="h1" as="div">
          Div heading
        </Typography>,
      );
      expect(container.querySelector('div')).toBeInTheDocument();
    });
  });

  describe('Alianza Theme Integration', () => {
    it('applies Alianza theme CSS variables when useAlianzaTheme=true', () => {
      render(
        <Typography variant="h1" useAlianzaTheme>
          Themed Heading
        </Typography>,
      );
      const element = screen.getByTestId('typography');

      expect(element.style.fontFamily).toBe('var(--typography-h1-font-family)');
      expect(element.style.fontSize).toBe('var(--typography-h1-font-size)');
      expect(element.style.fontWeight).toBe('var(--typography-h1-font-weight)');
      expect(element.style.lineHeight).toBe('var(--typography-h1-line-height)');
      expect(element.style.letterSpacing).toBe(
        'var(--typography-h1-letter-spacing)',
      );
    });

    it('works with all heading levels', () => {
      const levels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as TypographyVariant[];

      levels.forEach((variant) => {
        const { container } = render(
          <Typography variant={variant} useAlianzaTheme>
            Test
          </Typography>,
        );
        const element = container.querySelector('[data-testid="typography"]');
        const level = variant.charAt(1);

        expect(element?.style.fontFamily).toBe(
          `var(--typography-h${level}-font-family)`,
        );
      });
    });

    it('does not apply Alianza theme by default', () => {
      render(<Typography variant="h1">Normal Heading</Typography>);
      const element = screen.getByTestId('typography');

      expect(element.style.fontFamily).toBe('');
    });

    it('does not apply Alianza theme to non-heading variants', () => {
      render(
        <Typography variant="p" useAlianzaTheme>
          Paragraph
        </Typography>,
      );
      const element = screen.getByTestId('typography');

      expect(element.style.fontFamily).toBe('');
    });
  });

  describe('Theme Overrides', () => {
    it('applies themeOverride styles', () => {
      const themeOverride = {
        '--primary': '#ff0000',
        color: 'blue',
      };
      render(<Typography themeOverride={themeOverride}>Themed</Typography>);
      const element = screen.getByTestId('typography');

      expect(element.style.getPropertyValue('--primary')).toBe('#ff0000');
      expect(element.style.getPropertyValue('--color')).toBe('blue');
    });

    it('handles custom properties without -- prefix', () => {
      const themeOverride = {
        customProperty: 'value',
      };
      render(<Typography themeOverride={themeOverride}>Test</Typography>);
      const element = screen.getByTestId('typography');

      expect(element.style.getPropertyValue('--customProperty')).toBe('value');
    });

    it('useAlianzaTheme and themeOverride work independently', () => {
      // Test 1: themeOverride works without useAlianzaTheme
      const { rerender } = render(
        <Typography variant="h1" themeOverride={{ fontSize: '100px' }}>
          Override
        </Typography>,
      );
      let element = screen.getByTestId('typography');
      expect(element.style.getPropertyValue('--fontSize')).toBe('100px');

      // Test 2: useAlianzaTheme works without themeOverride
      rerender(
        <Typography variant="h1" useAlianzaTheme>
          Alianza
        </Typography>,
      );
      element = screen.getByTestId('typography');
      expect(element.style.fontSize).toBe('var(--typography-h1-font-size)');
    });
  });

  describe('Backward Compatibility - Heading Component', () => {
    it('renders Heading component', () => {
      render(<Heading>Test Heading</Heading>);
      expect(screen.getByText('Test Heading')).toBeInTheDocument();
    });

    it('has displayName set', () => {
      expect(Heading.displayName).toBe('Heading');
    });

    it('renders h1 by default', () => {
      const { container } = render(<Heading>Default</Heading>);
      expect(container.querySelector('h1')).toBeInTheDocument();
    });

    it.each([1, 2, 3, 4, 5, 6] as const)(
      'renders h%i when level=%i',
      (level) => {
        const { container } = render(<Heading level={level}>Test</Heading>);
        expect(container.querySelector(`h${level}`)).toBeInTheDocument();
      },
    );

    it('uses Alianza theme by default', () => {
      render(<Heading level={1}>Themed</Heading>);
      const element = screen.getByTestId('typography');

      expect(element.style.fontFamily).toBe('var(--typography-h1-font-family)');
    });

    it('can disable Alianza theme', () => {
      render(
        <Heading level={1} useAlianzaTheme={false}>
          Not Themed
        </Heading>,
      );
      const element = screen.getByTestId('typography');

      expect(element.style.fontFamily).toBe('');
    });

    it('accepts className prop', () => {
      render(
        <Heading level={1} className="custom-class">
          Custom
        </Heading>,
      );
      const element = screen.getByTestId('typography');
      expect(element).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Heading ref={ref}>Test</Heading>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('heading hierarchy is semantically correct', () => {
      const { container } = render(
        <div>
          <Typography variant="h1">Main Title</Typography>
          <Typography variant="h2">Section</Typography>
          <Typography variant="h3">Subsection</Typography>
        </div>,
      );

      expect(container.querySelector('h1')).toBeInTheDocument();
      expect(container.querySelector('h2')).toBeInTheDocument();
      expect(container.querySelector('h3')).toBeInTheDocument();
    });

    it('label has proper attributes for form association', () => {
      render(
        <Typography variant="label" htmlFor="input-id">
          Label Text
        </Typography>,
      );
      const label = screen.getByText('Label Text');
      expect(label).toHaveAttribute('for', 'input-id');
    });

    it('has no accessibility violations - heading', async () => {
      const { container } = render(
        <Typography variant="h1">Accessible Heading</Typography>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - paragraph', async () => {
      const { container } = render(
        <Typography variant="p">Accessible paragraph text</Typography>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - blockquote', async () => {
      const { container } = render(
        <Typography variant="blockquote">Accessible quote</Typography>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - label', async () => {
      const { container } = render(
        <div>
          <Typography variant="label" htmlFor="test-input">
            Label
          </Typography>
          <input id="test-input" />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Custom Props and Edge Cases', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Typography ref={ref}>Test</Typography>);
      expect(ref).toHaveBeenCalled();
    });

    it('accepts className prop', () => {
      render(<Typography className="custom-class">Test</Typography>);
      const element = screen.getByTestId('typography');
      expect(element).toHaveClass('custom-class');
    });

    it('merges custom className with variant classes', () => {
      render(
        <Typography className="custom-class" variant="h1">
          Test
        </Typography>,
      );
      const element = screen.getByTestId('typography');
      expect(element).toHaveClass('custom-class', 'scroll-m-20', 'tracking-tight');
    });

    it('spreads additional HTML attributes', () => {
      render(
        <Typography id="test-id" title="Test Title">
          Test
        </Typography>,
      );
      const element = screen.getByTestId('typography');
      expect(element).toHaveAttribute('id', 'test-id');
      expect(element).toHaveAttribute('title', 'Test Title');
    });

    it('accepts ARIA attributes', () => {
      render(
        <Typography aria-label="Custom Label" aria-describedby="desc-id">
          Test
        </Typography>,
      );
      const element = screen.getByTestId('typography');
      expect(element).toHaveAttribute('aria-label', 'Custom Label');
      expect(element).toHaveAttribute('aria-describedby', 'desc-id');
    });

    it('renders with complex children', () => {
      render(
        <Typography variant="p">
          <span>Complex</span> <strong>Content</strong> with{' '}
          <em>nested elements</em>
        </Typography>,
      );
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('nested elements')).toBeInTheDocument();
    });

    it('handles empty children gracefully', () => {
      const { container } = render(<Typography>{''}</Typography>);
      const element = container.querySelector('p');
      expect(element).toBeInTheDocument();
      expect(element?.textContent).toBe('');
    });
  });

  describe('Visual Regression Prevention', () => {
    it('applies transition classes', () => {
      render(<Typography>Test</Typography>);
      const element = screen.getByTestId('typography');
      expect(element).toHaveClass('transition-colors');
    });

    it('maintains consistent heading styles', () => {
      const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as TypographyVariant[];

      headings.forEach((variant) => {
        const { container } = render(<Typography variant={variant}>Test</Typography>);
        const element = container.querySelector('[data-testid="typography"]');
        expect(element).toHaveClass('scroll-m-20', 'tracking-tight');
      });
    });

    it('maintains consistent size progression', () => {
      const sizeOrder: TypographySize[] = [
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
      ];
      const expectedClasses = [
        'text-xs',
        'text-sm',
        'text-base',
        'text-lg',
        'text-xl',
        'text-2xl',
        'text-3xl',
        'text-4xl',
        'text-5xl',
      ];

      sizeOrder.forEach((size, index) => {
        const { container } = render(<Typography size={size}>Test</Typography>);
        const element = container.querySelector('[data-testid="typography"]');
        expect(element).toHaveClass(expectedClasses[index]);
      });
    });
  });

  describe('Combined Props', () => {
    it('combines variant, size, weight, color, and align', () => {
      render(
        <Typography
          variant="h2"
          size="xl"
          weight="light"
          color="primary"
          align="center"
        >
          Combined
        </Typography>,
      );
      const element = screen.getByTestId('typography');

      expect(element).toHaveClass(
        'text-xl',
        'font-light',
        'text-primary',
        'text-center',
        'scroll-m-20',
        'tracking-tight',
      );
    });

    it('combines truncate with other props', () => {
      render(
        <Typography
          variant="p"
          size="lg"
          color="muted"
          truncate
          className="custom"
        >
          Test
        </Typography>,
      );
      const element = screen.getByTestId('typography');

      expect(element).toHaveClass(
        'text-lg',
        'text-muted-foreground',
        'truncate',
        'custom',
        'leading-7',
      );
    });

    it('combines useAlianzaTheme with custom className', () => {
      render(
        <Typography variant="h1" useAlianzaTheme className="custom-heading">
          Combined Theme
        </Typography>,
      );
      const element = screen.getByTestId('typography');

      expect(element).toHaveClass('custom-heading');
      expect(element.style.fontFamily).toBe('var(--typography-h1-font-family)');
    });
  });
});
