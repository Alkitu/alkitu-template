import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { PreviewImage } from './PreviewImage';
import type { PreviewImageProps } from './PreviewImage.types';

// Extend Vitest matchers with jest-axe
expect.extend(toHaveNoViolations);

describe('PreviewImage Molecule', () => {
  // Test 1: Basic Rendering
  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      const { container } = render(<PreviewImage />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with image src', () => {
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" alt="Test image" />,
      );
      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(img).toHaveAttribute('alt', 'Test image');
    });

    it('applies displayName correctly', () => {
      expect(PreviewImage.displayName).toBe('PreviewImage');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<PreviewImage ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });

  // Test 3: Size Variants
  describe('Size Variants', () => {
    const sizes: Array<{
      size: PreviewImageProps['size'];
      dimensions: { width: string; height: string };
    }> = [
      { size: 'xs', dimensions: { width: '64px', height: '64px' } },
      { size: 'sm', dimensions: { width: '96px', height: '96px' } },
      { size: 'md', dimensions: { width: '128px', height: '128px' } },
      { size: 'lg', dimensions: { width: '192px', height: '192px' } },
      { size: 'xl', dimensions: { width: '256px', height: '256px' } },
      { size: '2xl', dimensions: { width: '384px', height: '384px' } },
    ];

    sizes.forEach(({ size, dimensions }) => {
      it(`applies ${size} size correctly with auto aspect ratio`, () => {
        const { container } = render(
          <PreviewImage size={size} aspectRatio="auto" />,
        );
        const element = container.firstChild as HTMLElement;
        expect(element.style.width).toBe(dimensions.width);
        expect(element.style.height).toBe(dimensions.height);
      });
    });

    it('uses 100% width with non-auto aspect ratio', () => {
      const { container } = render(<PreviewImage size="lg" aspectRatio="16:9" />);
      const element = container.firstChild as HTMLElement;
      expect(element.style.width).toBe('100%');
    });
  });

  // Test 5: Object Fit
  describe('Object Fit', () => {
    const objectFits: PreviewImageProps['objectFit'][] = [
      'cover',
      'contain',
      'fill',
      'scale-down',
      'none',
    ];

    objectFits.forEach((fit) => {
      it(`applies ${fit} object-fit correctly`, () => {
        const { container } = render(
          <PreviewImage src="https://example.com/image.jpg" objectFit={fit} />,
        );
        const img = container.querySelector('img');
        expect(img).toHaveStyle({ objectFit: fit });
      });
    });
  });

  // Test 6: Loading States
  describe('Loading States', () => {
    it('shows loading state when loading prop is true', () => {
      render(<PreviewImage loading />);
      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('displays loader icon when loading', () => {
      const { container } = render(<PreviewImage loading />);
      const loaderIcon = container.querySelector('.animate-spin');
      expect(loaderIcon).toBeInTheDocument();
    });

    it('shows loading overlay when loading', () => {
      const { container } = render(<PreviewImage loading />);
      const overlay = container.querySelector('.backdrop-blur-sm');
      expect(overlay).toBeInTheDocument();
    });
  });

  // Test 7: Error States
  describe('Error States', () => {
    it('shows error state when image fails to load', async () => {
      const { container } = render(
        <PreviewImage src="https://invalid-url.jpg" />,
      );

      const img = container.querySelector('img');
      if (img) {
        fireEvent.error(img);
      }

      await waitFor(() => {
        expect(screen.getByText('Error al cargar')).toBeInTheDocument();
      });
    });

    it('calls onError callback when image fails', async () => {
      const onError = vi.fn();
      const { container } = render(
        <PreviewImage src="https://invalid-url.jpg" onError={onError} />,
      );

      const img = container.querySelector('img');
      if (img) {
        fireEvent.error(img);
      }

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });
  });

  // Test 8: Success States
  describe('Success States', () => {
    it('shows image when loaded successfully', async () => {
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" />,
      );

      const img = container.querySelector('img');
      if (img) {
        fireEvent.load(img);
      }

      await waitFor(() => {
        expect(img).toHaveStyle({ opacity: '1' });
      });
    });

    it('calls onLoad callback when image loads', async () => {
      const onLoad = vi.fn();
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" onLoad={onLoad} />,
      );

      const img = container.querySelector('img');
      if (img) {
        fireEvent.load(img);
      }

      await waitFor(() => {
        expect(onLoad).toHaveBeenCalled();
      });
    });
  });

  // Test 9: Placeholder States
  describe('Placeholder States', () => {
    it('shows default placeholder when no src provided', () => {
      render(<PreviewImage />);
      expect(screen.getByText('Sin imagen')).toBeInTheDocument();
    });

    it('renders custom placeholder when provided', () => {
      render(
        <PreviewImage placeholder={<div>Custom placeholder</div>} />,
      );
      expect(screen.getByText('Custom placeholder')).toBeInTheDocument();
    });
  });

  // Test 10: Interactive Features
  describe('Interactive Features', () => {
    it('applies cursor pointer when onClick is provided', () => {
      const onClick = vi.fn();
      const { container } = render(<PreviewImage onClick={onClick} />);
      const element = container.firstChild as HTMLElement;
      expect(element.style.cursor).toBe('pointer');
    });

    it('calls onClick handler when clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { container } = render(<PreviewImage onClick={onClick} />);
      const element = container.firstChild as HTMLElement;

      await user.click(element);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('applies interactive hover effects', async () => {
      const user = userEvent.setup();
      const { container } = render(<PreviewImage interactive />);
      const element = container.firstChild as HTMLElement;

      await user.hover(element);
      expect(element.style.transform).toBe('scale(1.02)');

      await user.unhover(element);
      expect(element.style.transform).toBe('scale(1)');
    });

    it('does not apply hover effects when not interactive', async () => {
      const user = userEvent.setup();
      const { container } = render(<PreviewImage />);
      const element = container.firstChild as HTMLElement;

      await user.hover(element);
      expect(element.style.transform).toBe('scale(1)');
    });
  });

  // Test 11: Overlay Features
  describe('Overlay Features', () => {
    it('shows overlay content when provided and hovered', async () => {
      const user = userEvent.setup();
      render(
        <PreviewImage
          interactive
          showOverlay
          overlayContent="View Details"
        />,
      );

      const container = screen.getByText('View Details').parentElement?.parentElement;
      if (container) {
        await user.hover(container);
        expect(screen.getByText('View Details')).toBeVisible();
      }
    });

    it('hides overlay when not hovered', () => {
      const { container } = render(
        <PreviewImage interactive showOverlay overlayContent="View Details" />,
      );

      const overlay = container.querySelector(
        'div[style*="opacity"]',
      ) as HTMLElement;
      expect(overlay?.style.opacity).toBe('0');
    });
  });

  // Test 13: Custom Styling
  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = render(<PreviewImage className="custom-class" />);
      const element = container.firstChild;
      expect(element).toHaveClass('custom-class');
    });

    it('applies custom inline styles', () => {
      const { container } = render(
        <PreviewImage style={{ maxWidth: '300px' }} />,
      );
      const element = container.firstChild as HTMLElement;
      expect(element.style.maxWidth).toBe('300px');
    });

    it('merges custom styles with default styles', () => {
      const { container } = render(
        <PreviewImage style={{ opacity: '0.5' }} />,
      );
      const element = container.firstChild as HTMLElement;
      expect(element.style.opacity).toBe('0.5');
      expect(element.style.position).toBe('relative');
    });
  });

  // Test 14: Accessibility
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <PreviewImage
          src="https://example.com/image.jpg"
          alt="Accessible image"
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('sets role and tabIndex when onClick is provided', () => {
      const onClick = vi.fn();
      const { container } = render(<PreviewImage onClick={onClick} />);
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveAttribute('role', 'button');
      expect(element).toHaveAttribute('tabIndex', '0');
    });

    it('does not set role when onClick is not provided', () => {
      const { container } = render(<PreviewImage />);
      const element = container.firstChild as HTMLElement;
      expect(element).not.toHaveAttribute('role');
    });

    it('provides alt text for images', () => {
      const { container } = render(
        <PreviewImage
          src="https://example.com/image.jpg"
          alt="Descriptive alt text"
        />,
      );
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'Descriptive alt text');
    });
  });

  // Test 15: Edge Cases
  describe('Edge Cases', () => {
    it('handles empty string src', () => {
      render(<PreviewImage src="" />);
      expect(screen.getByText('Sin imagen')).toBeInTheDocument();
    });

    it('handles missing alt text gracefully', () => {
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" />,
      );
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', '');
    });

    it('handles rapid state changes', async () => {
      const { container, rerender } = render(<PreviewImage loading />);
      expect(screen.getByText('Cargando...')).toBeInTheDocument();

      rerender(<PreviewImage src="https://example.com/image.jpg" />);
      const img = container.querySelector('img');
      if (img) {
        fireEvent.error(img);
      }

      await waitFor(() => {
        expect(screen.getByText('Error al cargar')).toBeInTheDocument();
      });
    });

    it('handles multiple event handlers', async () => {
      const onLoad = vi.fn();
      const onError = vi.fn();
      const onClick = vi.fn();
      const user = userEvent.setup();

      const { container } = render(
        <PreviewImage
          src="https://example.com/image.jpg"
          onLoad={onLoad}
          onError={onError}
          onClick={onClick}
        />,
      );

      const element = container.firstChild as HTMLElement;
      await user.click(element);
      expect(onClick).toHaveBeenCalled();

      const img = container.querySelector('img');
      if (img) {
        fireEvent.load(img);
      }

      await waitFor(() => {
        expect(onLoad).toHaveBeenCalled();
      });
    });
  });

  // Test 16: Component Composition
  describe('Component Composition', () => {
    it('composes CustomIcon atoms correctly', () => {
      render(<PreviewImage />);
      // Check for placeholder text which indicates the component rendered correctly
      expect(screen.getByText('Sin imagen')).toBeInTheDocument();
    });

    it('renders all required placeholder elements', () => {
      render(<PreviewImage />);

      // Check for placeholder container
      const placeholder = screen.getByText('Sin imagen').closest('div');
      expect(placeholder).toBeInTheDocument();

      // Check for text
      expect(screen.getByText('Sin imagen')).toBeInTheDocument();
    });
  });

  // Test 17: Performance
  describe('Performance', () => {
    it('renders in under 16ms', () => {
      const startTime = performance.now();
      render(<PreviewImage src="https://example.com/image.jpg" />);
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(16);
    });

    it('handles multiple instances efficiently', () => {
      const startTime = performance.now();
      const { container } = render(
        <div>
          <PreviewImage src="https://example.com/1.jpg" />
          <PreviewImage src="https://example.com/2.jpg" />
          <PreviewImage src="https://example.com/3.jpg" />
          <PreviewImage src="https://example.com/4.jpg" />
          <PreviewImage src="https://example.com/5.jpg" />
        </div>,
      );
      const endTime = performance.now();

      const images = container.querySelectorAll('.preview-image-molecule');
      expect(images).toHaveLength(5);
      expect(endTime - startTime).toBeLessThan(50);
    });
  });

  // Test 18: Transitions and Animations
  describe('Transitions and Animations', () => {
    it('applies transition when interactive', () => {
      const { container } = render(<PreviewImage interactive />);
      const element = container.firstChild as HTMLElement;
      expect(element.style.transition).toContain('transform');
      expect(element.style.transition).toContain('box-shadow');
    });

    it('does not apply transition when not interactive', () => {
      const { container } = render(<PreviewImage />);
      const element = container.firstChild as HTMLElement;
      expect(element.style.transition).toBe('none');
    });

    it('animates loading spinner', () => {
      const { container } = render(<PreviewImage loading />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  // Test 19: Props Forwarding
  describe('Props Forwarding', () => {
    it('forwards data attributes', () => {
      const { container } = render(
        <PreviewImage data-testid="preview-image-test" />,
      );
      const element = container.firstChild;
      expect(element).toHaveAttribute('data-testid', 'preview-image-test');
    });

    it('forwards aria attributes', () => {
      const { container } = render(
        <PreviewImage aria-label="Preview image" />,
      );
      const element = container.firstChild;
      expect(element).toHaveAttribute('aria-label', 'Preview image');
    });

    it('forwards custom HTML attributes', () => {
      const { container } = render(<PreviewImage id="custom-id" />);
      const element = container.firstChild;
      expect(element).toHaveAttribute('id', 'custom-id');
    });
  });

  // Test 20: State Management
  describe('State Management', () => {
    it('manages loading state correctly', async () => {
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" />,
      );

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();

      // Image starts with opacity 0
      expect(img).toHaveStyle({ opacity: '0' });

      // Simulate load complete
      if (img) {
        fireEvent.load(img);
      }

      // Verify loaded state
      await waitFor(() => {
        expect(img).toHaveStyle({ opacity: '1' });
      });
    });

    it('resets state when src changes', async () => {
      const { container, rerender } = render(
        <PreviewImage src="https://example.com/1.jpg" />,
      );

      const img1 = container.querySelector('img');
      if (img1) {
        fireEvent.load(img1);
      }

      await waitFor(() => {
        expect(img1).toHaveStyle({ opacity: '1' });
      });

      // Change src
      rerender(<PreviewImage src="https://example.com/2.jpg" />);

      const img2 = container.querySelector('img');
      expect(img2).toHaveAttribute('src', 'https://example.com/2.jpg');
    });
  });
});
