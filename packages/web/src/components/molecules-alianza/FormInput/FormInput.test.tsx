import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormInput } from './FormInput';

describe('FormInput', () => {
  it('renders with label', () => {
    render(<FormInput label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<FormInput label="Username" placeholder="Enter username" />);
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('renders with left icon', () => {
    const { container } = render(
      <FormInput label="Search" icon={<span data-testid="search-icon">🔍</span>} />
    );
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    const { container } = render(
      <FormInput label="Password" iconRight={<span data-testid="eye-icon">👁️</span>} />
    );
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
  });

  it('renders with both left and right icons', () => {
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

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    render(<FormInput label="Name" error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toHaveClass('text-destructive');
  });

  it('applies error styling to input wrapper when error exists', () => {
    const { container } = render(<FormInput label="Email" error="Invalid email" />);
    const inputWrapper = container.querySelector('.border-destructive');
    expect(inputWrapper).toBeInTheDocument();
  });

  it('applies custom className to wrapper', () => {
    const { container } = render(<FormInput label="Test" className="custom-class" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('passes through input props correctly', () => {
    render(<FormInput label="Age" type="number" min="0" max="100" />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('handles disabled state correctly', () => {
    const { container } = render(<FormInput label="Disabled" disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    const wrapper = container.querySelector('.cursor-not-allowed.opacity-50.bg-muted');
    expect(wrapper).toBeInTheDocument();
  });

  it('allows user to type in input', async () => {
    const user = userEvent.setup();
    render(<FormInput label="Name" />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'John Doe');
    expect(input).toHaveValue('John Doe');
  });

  it('does not display error message when error prop is not provided', () => {
    const { container } = render(<FormInput label="Name" />);
    const errorText = container.querySelector('.text-destructive');
    expect(errorText).not.toBeInTheDocument();
  });
});
