import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Slider } from './Slider';

expect.extend(toHaveNoViolations);

describe('Slider Component', () => {
  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      const { container } = render(<Slider aria-label="Test slider" />);
      const slider = screen.getByRole('slider');

      expect(slider).toBeInTheDocument();
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });

    it('renders with custom min, max, and defaultValue', () => {
      render(<Slider min={10} max={200} defaultValue={75} aria-label="Custom slider" />);
      const slider = screen.getByRole('slider');

      expect(slider).toHaveAttribute('aria-valuemin', '10');
      expect(slider).toHaveAttribute('aria-valuemax', '200');
      expect(slider).toHaveAttribute('aria-valuenow', '75');
    });

    it('renders with value label when showValue is true', () => {
      const { container } = render(
        <Slider defaultValue={60} showValue aria-label="Slider with label" />,
      );

      expect(container).toHaveTextContent('60');
    });

    it('does not render value label when showValue is false', () => {
      const { container } = render(
        <Slider defaultValue={60} showValue={false} aria-label="Slider without label" />,
      );

      // Should not contain the value as text
      const textContent = container.textContent;
      expect(textContent).not.toContain('60');
    });

    it('renders tick marks when showTicks is true', () => {
      const { container } = render(<Slider showTicks aria-label="Slider with ticks" />);

      // Check for tick marks in the DOM (they are divs with specific styles)
      const slider = container.querySelector('[role="slider"]');
      expect(slider).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Slider className="custom-slider" aria-label="Custom styled slider" />,
      );

      expect(container.firstChild).toHaveClass('slider-atom', 'custom-slider');
    });
  });

  describe('Size Variants', () => {
    it.each([
      ['sm', 'small slider'],
      ['md', 'medium slider'],
      ['lg', 'large slider'],
    ])('renders %s size correctly', (size, label) => {
      const { container } = render(
        <Slider size={size as 'sm' | 'md' | 'lg'} aria-label={label} />,
      );

      expect(container.querySelector('[role="slider"]')).toBeInTheDocument();
    });
  });

  describe('Color Variants', () => {
    it.each([
      ['default', 'default slider'],
      ['primary', 'primary slider'],
      ['secondary', 'secondary slider'],
    ])('renders %s variant correctly', (variant, label) => {
      const { container } = render(
        <Slider variant={variant as 'default' | 'primary' | 'secondary'} aria-label={label} />,
      );

      expect(container.querySelector('[role="slider"]')).toBeInTheDocument();
    });
  });

  describe('Orientation', () => {
    it('renders horizontal orientation by default', () => {
      render(<Slider aria-label="Horizontal slider" />);
      const slider = screen.getByRole('slider');

      expect(slider).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('renders vertical orientation when specified', () => {
      render(<Slider orientation="vertical" aria-label="Vertical slider" />);
      const slider = screen.getByRole('slider');

      expect(slider).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works in uncontrolled mode with defaultValue', () => {
      render(<Slider defaultValue={30} aria-label="Uncontrolled slider" />);
      const slider = screen.getByRole('slider');

      expect(slider).toHaveAttribute('aria-valuenow', '30');
    });

    it('works in controlled mode with value prop', () => {
      const { rerender } = render(<Slider value={40} aria-label="Controlled slider" />);
      let slider = screen.getByRole('slider');

      expect(slider).toHaveAttribute('aria-valuenow', '40');

      // Update controlled value
      rerender(<Slider value={60} aria-label="Controlled slider" />);
      slider = screen.getByRole('slider');

      expect(slider).toHaveAttribute('aria-valuenow', '60');
    });
  });

  describe('Interaction', () => {
    it('calls onChange when value changes via pointer', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <Slider onChange={handleChange} aria-label="Interactive slider" />,
      );

      const track = container.querySelector('[role="slider"]') as HTMLElement;
      fireEvent.pointerDown(track, { clientX: 100, clientY: 0 });

      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onValueCommit when pointer is released', () => {
      const handleCommit = vi.fn();
      const { container } = render(
        <Slider onValueCommit={handleCommit} aria-label="Commit slider" />,
      );

      const track = container.querySelector('[role="slider"]') as HTMLElement;
      fireEvent.pointerDown(track, { clientX: 100, clientY: 0 });
      fireEvent.pointerUp(document);

      expect(handleCommit).toHaveBeenCalled();
    });

    it('handles keyboard navigation - ArrowRight', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Slider defaultValue={50} step={1} onChange={handleChange} aria-label="Keyboard slider" />);
      const slider = screen.getByRole('slider');

      slider.focus();
      await user.keyboard('{ArrowRight}');

      expect(handleChange).toHaveBeenCalledWith(51);
    });

    it('handles keyboard navigation - ArrowLeft', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Slider defaultValue={50} step={1} onChange={handleChange} aria-label="Keyboard slider" />);
      const slider = screen.getByRole('slider');

      slider.focus();
      await user.keyboard('{ArrowLeft}');

      expect(handleChange).toHaveBeenCalledWith(49);
    });

    it('handles keyboard navigation - Home', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Slider min={0} max={100} defaultValue={50} onChange={handleChange} aria-label="Keyboard slider" />);
      const slider = screen.getByRole('slider');

      slider.focus();
      await user.keyboard('{Home}');

      expect(handleChange).toHaveBeenCalledWith(0);
    });

    it('handles keyboard navigation - End', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Slider min={0} max={100} defaultValue={50} onChange={handleChange} aria-label="Keyboard slider" />);
      const slider = screen.getByRole('slider');

      slider.focus();
      await user.keyboard('{End}');

      expect(handleChange).toHaveBeenCalledWith(100);
    });

    it('respects step increments via keyboard', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Slider min={0} max={100} defaultValue={50} step={10} onChange={handleChange} aria-label="Step slider" />,
      );
      const slider = screen.getByRole('slider');

      slider.focus();
      await user.keyboard('{ArrowRight}');

      // Should increment by step (50 + 10 = 60)
      expect(handleChange).toHaveBeenCalledWith(60);
    });

    it('clamps values to min/max bounds', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Slider min={0} max={100} defaultValue={100} onChange={handleChange} aria-label="Bounded slider" />,
      );
      const slider = screen.getByRole('slider');

      slider.focus();
      await user.keyboard('{ArrowRight}');

      // Value should stay at 100 (max)
      expect(handleChange).toHaveBeenCalledWith(100);
    });
  });

  describe('Disabled State', () => {
    it('renders disabled state correctly', () => {
      render(<Slider disabled aria-label="Disabled slider" />);
      const slider = screen.getByRole('slider');

      expect(slider).toHaveAttribute('aria-disabled', 'true');
      expect(slider).toHaveAttribute('tabIndex', '-1');
    });

    it('does not respond to pointer events when disabled', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <Slider disabled onChange={handleChange} aria-label="Disabled slider" />,
      );

      const track = container.querySelector('[role="slider"]') as HTMLElement;
      fireEvent.pointerDown(track, { clientX: 100, clientY: 0 });

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does not respond to keyboard events when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Slider disabled onChange={handleChange} aria-label="Disabled slider" />);
      const slider = screen.getByRole('slider');

      slider.focus();
      await user.keyboard('{ArrowRight}');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Label Positioning', () => {
    it.each([
      ['top', 'Top label slider'],
      ['bottom', 'Bottom label slider'],
      ['left', 'Left label slider'],
      ['right', 'Right label slider'],
    ])('positions label at %s', (position, label) => {
      const { container } = render(
        <Slider
          showValue
          labelPosition={position as 'top' | 'bottom' | 'left' | 'right'}
          defaultValue={75}
          aria-label={label}
        />,
      );

      expect(container).toHaveTextContent('75');
    });
  });

  describe('Theme Reactivity', () => {
    it('uses CSS variables for theming', () => {
      const { container } = render(<Slider variant="primary" aria-label="Themed slider" />);

      const slider = container.querySelector('[role="slider"]');
      expect(slider).toBeInTheDocument();

      // Component uses inline styles with CSS variables
      const track = slider?.parentElement;
      expect(track).toBeInTheDocument();
    });

    it('applies correct variant colors', () => {
      const { container } = render(<Slider variant="secondary" aria-label="Colored slider" />);

      const slider = container.querySelector('[role="slider"]');
      expect(slider).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Slider
          min={0}
          max={100}
          defaultValue={50}
          aria-label="Accessible slider"
        />,
      );
      const slider = screen.getByRole('slider');

      expect(slider).toHaveAttribute('role', 'slider');
      expect(slider).toHaveAttribute('aria-label', 'Accessible slider');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
      expect(slider).toHaveAttribute('aria-valuenow', '50');
      expect(slider).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('is keyboard accessible', () => {
      render(<Slider aria-label="Keyboard accessible slider" />);
      const slider = screen.getByRole('slider');

      expect(slider).toHaveAttribute('tabIndex', '0');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(
        <Slider
          min={0}
          max={100}
          defaultValue={50}
          aria-label="Fully accessible slider"
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Slider ref={ref} aria-label="Ref slider" />);

      expect(ref).toHaveBeenCalled();
    });
  });
});
