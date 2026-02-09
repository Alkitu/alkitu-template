import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { PreviewImage } from './PreviewImage';
import type { PreviewImageProps, ImageData } from './PreviewImage.types';

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

  // Test 2: Size Variants
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

  // Test 3: Aspect Ratios
  describe('Aspect Ratios', () => {
    it('applies square aspect ratio', () => {
      const { container } = render(<PreviewImage aspectRatio="square" />);
      const element = container.firstChild as HTMLElement;
      // Browser normalizes '1' to '1 / 1'
      expect(element.style.aspectRatio).toMatch(/1(\s*\/\s*1)?/);
    });

    it('applies 16:9 aspect ratio', () => {
      const { container } = render(<PreviewImage aspectRatio="16:9" />);
      const element = container.firstChild as HTMLElement;
      // Browser may normalize to '16 / 9'
      expect(element.style.aspectRatio).toMatch(/16\s*\/\s*9/);
    });

    it('applies custom aspect ratio', () => {
      const { container } = render(<PreviewImage customRatio="21/9" aspectRatio="16:9" />);
      const element = container.firstChild as HTMLElement;
      // Custom ratio should override preset (check for 21/9 format with possible spaces)
      expect(element.style.aspectRatio).toMatch(/21\s*\/\s*9/);
    });
  });

  // Test 4: Loading States
  describe('Loading States', () => {
    it('shows loading state when loading prop is true', () => {
      render(<PreviewImage loading />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows spinner when loading', () => {
      const { container } = render(<PreviewImage loading />);
      const spinner = container.querySelector('[role="status"]');
      expect(spinner).toBeInTheDocument();
    });

    it('hides image when loading', () => {
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" loading />,
      );
      const img = container.querySelector('img');
      expect(img).toHaveStyle({ opacity: '0' });
    });
  });

  // Test 5: Error States
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
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
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

    it('shows error icon when image fails', async () => {
      const { container } = render(
        <PreviewImage src="https://invalid-url.jpg" />,
      );

      const img = container.querySelector('img');
      if (img) {
        fireEvent.error(img);
      }

      await waitFor(() => {
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
      });
    });
  });

  // Test 6: Success States
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

  // Test 7: Placeholder States
  describe('Placeholder States', () => {
    it('shows default placeholder when no src provided', () => {
      render(<PreviewImage />);
      expect(screen.getByText('No image')).toBeInTheDocument();
    });

    it('renders custom placeholder when provided', () => {
      render(<PreviewImage placeholder={<div>Custom placeholder</div>} />);
      expect(screen.getByText('Custom placeholder')).toBeInTheDocument();
    });
  });

  // Test 8: Lightbox Functionality
  describe('Lightbox Functionality', () => {
    beforeEach(() => {
      // Reset body overflow before each test
      document.body.style.overflow = '';
    });

    afterEach(() => {
      // Clean up after each test
      document.body.style.overflow = '';
    });

    it('opens lightbox when thumbnail is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" alt="Test" />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        const lightbox = screen.getByRole('dialog');
        expect(lightbox).toBeInTheDocument();
      });
    });

    it('closes lightbox when close button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" alt="Test" />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const closeButton = screen.getByLabelText('Close lightbox');
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes lightbox when ESC key is pressed', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" alt="Test" />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      fireEvent.keyDown(window, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes lightbox when backdrop is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" alt="Test" />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const backdrop = screen.getByRole('dialog');
      await user.click(backdrop);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('does not open lightbox when enableLightbox is false', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage
          src="https://example.com/image.jpg"
          alt="Test"
          enableLightbox={false}
        />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('calls onLightboxOpen when lightbox opens', async () => {
      const onLightboxOpen = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage
          src="https://example.com/image.jpg"
          alt="Test"
          onLightboxOpen={onLightboxOpen}
        />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(onLightboxOpen).toHaveBeenCalled();
      });
    });

    it('calls onLightboxClose when lightbox closes', async () => {
      const onLightboxClose = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage
          src="https://example.com/image.jpg"
          alt="Test"
          onLightboxClose={onLightboxClose}
        />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      fireEvent.keyDown(window, { key: 'Escape' });

      await waitFor(() => {
        expect(onLightboxClose).toHaveBeenCalled();
      });
    });

    it('prevents body scroll when lightbox is open', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" alt="Test" />,
      );

      expect(document.body.style.overflow).toBe('');

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });
    });

    it('restores body scroll when lightbox closes', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" alt="Test" />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });

      fireEvent.keyDown(window, { key: 'Escape' });

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('');
      });
    });
  });

  // Test 9: Gallery Mode
  describe('Gallery Mode', () => {
    const galleryImages: ImageData[] = [
      { src: 'img1.jpg', alt: 'Image 1', caption: 'Caption 1' },
      { src: 'img2.jpg', alt: 'Image 2', caption: 'Caption 2' },
      { src: 'img3.jpg', alt: 'Image 3', caption: 'Caption 3' },
    ];

    it('renders gallery with multiple images', () => {
      const { container } = render(<PreviewImage images={galleryImages} />);
      expect(container.querySelector('img')).toHaveAttribute('src', 'img1.jpg');
    });

    it('shows gallery indicator with image count', () => {
      render(<PreviewImage images={galleryImages} />);
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('navigates to next image with arrow key', async () => {
      const user = userEvent.setup();
      const { container } = render(<PreviewImage images={galleryImages} />);

      // Open lightbox
      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Navigate to next
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(screen.getByText('2 of 3')).toBeInTheDocument();
      });
    });

    it('navigates to previous image with arrow key', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage images={galleryImages} initialIndex={1} />,
      );

      // Open lightbox
      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Navigate to previous
      fireEvent.keyDown(window, { key: 'ArrowLeft' });

      await waitFor(() => {
        expect(screen.getByText('1 of 3')).toBeInTheDocument();
      });
    });

    it('wraps around to first image when navigating forward from last', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage images={galleryImages} initialIndex={2} />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      fireEvent.keyDown(window, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(screen.getByText('1 of 3')).toBeInTheDocument();
      });
    });

    it('wraps around to last image when navigating backward from first', async () => {
      const user = userEvent.setup();
      const { container } = render(<PreviewImage images={galleryImages} />);

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      fireEvent.keyDown(window, { key: 'ArrowLeft' });

      await waitFor(() => {
        expect(screen.getByText('3 of 3')).toBeInTheDocument();
      });
    });

    it('shows navigation buttons in lightbox for gallery', async () => {
      const user = userEvent.setup();
      const { container } = render(<PreviewImage images={galleryImages} />);

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
        expect(screen.getByLabelText('Next image')).toBeInTheDocument();
      });
    });

    it('navigates with next button click', async () => {
      const user = userEvent.setup();
      const { container } = render(<PreviewImage images={galleryImages} />);

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const nextButton = screen.getByLabelText('Next image');
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('2 of 3')).toBeInTheDocument();
      });
    });

    it('navigates with previous button click', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage images={galleryImages} initialIndex={1} />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const prevButton = screen.getByLabelText('Previous image');
      await user.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText('1 of 3')).toBeInTheDocument();
      });
    });
  });

  // Test 10: Caption Display
  describe('Caption Display', () => {
    it('shows caption in lightbox', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage
          src="https://example.com/image.jpg"
          alt="Test"
          caption="Test Caption"
        />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(screen.getByText('Test Caption')).toBeInTheDocument();
      });
    });

    it('does not show caption section when no caption provided', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" alt="Test" />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        const lightbox = screen.getByRole('dialog');
        expect(lightbox.querySelector('p')).not.toBeInTheDocument();
      });
    });
  });

  // Test 11: Download Functionality
  describe('Download Functionality', () => {
    beforeEach(() => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          blob: () => Promise.resolve(new Blob()),
        } as Response),
      );
      global.URL.createObjectURL = vi.fn(() => 'blob:mock');
      global.URL.revokeObjectURL = vi.fn();
    });

    it('shows download button in lightbox', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" alt="Test" />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(screen.getByLabelText('Download image')).toBeInTheDocument();
      });
    });

    it('hides download button when showDownload is false', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage
          src="https://example.com/image.jpg"
          alt="Test"
          showDownload={false}
        />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(
          screen.queryByLabelText('Download image'),
        ).not.toBeInTheDocument();
      });
    });

    it('calls onDownload callback when download is triggered', async () => {
      const onDownload = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage
          src="https://example.com/image.jpg"
          alt="Test"
          onDownload={onDownload}
        />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const downloadButton = screen.getByLabelText('Download image');
      await user.click(downloadButton);

      await waitFor(() => {
        expect(onDownload).toHaveBeenCalledWith('https://example.com/image.jpg');
      });
    });
  });

  // Test 12: Lazy Loading
  describe('Lazy Loading', () => {
    it('enables lazy loading by default', () => {
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" />,
      );
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('disables lazy loading when disableLazyLoad is true', () => {
      const { container } = render(
        <PreviewImage
          src="https://example.com/image.jpg"
          disableLazyLoad={true}
        />,
      );
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('loading', 'eager');
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

    it('applies border radius variants', () => {
      const { container } = render(<PreviewImage radius="none" />);
      const element = container.firstChild as HTMLElement;
      // radius="none" should set borderRadius to '0' (browser normalizes to '0px')
      expect(element.style.borderRadius).toMatch(/^0(px)?$/);
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

    it('sets role and tabIndex when lightbox is enabled', () => {
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" />,
      );
      const element = container.firstChild as HTMLElement;
      expect(element).toHaveAttribute('role', 'button');
      expect(element).toHaveAttribute('tabIndex', '0');
    });

    it('does not set role when enableLightbox is false', () => {
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" enableLightbox={false} />,
      );
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

    it('supports keyboard navigation (Enter key)', async () => {
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" alt="Test" />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      fireEvent.keyDown(thumbnail, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('supports keyboard navigation (Space key)', async () => {
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" alt="Test" />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      fireEvent.keyDown(thumbnail, { key: ' ' });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('focuses close button when lightbox opens', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" alt="Test" />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        const closeButton = screen.getByLabelText('Close lightbox');
        expect(closeButton).toHaveFocus();
      });
    });

    it('has proper aria-label on lightbox dialog', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" alt="Test" />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        const lightbox = screen.getByRole('dialog');
        expect(lightbox).toHaveAttribute('aria-label', 'Image lightbox');
      });
    });
  });

  // Test 15: Edge Cases
  describe('Edge Cases', () => {
    it('handles empty string src', () => {
      render(<PreviewImage src="" />);
      expect(screen.getByText('No image')).toBeInTheDocument();
    });

    it('handles missing alt text gracefully', () => {
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" />,
      );
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', '');
    });

    it('handles gallery with single image', () => {
      const { container } = render(
        <PreviewImage
          images={[{ src: 'img1.jpg', alt: 'Image 1' }]}
        />,
      );
      expect(container.querySelector('img')).toHaveAttribute('src', 'img1.jpg');
      // No gallery indicator for single image
      expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
    });

    it('handles empty gallery array', () => {
      render(<PreviewImage images={[]} />);
      expect(screen.getByText('No image')).toBeInTheDocument();
    });

    it('prevents event propagation when clicking lightbox content', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PreviewImage src="https://example.com/image.jpg" alt="Test" />,
      );

      const thumbnail = container.firstChild as HTMLElement;
      await user.click(thumbnail);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click on image should not close lightbox
      const lightboxImage = screen.getByRole('dialog').querySelector('img');
      if (lightboxImage) {
        await user.click(lightboxImage);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      }
    });
  });

  // Test 16: Performance
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

  // Test 17: Props Forwarding
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
        <PreviewImage aria-describedby="description-id" />,
      );
      const element = container.firstChild;
      expect(element).toHaveAttribute('aria-describedby', 'description-id');
    });

    it('forwards custom HTML attributes', () => {
      const { container } = render(<PreviewImage id="custom-id" />);
      const element = container.firstChild;
      expect(element).toHaveAttribute('id', 'custom-id');
    });
  });

  // Test 18: Object Fit
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
});
