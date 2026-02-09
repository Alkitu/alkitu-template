import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormTextarea } from './FormTextarea';

describe('FormTextarea', () => {
  describe('Rendering', () => {
    it('should render with label', () => {
      render(<FormTextarea label="Description" />);
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('should render textarea element', () => {
      render(<FormTextarea label="Description" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<FormTextarea label="Description" placeholder="Enter text..." />);
      expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
    });

    it('should render with default value', () => {
      render(<FormTextarea label="Description" defaultValue="Initial text" />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.value).toBe('Initial text');
    });
  });

  describe('Error State', () => {
    it('should display error message when error prop is provided', () => {
      render(<FormTextarea label="Description" error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should not display error message when error prop is not provided', () => {
      render(<FormTextarea label="Description" />);
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

    it('should apply error styles when error is present', () => {
      render(<FormTextarea label="Description" error="Error message" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-destructive');
      expect(textarea).toHaveClass('focus-visible:ring-destructive');
    });

    it('should apply default styles when no error', () => {
      render(<FormTextarea label="Description" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-input');
      expect(textarea).toHaveClass('focus-visible:ring-primary');
    });
  });

  describe('User Interactions', () => {
    it('should handle text input', async () => {
      const user = userEvent.setup();
      render(<FormTextarea label="Description" />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      await user.type(textarea, 'Hello World');
      expect(textarea.value).toBe('Hello World');
    });

    it('should call onChange handler', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<FormTextarea label="Description" onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'Test');
      expect(handleChange).toHaveBeenCalled();
    });

    it('should handle multiple lines of text', async () => {
      const user = userEvent.setup();
      render(<FormTextarea label="Description" />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      await user.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3');
      expect(textarea.value).toContain('Line 1');
      expect(textarea.value).toContain('Line 2');
      expect(textarea.value).toContain('Line 3');
    });
  });

  describe('Disabled State', () => {
    it('should render disabled textarea', () => {
      render(<FormTextarea label="Description" disabled />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });

    it('should apply disabled styles', () => {
      render(<FormTextarea label="Description" disabled />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('disabled:cursor-not-allowed');
      expect(textarea).toHaveClass('disabled:opacity-50');
    });

    it('should not accept input when disabled', async () => {
      const user = userEvent.setup();
      render(<FormTextarea label="Description" disabled />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      await user.type(textarea, 'Test');
      expect(textarea.value).toBe('');
    });
  });

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      render(<FormTextarea label="Description" className="custom-class" />);
      const container = screen.getByRole('textbox').parentElement;
      expect(container).toHaveClass('custom-class');
    });

    it('should forward HTML textarea attributes', () => {
      render(
        <FormTextarea
          label="Description"
          rows={5}
          maxLength={100}
          data-testid="custom-textarea"
        />
      );
      const textarea = screen.getByTestId('custom-textarea');
      expect(textarea).toHaveAttribute('rows', '5');
      expect(textarea).toHaveAttribute('maxLength', '100');
    });

    it('should support required attribute', () => {
      render(<FormTextarea label="Description" required />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeRequired();
    });

    it('should support readonly attribute', () => {
      render(<FormTextarea label="Description" readOnly value="Read only text" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('readonly');
    });

    it('should support name attribute', () => {
      render(<FormTextarea label="Description" name="description" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('name', 'description');
    });
  });

  describe('Styling', () => {
    it('should apply minimum height', () => {
      render(<FormTextarea label="Description" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('min-h-[80px]');
    });

    it('should have proper spacing and layout classes', () => {
      render(<FormTextarea label="Description" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('px-3');
      expect(textarea).toHaveClass('py-2');
      expect(textarea).toHaveClass('rounded-md');
    });

    it('should have focus styles', () => {
      render(<FormTextarea label="Description" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('focus-visible:outline-none');
      expect(textarea).toHaveClass('focus-visible:ring-2');
      expect(textarea).toHaveClass('focus-visible:ring-offset-2');
    });
  });

  describe('Accessibility', () => {
    it('should associate label with textarea', () => {
      render(<FormTextarea label="Description" />);
      const textarea = screen.getByRole('textbox');
      const label = screen.getByText('Description');
      // Label should be in the same container as textarea
      expect(label.nextElementSibling).toBe(textarea);
    });

    it('should be keyboard accessible', () => {
      render(<FormTextarea label="Description" />);
      const textarea = screen.getByRole('textbox');
      textarea.focus();
      expect(document.activeElement).toBe(textarea);
    });

    it('should support aria-label', () => {
      render(<FormTextarea label="Description" aria-label="Custom aria label" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-label', 'Custom aria label');
    });

    it('should support aria-describedby', () => {
      render(<FormTextarea label="Description" aria-describedby="help-text" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby', 'help-text');
    });
  });
});
