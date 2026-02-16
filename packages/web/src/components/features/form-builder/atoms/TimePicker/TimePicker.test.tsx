import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TimePicker } from './TimePicker';

expect.extend(toHaveNoViolations);

describe('TimePicker', () => {
  it('renders with default placeholder', () => {
    const onChange = vi.fn();
    render(<TimePicker onChange={onChange} />);
    expect(screen.getByText('Select time')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const onChange = vi.fn();
    render(<TimePicker onChange={onChange} placeholder="Pick a time" />);
    expect(screen.getByText('Pick a time')).toBeInTheDocument();
  });

  it('renders with Spanish locale', () => {
    const onChange = vi.fn();
    render(<TimePicker onChange={onChange} locale="es" />);
    expect(screen.getByText('Seleccionar hora')).toBeInTheDocument();
  });

  it('displays the provided time value in 24h format', () => {
    const onChange = vi.fn();
    render(<TimePicker value="14:30" onChange={onChange} format24 />);
    expect(screen.getByText('14:30')).toBeInTheDocument();
  });

  it('displays the provided time value in 12h format', () => {
    const onChange = vi.fn();
    render(<TimePicker value="14:30" onChange={onChange} />);
    expect(screen.getByText(/02:30 PM/)).toBeInTheDocument();
  });

  it('opens popover when trigger is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onChange={onChange} />);

    const trigger = screen.getByRole('button', { name: /select time/i });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByLabelText(/hours/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/minutes/i)).toBeInTheDocument();
    });
  });

  it('updates hours input correctly in 24h format', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onChange={onChange} format24 />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    const hoursInput = screen.getByLabelText(/hours/i);
    await user.clear(hoursInput);
    await user.type(hoursInput, '15');

    expect(hoursInput).toHaveValue(15);
  });

  it('updates minutes input correctly', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onChange={onChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    const minutesInput = screen.getByLabelText(/minutes/i);
    await user.clear(minutesInput);
    await user.type(minutesInput, '45');

    expect(minutesInput).toHaveValue(45);
  });

  it('shows seconds input when includeSeconds is true', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onChange={onChange} includeSeconds />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByLabelText(/seconds/i)).toBeInTheDocument();
    });
  });

  it('calls onChange with correct time in 24h format when Accept is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onChange={onChange} format24 />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    const hoursInput = screen.getByLabelText(/hours/i);
    const minutesInput = screen.getByLabelText(/minutes/i);

    await user.clear(hoursInput);
    await user.type(hoursInput, '14');
    await user.clear(minutesInput);
    await user.type(minutesInput, '30');

    const acceptButton = screen.getByRole('button', { name: /accept/i });
    await user.click(acceptButton);

    expect(onChange).toHaveBeenCalledWith('14:30');
  });

  it('calls onChange with correct time in 12h format with AM/PM', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onChange={onChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    const hoursInput = screen.getByLabelText(/hours/i);
    const minutesInput = screen.getByLabelText(/minutes/i);

    await user.clear(hoursInput);
    await user.type(hoursInput, '2');
    await user.clear(minutesInput);
    await user.type(minutesInput, '30');

    const pmButton = screen.getByRole('button', { name: 'PM', pressed: false });
    await user.click(pmButton);

    const acceptButton = screen.getByRole('button', { name: /accept/i });
    await user.click(acceptButton);

    expect(onChange).toHaveBeenCalledWith('14:30');
  });

  it('displays interval options when interval prop is provided', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onChange={onChange} interval={15} format24 />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('00:00')).toBeInTheDocument();
      expect(screen.getByText('00:15')).toBeInTheDocument();
      expect(screen.getByText('00:30')).toBeInTheDocument();
      expect(screen.getByText('00:45')).toBeInTheDocument();
    });
  });

  it('selects time from interval options when clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onChange={onChange} interval={30} format24 />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    const option = await screen.findByText('12:30');
    await user.click(option);

    expect(onChange).toHaveBeenCalledWith('12:30');
  });

  it('respects minHour restriction', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onChange={onChange} format24 minHour={9} maxHour={17} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    const hoursInput = screen.getByLabelText(/hours/i) as HTMLInputElement;
    expect(hoursInput.min).toBe('9');
    expect(hoursInput.max).toBe('17');
  });

  it('disables the trigger button when disabled prop is true', () => {
    const onChange = vi.fn();
    render(<TimePicker onChange={onChange} disabled />);

    const trigger = screen.getByRole('button');
    expect(trigger).toBeDisabled();
  });

  it('applies custom className to trigger button', () => {
    const onChange = vi.fn();
    render(<TimePicker onChange={onChange} className="custom-class" />);

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass('custom-class');
  });

  it('closes popover when Cancel button is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onChange={onChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByLabelText(/hours/i)).not.toBeInTheDocument();
    });
  });

  it('has proper ARIA attributes on trigger button', () => {
    const onChange = vi.fn();
    render(<TimePicker onChange={onChange} />);

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-label', 'Select time');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('updates aria-expanded when popover is opened', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onChange={onChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('has no accessibility violations', async () => {
    const onChange = vi.fn();
    const { container } = render(<TimePicker onChange={onChange} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with popover open', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(<TimePicker onChange={onChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(async () => {
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  it('has no accessibility violations with intervals', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(<TimePicker onChange={onChange} interval={30} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(async () => {
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
