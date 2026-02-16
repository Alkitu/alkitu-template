/**
 * ImageUpload Component Tests
 *
 * Comprehensive test suite covering:
 * - URL input and submission
 * - File selection and validation
 * - Drag & drop functionality
 * - Upload progress tracking
 * - Error handling and recovery
 * - Image preview display
 * - Accessibility features
 *
 * Target: 12+ tests for complex component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ImageUpload } from './ImageUpload';
import type { ImageUploadProps } from './ImageUpload.types';
import * as uploadUtils from './ImageUpload.utils';

expect.extend(toHaveNoViolations);

/**
 * Default props for testing
 */
const defaultProps: ImageUploadProps = {
  value: '',
  onChange: vi.fn(),
};

/**
 * Creates a mock File object for testing
 */
function createMockFile(
  name: string = 'test-image.png',
  size: number = 1024 * 1024, // 1MB
  type: string = 'image/png'
): File {
  const file = new File([''], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

/**
 * Creates a mock drag event with files
 */
function createDragEvent(files: File[]): Partial<DragEvent> {
  return {
    dataTransfer: {
      files: files as any,
      items: files.map((file) => ({
        kind: 'file',
        type: file.type,
        getAsFile: () => file,
      })) as any,
      types: ['Files'],
    } as DataTransfer,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  };
}

describe('ImageUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<ImageUpload {...defaultProps} />);

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByText('URL')).toBeInTheDocument();
      expect(screen.getByText('Upload')).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(
        <ImageUpload
          {...defaultProps}
          placeholder="Enter custom image URL"
        />
      );

      expect(
        screen.getByPlaceholderText('Enter custom image URL')
      ).toBeInTheDocument();
    });

    it('should render disabled state', () => {
      render(<ImageUpload {...defaultProps} disabled />);

      const urlInput = screen.getByLabelText('Image URL');
      const applyButton = screen.getByLabelText('Apply image URL');

      expect(urlInput).toBeDisabled();
      expect(applyButton).toBeDisabled();
    });

    it('should render with initial value', () => {
      render(
        <ImageUpload
          {...defaultProps}
          value="https://example.com/image.jpg"
        />
      );

      const urlInput = screen.getByLabelText(
        'Image URL'
      ) as HTMLInputElement;
      expect(urlInput.value).toBe('https://example.com/image.jpg');
    });
  });

  describe('URL Input', () => {
    it('should handle URL input change', async () => {
      const user = userEvent.setup();
      render(<ImageUpload {...defaultProps} />);

      const urlInput = screen.getByLabelText('Image URL');
      await user.type(urlInput, 'https://example.com/test.jpg');

      expect(urlInput).toHaveValue('https://example.com/test.jpg');
    });

    it('should apply URL on button click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ImageUpload {...defaultProps} onChange={onChange} />);

      const urlInput = screen.getByLabelText('Image URL');
      const applyButton = screen.getByLabelText('Apply image URL');

      await user.type(urlInput, 'https://example.com/test.jpg');
      await user.click(applyButton);

      expect(onChange).toHaveBeenCalledWith('https://example.com/test.jpg');
    });

    it('should apply URL on Enter key', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ImageUpload {...defaultProps} onChange={onChange} />);

      const urlInput = screen.getByLabelText('Image URL');
      await user.type(urlInput, 'https://example.com/test.jpg{Enter}');

      expect(onChange).toHaveBeenCalledWith('https://example.com/test.jpg');
    });

    it('should disable Apply button when URL is unchanged', async () => {
      const user = userEvent.setup();
      render(
        <ImageUpload
          {...defaultProps}
          value="https://example.com/test.jpg"
        />
      );

      const applyButton = screen.getByLabelText('Apply image URL');
      expect(applyButton).toBeDisabled();
    });
  });

  describe('File Selection', () => {
    it('should handle file selection via input', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const mockFile = createMockFile();

      // Mock uploadImage to resolve immediately
      vi.spyOn(uploadUtils, 'uploadImage').mockResolvedValue({
        url: 'data:image/png;base64,mock',
        variants: {
          thumbnail: 'data:image/png;base64,mock',
          medium: 'data:image/png;base64,mock',
          large: 'data:image/png;base64,mock',
        },
      });

      render(<ImageUpload {...defaultProps} onChange={onChange} />);

      // Switch to Upload tab
      const uploadTab = screen.getByText('Upload');
      await user.click(uploadTab);

      // Simulate file selection
      const fileInput = screen.getByLabelText('File input');
      await user.upload(fileInput, mockFile);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });

    it('should validate file type', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const invalidFile = createMockFile('test.txt', 1024, 'text/plain');

      // Mock uploadImage to never be called if validation fails
      const uploadSpy = vi.spyOn(uploadUtils, 'uploadImage');

      render(
        <ImageUpload
          {...defaultProps}
          onChange={onChange}
        />
      );

      const uploadTab = screen.getByText('Upload');
      await user.click(uploadTab);

      const fileInput = screen.getByLabelText('File input');
      await user.upload(fileInput, invalidFile);

      // Wait a bit for async operations
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Upload should never have been attempted due to validation failure
      expect(uploadSpy).not.toHaveBeenCalled();

      // onChange should not have been called (file was rejected)
      expect(onChange).not.toHaveBeenCalled();

      uploadSpy.mockRestore();
    });

    it('should validate file size', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const largeFile = createMockFile(
        'large.png',
        10 * 1024 * 1024,
        'image/png'
      ); // 10MB

      render(
        <ImageUpload {...defaultProps} onChange={onChange} maxSizeMB={5} />
      );

      const uploadTab = screen.getByText('Upload');
      await user.click(uploadTab);

      const fileInput = screen.getByLabelText('File input');
      await user.upload(fileInput, largeFile);

      await waitFor(() => {
        expect(
          screen.getByText(/File size must be less than/i)
        ).toBeInTheDocument();
      });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Drag and Drop', () => {
    it('should handle drag over', async () => {
      render(<ImageUpload {...defaultProps} />);

      const uploadTab = screen.getByText('Upload');
      await userEvent.click(uploadTab);

      const dropzone = screen.getByLabelText(
        /drag and drop image or click to upload/i
      );

      fireEvent.dragOver(dropzone, {
        dataTransfer: { files: [] },
      });

      expect(dropzone).toHaveClass('border-primary');
    });

    it('should handle drag leave', async () => {
      render(<ImageUpload {...defaultProps} />);

      const uploadTab = screen.getByText('Upload');
      await userEvent.click(uploadTab);

      const dropzone = screen.getByLabelText(
        /drag and drop image or click to upload/i
      );

      fireEvent.dragOver(dropzone, {
        dataTransfer: { files: [] },
      });
      fireEvent.dragLeave(dropzone, {
        dataTransfer: { files: [] },
      });

      expect(dropzone).not.toHaveClass('border-primary');
    });

    it('should handle file drop', async () => {
      const onChange = vi.fn();
      const mockFile = createMockFile();

      vi.spyOn(uploadUtils, 'uploadImage').mockResolvedValue({
        url: 'data:image/png;base64,mock',
      });

      render(<ImageUpload {...defaultProps} onChange={onChange} />);

      const uploadTab = screen.getByText('Upload');
      await userEvent.click(uploadTab);

      const dropzone = screen.getByLabelText(
        /drag and drop image or click to upload/i
      );

      const dragEvent = createDragEvent([mockFile]);
      fireEvent.drop(dropzone, dragEvent);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });

    it('should reject non-image files on drop', async () => {
      const onChange = vi.fn();
      const invalidFile = createMockFile('test.txt', 1024, 'text/plain');

      render(<ImageUpload {...defaultProps} onChange={onChange} />);

      const uploadTab = screen.getByText('Upload');
      await userEvent.click(uploadTab);

      const dropzone = screen.getByLabelText(
        /drag and drop image or click to upload/i
      );

      const dragEvent = createDragEvent([invalidFile]);
      fireEvent.drop(dropzone, dragEvent);

      await waitFor(() => {
        expect(
          screen.getByText(/Please drop an image file/i)
        ).toBeInTheDocument();
      });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Upload Progress', () => {
    it('should show upload progress', async () => {
      const user = userEvent.setup();
      const onUploadProgress = vi.fn();
      const mockFile = createMockFile();

      vi.spyOn(uploadUtils, 'uploadImage').mockImplementation(
        async (file, endpoint, onProgress) => {
          // Simulate progress
          onProgress?.(50);
          await new Promise((resolve) => setTimeout(resolve, 100));
          onProgress?.(100);
          return { url: 'data:image/png;base64,mock' };
        }
      );

      render(
        <ImageUpload
          {...defaultProps}
          onUploadProgress={onUploadProgress}
        />
      );

      const uploadTab = screen.getByText('Upload');
      await user.click(uploadTab);

      const fileInput = screen.getByLabelText('File input');
      await user.upload(fileInput, mockFile);

      await waitFor(() => {
        expect(screen.getByText('Uploading...')).toBeInTheDocument();
      });

      expect(onUploadProgress).toHaveBeenCalled();
    });
  });

  describe('Image Preview', () => {
    it('should display image preview when value is set', () => {
      render(
        <ImageUpload
          {...defaultProps}
          value="https://example.com/test.jpg"
        />
      );

      const preview = screen.getByAltText('Preview');
      expect(preview).toBeInTheDocument();
      expect(preview).toHaveAttribute('src', 'https://example.com/test.jpg');
    });

    it('should handle image load error', async () => {
      render(
        <ImageUpload
          {...defaultProps}
          value="https://example.com/broken.jpg"
        />
      );

      const preview = screen.getByAltText('Preview');
      fireEvent.error(preview);

      await waitFor(() => {
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
      });
    });

    it('should clear image on remove button click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <ImageUpload
          {...defaultProps}
          value="https://example.com/test.jpg"
          onChange={onChange}
        />
      );

      const removeButton = screen.getByLabelText('Remove image');
      await user.click(removeButton);

      expect(onChange).toHaveBeenCalledWith('');
    });

    it('should render different preview sizes', () => {
      const { rerender } = render(
        <ImageUpload
          {...defaultProps}
          value="https://example.com/test.jpg"
          size="small"
        />
      );

      const previewContainer = screen
        .getByAltText('Preview')
        .closest('div');
      expect(previewContainer).toHaveClass('w-24 h-24');

      rerender(
        <ImageUpload
          {...defaultProps}
          value="https://example.com/test.jpg"
          size="large"
        />
      );

      const largeContainer = screen.getByAltText('Preview').closest('div');
      expect(largeContainer).toHaveClass('w-48 h-48');
    });
  });

  describe('Error Handling', () => {
    it('should display error message on upload failure', async () => {
      const user = userEvent.setup();
      const onUploadError = vi.fn();
      const mockFile = createMockFile();

      vi.spyOn(uploadUtils, 'uploadImage').mockRejectedValue(
        new Error('Upload failed')
      );

      render(
        <ImageUpload {...defaultProps} onUploadError={onUploadError} />
      );

      const uploadTab = screen.getByText('Upload');
      await user.click(uploadTab);

      const fileInput = screen.getByLabelText('File input');
      await user.upload(fileInput, mockFile);

      await waitFor(() => {
        expect(screen.getByText('Upload failed')).toBeInTheDocument();
      });

      expect(onUploadError).toHaveBeenCalled();
    });

    it('should allow retry after error', async () => {
      const user = userEvent.setup();
      const mockFile = createMockFile();

      vi.spyOn(uploadUtils, 'uploadImage').mockRejectedValue(
        new Error('Upload failed')
      );

      render(<ImageUpload {...defaultProps} />);

      const uploadTab = screen.getByText('Upload');
      await user.click(uploadTab);

      const fileInput = screen.getByLabelText('File input');
      await user.upload(fileInput, mockFile);

      await waitFor(() => {
        expect(screen.getByText('Upload failed')).toBeInTheDocument();
      });

      const retryButton = screen.getByLabelText('Retry upload');
      await user.click(retryButton);

      expect(screen.queryByText('Upload failed')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<ImageUpload {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels', () => {
      render(<ImageUpload {...defaultProps} />);

      expect(screen.getByLabelText('Image URL')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Apply image URL')
      ).toBeInTheDocument();
    });

    it('should have proper ARIA live regions for status updates', async () => {
      const user = userEvent.setup();
      const mockFile = createMockFile();

      vi.spyOn(uploadUtils, 'uploadImage').mockImplementation(
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return { url: 'data:image/png;base64,mock' };
        }
      );

      render(<ImageUpload {...defaultProps} />);

      const uploadTab = screen.getByText('Upload');
      await user.click(uploadTab);

      const fileInput = screen.getByLabelText('File input');
      await user.upload(fileInput, mockFile);

      await waitFor(() => {
        const statusRegion = screen.getByRole('status');
        expect(statusRegion).toHaveAttribute('aria-live', 'polite');
      });
    });

    it('should support keyboard navigation', async () => {
      render(<ImageUpload {...defaultProps} />);

      // Component should have focusable elements
      const urlInput = screen.getByLabelText('Image URL');
      const applyButton = screen.getByLabelText('Apply image URL');

      expect(urlInput).toBeInTheDocument();
      expect(applyButton).toBeInTheDocument();

      // Verify elements are in tab order
      expect(urlInput).toHaveAttribute('type', 'url');
      expect(applyButton).toHaveAttribute('type', 'button');

      // Both should be focusable (not have tabindex="-1")
      expect(urlInput).not.toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Callbacks', () => {
    it('should call onUploadStart when upload begins', async () => {
      const user = userEvent.setup();
      const onUploadStart = vi.fn();
      const mockFile = createMockFile();

      vi.spyOn(uploadUtils, 'uploadImage').mockResolvedValue({
        url: 'data:image/png;base64,mock',
      });

      render(
        <ImageUpload {...defaultProps} onUploadStart={onUploadStart} />
      );

      const uploadTab = screen.getByText('Upload');
      await user.click(uploadTab);

      const fileInput = screen.getByLabelText('File input');
      await user.upload(fileInput, mockFile);

      expect(onUploadStart).toHaveBeenCalled();
    });

    it('should call onUploadSuccess when upload completes', async () => {
      const user = userEvent.setup();
      const onUploadSuccess = vi.fn();
      const mockFile = createMockFile();
      const mockResult = {
        url: 'data:image/png;base64,mock',
        variants: {
          thumbnail: 'thumb',
          medium: 'medium',
          large: 'large',
        },
      };

      vi.spyOn(uploadUtils, 'uploadImage').mockResolvedValue(mockResult);

      render(
        <ImageUpload {...defaultProps} onUploadSuccess={onUploadSuccess} />
      );

      const uploadTab = screen.getByText('Upload');
      await user.click(uploadTab);

      const fileInput = screen.getByLabelText('File input');
      await user.upload(fileInput, mockFile);

      await waitFor(() => {
        expect(onUploadSuccess).toHaveBeenCalledWith(mockResult);
      });
    });
  });
});
