import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { FormInput } from './FormInput';

describe('FormInput', () => {
  describe('Rendering', () => {
    it('should render input element with label', () => {
      render(<FormInput label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with all props', () => {
      render(
        <FormInput
          label="Username"
          placeholder="Enter username"
          type="text"
          icon={<span data-testid="left-icon">📧</span>}
          iconRight={<span data-testid="right-icon">✅</span>}
        />
      );
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<FormInput label="Username" placeholder="Enter username" />);
      expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    });

    it('should render with left icon only', () => {
      render(<FormInput label="Search" icon={<span data-testid="search-icon">🔍</span>} />);
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('form-input-icon-right')).not.toBeInTheDocument();
    });

    it('should render with right icon only', () => {
      render(<FormInput label="Password" iconRight={<span data-testid="eye-icon">👁️</span>} />);
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('form-input-icon-left')).not.toBeInTheDocument();
    });

    it('should render with both left and right icons', () => {
      render(
        <FormInput
          label="Email"
          icon={<span data-testid="left-icon">📧</span>}
          iconRight={<span data-testid="right-icon">✅</span>}
        />
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when error prop is provided', () => {
      const errorMessage = 'This field is required';
      render(<FormInput label="Name" error={errorMessage} />);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByTestId('form-input-error')).toBeInTheDocument();
    });

    it('should apply error styling (red border) to container', () => {
      render(<FormInput label="Email" error="Invalid email" />);
      const container = screen.getByTestId('form-input-container');
      expect(container).toHaveClass('border-destructive');
    });

    it('should not display error message when error prop is not provided', () => {
      render(<FormInput label="Name" />);
      expect(screen.queryByTestId('form-input-error')).not.toBeInTheDocument();
    });

    it('should apply focus error styling on error state', () => {
      render(<FormInput label="Email" error="Invalid" />);
      const container = screen.getByTestId('form-input-container');
      expect(container).toHaveClass('focus-within:ring-destructive');
    });
  });

  describe('User Interactions', () => {
    it('should call onChange handler when user types', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<FormInput label="Name" onChange={onChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(onChange).toHaveBeenCalled();
    });

    it('should call onBlur handler when input loses focus', async () => {
      const onBlur = vi.fn();
      const user = userEvent.setup();
      render(<FormInput label="Name" onBlur={onBlur} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();

      expect(onBlur).toHaveBeenCalled();
    });

    it('should call onFocus handler when input receives focus', async () => {
      const onFocus = vi.fn();
      const user = userEvent.setup();
      render(<FormInput label="Name" onFocus={onFocus} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      expect(onFocus).toHaveBeenCalled();
    });

    it('should update input value when user types', async () => {
      const user = userEvent.setup();
      render(<FormInput label="Name" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      await user.type(input, 'John Doe');
      expect(input.value).toBe('John Doe');
    });
  });

  describe('Disabled State', () => {
    it('should apply disabled styling', () => {
      render(<FormInput label="Disabled" disabled />);
      const container = screen.getByTestId('form-input-container');
      expect(container).toHaveClass('cursor-not-allowed', 'opacity-50', 'bg-muted');
    });

    it('should have disabled attribute when disabled', () => {
      render(<FormInput label="Disabled" disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should not allow user interaction when disabled', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<FormInput label="Disabled" disabled onChange={onChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Input Types', () => {
    it('should render as text input by default', () => {
      render(<FormInput label="Text" />);
      const input = screen.getByRole('textbox');
      // HTML inputs without explicit type default to "text" but don't have the attribute
      expect(input.tagName).toBe('INPUT');
    });

    it('should render as email input when type="email"', () => {
      render(<FormInput label="Email" type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render as password input when type="password"', () => {
      render(<FormInput label="Password" type="password" />);
      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should render as number input when type="number"', () => {
      render(<FormInput label="Age" type="number" min="0" max="100" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
    });
  });

  describe('Label Behavior', () => {
    it('should associate label with input via htmlFor', () => {
      render(<FormInput label="Email" id="email-input" />);
      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('for', 'email-input');
    });

    it('should generate unique ID when id is not provided', () => {
      const { container: container1 } = render(<FormInput label="First" />);
      const firstInput = container1.querySelector('input');
      const firstId = firstInput?.getAttribute('id');

      const { container: container2 } = render(<FormInput label="Second" />);
      const secondInput = container2.querySelector('input');
      const secondId = secondInput?.getAttribute('id');

      expect(firstId).toBeTruthy();
      expect(secondId).toBeTruthy();
      expect(firstId).not.toBe(secondId);
    });
  });

  describe('Accessibility', () => {
    it('should have aria-invalid="true" when error exists', () => {
      render(<FormInput label="Email" error="Invalid email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have aria-invalid="false" when no error', () => {
      render(<FormInput label="Email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('should have aria-describedby pointing to error message', () => {
      render(<FormInput label="Email" id="email" error="Invalid" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
    });

    it('should have error message with role="alert"', () => {
      render(<FormInput label="Email" error="Invalid email" />);
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent('Invalid email');
    });
  });

  describe('Styling', () => {
    it('should apply custom className to wrapper', () => {
      render(<FormInput label="Test" className="custom-class" />);
      const wrapper = screen.getByTestId('form-input-wrapper');
      expect(wrapper).toHaveClass('custom-class');
    });

    it('should apply default classes to wrapper', () => {
      render(<FormInput label="Test" />);
      const wrapper = screen.getByTestId('form-input-wrapper');
      expect(wrapper).toHaveClass('flex', 'flex-col', 'gap-2', 'items-start', 'w-full');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<FormInput label="Test" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('should allow ref to access input methods', () => {
      const ref = createRef<HTMLInputElement>();
      render(<FormInput label="Test" ref={ref} />);
      ref.current?.focus();
      expect(document.activeElement).toBe(ref.current);
    });
  });
});
