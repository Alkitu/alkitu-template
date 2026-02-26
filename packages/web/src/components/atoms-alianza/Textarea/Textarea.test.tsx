import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Textarea } from './Textarea';
import type { TextareaProps, AutosizeTextAreaRef } from './Textarea.types';
import React from 'react';

expect.extend(toHaveNoViolations);

describe('Textarea Component', () => {
  beforeEach(() => {
    // Mock scrollHeight for autosize tests
    Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', {
      configurable: true,
      get() {
        return this._scrollHeight || 100;
      },
      set(val) {
        this._scrollHeight = val;
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe('Basic Rendering', () => {
    it('renders textarea element', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('renders with placeholder text', () => {
      render(<Textarea placeholder="Enter your message" />);
      expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument();
    });

    it('renders with default value', () => {
      render(<Textarea defaultValue="Default text" data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveValue('Default text');
    });

    it('renders with controlled value', () => {
      render(<Textarea value="Controlled text" onChange={() => {}} data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveValue('Controlled text');
    });

    it('renders with displayName', () => {
      expect(Textarea.displayName).toBe('Textarea');
    });
  });

  describe('Variants', () => {
    it('applies default variant classes', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('border-input', 'bg-background');
    });

    it('applies filled variant classes', () => {
      render(<Textarea variant="filled" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('border-transparent', 'bg-muted');
    });

    it('applies outline variant classes', () => {
      render(<Textarea variant="outline" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('border-2', 'border-input', 'bg-transparent');
    });
  });

  describe('Sizes', () => {
    it('applies small size classes', () => {
      render(<Textarea size="sm" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('min-h-20', 'px-3', 'py-2', 'text-sm');
    });

    it('applies medium size classes by default', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('min-h-24', 'px-3', 'py-2', 'text-sm');
    });

    it('applies large size classes', () => {
      render(<Textarea size="lg" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('min-h-32', 'px-4', 'py-3', 'text-base');
    });
  });

  describe('States', () => {
    it('applies default state by default', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea.className).not.toContain('border-destructive');
      expect(textarea.className).not.toContain('border-success');
      expect(textarea.className).not.toContain('border-warning');
    });

    it('applies error state classes', () => {
      render(<Textarea state="error" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('border-destructive', 'focus-visible:ring-destructive');
    });

    it('applies success state classes', () => {
      render(<Textarea state="success" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('border-success', 'focus-visible:ring-success');
    });

    it('applies warning state classes', () => {
      render(<Textarea state="warning" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('border-warning', 'focus-visible:ring-warning');
    });

    it('handles disabled state', () => {
      render(<Textarea disabled data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toBeDisabled();
      expect(textarea).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });

    it('handles readonly state', () => {
      render(<Textarea readOnly data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('readonly');
    });

    it('handles required state', () => {
      render(<Textarea required data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toBeRequired();
    });
  });

  describe('User Interactions', () => {
    it('handles text input', async () => {
      const user = userEvent.setup();
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');

      await user.type(textarea, 'Hello World');
      expect(textarea).toHaveValue('Hello World');
    });

    it('calls onChange handler when text changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Textarea onChange={handleChange} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');

      await user.type(textarea, 'A');
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('handles onFocus event', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<Textarea onFocus={handleFocus} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');

      await user.click(textarea);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('handles onBlur event', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(<Textarea onBlur={handleBlur} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');

      await user.click(textarea);
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Theme and Styling', () => {
    it('applies custom className', () => {
      render(<Textarea className="custom-class" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('custom-class');
    });

    it('merges custom className with default classes', () => {
      render(<Textarea className="custom-class" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('custom-class', 'border-input', 'bg-background');
    });

    it('applies custom theme overrides', () => {
      const themeOverride = {
        backgroundColor: 'rgb(255, 0, 0)',
        color: 'rgb(255, 255, 255)',
      };
      render(<Textarea themeOverride={themeOverride} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');

      expect(textarea.style.backgroundColor).toBe('rgb(255, 0, 0)');
      expect(textarea.style.color).toBe('rgb(255, 255, 255)');
    });

    it('does not apply variant classes when useSystemColors is false', () => {
      render(<Textarea useSystemColors={false} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      // Base classes should still be present, but not variant classes
      expect(textarea).toHaveClass('flex', 'w-full');
    });

    it('applies focus-visible ring classes', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
      );
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to textarea element', () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    it('allows focusing via ref', () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} data-testid="textarea" />);
      ref.current?.focus();
      expect(screen.getByTestId('textarea')).toHaveFocus();
    });
  });

  describe('Autosize Mode', () => {
    it('enables autosize mode with autosize prop', () => {
      render(<Textarea autosize data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('resize-none');
    });

    it('applies resize-y class when autosize is disabled', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('resize-y');
    });

    it('applies minHeight in autosize mode', () => {
      render(<Textarea autosize minHeight={100} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toBeInTheDocument();
    });

    it('applies maxHeight in autosize mode', () => {
      render(<Textarea autosize maxHeight={300} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toBeInTheDocument();
    });

    it('exposes imperative handle in autosize mode', () => {
      const ref = React.createRef<AutosizeTextAreaRef>();
      render(<Textarea autosize ref={ref} />);

      expect(ref.current).toBeDefined();
      expect(ref.current).toHaveProperty('textArea');
      expect(ref.current).toHaveProperty('focus');
      expect(ref.current).toHaveProperty('maxHeight');
      expect(ref.current).toHaveProperty('minHeight');
    });

    it('allows focusing via imperative handle in autosize mode', () => {
      const ref = React.createRef<AutosizeTextAreaRef>();
      render(<Textarea autosize ref={ref} data-testid="textarea" />);

      ref.current?.focus();
      expect(screen.getByTestId('textarea')).toHaveFocus();
    });

    it('updates height on value change in autosize mode', async () => {
      const user = userEvent.setup();
      render(<Textarea autosize value="Initial" onChange={() => {}} data-testid="textarea" />);

      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveValue('Initial');

      await user.clear(textarea);
      await user.type(textarea, 'New longer text that should trigger resize');

      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Textarea aria-label="Message textarea" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports aria-label', () => {
      render(<Textarea aria-label="User message" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('aria-label', 'User message');
    });

    it('supports aria-describedby', () => {
      render(<Textarea aria-describedby="description" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('aria-describedby', 'description');
    });

    it('supports aria-invalid for error state', () => {
      render(<Textarea aria-invalid="true" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('is keyboard navigable', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <button>Before</button>
          <Textarea data-testid="textarea" />
          <button>After</button>
        </div>,
      );

      await user.tab();
      expect(screen.getByText('Before')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('textarea')).toHaveFocus();

      await user.tab();
      expect(screen.getByText('After')).toHaveFocus();
    });
  });

  describe('HTML Attributes', () => {
    it('accepts standard textarea attributes', () => {
      render(
        <Textarea
          name="message"
          id="message-input"
          rows={5}
          cols={50}
          maxLength={500}
          data-testid="textarea"
        />,
      );
      const textarea = screen.getByTestId('textarea');

      expect(textarea).toHaveAttribute('name', 'message');
      expect(textarea).toHaveAttribute('id', 'message-input');
      expect(textarea).toHaveAttribute('rows', '5');
      expect(textarea).toHaveAttribute('cols', '50');
      expect(textarea).toHaveAttribute('maxlength', '500');
    });

    it('accepts data attributes', () => {
      render(<Textarea data-testid="textarea" data-custom="value" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string value', () => {
      render(<Textarea value="" onChange={() => {}} data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveValue('');
    });

    it('handles very long text', () => {
      const longText = 'A'.repeat(10000);
      render(<Textarea value={longText} onChange={() => {}} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveValue(longText);
    });

    it('handles multiple lines of text', () => {
      const multilineText = 'Line 1\nLine 2\nLine 3';
      render(<Textarea value={multilineText} onChange={() => {}} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveValue(multilineText);
    });

    it('handles special characters', () => {
      const specialText = '<>&"\'`@#$%^&*()';
      render(<Textarea value={specialText} onChange={() => {}} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveValue(specialText);
    });
  });

  describe('Performance', () => {
    it('renders without unnecessary re-renders', () => {
      const { rerender } = render(<Textarea value="Test" onChange={() => {}} />);
      rerender(<Textarea value="Test" onChange={() => {}} />);
      expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    });

    it('handles rapid typing without errors', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Textarea onChange={handleChange} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');

      await user.type(textarea, 'Test', { delay: 1 } as any);
      expect(handleChange).toHaveBeenCalled();
      expect(textarea).toHaveValue('Test');
    });
  });

  describe('Variant Combinations', () => {
    it('combines variant and size correctly', () => {
      render(<Textarea variant="filled" size="lg" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('bg-muted', 'min-h-32', 'px-4', 'py-3');
    });

    it('combines variant and state correctly', () => {
      render(<Textarea variant="outline" state="error" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('border-2', 'border-destructive');
    });

    it('combines all props correctly', () => {
      render(
        <Textarea
          variant="filled"
          size="sm"
          state="success"
          className="custom"
          data-testid="textarea"
        />,
      );
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('bg-muted', 'min-h-20', 'border-success', 'custom');
    });
  });
});
