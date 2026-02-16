import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CharacterCount } from './CharacterCount';

expect.extend(toHaveNoViolations);

describe('CharacterCount', () => {
  it('renders current count', () => {
    render(<CharacterCount current={10} max={100} />);
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  it('shows max when provided', () => {
    render(<CharacterCount current={10} max={100} />);
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('renders nothing when max is not provided', () => {
    const { container } = render(<CharacterCount current={10} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('applies default styling when under 80%', () => {
    render(<CharacterCount current={50} max={100} />);
    const element = screen.getByText(/50 \/ 100/);
    expect(element).toHaveClass('text-muted-foreground');
    expect(element).not.toHaveClass('text-orange-500');
    expect(element).not.toHaveClass('text-destructive');
  });

  it('applies warning styling when near limit (>80%)', () => {
    render(<CharacterCount current={85} max={100} />);
    const element = screen.getByText(/85 \/ 100/);
    expect(element).toHaveClass('text-orange-500');
    expect(element).not.toHaveClass('text-destructive');
  });

  it('applies error styling when over limit', () => {
    render(<CharacterCount current={105} max={100} />);
    const element = screen.getByText(/105 \/ 100/);
    expect(element).toHaveClass('text-destructive');
    expect(element).toHaveClass('font-medium');
    expect(element).not.toHaveClass('text-orange-500');
  });

  it('applies custom className', () => {
    render(<CharacterCount current={10} max={100} className="custom-class" />);
    const element = screen.getByText(/10 \/ 100/);
    expect(element).toHaveClass('custom-class');
  });

  it('has proper ARIA attributes', () => {
    render(<CharacterCount current={42} max={100} />);
    const element = screen.getByText(/42 \/ 100/);
    expect(element).toHaveAttribute('role', 'status');
    expect(element).toHaveAttribute('aria-live', 'polite');
    expect(element).toHaveAttribute('aria-label', '42 of 100 characters used');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<CharacterCount current={10} max={100} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations when near limit', async () => {
    const { container } = render(<CharacterCount current={95} max={100} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations when over limit', async () => {
    const { container } = render(<CharacterCount current={105} max={100} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
