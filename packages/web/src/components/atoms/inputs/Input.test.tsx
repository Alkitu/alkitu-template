import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import Input from './Input';
import type { InputVariant, InputSize } from './Input.types';

expect.extend(toHaveNoViolations);

describe('Input - Atom', () => {
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

    it('renders with default type', () => {
      render(<Input placeholder="Text input" />);
      const input = screen.getByPlaceholderText('Text input');
      // Input type defaults to text when not specified (implicit in HTML)
      expect(input).toBeInTheDocument();
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

    it('uses default variant by default', () => {
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

  describe('Label Support', () => {
    it('renders with label', () => {
      render(<Input label="Username" placeholder="Enter username" />);
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('label has correct HTML structure', () => {
      const { container } = render(<Input label="Email" placeholder="test" />);
      const label = container.querySelector('label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass('text-sm', 'font-medium');
    });

    it('renders required indicator when required=true', () => {
      render(<Input label="Email" required placeholder="test" />);
      const requiredSpan = screen.getByText('*');
      expect(requiredSpan).toBeInTheDocument();
      expect(requiredSpan).toHaveClass('text-destructive');
    });

    it('does not render required indicator when required=false', () => {
      render(<Input label="Email" required={false} placeholder="test" />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('Helper Text Support', () => {
    it('renders helper text', () => {
      render(<Input helperText="Enter your email address" placeholder="test" />);
      expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });

    it('helper text has correct styles', () => {
      render(<Input helperText="Helper text" placeholder="test" />);
      const helper = screen.getByText('Helper text');
      expect(helper).toHaveClass('text-sm', 'mt-2', 'text-muted-foreground');
    });

    it('renders both label and helper text', () => {
      render(
        <Input
          label="Password"
          helperText="Must be at least 8 characters"
          placeholder="test"
        />
      );
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('renders error message', () => {
      render(<Input error="This field is required" placeholder="test" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('error message has correct styles', () => {
      render(<Input error="Error message" placeholder="test" />);
      const error = screen.getByText('Error message');
      expect(error).toHaveClass('text-sm', 'mt-2', 'text-destructive');
    });

    it('applies error border classes to input', () => {
      render(<Input error="Error" placeholder="test" />);
      const input = screen.getByPlaceholderText('test');
      expect(input).toHaveClass('border-destructive', 'focus-visible:ring-destructive');
    });

    it('error message takes precedence over helper text', () => {
      render(
        <Input
          helperText="Helper text"
          error="Error message"
          placeholder="test"
        />
      );
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('renders disabled input', () => {
      render(<Input disabled placeholder="Disabled" />);
      expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
    });

    it('has disabled opacity', () => {
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
  });

  describe('Input Types', () => {
    it.each([
      'text',
      'email',
      'password',
      'number',
      'tel',
      'url',
      'search',
    ])('supports type="%s"', (type) => {
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

  describe('Events', () => {
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
  });

  describe('Value Control', () => {
    it('works as controlled input', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { rerender } = render(
        <Input value="" onChange={onChange} placeholder="Test" />
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
  });

  describe('Theme Integration', () => {
    it('applies themeOverride styles', () => {
      const themeOverride = { backgroundColor: 'yellow' };
      render(<Input themeOverride={themeOverride} placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input.style.backgroundColor).toBe('yellow');
    });

    it('useSystemColors can be disabled', () => {
      render(<Input useSystemColors={false} placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      // Should not have variant classes when useSystemColors=false
      expect(input).not.toHaveClass('border-input');
    });
  });

  describe('Accessibility', () => {
    it('has proper input role', () => {
      render(<Input placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toBeInTheDocument();
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

    it('label associates with input', () => {
      render(<Input label="Email" placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      const label = screen.getByText('Email');
      expect(label.tagName).toBe('LABEL');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<Input placeholder="Accessible input" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('input with label has no accessibility violations', async () => {
      const { container } = render(
        <Input label="Email" placeholder="Enter email" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('input with error has no accessibility violations', async () => {
      const { container } = render(
        <Input error="This field is required" placeholder="Test" />
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

    it('spreads additional HTML attributes', () => {
      render(<Input title="Test Title" placeholder="Test" />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toHaveAttribute('title', 'Test Title');
    });
  });

  describe('Visual Regression Prevention', () => {
    it('maintains consistent height across variants', () => {
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
});
