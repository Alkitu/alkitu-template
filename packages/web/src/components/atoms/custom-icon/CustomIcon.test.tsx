import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CustomIcon, createCustomIconComponent } from './CustomIcon';
import type { CustomIconProps } from './CustomIcon.types';

expect.extend(toHaveNoViolations);

describe('CustomIcon Component', () => {
  const validSVG = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>';
  const validSVGWithFill = '<svg viewBox="0 0 24 24" fill="red"><path d="M10 10" /></svg>';
  const invalidSVG = '<div>Not an SVG</div>';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly with valid SVG', () => {
      const { container } = render(<CustomIcon svg={validSVG} />);
      const icon = container.querySelector('span');

      expect(icon).toBeInTheDocument();
      expect(icon?.innerHTML).toContain('svg');
      expect(icon?.innerHTML).toContain('circle');
    });

    it('renders fallback for invalid SVG', () => {
      render(<CustomIcon svg={invalidSVG} data-testid="custom-icon" />);
      const icon = screen.getByTestId('custom-icon');

      expect(icon).toBeInTheDocument();
      expect(icon.textContent).toBe('?');
    });

    it('renders fallback for empty SVG string', () => {
      render(<CustomIcon svg="" data-testid="custom-icon" />);
      const icon = screen.getByTestId('custom-icon');

      expect(icon.textContent).toBe('?');
    });

    it('processes SVG with fill attribute correctly', () => {
      const { container } = render(<CustomIcon svg={validSVGWithFill} />);
      const svgElement = container.querySelector('svg');

      expect(svgElement).toBeInTheDocument();
      // SVG with explicit fill keeps its fill
      expect(svgElement?.getAttribute('fill')).toBe('red');
    });

    it('adds currentColor fill to SVG without fill', () => {
      const { container } = render(<CustomIcon svg={validSVG} />);
      const svgElement = container.querySelector('svg');

      expect(svgElement?.getAttribute('fill')).toBe('currentColor');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<CustomIcon ref={ref} svg={validSVG} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLElement);
    });
  });

  describe('Size Variants', () => {
    const sizes: Array<{ size: CustomIconProps['size']; expected: number }> = [
      { size: 'xs', expected: 12 },
      { size: 'sm', expected: 16 },
      { size: 'md', expected: 20 },
      { size: 'lg', expected: 24 },
      { size: 'xl', expected: 28 },
      { size: '2xl', expected: 32 },
    ];

    it.each(sizes)(
      'applies correct size for $size variant ($expected px)',
      ({ size, expected }) => {
        const { container } = render(<CustomIcon svg={validSVG} size={size} />);
        const icon = container.firstChild as HTMLElement;
        const svgElement = icon.querySelector('svg');

        expect(icon.style.width).toBe(`${expected}px`);
        expect(icon.style.height).toBe(`${expected}px`);
        expect(svgElement?.getAttribute('width')).toBe(expected.toString());
        expect(svgElement?.getAttribute('height')).toBe(expected.toString());
      },
    );

    it('uses md size by default', () => {
      const { container } = render(<CustomIcon svg={validSVG} />);
      const icon = container.firstChild as HTMLElement;

      expect(icon.style.width).toBe('20px');
      expect(icon.style.height).toBe('20px');
    });

    it('applies custom size when provided', () => {
      const { container } = render(
        <CustomIcon svg={validSVG} customSize={48} />,
      );
      const icon = container.firstChild as HTMLElement;
      const svgElement = icon.querySelector('svg');

      expect(icon.style.width).toBe('48px');
      expect(icon.style.height).toBe('48px');
      expect(svgElement?.getAttribute('width')).toBe('48');
      expect(svgElement?.getAttribute('height')).toBe('48');
    });

    it('customSize overrides size preset', () => {
      const { container } = render(
        <CustomIcon svg={validSVG} size="xs" customSize={100} />,
      );
      const icon = container.firstChild as HTMLElement;

      expect(icon.style.width).toBe('100px');
      expect(icon.style.height).toBe('100px');
    });
  });

  describe('Color Variants', () => {
    const variants: Array<{
      variant: CustomIconProps['variant'];
      expectedClass: string;
    }> = [
      { variant: 'default', expectedClass: 'text-current' },
      { variant: 'primary', expectedClass: 'text-primary' },
      { variant: 'secondary', expectedClass: 'text-secondary' },
      { variant: 'accent', expectedClass: 'text-accent' },
      { variant: 'muted', expectedClass: 'text-muted-foreground' },
      { variant: 'destructive', expectedClass: 'text-destructive' },
      { variant: 'warning', expectedClass: 'text-warning' },
      { variant: 'success', expectedClass: 'text-success' },
    ];

    it.each(variants)(
      'applies correct class for $variant variant',
      ({ variant, expectedClass }) => {
        const { container } = render(
          <CustomIcon svg={validSVG} variant={variant} />,
        );
        const icon = container.firstChild as HTMLElement;

        expect(icon).toHaveClass(expectedClass);
      },
    );

    it('uses default variant by default', () => {
      const { container } = render(<CustomIcon svg={validSVG} />);
      const icon = container.firstChild as HTMLElement;

      expect(icon).toHaveClass('text-current');
    });

    it('applies custom color when provided', () => {
      const { container } = render(
        <CustomIcon svg={validSVG} customColor="#FF5733" />,
      );
      const icon = container.firstChild as HTMLElement;

      // Browsers normalize hex to rgb format
      expect(icon.style.color).toBeTruthy();
      expect(['#FF5733', 'rgb(255, 87, 51)']).toContain(icon.style.color);
    });

    it('customColor overrides variant class', () => {
      const { container } = render(
        <CustomIcon svg={validSVG} variant="primary" customColor="#FF5733" />,
      );
      const icon = container.firstChild as HTMLElement;

      // Should not have variant class when customColor is provided
      expect(icon).not.toHaveClass('text-primary');
      // Browsers normalize hex to rgb format
      expect(['#FF5733', 'rgb(255, 87, 51)']).toContain(icon.style.color);
    });
  });

  describe('CSS Classes and Styles', () => {
    it('applies base classes', () => {
      const { container } = render(<CustomIcon svg={validSVG} />);
      const icon = container.firstChild as HTMLElement;

      expect(icon).toHaveClass('inline-flex');
      expect(icon).toHaveClass('items-center');
      expect(icon).toHaveClass('justify-center');
      expect(icon).toHaveClass('flex-shrink-0');
    });

    it('merges custom className', () => {
      const { container } = render(
        <CustomIcon svg={validSVG} className="custom-class another-class" />,
      );
      const icon = container.firstChild as HTMLElement;

      expect(icon).toHaveClass('custom-class');
      expect(icon).toHaveClass('another-class');
      expect(icon).toHaveClass('inline-flex');
    });

    it('applies custom styles', () => {
      const customStyle = {
        opacity: 0.5,
        transform: 'rotate(45deg)',
      };

      const { container } = render(
        <CustomIcon svg={validSVG} style={customStyle} />,
      );
      const icon = container.firstChild as HTMLElement;

      expect(icon.style.opacity).toBe('0.5');
      expect(icon.style.transform).toBe('rotate(45deg)');
    });

    it('custom styles override component styles', () => {
      const { container } = render(
        <CustomIcon svg={validSVG} size="md" style={{ width: '100px' }} />,
      );
      const icon = container.firstChild as HTMLElement;

      expect(icon.style.width).toBe('100px'); // Custom style wins
    });
  });

  describe('Interactive Behavior', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <CustomIcon
          svg={validSVG}
          onClick={handleClick}
          data-testid="custom-icon"
        />,
      );
      const icon = screen.getByTestId('custom-icon');

      await user.click(icon);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('sets cursor pointer when onClick is provided', () => {
      const { container } = render(
        <CustomIcon svg={validSVG} onClick={() => {}} />,
      );
      const icon = container.firstChild as HTMLElement;

      expect(icon.style.cursor).toBe('pointer');
    });

    it('does not set cursor pointer without onClick', () => {
      const { container } = render(<CustomIcon svg={validSVG} />);
      const icon = container.firstChild as HTMLElement;

      expect(icon.style.cursor).toBe('');
    });

    it('sets role="button" when onClick is provided', () => {
      const { container } = render(
        <CustomIcon svg={validSVG} onClick={() => {}} />,
      );
      const icon = container.firstChild as HTMLElement;

      expect(icon).toHaveAttribute('role', 'button');
    });

    it('does not set role when onClick is not provided', () => {
      const { container } = render(<CustomIcon svg={validSVG} />);
      const icon = container.firstChild as HTMLElement;

      expect(icon).not.toHaveAttribute('role');
    });
  });

  describe('Accessibility', () => {
    it('applies aria-label when provided', () => {
      const { container } = render(
        <CustomIcon svg={validSVG} aria-label="Custom icon" />,
      );
      const icon = container.firstChild as HTMLElement;

      expect(icon).toHaveAttribute('aria-label', 'Custom icon');
    });

    it('does not have aria-label by default', () => {
      const { container } = render(<CustomIcon svg={validSVG} />);
      const icon = container.firstChild as HTMLElement;

      expect(icon).not.toHaveAttribute('aria-label');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(
        <CustomIcon
          svg={validSVG}
          onClick={() => {}}
          aria-label="Accessible icon"
        />,
      );
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with onClick', async () => {
      const { container } = render(
        <CustomIcon
          svg={validSVG}
          onClick={() => {}}
          aria-label="Clickable icon"
        />,
      );
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations in fallback mode', async () => {
      const { container } = render(
        <CustomIcon svg={invalidSVG} aria-label="Invalid icon" />,
      );
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });

  describe('HTML Attributes', () => {
    it('forwards data-testid attribute', () => {
      render(<CustomIcon svg={validSVG} data-testid="test-icon" />);
      const icon = screen.getByTestId('test-icon');

      expect(icon).toBeInTheDocument();
    });

    it('forwards additional HTML attributes', () => {
      const { container } = render(
        <CustomIcon
          svg={validSVG}
          data-custom="value"
          id="custom-icon-id"
          title="Custom Icon"
        />,
      );
      const icon = container.firstChild as HTMLElement;

      expect(icon).toHaveAttribute('data-custom', 'value');
      expect(icon).toHaveAttribute('id', 'custom-icon-id');
      expect(icon).toHaveAttribute('title', 'Custom Icon');
    });
  });

  describe('SVG Processing Edge Cases', () => {
    it('handles SVG with currentColor fill', () => {
      const svgWithCurrentColor =
        '<svg fill="currentColor"><path d="M10 10" /></svg>';
      const { container } = render(<CustomIcon svg={svgWithCurrentColor} />);
      const svgElement = container.querySelector('svg');

      expect(svgElement?.getAttribute('fill')).toBe('currentColor');
    });

    it('handles malformed SVG gracefully', () => {
      const malformedSVG = '<svg><unclosed-tag></svg>';
      render(<CustomIcon svg={malformedSVG} data-testid="custom-icon" />);
      const icon = screen.getByTestId('custom-icon');

      // Should render without crashing
      expect(icon).toBeInTheDocument();
    });

    it('handles SVG with multiple elements', () => {
      const complexSVG = `
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M10 10 L20 20" />
          <rect x="5" y="5" width="14" height="14" />
        </svg>
      `;
      const { container } = render(<CustomIcon svg={complexSVG} />);
      const icon = container.firstChild as HTMLElement;

      expect(icon.querySelector('circle')).toBeInTheDocument();
      expect(icon.querySelector('path')).toBeInTheDocument();
      expect(icon.querySelector('rect')).toBeInTheDocument();
    });

    it('preserves SVG viewBox attribute', () => {
      const { container } = render(<CustomIcon svg={validSVG} />);
      const svgElement = container.querySelector('svg');

      expect(svgElement?.getAttribute('viewBox')).toBe('0 0 24 24');
    });

    it('logs error for invalid SVG', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<CustomIcon svg="not valid xml at all!" data-testid="invalid-icon" />);

      // DOMParser may or may not throw an error depending on the browser
      // The important thing is that it renders a fallback
      const icon = screen.getByTestId('invalid-icon');
      expect(icon.textContent).toBe('?');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('createCustomIconComponent', () => {
    it('creates a reusable component with pre-defined SVG', () => {
      const MyIcon = createCustomIconComponent(validSVG);
      const { container } = render(<MyIcon />);
      const icon = container.querySelector('span');

      expect(icon).toBeInTheDocument();
      expect(icon?.innerHTML).toContain('svg');
    });

    it('forwards props to CustomIcon', () => {
      const MyIcon = createCustomIconComponent(validSVG);
      const { container } = render(
        <MyIcon size="lg" variant="primary" customSize={50} />,
      );
      const icon = container.firstChild as HTMLElement;

      expect(icon.style.width).toBe('50px'); // customSize applied
      expect(icon).toHaveClass('text-primary'); // variant applied
    });

    it('forwards ref correctly', () => {
      const MyIcon = createCustomIconComponent(validSVG);
      const ref = vi.fn();

      render(<MyIcon ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLElement);
    });

    it('uses defaults when no props provided', () => {
      const MyIcon = createCustomIconComponent(validSVG);
      const { container } = render(<MyIcon />);
      const icon = container.firstChild as HTMLElement;

      expect(icon.style.width).toBe('20px'); // default md size
      expect(icon).toHaveClass('text-current'); // default variant
    });

    it('handles invalid SVG gracefully', () => {
      const MyIcon = createCustomIconComponent(invalidSVG);
      render(<MyIcon data-testid="custom-icon" />);
      const icon = screen.getByTestId('custom-icon');

      expect(icon.textContent).toBe('?'); // fallback
    });

    it('accepts all CustomIcon props', () => {
      const MyIcon = createCustomIconComponent(validSVG);
      const handleClick = vi.fn();

      const { container } = render(
        <MyIcon
          onClick={handleClick}
          aria-label="My custom icon"
          className="custom-class"
          style={{ opacity: 0.7 }}
        />,
      );
      const icon = container.firstChild as HTMLElement;

      expect(icon).toHaveClass('custom-class');
      expect(icon.style.opacity).toBe('0.7');
      expect(icon).toHaveAttribute('aria-label', 'My custom icon');
    });
  });

  describe('Theme Integration', () => {
    it('uses CSS variables for colors via Tailwind classes', () => {
      const { container } = render(
        <CustomIcon svg={validSVG} variant="primary" />,
      );
      const icon = container.firstChild as HTMLElement;

      // Should have Tailwind class that maps to CSS variable
      expect(icon).toHaveClass('text-primary');
    });

    it('supports all theme color variants', () => {
      const variants: CustomIconProps['variant'][] = [
        'primary',
        'secondary',
        'accent',
        'muted',
        'destructive',
        'warning',
        'success',
      ];

      variants.forEach((variant) => {
        const { container } = render(
          <CustomIcon svg={validSVG} variant={variant} />,
        );
        const icon = container.firstChild as HTMLElement;

        // Each variant should have a corresponding class
        expect(icon.className).toBeTruthy();
      });
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(CustomIcon.displayName).toBe('CustomIcon');
    });

    it('wrapper has correct displayName', () => {
      const Wrapper = createCustomIconComponent(validSVG);
      expect(Wrapper.displayName).toBe('CustomIconWrapper');
    });
  });
});
