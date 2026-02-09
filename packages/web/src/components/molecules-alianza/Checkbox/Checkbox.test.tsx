import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('button');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('data-name', 'Checkbox');
  });

  it('renders checked state when checked prop is true', () => {
    render(<Checkbox checked={true} />);
    const checkbox = screen.getByRole('button');
    expect(checkbox).toHaveClass('bg-primary', 'border-transparent');
  });

  it('renders unchecked state when checked prop is false', () => {
    render(<Checkbox checked={false} />);
    const checkbox = screen.getByRole('button');
    expect(checkbox).toHaveClass('bg-background', 'border-input');
  });

  it('calls onCheckedChange with true when unchecked checkbox is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox checked={false} onCheckedChange={handleChange} />);

    const checkbox = screen.getByRole('button');
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('calls onCheckedChange with false when checked checkbox is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox checked={true} onCheckedChange={handleChange} />);

    const checkbox = screen.getByRole('button');
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('does not call onCheckedChange when not provided', async () => {
    const user = userEvent.setup();
    render(<Checkbox checked={false} />);

    const checkbox = screen.getByRole('button');
    await user.click(checkbox);

    // Should not throw error
    expect(checkbox).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-checkbox-class';
    render(<Checkbox className={customClass} />);
    const checkbox = screen.getByRole('button');
    expect(checkbox).toHaveClass(customClass);
  });

  it('has button type set to button', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('button');
    expect(checkbox).toHaveAttribute('type', 'button');
  });

  it('shows check icon with full opacity when checked', () => {
    const { container } = render(<Checkbox checked={true} />);
    // The Icon component creates a wrapper div with the className
    const iconWrapper = container.querySelector('.opacity-100');
    expect(iconWrapper).toBeInTheDocument();
    expect(iconWrapper).toHaveClass('opacity-100');
  });

  it('hides check icon when unchecked', () => {
    const { container } = render(<Checkbox checked={false} />);
    // The Icon component creates a wrapper div with the className
    const iconWrapper = container.querySelector('.opacity-0');
    expect(iconWrapper).toBeInTheDocument();
    expect(iconWrapper).toHaveClass('opacity-0');
  });
});
