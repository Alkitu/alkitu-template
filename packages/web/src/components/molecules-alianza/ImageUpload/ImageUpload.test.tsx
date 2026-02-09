import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import { ImageUpload } from './ImageUpload';
import type { ImageUploadProps } from './ImageUpload.types';

expect.extend(toHaveNoViolations);

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockObjectURL = 'blob:mock-url';
const createObjectURLMock = vi.fn(() => mockObjectURL);
const revokeObjectURLMock = vi.fn();

beforeEach(() => {
  global.URL.createObjectURL = createObjectURLMock;
  global.URL.revokeObjectURL = revokeObjectURLMock;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('ImageUpload - Molecule', () => {
  // Helper function to create a mock file
  const createMockFile = (
    name: string = 'test-image.png',
    size: number = 1024,
    type: string = 'image/png'
  ): File => {
    const file = new File(['test'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  const defaultProps: ImageUploadProps = {
    onUpload: vi.fn(),
  };

  describe('Basic Rendering', () => {
    it('renders correctly without image', () => {
      render(<ImageUpload {...defaultProps} />);
      expect(screen.getByTestId('upload-button')).toBeInTheDocument();
    });

    it('has displayName set', () => {
      expect(ImageUpload.displayName).toBe('ImageUpload');
    });

    it('renders upload button with default text', () => {
      render(<ImageUpload {...defaultProps} />);
      expect(screen.getByText('Subir fotos')).toBeInTheDocument();
      expect(screen.getByText('Antes y después')).toBeInTheDocument();
    });

    it('renders with custom upload text', () => {
      render(<ImageUpload {...defaultProps} uploadText="Upload Image" helperText="Max 5MB" />);
      expect(screen.getByText('Upload Image')).toBeInTheDocument();
      expect(screen.getByText('Max 5MB')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<ImageUpload {...defaultProps} className="custom-class" />);
      const container = screen.getByTestId('upload-button').parentElement;
      expect(container).toHaveClass('custom-class');
    });

    it('renders with custom testId', () => {
      render(<ImageUpload {...defaultProps} data-testid="custom-upload" />);
      expect(screen.getByTestId('custom-upload')).toBeInTheDocument();
    });

    it('renders file input with correct attributes', () => {
      render(<ImageUpload {...defaultProps} accept="image/jpeg,image/png" required />);
      const input = screen.getByTestId('file-input');
      expect(input).toHaveAttribute('type', 'file');
      expect(input).toHaveAttribute('accept', 'image/jpeg,image/png');
      expect(input).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Image Display', () => {
    it('displays uploaded image when src is provided', () => {
      render(<ImageUpload {...defaultProps} src="https://example.com/image.jpg" alt="Test" />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test');
    });

    it('displays default alt text when not provided', () => {
      render(<ImageUpload {...defaultProps} src="https://example.com/image.jpg" />);
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Uploaded image');
    });

    it('shows delete button on uploaded image', () => {
      render(<ImageUpload {...defaultProps} src="https://example.com/image.jpg" />);
      expect(screen.getByTestId('remove-button')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove image')).toBeInTheDocument();
    });

    it('hides delete button when showDeleteButton is false', () => {
      render(
        <ImageUpload
          {...defaultProps}
          src="https://example.com/image.jpg"
          showDeleteButton={false}
        />
      );
      expect(screen.queryByTestId('remove-button')).not.toBeInTheDocument();
    });

    it('does not show upload button when image is displayed', () => {
      render(<ImageUpload {...defaultProps} src="https://example.com/image.jpg" />);
      expect(screen.queryByTestId('upload-button')).not.toBeInTheDocument();
    });
  });

  describe('File Input Interaction', () => {
    it('opens file dialog when button is clicked', async () => {
      const user = userEvent.setup();
      render(<ImageUpload {...defaultProps} />);

      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const clickSpy = vi.spyOn(fileInput, 'click');

      await user.click(screen.getByTestId('upload-button'));
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('calls onUpload with selected file', async () => {
      const user = userEvent.setup();
      const onUpload = vi.fn();
      render(<ImageUpload {...defaultProps} onUpload={onUpload} />);

      const file = createMockFile();
      const input = screen.getByTestId('file-input') as HTMLInputElement;

      await user.upload(input, file);

      expect(onUpload).toHaveBeenCalledTimes(1);
      expect(onUpload).toHaveBeenCalledWith(file);
    });

    it('creates preview URL after file selection', async () => {
      const user = userEvent.setup();
      render(<ImageUpload {...defaultProps} />);

      const file = createMockFile();
      const input = screen.getByTestId('file-input') as HTMLInputElement;

      await user.upload(input, file);

      expect(createObjectURLMock).toHaveBeenCalledWith(file);
      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });
    });

    it('displays preview after file selection', async () => {
      const user = userEvent.setup();
      render(<ImageUpload {...defaultProps} />);

      const file = createMockFile();
      const input = screen.getByTestId('file-input') as HTMLInputElement;

      await user.upload(input, file);

      await waitFor(() => {
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', mockObjectURL);
      });
    });
  });

  describe('File Validation', () => {
    it('accepts valid image file', async () => {
      const user = userEvent.setup();
      const onUpload = vi.fn();
      const onError = vi.fn();
      render(<ImageUpload {...defaultProps} onUpload={onUpload} onError={onError} />);

      const file = createMockFile('image.png', 1024, 'image/png');
      const input = screen.getByTestId('file-input') as HTMLInputElement;

      await user.upload(input, file);

      expect(onUpload).toHaveBeenCalledWith(file);
      expect(onError).not.toHaveBeenCalled();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('rejects file exceeding maxSize', async () => {
      const user = userEvent.setup();
      const onUpload = vi.fn();
      const onError = vi.fn();
      render(
        <ImageUpload {...defaultProps} onUpload={onUpload} onError={onError} maxSize={1024} />
      );

      const file = createMockFile('large.png', 2048, 'image/png');
      const input = screen.getByTestId('file-input') as HTMLInputElement;

      await user.upload(input, file);

      expect(onUpload).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
      expect(screen.getByRole('alert')).toHaveTextContent('File size exceeds');
    });

    it('displays error message for oversized file', async () => {
      const user = userEvent.setup();
      render(<ImageUpload {...defaultProps} maxSize={1024} />);

      const file = createMockFile('large.png', 2048, 'image/png');
      const input = screen.getByTestId('file-input') as HTMLInputElement;

      await user.upload(input, file);

      const error = screen.getByTestId('error-message');
      expect(error).toHaveTextContent('File size exceeds 0.00MB');
    });

    it('rejects invalid file type via drop', async () => {
      const onUpload = vi.fn();
      const onError = vi.fn();
      render(
        <ImageUpload
          {...defaultProps}
          onUpload={onUpload}
          onError={onError}
          accept="image/jpeg,image/png"
          allowDragDrop
        />
      );

      // Test via drag & drop which bypasses browser's file input restrictions
      const button = screen.getByTestId('upload-button');
      const file = createMockFile('document.pdf', 1024, 'application/pdf');

      const dropEvent = new Event('drop', { bubbles: true }) as any;
      dropEvent.dataTransfer = {
        files: [file],
      };

      await act(async () => {
        button.dispatchEvent(dropEvent);
      });

      await waitFor(() => {
        expect(onUpload).not.toHaveBeenCalled();
        expect(onError).toHaveBeenCalled();
        expect(screen.getByRole('alert')).toHaveTextContent('Invalid file type');
      });
    });

    it('displays error message for invalid file type via drop', async () => {
      render(<ImageUpload {...defaultProps} accept="image/jpeg" allowDragDrop />);

      const button = screen.getByTestId('upload-button');
      const file = createMockFile('image.png', 1024, 'image/png');

      const dropEvent = new Event('drop', { bubbles: true }) as any;
      dropEvent.dataTransfer = {
        files: [file],
      };

      await act(async () => {
        button.dispatchEvent(dropEvent);
      });

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent(
          'Invalid file type. Accepted types: image/jpeg'
        );
      });
    });

    it('accepts image/* wildcard', async () => {
      const user = userEvent.setup();
      const onUpload = vi.fn();
      render(<ImageUpload {...defaultProps} onUpload={onUpload} accept="image/*" />);

      const file = createMockFile('image.webp', 1024, 'image/webp');
      const input = screen.getByTestId('file-input') as HTMLInputElement;

      await user.upload(input, file);

      expect(onUpload).toHaveBeenCalledWith(file);
    });

    it('clears error when valid file is uploaded after invalid', async () => {
      const user = userEvent.setup();
      render(<ImageUpload {...defaultProps} maxSize={1024} />);

      const input = screen.getByTestId('file-input') as HTMLInputElement;

      // Upload invalid file
      const largeFile = createMockFile('large.png', 2048, 'image/png');
      await user.upload(input, largeFile);
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Upload valid file
      const validFile = createMockFile('small.png', 512, 'image/png');
      await user.upload(input, validFile);
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  });

  describe('Drag and Drop', () => {
    it('handles drag enter event', async () => {
      render(<ImageUpload {...defaultProps} allowDragDrop />);
      const button = screen.getByTestId('upload-button');

      await act(async () => {
        button.dispatchEvent(new Event('dragenter', { bubbles: true }));
      });

      await waitFor(() => {
        expect(button).toHaveClass('border-primary');
      });
    });

    it('handles drag leave event', async () => {
      render(<ImageUpload {...defaultProps} allowDragDrop />);
      const button = screen.getByTestId('upload-button');

      await act(async () => {
        button.dispatchEvent(new Event('dragenter', { bubbles: true }));
      });
      await waitFor(() => {
        expect(button).toHaveClass('border-primary');
      });

      await act(async () => {
        button.dispatchEvent(new Event('dragleave', { bubbles: true }));
      });
      await waitFor(() => {
        expect(button).not.toHaveClass('border-primary');
      });
    });

    it('handles file drop', async () => {
      const onUpload = vi.fn();
      render(<ImageUpload {...defaultProps} onUpload={onUpload} allowDragDrop />);

      const button = screen.getByTestId('upload-button');
      const file = createMockFile();

      const dropEvent = new Event('drop', { bubbles: true }) as any;
      dropEvent.dataTransfer = {
        files: [file],
      };

      await act(async () => {
        button.dispatchEvent(dropEvent);
      });

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalledWith(file);
      });
    });

    it('shows drop hint when dragging', async () => {
      render(<ImageUpload {...defaultProps} allowDragDrop />);
      const button = screen.getByTestId('upload-button');

      await act(async () => {
        button.dispatchEvent(new Event('dragenter', { bubbles: true }));
      });

      await waitFor(() => {
        expect(screen.getByText('Suelta para subir')).toBeInTheDocument();
      });
    });

    it('does not handle drag events when allowDragDrop is false', () => {
      render(<ImageUpload {...defaultProps} allowDragDrop={false} />);
      const button = screen.getByTestId('upload-button');

      button.dispatchEvent(new Event('dragenter', { bubbles: true }));

      expect(button).not.toHaveClass('border-primary');
    });

    it('does not handle drag events when disabled', () => {
      render(<ImageUpload {...defaultProps} disabled allowDragDrop />);
      const button = screen.getByTestId('upload-button');

      button.dispatchEvent(new Event('dragenter', { bubbles: true }));

      expect(button).not.toHaveClass('border-primary');
    });

    it('validates dropped file', async () => {
      const onError = vi.fn();
      render(<ImageUpload {...defaultProps} onError={onError} maxSize={1024} allowDragDrop />);

      const button = screen.getByTestId('upload-button');
      const file = createMockFile('large.png', 2048, 'image/png');

      const dropEvent = new Event('drop', { bubbles: true }) as any;
      dropEvent.dataTransfer = {
        files: [file],
      };

      await act(async () => {
        button.dispatchEvent(dropEvent);
      });

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });
  });

  describe('Delete/Remove Functionality', () => {
    it('calls onRemove when delete button clicked', async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      render(
        <ImageUpload
          {...defaultProps}
          src="https://example.com/image.jpg"
          onRemove={onRemove}
        />
      );

      await user.click(screen.getByTestId('remove-button'));

      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('removes preview after delete button clicked', async () => {
      const user = userEvent.setup();
      render(<ImageUpload {...defaultProps} />);

      // Upload file
      const file = createMockFile();
      const input = screen.getByTestId('file-input') as HTMLInputElement;
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      // Click remove
      await user.click(screen.getByTestId('remove-button'));

      await waitFor(() => {
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(screen.getByTestId('upload-button')).toBeInTheDocument();
      });
    });

    it('revokes preview URL when removing', async () => {
      const user = userEvent.setup();
      render(<ImageUpload {...defaultProps} />);

      // Upload file
      const file = createMockFile();
      const input = screen.getByTestId('file-input') as HTMLInputElement;
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      // Click remove
      await user.click(screen.getByTestId('remove-button'));

      expect(revokeObjectURLMock).toHaveBeenCalledWith(mockObjectURL);
    });

    it('resets file input when removing', async () => {
      const user = userEvent.setup();
      render(<ImageUpload {...defaultProps} />);

      const input = screen.getByTestId('file-input') as HTMLInputElement;
      const file = createMockFile();
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('remove-button'));

      expect(input.value).toBe('');
    });

    it('does not remove when disabled', async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      render(
        <ImageUpload
          {...defaultProps}
          src="https://example.com/image.jpg"
          onRemove={onRemove}
          disabled
        />
      );

      expect(screen.queryByTestId('remove-button')).not.toBeInTheDocument();
    });

    it('stops propagation on remove button click', async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      const onClick = vi.fn();

      const { container } = render(
        <div onClick={onClick}>
          <ImageUpload
            {...defaultProps}
            src="https://example.com/image.jpg"
            onRemove={onRemove}
          />
        </div>
      );

      await user.click(screen.getByTestId('remove-button'));

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('displays loading spinner when loading', () => {
      render(<ImageUpload {...defaultProps} loading />);
      expect(screen.getByText('Subiendo...')).toBeInTheDocument();
    });

    it('shows loading overlay on uploaded image', () => {
      render(<ImageUpload {...defaultProps} src="https://example.com/image.jpg" loading />);
      expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
    });

    it('disables button when loading', () => {
      render(<ImageUpload {...defaultProps} loading />);
      const button = screen.getByTestId('upload-button');
      expect(button).toBeDisabled();
    });

    it('disables file input when loading', () => {
      render(<ImageUpload {...defaultProps} loading />);
      const input = screen.getByTestId('file-input');
      expect(input).toBeDisabled();
    });

    it('does not open file dialog when loading', async () => {
      const user = userEvent.setup();
      render(<ImageUpload {...defaultProps} loading />);

      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const clickSpy = vi.spyOn(fileInput, 'click');

      await user.click(screen.getByTestId('upload-button'));
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('hides delete button when loading', () => {
      render(<ImageUpload {...defaultProps} src="https://example.com/image.jpg" loading />);
      expect(screen.queryByTestId('remove-button')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables button when disabled', () => {
      render(<ImageUpload {...defaultProps} disabled />);
      const button = screen.getByTestId('upload-button');
      expect(button).toBeDisabled();
    });

    it('disables file input when disabled', () => {
      render(<ImageUpload {...defaultProps} disabled />);
      const input = screen.getByTestId('file-input');
      expect(input).toBeDisabled();
    });

    it('applies opacity to disabled button', () => {
      render(<ImageUpload {...defaultProps} disabled />);
      const button = screen.getByTestId('upload-button');
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('applies opacity to disabled image', () => {
      render(<ImageUpload {...defaultProps} src="https://example.com/image.jpg" disabled />);
      const imageContainer = screen.getByRole('img').parentElement;
      expect(imageContainer).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('hides delete button when disabled', () => {
      render(<ImageUpload {...defaultProps} src="https://example.com/image.jpg" disabled />);
      expect(screen.queryByTestId('remove-button')).not.toBeInTheDocument();
    });

    it('does not open file dialog when disabled', async () => {
      const user = userEvent.setup();
      render(<ImageUpload {...defaultProps} disabled />);

      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const clickSpy = vi.spyOn(fileInput, 'click');

      await user.click(screen.getByTestId('upload-button'));
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('does not handle drag events when disabled', () => {
      render(<ImageUpload {...defaultProps} disabled allowDragDrop />);
      const button = screen.getByTestId('upload-button');

      button.dispatchEvent(new Event('dragenter', { bubbles: true }));

      expect(button).not.toHaveClass('border-primary');
    });
  });

  describe('Error States', () => {
    it('displays error message', async () => {
      const user = userEvent.setup();
      render(<ImageUpload {...defaultProps} maxSize={100} />);

      const file = createMockFile('large.png', 200, 'image/png');
      const input = screen.getByTestId('file-input') as HTMLInputElement;

      await user.upload(input, file);

      const errorMessage = screen.getByTestId('error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });

    it('applies error border when error exists', async () => {
      const user = userEvent.setup();
      render(<ImageUpload {...defaultProps} maxSize={100} />);

      const file = createMockFile('large.png', 200, 'image/png');
      const input = screen.getByTestId('file-input') as HTMLInputElement;

      await user.upload(input, file);

      const button = screen.getByTestId('upload-button');
      expect(button).toHaveClass('border-destructive');
    });

    it('calls onError callback with Error object', async () => {
      const user = userEvent.setup();
      const onError = vi.fn();
      render(<ImageUpload {...defaultProps} onError={onError} maxSize={100} />);

      const file = createMockFile('large.png', 200, 'image/png');
      const input = screen.getByTestId('file-input') as HTMLInputElement;

      await user.upload(input, file);

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to file input', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<ImageUpload {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current).toHaveAttribute('type', 'file');
    });

    it('allows external access to file input via ref', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<ImageUpload {...defaultProps} ref={ref} />);

      const clickSpy = vi.spyOn(ref.current!, 'click');
      ref.current?.click();

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Memory Management', () => {
    it('revokes preview URL on unmount', async () => {
      const user = userEvent.setup();
      const { unmount } = render(<ImageUpload {...defaultProps} />);

      // Upload file to create preview URL
      const input = screen.getByTestId('file-input') as HTMLInputElement;
      const file = createMockFile();
      await user.upload(input, file);

      // Wait for preview to appear
      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      unmount();

      expect(revokeObjectURLMock).toHaveBeenCalledWith(mockObjectURL);
    });
  });

  describe('Accept Attribute', () => {
    it('uses default accept value', () => {
      render(<ImageUpload {...defaultProps} />);
      const input = screen.getByTestId('file-input');
      expect(input).toHaveAttribute('accept', 'image/*');
    });

    it('accepts custom accept value', () => {
      render(<ImageUpload {...defaultProps} accept="image/jpeg,image/png" />);
      const input = screen.getByTestId('file-input');
      expect(input).toHaveAttribute('accept', 'image/jpeg,image/png');
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations - upload button', async () => {
      const { container } = render(<ImageUpload {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - with image', async () => {
      const { container } = render(
        <ImageUpload {...defaultProps} src="https://example.com/image.jpg" alt="Test image" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - with error', async () => {
      const user = userEvent.setup();
      const { container } = render(<ImageUpload {...defaultProps} maxSize={100} />);

      const file = createMockFile('large.png', 200, 'image/png');
      const input = screen.getByTestId('file-input') as HTMLInputElement;
      await user.upload(input, file);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA label on upload button', () => {
      render(<ImageUpload {...defaultProps} uploadText="Upload Photo" />);
      const button = screen.getByTestId('upload-button');
      expect(button).toHaveAttribute('aria-label', 'Upload Photo');
    });

    it('has proper ARIA label on remove button', () => {
      render(<ImageUpload {...defaultProps} src="https://example.com/image.jpg" />);
      const removeButton = screen.getByTestId('remove-button');
      expect(removeButton).toHaveAttribute('aria-label', 'Remove image');
    });

    it('file input is screen reader accessible', () => {
      render(<ImageUpload {...defaultProps} required />);
      const input = screen.getByTestId('file-input');
      expect(input).toHaveClass('sr-only');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('error message has alert role', async () => {
      const user = userEvent.setup();
      render(<ImageUpload {...defaultProps} maxSize={100} />);

      const file = createMockFile('large.png', 200, 'image/png');
      const input = screen.getByTestId('file-input') as HTMLInputElement;
      await user.upload(input, file);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('icon has aria-hidden attribute', () => {
      const { container } = render(<ImageUpload {...defaultProps} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing onUpload callback', async () => {
      const user = userEvent.setup();
      render(<ImageUpload />);

      const file = createMockFile();
      const input = screen.getByTestId('file-input') as HTMLInputElement;

      await expect(user.upload(input, file)).resolves.not.toThrow();
    });

    it('handles missing onRemove callback', async () => {
      const user = userEvent.setup();
      render(<ImageUpload src="https://example.com/image.jpg" />);

      await expect(user.click(screen.getByTestId('remove-button'))).resolves.not.toThrow();
    });

    it('handles missing onError callback', async () => {
      const user = userEvent.setup();
      render(<ImageUpload maxSize={100} />);

      const file = createMockFile('large.png', 200, 'image/png');
      const input = screen.getByTestId('file-input') as HTMLInputElement;

      await expect(user.upload(input, file)).resolves.not.toThrow();
    });

    it('handles empty file selection', () => {
      render(<ImageUpload {...defaultProps} />);
      const input = screen.getByTestId('file-input') as HTMLInputElement;

      const changeEvent = new Event('change', { bubbles: true });
      Object.defineProperty(changeEvent, 'target', {
        value: { files: [] },
        writable: false,
      });

      expect(() => input.dispatchEvent(changeEvent)).not.toThrow();
    });

    it('handles null file in drop event', async () => {
      render(<ImageUpload {...defaultProps} allowDragDrop />);
      const button = screen.getByTestId('upload-button');

      const dropEvent = new Event('drop', { bubbles: true }) as any;
      dropEvent.dataTransfer = {
        files: [],
      };

      await act(async () => {
        expect(() => button.dispatchEvent(dropEvent)).not.toThrow();
      });
    });

    it('handles zero maxSize', async () => {
      const user = userEvent.setup();
      const onError = vi.fn();
      render(<ImageUpload {...defaultProps} onError={onError} maxSize={0} />);

      const file = createMockFile('image.png', 1, 'image/png');
      const input = screen.getByTestId('file-input') as HTMLInputElement;

      await user.upload(input, file);

      expect(onError).toHaveBeenCalled();
    });

    it('handles very large maxSize', async () => {
      const user = userEvent.setup();
      const onUpload = vi.fn();
      render(<ImageUpload {...defaultProps} onUpload={onUpload} maxSize={999999999} />);

      const file = createMockFile('image.png', 1024, 'image/png');
      const input = screen.getByTestId('file-input') as HTMLInputElement;

      await user.upload(input, file);

      expect(onUpload).toHaveBeenCalledWith(file);
    });

    it('handles special characters in file names', async () => {
      const user = userEvent.setup();
      const onUpload = vi.fn();
      render(<ImageUpload {...defaultProps} onUpload={onUpload} />);

      const file = createMockFile('image (1) [copy].png', 1024, 'image/png');
      const input = screen.getByTestId('file-input') as HTMLInputElement;

      await user.upload(input, file);

      expect(onUpload).toHaveBeenCalledWith(file);
    });
  });

  describe('Component Integration', () => {
    it('works with form submission', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn((e) => e.preventDefault());

      render(
        <form onSubmit={onSubmit}>
          <ImageUpload {...defaultProps} />
          <button type="submit">Submit</button>
        </form>
      );

      const file = createMockFile();
      const input = screen.getByTestId('file-input') as HTMLInputElement;
      await user.upload(input, file);

      await user.click(screen.getByText('Submit'));
      expect(onSubmit).toHaveBeenCalled();
    });

    it('maintains state across re-renders', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<ImageUpload {...defaultProps} uploadText="Upload 1" />);

      const file = createMockFile();
      const input = screen.getByTestId('file-input') as HTMLInputElement;
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      rerender(<ImageUpload {...defaultProps} uploadText="Upload 2" />);

      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });
});
