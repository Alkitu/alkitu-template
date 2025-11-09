import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RadioButton } from './RadioButton';

expect.extend(toHaveNoViolations);

describe('RadioButton Component', () => {
  describe('Rendering', () => {
    it('renders correctly with minimal props', () => {
      render(<RadioButton name="test" value="option1" data-testid="radio" />);

      const input = screen.getByTestId('radio-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('name', 'test');
      expect(input).toHaveAttribute('value', 'option1');
    });

    it('renders with label', () => {
      render(
        <RadioButton
          name="test"
          value="option1"
          label="Option 1"
          id="test-1"
        />,
      );

      const label = screen.getByText('Option 1');
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('for', 'test-1');
    });

    it('renders with description', () => {
      render(
        <RadioButton
          name="test"
          value="option1"
          description="This is option 1"
          id="test-1"
        />,
      );

      const description = screen.getByText('This is option 1');
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute('id', 'test-1-description');
    });

    it('renders with both label and description', () => {
      render(
        <RadioButton
          name="test"
          value="option1"
          label="Option 1"
          description="Description text"
          id="test-1"
        />,
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('renders checked state with visible dot', () => {
      const { container } = render(
        <RadioButton
          name="test"
          value="option1"
          checked={true}
          data-testid="radio"
        />,
      );

      const input = screen.getByTestId('radio-input');
      expect(input).toBeChecked();

      const dot = screen.getByTestId('radio-dot');
      expect(dot).toBeInTheDocument();
    });

    it('does not render dot when unchecked', () => {
      render(
        <RadioButton
          name="test"
          value="option1"
          checked={false}
          data-testid="radio"
        />,
      );

      const dot = screen.queryByTestId('radio-dot');
      expect(dot).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it.each([
      ['default', 'border-input'],
      ['error', 'border-destructive'],
      ['success', 'border-success'],
      ['warning', 'border-warning'],
    ] as const)(
      'applies correct classes for %s variant',
      (variant, expectedClass) => {
        render(
          <RadioButton
            name="test"
            value="option1"
            variant={variant}
            data-testid="radio"
          />,
        );

        const customRadio = screen.getByTestId('radio-custom');
        expect(customRadio).toHaveClass(expectedClass);
      },
    );

    it('applies correct dot color for each variant', () => {
      const variants = [
        { variant: 'default' as const, colorClass: 'bg-primary' },
        { variant: 'error' as const, colorClass: 'bg-destructive' },
        { variant: 'success' as const, colorClass: 'bg-success' },
        { variant: 'warning' as const, colorClass: 'bg-warning' },
      ];

      variants.forEach(({ variant, colorClass }) => {
        const { unmount } = render(
          <RadioButton
            name="test"
            value="option1"
            variant={variant}
            checked={true}
            data-testid={`radio-${variant}`}
          />,
        );

        const dot = screen.getByTestId(`radio-${variant}-dot`);
        expect(dot).toHaveClass(colorClass);

        unmount();
      });
    });
  });

  describe('Sizes', () => {
    it.each([
      ['sm', 'h-4', 'w-4'],
      ['md', 'h-5', 'w-5'],
      ['lg', 'h-6', 'w-6'],
    ] as const)('applies correct size classes for %s', (size, height, width) => {
      render(
        <RadioButton
          name="test"
          value="option1"
          size={size}
          data-testid="radio"
        />,
      );

      const customRadio = screen.getByTestId('radio-custom');
      expect(customRadio).toHaveClass(height, width);
    });

    it.each([
      ['sm', 'h-2', 'w-2'],
      ['md', 'h-2.5', 'w-2.5'],
      ['lg', 'h-3', 'w-3'],
    ] as const)(
      'applies correct dot size for %s size',
      (size, height, width) => {
        render(
          <RadioButton
            name="test"
            value="option1"
            size={size}
            checked={true}
            data-testid="radio"
          />,
        );

        const dot = screen.getByTestId('radio-dot');
        expect(dot).toHaveClass(height, width);
      },
    );
  });

  describe('Disabled State', () => {
    it('renders disabled state correctly', () => {
      render(
        <RadioButton
          name="test"
          value="option1"
          disabled={true}
          data-testid="radio"
        />,
      );

      const input = screen.getByTestId('radio-input');
      expect(input).toBeDisabled();

      const customRadio = screen.getByTestId('radio-custom');
      expect(customRadio).toHaveClass('cursor-not-allowed');
      expect(customRadio).toHaveAttribute('aria-disabled', 'true');
      expect(customRadio).toHaveAttribute('tabIndex', '-1');
    });

    it('applies disabled classes to label', () => {
      render(
        <RadioButton
          name="test"
          value="option1"
          label="Disabled option"
          disabled={true}
          id="test-1"
          data-testid="radio"
        />,
      );

      const label = screen.getByTestId('radio-label');
      expect(label).toHaveClass('text-muted-foreground', 'cursor-not-allowed');
    });

    it('does not call onChange when disabled and clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <RadioButton
          name="test"
          value="option1"
          disabled={true}
          onChange={handleChange}
          data-testid="radio"
        />,
      );

      const customRadio = screen.getByTestId('radio-custom');
      await user.click(customRadio);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    it('calls onChange when clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <RadioButton
          name="test"
          value="option1"
          onChange={handleChange}
          data-testid="radio"
        />,
      );

      const customRadio = screen.getByTestId('radio-custom');
      await user.click(customRadio);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('option1');
    });

    it('calls onChange when label is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <RadioButton
          name="test"
          value="option1"
          label="Click me"
          id="test-1"
          onChange={handleChange}
        />,
      );

      const label = screen.getByText('Click me');
      await user.click(label);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('option1');
    });

    it('handles Space key press', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <RadioButton
          name="test"
          value="option1"
          onChange={handleChange}
          data-testid="radio"
        />,
      );

      const customRadio = screen.getByTestId('radio-custom');
      customRadio.focus();
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('option1');
    });

    it('handles Enter key press', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <RadioButton
          name="test"
          value="option1"
          onChange={handleChange}
          data-testid="radio"
        />,
      );

      const customRadio = screen.getByTestId('radio-custom');
      customRadio.focus();
      await user.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('option1');
    });

    it('does not call onChange for other keys', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <RadioButton
          name="test"
          value="option1"
          onChange={handleChange}
          data-testid="radio"
        />,
      );

      const customRadio = screen.getByTestId('radio-custom');
      customRadio.focus();
      await user.keyboard('a');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <RadioButton
          name="test"
          value="option1"
          checked={true}
          data-testid="radio"
        />,
      );

      const customRadio = screen.getByTestId('radio-custom');
      expect(customRadio).toHaveAttribute('role', 'radio');
      expect(customRadio).toHaveAttribute('aria-checked', 'true');
      expect(customRadio).toHaveAttribute('aria-disabled', 'false');
    });

    it('links description with aria-describedby', () => {
      render(
        <RadioButton
          name="test"
          value="option1"
          description="Helper text"
          id="test-1"
          data-testid="radio"
        />,
      );

      const input = screen.getByTestId('radio-input');
      expect(input).toHaveAttribute('aria-describedby', 'test-1-description');
    });

    it('is keyboard navigable when enabled', () => {
      render(
        <RadioButton
          name="test"
          value="option1"
          data-testid="radio"
        />,
      );

      const customRadio = screen.getByTestId('radio-custom');
      expect(customRadio).toHaveAttribute('tabIndex', '0');
    });

    it('is not keyboard navigable when disabled', () => {
      render(
        <RadioButton
          name="test"
          value="option1"
          disabled={true}
          data-testid="radio"
        />,
      );

      const customRadio = screen.getByTestId('radio-custom');
      expect(customRadio).toHaveAttribute('tabIndex', '-1');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(
        <RadioButton
          name="test"
          value="option1"
          label="Accessible option"
          id="test-1"
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when checked', async () => {
      const { container } = render(
        <RadioButton
          name="test"
          value="option1"
          label="Accessible option"
          id="test-1"
          checked={true}
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when disabled', async () => {
      const { container } = render(
        <RadioButton
          name="test"
          value="option1"
          label="Disabled option"
          id="test-1"
          disabled={true}
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Theme Reactivity', () => {
    it('uses theme CSS variables for borders', () => {
      render(
        <RadioButton
          name="test"
          value="option1"
          variant="default"
          data-testid="radio"
        />,
      );

      const customRadio = screen.getByTestId('radio-custom');
      expect(customRadio).toHaveClass('border-input');
    });

    it('uses theme CSS variables for dot colors', () => {
      render(
        <RadioButton
          name="test"
          value="option1"
          variant="default"
          checked={true}
          data-testid="radio"
        />,
      );

      const dot = screen.getByTestId('radio-dot');
      expect(dot).toHaveClass('bg-primary');
    });

    it('applies typography CSS variables to label', () => {
      render(
        <RadioButton
          name="test"
          value="option1"
          label="Styled label"
          id="test-1"
          data-testid="radio"
        />,
      );

      const label = screen.getByTestId('radio-label');
      const style = window.getComputedStyle(label);

      // These should be applied via inline styles
      expect(label.style.fontFamily).toBe(
        'var(--typography-emphasis-font-family)',
      );
      expect(label.style.fontSize).toBe('var(--typography-emphasis-font-size)');
      expect(label.style.fontWeight).toBe(
        'var(--typography-emphasis-font-weight)',
      );
    });

    it('applies typography CSS variables to description', () => {
      render(
        <RadioButton
          name="test"
          value="option1"
          description="Styled description"
          id="test-1"
          data-testid="radio"
        />,
      );

      const description = screen.getByTestId('radio-description');

      expect(description.style.fontFamily).toBe(
        'var(--typography-paragraph-font-family)',
      );
      expect(description.style.fontSize).toBe(
        'var(--typography-paragraph-font-size)',
      );
      expect(description.style.fontWeight).toBe(
        'var(--typography-paragraph-font-weight)',
      );
    });
  });

  describe('Custom Props', () => {
    it('forwards className to wrapper', () => {
      render(
        <RadioButton
          name="test"
          value="option1"
          className="custom-class"
          data-testid="radio"
        />,
      );

      const wrapper = screen.getByTestId('radio');
      expect(wrapper).toHaveClass('custom-class');
    });

    it('forwards data-testid correctly', () => {
      render(
        <RadioButton
          name="test"
          value="option1"
          data-testid="custom-radio"
        />,
      );

      expect(screen.getByTestId('custom-radio')).toBeInTheDocument();
      expect(screen.getByTestId('custom-radio-input')).toBeInTheDocument();
      expect(screen.getByTestId('custom-radio-custom')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <RadioButton
          ref={ref}
          name="test"
          value="option1"
        />,
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Radio Group Behavior', () => {
    it('renders multiple radio buttons with same name', () => {
      const { container } = render(
        <div>
          <RadioButton name="group" value="option1" id="opt1" />
          <RadioButton name="group" value="option2" id="opt2" />
          <RadioButton name="group" value="option3" id="opt3" />
        </div>,
      );

      const radios = container.querySelectorAll('input[type="radio"]');
      expect(radios).toHaveLength(3);

      radios.forEach((radio) => {
        expect(radio).toHaveAttribute('name', 'group');
      });
    });

    it('only one radio can be checked in a group', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      const { rerender } = render(
        <div>
          <RadioButton
            name="group"
            value="option1"
            checked={true}
            onChange={handleChange}
            data-testid="radio1"
          />
          <RadioButton
            name="group"
            value="option2"
            checked={false}
            onChange={handleChange}
            data-testid="radio2"
          />
        </div>,
      );

      const radio1Input = screen.getByTestId('radio1-input');
      const radio2Custom = screen.getByTestId('radio2-custom');

      expect(radio1Input).toBeChecked();

      await user.click(radio2Custom);

      expect(handleChange).toHaveBeenCalledWith('option2');
    });
  });
});
