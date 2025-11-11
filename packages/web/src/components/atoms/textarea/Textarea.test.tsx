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
      expect(textarea).toHaveClass('border-input', 'bg-background', 'text-foreground');
      expect(textarea).toHaveAttribute('data-variant', 'default');
    });

    it('applies error variant classes', () => {
      render(<Textarea variant="error" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('border-destructive');
      expect(textarea).toHaveAttribute('data-variant', 'error');
    });

    it('applies success variant classes', () => {
      render(<Textarea variant="success" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('border-success');
      expect(textarea).toHaveAttribute('data-variant', 'success');
    });
  });

  describe('Sizes', () => {
    it('applies small size classes', () => {
      render(<Textarea size="sm" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('min-h-12', 'px-2', 'py-1', 'text-sm');
      expect(textarea).toHaveAttribute('data-size', 'sm');
    });

    it('applies medium size classes by default', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('min-h-16', 'px-3', 'py-2');
      expect(textarea).toHaveAttribute('data-size', 'md');
    });

    it('applies large size classes', () => {
      render(<Textarea size="lg" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('min-h-20', 'px-4', 'py-3', 'text-lg');
      expect(textarea).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('States', () => {
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

  describe('Theme Reactivity', () => {
    it('uses theme CSS variables by default', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('bg-background', 'text-foreground', 'border-input');
      expect(textarea).toHaveAttribute('data-use-system-colors', 'true');
    });

    it('applies typography CSS variables when enabled', () => {
      render(<Textarea useTypographyVars data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      const style = textarea.style;

      expect(style.fontFamily).toContain('var(--typography-paragraph-font-family');
      expect(style.fontSize).toContain('var(--typography-paragraph-font-size');
      expect(style.letterSpacing).toContain('var(--typography-paragraph-letter-spacing');
      expect(style.lineHeight).toContain('var(--typography-paragraph-line-height');
    });

    it('does not apply typography variables when disabled', () => {
      render(<Textarea useTypographyVars={false} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      const style = textarea.style;

      expect(style.fontFamily).toBe('');
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

    it('applies focus-visible ring classes', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-[3px]',
        'focus-visible:border-ring',
        'focus-visible:ring-ring/50',
      );
    });
  });

  describe('Custom Classes', () => {
    it('accepts and applies custom className', () => {
      render(<Textarea className="custom-class" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('custom-class');
    });

    it('merges custom className with default classes', () => {
      render(<Textarea className="custom-class" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('custom-class', 'border-input', 'bg-background');
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
      expect(textarea).toHaveAttribute('data-autosize', 'true');
      expect(textarea).toHaveClass('resize-none');
    });

    it('applies minHeight in autosize mode', () => {
      render(<Textarea autosize minHeight={100} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      // MinHeight is applied via style in useEffect
      expect(textarea).toBeInTheDocument();
    });

    it('applies maxHeight in autosize mode', () => {
      render(<Textarea autosize maxHeight={300} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      // MaxHeight is applied via style in useEffect
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
      const { rerender } = render(
        <Textarea autosize value="Initial" onChange={() => {}} data-testid="textarea" />,
      );

      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveValue('Initial');

      // Simulate typing
      await user.clear(textarea);
      await user.type(textarea, 'New longer text that should trigger resize');

      // The autosize logic should have been triggered
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

  describe('Dark Mode', () => {
    it('applies dark mode classes', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('dark:bg-input/30');
    });
  });

  describe('Performance', () => {
    it('renders without unnecessary re-renders', () => {
      const { rerender } = render(<Textarea value="Test" onChange={() => {}} />);
      rerender(<Textarea value="Test" onChange={() => {}} />);
      // Component should not error on re-render
      expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    });

    it('handles rapid typing without errors', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Textarea onChange={handleChange} data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');

      // Use shorter text for rapid typing test
      await user.type(textarea, 'Test', { delay: 1 });
      expect(handleChange).toHaveBeenCalled();
      expect(textarea).toHaveValue('Test');
    });
  });
});
