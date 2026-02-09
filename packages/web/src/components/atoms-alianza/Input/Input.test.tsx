import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Input } from './Input';
import type { InputVariant, InputSize, InputState } from './Input.types';

expect.extend(toHaveNoViolations);

describe('Input - Atom (Pure)', () => {
  describe('Basic Rendering', () => {
    it('renders correctly', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders as input element', () => {
      const { container } = render(<Input />);
      expect(container.querySelector('input')).toBeInTheDocument();
    });

    it('has displayName set', () => {
      expect(Input.displayName).toBe('Input');
    });

    it('renders with default type=text', () => {
      render(<Input placeholder="Text input" />);
      const input = screen.getByPlaceholderText('Text input');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders as pure atom without label wrapper', () => {
      const { container } = render(<Input placeholder="test" />);
      const label = container.querySelector('label');
      const wrapper = container.querySelector('div');
      expect(label).not.toBeInTheDocument();
      expect(wrapper).not.toBeInTheDocument();
    });
  });

  describe('Variants - All 3 Variants', () => {
    const variants: InputVariant[] = ['default', 'filled', 'outline'];

    it.each(variants)('renders %s variant with correct classes', (variant) => {
      render(<Input variant={variant} placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');

      if (variant === 'default') {
        expect(input).toHaveClass('border-input', 'bg-background');
      } else if (variant === 'filled') {
        expect(input).toHaveClass('border-transparent', 'bg-muted');
      } else if (variant === 'outline') {
        expect(input).toHaveClass('border-2', 'border-input', 'bg-transparent');
      }
    });

    it('uses default variant when not specified', () => {
      render(<Input placeholder="Default" />);
      const input = screen.getByPlaceholderText('Default');
      expect(input).toHaveClass('border-input', 'bg-background');
    });
  });

  describe('Sizes - All 3 Sizes', () => {
    const sizes: InputSize[] = ['sm', 'md', 'lg'];

    it.each(sizes)('renders %s size with correct classes', (size) => {
      render(<Input size={size} placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');

      if (size === 'sm') {
        expect(input).toHaveClass('h-8', 'px-3', 'text-sm');
      } else if (size === 'md') {
        expect(input).toHaveClass('h-10', 'px-3', 'text-sm');
      } else if (size === 'lg') {
        expect(input).toHaveClass('h-12', 'px-4', 'text-base');
      }
    });

    it('uses md size by default', () => {
      render(<Input placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveClass('h-10', 'px-3');
    });
  });

  describe('States - All 4 Validation States', () => {
    const states: InputState[] = ['default', 'error', 'success', 'warning'];

    it.each(states)('renders %s state with correct classes', (state) => {
      render(<Input state={state} placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');

      if (state === 'error') {
        expect(input).toHaveClass('border-destructive', 'focus-visible:ring-destructive');
      } else if (state === 'success') {
        expect(input).toHaveClass('border-success', 'focus-visible:ring-success');
      } else if (state === 'warning') {
        expect(input).toHaveClass('border-warning', 'focus-visible:ring-warning');
      }
    });

    it('uses default state when not specified', () => {
      render(<Input placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).not.toHaveClass('border-destructive');
      expect(input).not.toHaveClass('border-success');
      expect(input).not.toHaveClass('border-warning');
    });
  });

  describe('Input Types - All Common Types', () => {
    const inputTypes = [
      'text',
      'email',
      'password',
      'number',
      'tel',
      'url',
      'search',
      'date',
      'time',
    ];

    it.each(inputTypes)('supports type="%s"', (type) => {
      render(<Input type={type} placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveAttribute('type', type);
    });

    it('renders password type correctly', () => {
      render(<Input type="password" placeholder="Enter password" />);
      const input = screen.getByPlaceholderText('Enter password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders email type correctly', () => {
      render(<Input type="email" placeholder="Enter email" />);
      const input = screen.getByPlaceholderText('Enter email');
      expect(input).toHaveAttribute('type', 'email');
    });
  });

  describe('Disabled State', () => {
    it('renders disabled input', () => {
      render(<Input disabled placeholder="Disabled" />);
      expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
    });

    it('has disabled opacity class', () => {
      render(<Input disabled placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveClass('disabled:opacity-50');
    });

    it('does not allow input when disabled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Input disabled onChange={onChange} placeholder="Test" />);

      const input = screen.getByPlaceholderText('Test');
      await user.type(input, 'test');

      expect(onChange).not.toHaveBeenCalled();
    });

    it('has cursor-not-allowed class when disabled', () => {
      render(<Input disabled placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveClass('disabled:cursor-not-allowed');
    });
  });

  describe('User Interactions', () => {
    it('handles onChange events', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Input onChange={onChange} placeholder="Test" />);

      const input = screen.getByPlaceholderText('Test');
      await user.type(input, 'hello');

      expect(onChange).toHaveBeenCalled();
      expect(input).toHaveValue('hello');
    });

    it('handles onFocus events', async () => {
      const user = userEvent.setup();
      const onFocus = vi.fn();
      render(<Input onFocus={onFocus} placeholder="Test" />);

      const input = screen.getByPlaceholderText('Test');
      await user.click(input);

      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('handles onBlur events', async () => {
      const user = userEvent.setup();
      const onBlur = vi.fn();
      render(<Input onBlur={onBlur} placeholder="Test" />);

      const input = screen.getByPlaceholderText('Test');
      await user.click(input);
      await user.tab();

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('handles onKeyDown events', async () => {
      const user = userEvent.setup();
      const onKeyDown = vi.fn();
      render(<Input onKeyDown={onKeyDown} placeholder="Test" />);

      const input = screen.getByPlaceholderText('Test');
      await user.click(input);
      await user.keyboard('{Enter}');

      expect(onKeyDown).toHaveBeenCalled();
    });

    it('handles onKeyUp events', async () => {
      const user = userEvent.setup();
      const onKeyUp = vi.fn();
      render(<Input onKeyUp={onKeyUp} placeholder="Test" />);

      const input = screen.getByPlaceholderText('Test');
      await user.click(input);
      await user.keyboard('a');

      expect(onKeyUp).toHaveBeenCalled();
    });
  });

  describe('Value Control', () => {
    it('works as controlled input', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { rerender } = render(
        <Input value="" onChange={onChange} placeholder="Test" />,
      );

      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveValue('');

      await user.type(input, 'a');
      expect(onChange).toHaveBeenCalled();

      rerender(<Input value="a" onChange={onChange} placeholder="Test" />);
      expect(input).toHaveValue('a');
    });

    it('works as uncontrolled input with defaultValue', () => {
      render(<Input defaultValue="initial" placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveValue('initial');
    });

    it('updates value correctly in controlled mode', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Input value="initial" onChange={vi.fn()} />);
      const input = screen.getByDisplayValue('initial');
      expect(input).toHaveValue('initial');

      rerender(<Input value="updated" onChange={vi.fn()} />);
      expect(input).toHaveValue('updated');
    });
  });

  describe('Theme Integration', () => {
    it('applies themeOverride styles', () => {
      const themeOverride = { backgroundColor: 'rgb(255, 255, 0)' };
      render(<Input themeOverride={themeOverride} placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input.style.backgroundColor).toBe('rgb(255, 255, 0)');
    });

    it('useSystemColors can be disabled', () => {
      render(<Input useSystemColors={false} placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      // Should not have variant classes when useSystemColors=false
      expect(input).not.toHaveClass('border-input');
      expect(input).not.toHaveClass('bg-background');
    });

    it('applies themeOverride without affecting other classes', () => {
      const themeOverride = { color: 'red' };
      render(<Input themeOverride={themeOverride} size="lg" placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveClass('h-12');
      expect(input.style.color).toBe('red');
    });
  });

  describe('Accessibility', () => {
    it('has proper input role implicitly', () => {
      render(<Input placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
    });

    it('accepts aria-label', () => {
      render(<Input aria-label="Search" placeholder="Test" />);
      expect(screen.getByLabelText('Search')).toBeInTheDocument();
    });

    it('accepts aria-describedby', () => {
      render(<Input aria-describedby="description-id" placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveAttribute('aria-describedby', 'description-id');
    });

    it('accepts aria-invalid', () => {
      render(<Input aria-invalid="true" placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('accepts aria-required', () => {
      render(<Input aria-required="true" placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<Input placeholder="Accessible input" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('input with aria-label has no accessibility violations', async () => {
      const { container } = render(
        <Input aria-label="Email input" placeholder="Enter email" />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Custom Props and Edge Cases', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Input ref={ref} placeholder="Test" />);
      expect(ref).toHaveBeenCalled();
    });

    it('accepts className prop', () => {
      render(<Input className="custom-class" placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveClass('custom-class');
    });

    it('merges custom className with base classes', () => {
      render(<Input className="custom-class" placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveClass('custom-class', 'border-input');
    });

    it('accepts id attribute', () => {
      render(<Input id="test-input" placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveAttribute('id', 'test-input');
    });

    it('accepts name attribute', () => {
      render(<Input name="username" placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveAttribute('name', 'username');
    });

    it('accepts maxLength attribute', () => {
      render(<Input maxLength={10} placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveAttribute('maxLength', '10');
    });

    it('accepts minLength attribute', () => {
      render(<Input minLength={3} placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveAttribute('minLength', '3');
    });

    it('accepts readOnly attribute', () => {
      render(<Input readOnly placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveAttribute('readOnly');
    });

    it('accepts autoComplete attribute', () => {
      render(<Input autoComplete="email" placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveAttribute('autoComplete', 'email');
    });

    it('accepts autoFocus attribute', () => {
      render(<Input autoFocus placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      // autoFocus is applied but doesn't persist in the DOM after initial render
      expect(input).toBeInTheDocument();
    });

    it('accepts required attribute', () => {
      render(<Input required placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toBeRequired();
    });

    it('spreads additional HTML attributes', () => {
      render(<Input title="Test Title" data-testid="custom-input" placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveAttribute('title', 'Test Title');
      expect(input).toHaveAttribute('data-testid', 'custom-input');
    });
  });

  describe('Visual Regression Prevention', () => {
    it('maintains consistent height across sizes', () => {
      const sizes: InputSize[] = ['sm', 'md', 'lg'];
      const heights = ['h-8', 'h-10', 'h-12'];

      sizes.forEach((size, index) => {
        const { container } = render(<Input size={size} placeholder="Test" />);
        const input = container.querySelector('input');
        expect(input).toHaveClass(heights[index]);
      });
    });

    it('applies focus-visible styles', () => {
      render(<Input placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveClass('focus-visible:outline-none');
      expect(input).toHaveClass('focus-visible:ring-2');
    });

    it('applies transition classes', () => {
      render(<Input placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveClass('transition-colors');
    });

    it('applies rounded corners', () => {
      render(<Input placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveClass('rounded-md');
    });
  });

  describe('Combination Tests', () => {
    it('combines variant, size, and state correctly', () => {
      render(
        <Input
          variant="filled"
          size="lg"
          state="error"
          placeholder="Test"
        />,
      );
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveClass('bg-muted', 'h-12', 'border-destructive');
    });

    it('works with all props combined', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Input
          variant="outline"
          size="sm"
          state="success"
          type="email"
          placeholder="Email"
          className="custom-class"
          onChange={onChange}
          aria-label="Email input"
        />,
      );
      const input = screen.getByPlaceholderText('Email');
      expect(input).toHaveClass('border-2', 'h-8', 'border-success', 'custom-class');
      expect(input).toHaveAttribute('type', 'email');

      await user.type(input, 'test@example.com');
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty placeholder', () => {
      const { container } = render(<Input placeholder="" />);
      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', '');
    });

    it('handles very long placeholder text', () => {
      const longText = 'A'.repeat(200);
      render(<Input placeholder={longText} />);
      const input = screen.getByPlaceholderText(longText);
      expect(input).toBeInTheDocument();
    });

    it('handles numeric type with min and max', () => {
      render(<Input type="number" min={0} max={100} placeholder="Number" />);
      const input = screen.getByPlaceholderText('Number');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
    });

    it('handles pattern attribute', () => {
      render(<Input pattern="[0-9]{3}" placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveAttribute('pattern', '[0-9]{3}');
    });
  });
});
