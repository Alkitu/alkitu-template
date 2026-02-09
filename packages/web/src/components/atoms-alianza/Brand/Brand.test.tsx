import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Brand } from './Brand';

expect.extend(toHaveNoViolations);

describe('Brand Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Brand />);
      expect(screen.getByText('Alkitu')).toBeInTheDocument();
    });

    it('renders with custom brand name', () => {
      render(<Brand brandName="Custom Brand" />);
      expect(screen.getByText('Custom Brand')).toBeInTheDocument();
    });

    it('renders tagline when showTagline is true', () => {
      render(<Brand showTagline />);
      expect(screen.getByText('Design System')).toBeInTheDocument();
    });

    it('renders custom tagline', () => {
      render(<Brand showTagline tagline="Custom Tagline" />);
      expect(screen.getByText('Custom Tagline')).toBeInTheDocument();
    });

    it('does not render tagline by default', () => {
      render(<Brand tagline="Hidden Tagline" />);
      expect(screen.queryByText('Hidden Tagline')).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it.each([
      ['horizontal', 'flex-row items-center'],
      ['vertical', 'flex-col items-center'],
      ['icon-only', 'flex-row items-center'],
      ['text-only', 'flex-row items-center'],
      ['stacked', 'flex-col items-start'],
      ['compact', 'flex-row items-center'],
    ])('applies correct classes for %s variant', (variant, expectedClass) => {
      const { container } = render(
        <Brand variant={variant as any} />
      );
      const brandElement = container.firstChild as HTMLElement;

      expect(brandElement).toHaveClass(expectedClass);
    });

    it('uses horizontal variant by default', () => {
      const { container } = render(<Brand />);
      const brandElement = container.firstChild as HTMLElement;

      expect(brandElement).toHaveClass('flex-row', 'items-center');
    });

    it('renders only icon in icon-only variant', () => {
      render(<Brand variant="icon-only" />);
      expect(screen.queryByText('Alkitu')).not.toBeInTheDocument();
    });

    it('renders only text in text-only variant', () => {
      const { container } = render(<Brand variant="text-only" />);
      const icon = container.querySelector('svg');

      expect(screen.getByText('Alkitu')).toBeInTheDocument();
      expect(icon).toBeNull();
    });
  });

  describe('Sizes', () => {
    it.each([
      ['xs', 'gap-1.5'],
      ['sm', 'gap-2'],
      ['md', 'gap-2.5'],
      ['lg', 'gap-3'],
      ['xl', 'gap-4'],
    ])('applies correct gap for %s size', (size, expectedGap) => {
      const { container } = render(<Brand size={size as any} />);
      const brandElement = container.firstChild as HTMLElement;

      expect(brandElement).toHaveClass(expectedGap);
    });

    it('uses md size by default', () => {
      const { container } = render(<Brand />);
      const brandElement = container.firstChild as HTMLElement;

      expect(brandElement).toHaveClass('gap-2.5');
    });

    it('applies correct text size classes', () => {
      render(<Brand size="lg" />);
      const text = screen.getByText('Alkitu');

      expect(text).toHaveClass('text-xl');
    });
  });

  describe('Clickability', () => {
    it('renders as button when clickable is true', () => {
      render(<Brand clickable />);
      const button = screen.getByRole('button');

      expect(button).toBeInTheDocument();
    });

    it('renders as button when onClick is provided with clickable', () => {
      render(<Brand onClick={() => {}} clickable />);
      const button = screen.getByRole('button');

      expect(button).toBeInTheDocument();
    });

    it('renders as div when not clickable', () => {
      const { container } = render(<Brand />);
      const element = container.firstChild as HTMLElement;

      expect(element.tagName).toBe('DIV');
    });

    it('calls onClick when clicked and clickable is true', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Brand onClick={handleClick} clickable />);
      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when clickable is false', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Brand onClick={handleClick} />);
      const element = screen.getByText('Alkitu').parentElement?.parentElement;
      if (element) {
        await user.click(element);
      }

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies hover styles when clickable', () => {
      render(<Brand clickable />);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('cursor-pointer');
    });
  });

  describe('Logo Customization', () => {
    it('renders custom logo URL when provided', () => {
      const logoUrl = 'https://example.com/logo.png';
      render(<Brand logoUrl={logoUrl} />);

      const img = screen.getByAltText('Alkitu logo');
      expect(img).toHaveAttribute('src', logoUrl);
    });

    it('renders default icon when no logo URL', () => {
      const { container } = render(<Brand />);
      const iconContainer = container.querySelector('.bg-primary');

      expect(iconContainer).toBeInTheDocument();
    });

    it('does not render logo in text-only variant', () => {
      const { container } = render(<Brand variant="text-only" logoUrl="https://example.com/logo.png" />);
      const img = container.querySelector('img');

      expect(img).not.toBeInTheDocument();
    });
  });

  describe('Theme Customization', () => {
    it('accepts custom className', () => {
      const { container } = render(<Brand className="custom-class" />);
      const element = container.firstChild as HTMLElement;

      expect(element).toHaveClass('custom-class');
    });

    it('applies theme override styles', () => {
      const themeOverride = { '--custom-color': '#ff0000' };
      const { container } = render(<Brand themeOverride={themeOverride} />);
      const element = container.firstChild as HTMLElement;

      expect(element).toHaveStyle({ '--custom-color': '#ff0000' });
    });

    it('uses system colors by default', () => {
      const { container } = render(<Brand />);
      const icon = container.querySelector('.bg-primary');

      expect(icon).toBeInTheDocument();
    });

    it('can use custom icon background color', () => {
      const { container } = render(<Brand iconBackgroundColor="#ff0000" useSystemColors={false} />);
      const iconContainer = container.querySelector('[style*="background"]');

      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Custom Spacing', () => {
    it('applies custom gap between icon and text', () => {
      const { container } = render(<Brand gap="20px" />);
      const element = container.firstChild as HTMLElement;

      expect(element).toHaveStyle({ gap: '20px' });
    });

    it('applies custom text gap', () => {
      render(<Brand showTagline textGap="10px" />);
      const tagline = screen.getByText('Design System');

      expect(tagline).toHaveStyle({ marginTop: '10px' });
    });

    it('applies custom gap as number', () => {
      const { container } = render(<Brand gap={30} />);
      const element = container.firstChild as HTMLElement;

      expect(element).toHaveStyle({ gap: '30px' });
    });
  });

  describe('Icon Customization', () => {
    it('applies icon size scale', () => {
      const { container } = render(<Brand iconSizeScale={150} />);
      const iconContainer = container.querySelector('.bg-primary');

      expect(iconContainer).toHaveStyle({ transform: 'scale(1.5)' });
    });

    it('uses default scale when not specified', () => {
      const { container } = render(<Brand />);
      const iconContainer = container.querySelector('.bg-primary');

      expect(iconContainer).not.toHaveStyle({ transform: expect.anything() });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Brand />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with clickable', async () => {
      const { container } = render(<Brand clickable />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with tagline', async () => {
      const { container } = render(<Brand showTagline />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('button has proper type attribute', () => {
      render(<Brand clickable />);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Complex Scenarios', () => {
    it('renders with all features combined', () => {
      const handleClick = vi.fn();

      render(
        <Brand
          variant="vertical"
          size="lg"
          brandName="Custom"
          showTagline
          tagline="Custom Tagline"
          onClick={handleClick}
          clickable
          className="custom-class"
        />
      );

      expect(screen.getByText('Custom')).toBeInTheDocument();
      expect(screen.getByText('Custom Tagline')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles vertical stacked layout with tagline', () => {
      const { container } = render(
        <Brand variant="stacked" showTagline size="xl" />
      );
      const element = container.firstChild as HTMLElement;

      expect(element).toHaveClass('flex-col', 'items-start');
      expect(screen.getByText('Alkitu')).toBeInTheDocument();
      expect(screen.getByText('Design System')).toBeInTheDocument();
    });

    it('handles compact variant', () => {
      const { container } = render(<Brand variant="compact" size="sm" />);
      const element = container.firstChild as HTMLElement;

      expect(element).toHaveClass('flex-row', 'items-center', 'gap-2');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty brand name gracefully', () => {
      const { container } = render(<Brand brandName="" />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('passes through additional HTML attributes', () => {
      render(<Brand data-testid="custom-brand" id="brand-id" />);
      const element = screen.getByTestId('custom-brand');

      expect(element).toHaveAttribute('id', 'brand-id');
    });

    it('handles both clickable and onClick together', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Brand onClick={handleClick} clickable={true} />);
      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders SVG filters when needed', () => {
      const { container } = render(<Brand customSvg="<circle cx='24' cy='24' r='20' fill='blue' />" />);
      const svgDefs = container.querySelector('defs');

      expect(svgDefs).toBeInTheDocument();
    });
  });

  describe('Button Styling', () => {
    it('resets button styles when clickable', () => {
      render(<Brand clickable />);
      const button = screen.getByRole('button');

      expect(button).toHaveStyle({
        border: 'none',
        background: 'transparent',
      });
    });
  });
});
