import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import { InputGroup } from './InputGroup';
import { Mail, Lock, Eye, EyeOff, Search, User } from 'lucide-react';

expect.extend(toHaveNoViolations);

describe('InputGroup - Molecule', () => {
  describe('Basic Rendering', () => {
    it('renders correctly', () => {
      render(<InputGroup label="Email" placeholder="Enter email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    });

    it('has displayName set', () => {
      expect(InputGroup.displayName).toBe('InputGroup');
    });

    it('renders without label', () => {
      render(<InputGroup placeholder="No label" />);
      expect(screen.getByPlaceholderText('No label')).toBeInTheDocument();
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('renders with wrapper div', () => {
      const { container } = render(<InputGroup label="Test" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('flex', 'flex-col');
    });
  });

  describe('Label', () => {
    it('displays label text', () => {
      render(<InputGroup label="Email Address" />);
      expect(screen.getByText('Email Address')).toBeInTheDocument();
    });

    it('label has correct styles', () => {
      render(<InputGroup label="Username" />);
      const label = screen.getByText('Username');
      expect(label.tagName).toBe('LABEL');
      expect(label).toHaveClass('text-body-sm', 'font-light');
    });

    it('shows required indicator when required=true', () => {
      render(<InputGroup label="Password" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('*')).toHaveClass('text-destructive');
    });

    it('does not show required indicator when required=false', () => {
      render(<InputGroup label="Optional Field" required={false} />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('associates label with input using htmlFor', () => {
      render(<InputGroup label="Email" id="email-input" placeholder="test" />);
      const label = screen.getByText('Email') as HTMLLabelElement;
      const input = screen.getByPlaceholderText('test');
      expect(label.htmlFor).toBe('email-input');
      expect(input.id).toBe('email-input');
    });

    it('generates unique ID when not provided', () => {
      const { container } = render(<InputGroup label="Email" placeholder="test" />);
      const label = screen.getByText('Email') as HTMLLabelElement;
      const input = screen.getByPlaceholderText('test');
      expect(label.htmlFor).toBeTruthy();
      expect(input.id).toBeTruthy();
      expect(label.htmlFor).toBe(input.id);
    });
  });

  describe('Input Type (as="input")', () => {
    it('renders input by default', () => {
      render(<InputGroup label="Email" placeholder="test" />);
      const input = screen.getByPlaceholderText('test');
      expect(input.tagName).toBe('INPUT');
    });

    it('renders input when as="input"', () => {
      render(<InputGroup label="Email" as="input" placeholder="test" />);
      const input = screen.getByPlaceholderText('test');
      expect(input.tagName).toBe('INPUT');
    });

    it('supports different input types', () => {
      render(<InputGroup label="Email" type="email" placeholder="test" />);
      expect(screen.getByPlaceholderText('test')).toHaveAttribute('type', 'email');
    });

    it('applies correct classes to input', () => {
      render(<InputGroup label="Email" placeholder="test" />);
      const input = screen.getByPlaceholderText('test');
      expect(input).toHaveClass('h-input', 'text-body-sm', 'font-light');
    });
  });

  describe('Textarea Type (as="textarea")', () => {
    it('renders textarea when as="textarea"', () => {
      const { container } = render(
        <InputGroup label="Description" as="textarea" placeholder="test" />,
      );
      const textarea = screen.getByPlaceholderText('test');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('textarea has correct classes', () => {
      render(<InputGroup label="Description" as="textarea" placeholder="test" />);
      const textarea = screen.getByPlaceholderText('test');
      expect(textarea).toHaveClass('text-body-sm', 'font-light', 'rounded-input');
    });

    it('textarea supports value prop', () => {
      render(
        <InputGroup
          label="Description"
          as="textarea"
          value="Test content"
          onChange={() => {}}
        />,
      );
      const textarea = screen.getByDisplayValue('Test content');
      expect(textarea).toBeInTheDocument();
    });

    it('textarea is disabled when disabled prop is true', () => {
      render(<InputGroup label="Description" as="textarea" disabled placeholder="test" />);
      expect(screen.getByPlaceholderText('test')).toBeDisabled();
    });
  });

  describe('Select Type (as="select")', () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
      { label: 'Option 3', value: '3' },
    ];

    it('renders select when as="select"', () => {
      render(
        <InputGroup label="Choose" as="select" selectOptions={options} />,
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders select options', async () => {
      const user = userEvent.setup();
      render(
        <InputGroup label="Choose" as="select" selectOptions={options} />,
      );

      const select = screen.getByRole('combobox');
      await user.click(select);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('select shows placeholder', () => {
      render(
        <InputGroup
          label="Choose"
          as="select"
          selectOptions={options}
          placeholder="Select an option"
        />,
      );
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('select is disabled when disabled prop is true', () => {
      render(
        <InputGroup label="Choose" as="select" selectOptions={options} disabled />,
      );
      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });

  describe('Icons (Input Only)', () => {
    it('renders left icon', () => {
      render(<InputGroup label="Email" iconLeft={<Mail data-testid="mail-icon" />} />);
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    });

    it('renders right icon', () => {
      render(
        <InputGroup label="Password" iconRight={<Eye data-testid="eye-icon" />} />,
      );
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    });

    it('renders both left and right icons', () => {
      render(
        <InputGroup
          label="Field"
          iconLeft={<Mail data-testid="left-icon" />}
          iconRight={<Eye data-testid="right-icon" />}
        />,
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('applies correct padding when left icon present', () => {
      render(
        <InputGroup label="Email" iconLeft={<Mail />} placeholder="test" />,
      );
      const input = screen.getByPlaceholderText('test');
      expect(input).toHaveClass('pl-[36px]');
    });

    it('applies correct padding when right icon present', () => {
      render(
        <InputGroup label="Password" iconRight={<Eye />} placeholder="test" />,
      );
      const input = screen.getByPlaceholderText('test');
      expect(input).toHaveClass('pr-[36px]');
    });

    it('applies both paddings when both icons present', () => {
      render(
        <InputGroup
          label="Field"
          iconLeft={<Mail />}
          iconRight={<Eye />}
          placeholder="test"
        />,
      );
      const input = screen.getByPlaceholderText('test');
      expect(input).toHaveClass('pl-[36px]', 'pr-[36px]');
    });

    it('left icon has pointer-events-none', () => {
      const { container } = render(
        <InputGroup label="Email" iconLeft={<Mail data-testid="mail-icon" />} />,
      );
      const iconWrapper = screen.getByTestId('mail-icon').parentElement;
      expect(iconWrapper).toHaveClass('pointer-events-none');
    });
  });

  describe('Interactive Right Icon', () => {
    it('makes right icon clickable when onIconRightClick provided', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <InputGroup
          label="Password"
          iconRight={<Eye data-testid="eye-icon" />}
          onIconRightClick={handleClick}
        />,
      );

      const iconContainer = screen.getByTestId('eye-icon').parentElement;
      await user.click(iconContainer!);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('right icon has cursor-pointer when clickable', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <InputGroup
          label="Password"
          iconRight={<Eye />}
          onIconRightClick={handleClick}
        />,
      );
      const iconWrapper = container.querySelector('.cursor-pointer');
      expect(iconWrapper).toBeInTheDocument();
    });

    it('right icon is not clickable without onIconRightClick', () => {
      render(
        <InputGroup label="Password" iconRight={<Eye data-testid="eye-icon" />} />,
      );

      const iconContainer = screen.getByTestId('eye-icon').parentElement;
      expect(iconContainer).toHaveClass('pointer-events-none');
    });

    it('supports keyboard interaction on clickable icon (Enter)', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <InputGroup
          label="Password"
          iconRight={<Eye data-testid="eye-icon" />}
          onIconRightClick={handleClick}
        />,
      );

      const iconContainer = screen.getByTestId('eye-icon').parentElement;
      iconContainer?.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('supports keyboard interaction on clickable icon (Space)', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <InputGroup
          label="Password"
          iconRight={<Eye data-testid="eye-icon" />}
          onIconRightClick={handleClick}
        />,
      );

      const iconContainer = screen.getByTestId('eye-icon').parentElement;
      iconContainer?.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('right icon has role="button" when clickable', () => {
      const handleClick = vi.fn();
      render(
        <InputGroup
          label="Password"
          iconRight={<Eye data-testid="eye-icon" />}
          onIconRightClick={handleClick}
        />,
      );

      const iconContainer = screen.getByTestId('eye-icon').parentElement;
      expect(iconContainer).toHaveAttribute('role', 'button');
    });

    it('right icon has tabIndex when clickable', () => {
      const handleClick = vi.fn();
      render(
        <InputGroup
          label="Password"
          iconRight={<Eye data-testid="eye-icon" />}
          onIconRightClick={handleClick}
        />,
      );

      const iconContainer = screen.getByTestId('eye-icon').parentElement;
      expect(iconContainer).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Variants', () => {
    it('applies default variant classes', () => {
      render(<InputGroup label="Email" variant="default" placeholder="test" />);
      const input = screen.getByPlaceholderText('test');
      expect(input).toHaveClass('border-input');
    });

    it('applies error variant classes', () => {
      render(<InputGroup label="Email" variant="error" placeholder="test" />);
      const input = screen.getByPlaceholderText('test');
      expect(input).toHaveClass('border-destructive');
    });

    it('applies success variant classes', () => {
      render(<InputGroup label="Email" variant="success" placeholder="test" />);
      const input = screen.getByPlaceholderText('test');
      expect(input).toHaveClass('border-success');
    });

    it('error variant applies to textarea', () => {
      render(
        <InputGroup label="Description" as="textarea" variant="error" placeholder="test" />,
      );
      const textarea = screen.getByPlaceholderText('test');
      expect(textarea).toHaveClass('border-destructive');
    });

    it('success variant applies to select', () => {
      render(
        <InputGroup
          label="Choose"
          as="select"
          variant="success"
          selectOptions={[{ label: 'Option 1', value: '1' }]}
        />,
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('border-success');
    });
  });

  describe('Message Display', () => {
    it('displays message text', () => {
      render(<InputGroup label="Email" message="Enter your email address" />);
      expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });

    it('message has default color', () => {
      render(<InputGroup label="Email" message="Helper text" />);
      const message = screen.getByText('Helper text');
      expect(message).toHaveClass('text-muted-foreground-m');
    });

    it('message has error color when variant is error', () => {
      render(<InputGroup label="Email" variant="error" message="Error message" />);
      const message = screen.getByText('Error message');
      expect(message).toHaveClass('text-destructive');
    });

    it('message has success color when variant is success', () => {
      render(
        <InputGroup label="Email" variant="success" message="Success message" />,
      );
      const message = screen.getByText('Success message');
      expect(message).toHaveClass('text-success');
    });

    it('message has correct styles', () => {
      render(<InputGroup label="Email" message="Test message" />);
      const message = screen.getByText('Test message');
      expect(message.tagName).toBe('P');
      expect(message).toHaveClass('font-light');
      expect(message).toHaveClass('text-muted-foreground-m');
    });

    it('message has role="alert" when variant is error', () => {
      render(<InputGroup label="Email" variant="error" message="Error" />);
      const message = screen.getByText('Error');
      expect(message).toHaveAttribute('role', 'alert');
    });
  });

  describe('Disabled State', () => {
    it('disables input when disabled prop is true', () => {
      render(<InputGroup label="Email" disabled placeholder="test" />);
      expect(screen.getByPlaceholderText('test')).toBeDisabled();
    });

    it('applies disabled styling to input', () => {
      render(<InputGroup label="Email" disabled placeholder="test" />);
      const input = screen.getByPlaceholderText('test');
      expect(input).toHaveClass('cursor-not-allowed');
    });

    it('does not allow input when disabled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <InputGroup
          label="Email"
          disabled
          onChange={onChange}
          placeholder="test"
        />,
      );

      const input = screen.getByPlaceholderText('test');
      await user.type(input, 'test');

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    it('handles onChange events', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <InputGroup label="Email" onChange={onChange} placeholder="test" />,
      );

      const input = screen.getByPlaceholderText('test');
      await user.type(input, 'hello');

      expect(onChange).toHaveBeenCalled();
      expect(input).toHaveValue('hello');
    });

    it('handles onFocus events', async () => {
      const user = userEvent.setup();
      const onFocus = vi.fn();
      render(<InputGroup label="Email" onFocus={onFocus} placeholder="test" />);

      const input = screen.getByPlaceholderText('test');
      await user.click(input);

      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('handles onBlur events', async () => {
      const user = userEvent.setup();
      const onBlur = vi.fn();
      render(<InputGroup label="Email" onBlur={onBlur} placeholder="test" />);

      const input = screen.getByPlaceholderText('test');
      await user.click(input);
      await user.tab();

      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Value Control', () => {
    it('works as controlled input', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { rerender } = render(
        <InputGroup label="Email" value="" onChange={onChange} placeholder="test" />,
      );

      const input = screen.getByPlaceholderText('test');
      expect(input).toHaveValue('');

      await user.type(input, 'a');
      expect(onChange).toHaveBeenCalled();

      rerender(
        <InputGroup label="Email" value="a" onChange={onChange} placeholder="test" />,
      );
      expect(input).toHaveValue('a');
    });

    it('works as uncontrolled input', () => {
      render(
        <InputGroup label="Email" defaultValue="initial" placeholder="test" />,
      );
      const input = screen.getByPlaceholderText('test');
      expect(input).toHaveValue('initial');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <InputGroup label="Email" placeholder="Enter email" />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with error', async () => {
      const { container } = render(
        <InputGroup label="Email" variant="error" message="Invalid email" />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with icons', async () => {
      const { container } = render(
        <InputGroup label="Email" iconLeft={<Mail />} iconRight={<Eye />} />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations as textarea', async () => {
      const { container } = render(
        <InputGroup label="Description" as="textarea" />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations as select', async () => {
      const { container } = render(
        <InputGroup
          label="Choose"
          as="select"
          selectOptions={[{ label: 'Option', value: '1' }]}
          placeholder="Select an option"
        />,
      );
      // Note: Radix UI Select has known accessibility issues with empty state
      // The button-name violation occurs when no option is selected
      // This is a limitation of the underlying Radix UI component
      const results = await axe(container, {
        rules: {
          'button-name': { enabled: false }, // Disabled due to Radix UI limitation
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('input has aria-invalid when error variant', () => {
      render(<InputGroup label="Email" variant="error" placeholder="test" />);
      const input = screen.getByPlaceholderText('test');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('input has aria-describedby when message is present', () => {
      render(
        <InputGroup label="Email" message="Helper text" placeholder="test" id="email" />,
      );
      const input = screen.getByPlaceholderText('test');
      expect(input).toHaveAttribute('aria-describedby', 'email-message');
    });

    it('textarea has aria-invalid when error variant', () => {
      render(
        <InputGroup
          label="Description"
          as="textarea"
          variant="error"
          placeholder="test"
        />,
      );
      const textarea = screen.getByPlaceholderText('test');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('select has aria-invalid when error variant', () => {
      render(
        <InputGroup
          label="Choose"
          as="select"
          variant="error"
          selectOptions={[{ label: 'Option', value: '1' }]}
        />,
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = vi.fn();
      render(<InputGroup ref={ref} label="Email" />);
      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Custom Props', () => {
    it('accepts className prop for container', () => {
      const { container } = render(
        <InputGroup label="Email" className="custom-container-class" />,
      );
      expect(container.firstChild).toHaveClass('custom-container-class');
    });

    it('spreads additional HTML attributes to input', () => {
      render(
        <InputGroup
          label="Email"
          placeholder="test"
          data-testid="custom-input"
          autoComplete="email"
        />,
      );
      const input = screen.getByPlaceholderText('test');
      expect(input).toHaveAttribute('data-testid', 'custom-input');
      expect(input).toHaveAttribute('autoComplete', 'email');
    });

    it('accepts name attribute', () => {
      render(<InputGroup label="Email" name="userEmail" placeholder="test" />);
      const input = screen.getByPlaceholderText('test');
      expect(input).toHaveAttribute('name', 'userEmail');
    });
  });

  describe('Real-world Use Cases', () => {
    it('password field with toggle visibility', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [showPassword, setShowPassword] = React.useState(false);
        return (
          <InputGroup
            label="Password"
            type={showPassword ? 'text' : 'password'}
            iconLeft={<Lock />}
            iconRight={showPassword ? <EyeOff /> : <Eye />}
            onIconRightClick={() => setShowPassword(!showPassword)}
            placeholder="Enter password"
          />
        );
      };

      render(<TestComponent />);
      const input = screen.getByPlaceholderText('Enter password');
      expect(input).toHaveAttribute('type', 'password');

      const iconWrapper = screen.getByPlaceholderText('Enter password')
        .parentElement?.querySelector('[role="button"]');
      await user.click(iconWrapper!);

      expect(input).toHaveAttribute('type', 'text');
    });

    it('email field with validation error', () => {
      render(
        <InputGroup
          label="Email"
          type="email"
          iconLeft={<Mail />}
          variant="error"
          message="Please enter a valid email address"
          required
        />,
      );

      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    it('search field with icon', () => {
      render(
        <InputGroup
          label="Search"
          type="search"
          iconLeft={<Search />}
          placeholder="Search..."
        />,
      );

      expect(screen.getByLabelText('Search')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search...')).toHaveAttribute('type', 'search');
    });

    it('textarea for description', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <InputGroup
          label="Description"
          as="textarea"
          placeholder="Enter description..."
          onChange={onChange}
        />,
      );

      const textarea = screen.getByPlaceholderText('Enter description...');
      await user.type(textarea, 'Test');

      expect(onChange).toHaveBeenCalled();
    });

    it('select dropdown for country selection', async () => {
      const user = userEvent.setup();
      const countries = [
        { label: 'United States', value: 'us' },
        { label: 'Canada', value: 'ca' },
        { label: 'Mexico', value: 'mx' },
      ];

      render(
        <InputGroup
          label="Country"
          as="select"
          selectOptions={countries}
          placeholder="Select country"
        />,
      );

      const select = screen.getByRole('combobox');
      await user.click(select);

      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('Mexico')).toBeInTheDocument();
    });
  });
});
