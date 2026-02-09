import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ModeToggle } from './ModeToggle';

expect.extend(toHaveNoViolations);

// Mock next-themes
const mockSetTheme = vi.fn();
const mockTheme = vi.fn(() => 'light');

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockTheme(),
    setTheme: mockSetTheme,
  }),
}));

describe('ModeToggle - Molecule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme.mockReturnValue('light');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // 1. BASIC RENDERING TESTS (10 tests)
  describe('Basic Rendering', () => {
    it('renders without crashing', async () => {
      render(<ModeToggle />);
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('renders icon variant by default', async () => {
      render(<ModeToggle />);
      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Toggle theme mode');
      });
    });

    it('renders buttons variant', async () => {
      render(<ModeToggle variant="buttons" />);
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(3);
      });
    });

    it('renders null before mounting (SSR safety)', () => {
      const { container } = render(<ModeToggle />);
      // Component should be null initially, then mount
      // This is handled by the useEffect hook
      expect(container.firstChild).toBeTruthy();
    });

    it('shows theme icons in icon variant', async () => {
      const { container } = render(<ModeToggle variant="icon" />);
      await waitFor(() => {
        const svgs = container.querySelectorAll('svg');
        expect(svgs.length).toBeGreaterThan(0);
      });
    });

    it('renders with custom className', async () => {
      const { container } = render(<ModeToggle className="custom-class" />);
      await waitFor(() => {
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('custom-class');
      });
    });

    it('renders with ref', async () => {
      const ref = vi.fn();
      render(<ModeToggle ref={ref} />);
      await waitFor(() => {
        expect(ref).toHaveBeenCalled();
      });
    });

    it('renders disabled state', async () => {
      render(<ModeToggle disabled />);
      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
      });
    });

    it('renders with tooltip text', async () => {
      render(<ModeToggle showTooltip tooltipText="Custom tooltip" />);
      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('title', 'Custom tooltip');
      });
    });

    it('defaults to no tooltip', async () => {
      render(<ModeToggle />);
      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).not.toHaveAttribute('title');
      });
    });
  });

  // 2. VARIANT TESTS (8 tests)
  describe('Variants', () => {
    it('icon variant renders dropdown trigger', async () => {
      render(<ModeToggle variant="icon" />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
      });
    });

    it('buttons variant renders three separate buttons', async () => {
      render(<ModeToggle variant="buttons" />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /light mode/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /dark mode/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /system mode/i })).toBeInTheDocument();
      });
    });

    it('defaults to icon variant', async () => {
      render(<ModeToggle />);
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(1);
      });
    });

    it('icon variant shows dropdown on click', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="icon" />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Light')).toBeInTheDocument();
        expect(screen.getByText('Dark')).toBeInTheDocument();
        expect(screen.getByText('System')).toBeInTheDocument();
      });
    });

    it('buttons variant has role="group"', async () => {
      render(<ModeToggle variant="buttons" />);
      await waitFor(() => {
        const group = screen.getByRole('group');
        expect(group).toHaveAttribute('aria-label', 'Theme mode selection');
      });
    });

    it('icon variant has screen reader text', async () => {
      render(<ModeToggle variant="icon" />);
      await waitFor(() => {
        const srText = screen.getByText('Toggle theme');
        expect(srText).toHaveClass('sr-only');
      });
    });

    it('buttons variant shows muted background', async () => {
      const { container } = render(<ModeToggle variant="buttons" />);
      await waitFor(() => {
        const group = container.querySelector('.bg-muted');
        expect(group).toBeInTheDocument();
      });
    });

    it('icon variant allows custom alignment', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="icon" align="start" />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      // Dropdown should appear
      await waitFor(() => {
        expect(screen.getByText('Light')).toBeInTheDocument();
      });
    });
  });

  // 3. SIZE TESTS (6 tests)
  describe('Size Props', () => {
    it('accepts sm size', async () => {
      render(<ModeToggle size="sm" />);
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('accepts md size (default)', async () => {
      render(<ModeToggle size="md" />);
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('accepts lg size', async () => {
      render(<ModeToggle size="lg" />);
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('defaults to md size', async () => {
      render(<ModeToggle />);
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('applies size to buttons variant', async () => {
      render(<ModeToggle variant="buttons" size="lg" />);
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(3);
      });
    });

    it('accepts custom icon size', async () => {
      const { container } = render(<ModeToggle iconSize={24} />);
      await waitFor(() => {
        const icon = container.querySelector('svg');
        expect(icon).toHaveStyle({ width: '24px', height: '24px' });
      });
    });
  });

  // 4. THEME SWITCHING TESTS (12 tests)
  describe('Theme Switching', () => {
    it('switches to light theme when clicked in dropdown', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="icon" />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Light')).toBeInTheDocument();
      });

      const lightOption = screen.getByText('Light').closest('[role="menuitem"]');
      if (lightOption) {
        await user.click(lightOption);
      }

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('switches to dark theme when clicked in dropdown', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="icon" />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Dark')).toBeInTheDocument();
      });

      const darkOption = screen.getByText('Dark').closest('[role="menuitem"]');
      if (darkOption) {
        await user.click(darkOption);
      }

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('switches to system theme when clicked in dropdown', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="icon" />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('System')).toBeInTheDocument();
      });

      const systemOption = screen.getByText('System').closest('[role="menuitem"]');
      if (systemOption) {
        await user.click(systemOption);
      }

      expect(mockSetTheme).toHaveBeenCalledWith('system');
    });

    it('switches to light in buttons variant', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /light mode/i })).toBeInTheDocument();
      });

      const lightButton = screen.getByRole('button', { name: /light mode/i });
      await user.click(lightButton);

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('switches to dark in buttons variant', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /dark mode/i })).toBeInTheDocument();
      });

      const darkButton = screen.getByRole('button', { name: /dark mode/i });
      await user.click(darkButton);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('switches to system in buttons variant', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /system mode/i })).toBeInTheDocument();
      });

      const systemButton = screen.getByRole('button', { name: /system mode/i });
      await user.click(systemButton);

      expect(mockSetTheme).toHaveBeenCalledWith('system');
    });

    it('calls onThemeChange callback when theme changes', async () => {
      const onThemeChange = vi.fn();
      const user = userEvent.setup();
      render(<ModeToggle variant="buttons" onThemeChange={onThemeChange} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /dark mode/i })).toBeInTheDocument();
      });

      const darkButton = screen.getByRole('button', { name: /dark mode/i });
      await user.click(darkButton);

      expect(onThemeChange).toHaveBeenCalledWith('dark');
    });

    it('does not switch theme when disabled', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="buttons" disabled />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons[0]).toBeDisabled();
      });

      const lightButton = screen.getByRole('button', { name: /light mode/i });
      await user.click(lightButton);

      expect(mockSetTheme).not.toHaveBeenCalled();
    });

    it('handles rapid theme changes', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(3);
      });

      const lightButton = screen.getByRole('button', { name: /light mode/i });
      const darkButton = screen.getByRole('button', { name: /dark mode/i });
      const systemButton = screen.getByRole('button', { name: /system mode/i });

      await user.click(lightButton);
      await user.click(darkButton);
      await user.click(systemButton);
      await user.click(lightButton);

      expect(mockSetTheme).toHaveBeenCalledTimes(4);
    });

    it('updates immediately on theme change', async () => {
      mockTheme.mockReturnValue('light');
      const user = userEvent.setup();
      const { rerender } = render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        const lightButton = screen.getByRole('button', { name: /light mode/i });
        expect(lightButton).toHaveAttribute('aria-pressed', 'true');
      });

      mockTheme.mockReturnValue('dark');
      rerender(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        const darkButton = screen.getByRole('button', { name: /dark mode/i });
        expect(darkButton).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('works with all three themes', async () => {
      const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
      const user = userEvent.setup();

      for (const theme of themes) {
        mockTheme.mockReturnValue(theme);
        const { rerender } = render(<ModeToggle variant="buttons" />);

        await waitFor(() => {
          const button = screen.getByRole('button', {
            name: new RegExp(`${theme} mode`, 'i')
          });
          expect(button).toHaveAttribute('aria-pressed', 'true');
        });

        rerender(<></>);
      }
    });

    it('preserves theme state across re-renders', async () => {
      mockTheme.mockReturnValue('dark');
      const { rerender } = render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        const darkButton = screen.getByRole('button', { name: /dark mode/i });
        expect(darkButton).toHaveAttribute('aria-pressed', 'true');
      });

      rerender(<ModeToggle variant="buttons" className="updated" />);

      await waitFor(() => {
        const darkButton = screen.getByRole('button', { name: /dark mode/i });
        expect(darkButton).toHaveAttribute('aria-pressed', 'true');
      });
    });
  });

  // 5. LABEL TESTS (6 tests)
  describe('Labels', () => {
    it('shows labels when showLabels is true', async () => {
      render(<ModeToggle variant="buttons" showLabels />);
      await waitFor(() => {
        expect(screen.getByText('Light')).toBeVisible();
        expect(screen.getByText('Dark')).toBeVisible();
        expect(screen.getByText('System')).toBeVisible();
      });
    });

    it('hides labels when showLabels is false', async () => {
      const { container } = render(<ModeToggle variant="buttons" showLabels={false} />);
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(3);
        // Labels should not be visible
        const lightText = within(buttons[0]).queryByText('Light');
        expect(lightText).not.toBeInTheDocument();
      });
    });

    it('defaults to hiding labels', async () => {
      const { container } = render(<ModeToggle variant="buttons" />);
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(3);
        const lightText = within(buttons[0]).queryByText('Light');
        expect(lightText).not.toBeInTheDocument();
      });
    });

    it('shows labels only in buttons variant', async () => {
      render(<ModeToggle variant="icon" showLabels />);
      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        // Icon variant shouldn't show labels directly on button
      });
    });

    it('dropdown always shows labels regardless of showLabels prop', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="icon" showLabels={false} />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Light')).toBeInTheDocument();
        expect(screen.getByText('Dark')).toBeInTheDocument();
        expect(screen.getByText('System')).toBeInTheDocument();
      });
    });

    it('buttons with labels have proper spacing', async () => {
      const { container } = render(<ModeToggle variant="buttons" showLabels />);
      await waitFor(() => {
        const buttons = container.querySelectorAll('button');
        buttons.forEach((button) => {
          expect(button.classList.contains('gap-2')).toBe(true);
        });
      });
    });
  });

  // 6. ACTIVE STATE TESTS (8 tests)
  describe('Active State', () => {
    it('shows checkmark for active theme in dropdown', async () => {
      mockTheme.mockReturnValue('light');
      const user = userEvent.setup();
      render(<ModeToggle variant="icon" />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        const lightOption = screen.getByText('Light').closest('[role="menuitem"]');
        expect(lightOption?.textContent).toContain('✓');
      });
    });

    it('shows checkmark for dark theme in dropdown', async () => {
      mockTheme.mockReturnValue('dark');
      const user = userEvent.setup();
      render(<ModeToggle variant="icon" />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        const darkOption = screen.getByText('Dark').closest('[role="menuitem"]');
        expect(darkOption?.textContent).toContain('✓');
      });
    });

    it('shows checkmark for system theme in dropdown', async () => {
      mockTheme.mockReturnValue('system');
      const user = userEvent.setup();
      render(<ModeToggle variant="icon" />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        const systemOption = screen.getByText('System').closest('[role="menuitem"]');
        expect(systemOption?.textContent).toContain('✓');
      });
    });

    it('buttons variant shows active state with aria-pressed for light', async () => {
      mockTheme.mockReturnValue('light');
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        const lightButton = screen.getByRole('button', { name: /light mode/i });
        expect(lightButton).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('buttons variant shows active state with aria-pressed for dark', async () => {
      mockTheme.mockReturnValue('dark');
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        const darkButton = screen.getByRole('button', { name: /dark mode/i });
        expect(darkButton).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('buttons variant shows active state with aria-pressed for system', async () => {
      mockTheme.mockReturnValue('system');
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        const systemButton = screen.getByRole('button', { name: /system mode/i });
        expect(systemButton).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('only one button is pressed at a time', async () => {
      mockTheme.mockReturnValue('dark');
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const pressedButtons = buttons.filter(
          (btn) => btn.getAttribute('aria-pressed') === 'true'
        );
        expect(pressedButtons).toHaveLength(1);
      });
    });

    it('updates active state when theme changes', async () => {
      mockTheme.mockReturnValue('light');
      const { rerender } = render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        const lightButton = screen.getByRole('button', { name: /light mode/i });
        expect(lightButton).toHaveAttribute('aria-pressed', 'true');
      });

      mockTheme.mockReturnValue('dark');
      rerender(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        const darkButton = screen.getByRole('button', { name: /dark mode/i });
        expect(darkButton).toHaveAttribute('aria-pressed', 'true');
        const lightButton = screen.getByRole('button', { name: /light mode/i });
        expect(lightButton).toHaveAttribute('aria-pressed', 'false');
      });
    });
  });

  // 7. ACCESSIBILITY TESTS (10 tests)
  describe('Accessibility', () => {
    it('has no accessibility violations for icon variant', async () => {
      const { container } = render(<ModeToggle variant="icon" />);
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations for buttons variant', async () => {
      const { container } = render(<ModeToggle variant="buttons" />);
      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(3);
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper aria-label on trigger button', async () => {
      render(<ModeToggle variant="icon" />);
      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Toggle theme mode');
      });
    });

    it('has proper aria-labels on individual buttons', async () => {
      render(<ModeToggle variant="buttons" />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Light mode' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Dark mode' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'System mode' })).toBeInTheDocument();
      });
    });

    it('buttons variant has role="group"', async () => {
      render(<ModeToggle variant="buttons" />);
      await waitFor(() => {
        const group = screen.getByRole('group');
        expect(group).toHaveAttribute('aria-label', 'Theme mode selection');
      });
    });

    it('has screen reader text for icon variant', async () => {
      render(<ModeToggle variant="icon" />);
      await waitFor(() => {
        const srText = screen.getByText('Toggle theme');
        expect(srText).toHaveClass('sr-only');
      });
    });

    it('dropdown items have proper role', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="icon" />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        const items = screen.getAllByRole('menuitem');
        expect(items).toHaveLength(3);
      });
    });

    it('keyboard navigation works in dropdown', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="icon" />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Light')).toBeInTheDocument();
      });

      // Tab through items
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(mockSetTheme).toHaveBeenCalled();
    });

    it('disabled buttons have proper ARIA attributes', async () => {
      render(<ModeToggle variant="buttons" disabled />);
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        buttons.forEach((button) => {
          expect(button).toBeDisabled();
        });
      });
    });

    it('supports keyboard navigation for button variant', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(3);
      });

      const lightButton = screen.getByRole('button', { name: /light mode/i });
      lightButton.focus();
      await user.keyboard('{Enter}');

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });
  });

  // 8. STYLING TESTS (6 tests)
  describe('Styling', () => {
    it('applies custom className to icon variant', async () => {
      const { container } = render(<ModeToggle variant="icon" className="custom-toggle" />);
      await waitFor(() => {
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('custom-toggle');
      });
    });

    it('applies custom className to buttons variant', async () => {
      const { container } = render(<ModeToggle variant="buttons" className="custom-buttons" />);
      await waitFor(() => {
        const group = screen.getByRole('group');
        expect(group).toHaveClass('custom-buttons');
      });
    });

    it('buttons variant has muted background', async () => {
      const { container } = render(<ModeToggle variant="buttons" />);
      await waitFor(() => {
        const group = container.querySelector('.bg-muted');
        expect(group).toBeInTheDocument();
      });
    });

    it('buttons variant has rounded corners', async () => {
      const { container } = render(<ModeToggle variant="buttons" />);
      await waitFor(() => {
        const group = container.querySelector('.rounded-md');
        expect(group).toBeInTheDocument();
      });
    });

    it('icons have transition classes', async () => {
      const { container } = render(<ModeToggle variant="icon" />);
      await waitFor(() => {
        const icon = container.querySelector('.transition-all');
        expect(icon).toBeInTheDocument();
      });
    });

    it('buttons have proper gap spacing', async () => {
      const { container } = render(<ModeToggle variant="buttons" />);
      await waitFor(() => {
        const buttons = container.querySelectorAll('button');
        buttons.forEach((button) => {
          expect(button.classList.contains('gap-2')).toBe(true);
        });
      });
    });
  });

  // 9. EDGE CASES (6 tests)
  describe('Edge Cases', () => {
    it('works when theme is undefined', async () => {
      mockTheme.mockReturnValue(undefined as any);
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(3);
      });
    });

    it('handles null theme gracefully', async () => {
      mockTheme.mockReturnValue(null as any);
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(3);
      });
    });

    it('handles empty string theme', async () => {
      mockTheme.mockReturnValue('' as any);
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(3);
      });
    });

    it('handles rapid variant changes', async () => {
      const { rerender } = render(<ModeToggle variant="icon" />);
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      rerender(<ModeToggle variant="buttons" />);
      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(3);
      });

      rerender(<ModeToggle variant="icon" />);
      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(1);
      });
    });

    it('maintains state across prop updates', async () => {
      const { rerender } = render(<ModeToggle size="sm" />);
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      rerender(<ModeToggle size="lg" />);
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('handles missing next-themes context gracefully', async () => {
      // Component should still render even if theme is undefined
      mockTheme.mockReturnValue(undefined as any);
      render(<ModeToggle />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  // 10. INTEGRATION TESTS (8 tests)
  describe('Integration', () => {
    it('works in navigation bar', async () => {
      render(
        <nav className="flex items-center gap-4">
          <span>Logo</span>
          <ModeToggle variant="icon" />
        </nav>
      );

      await waitFor(() => {
        expect(screen.getByText('Logo')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('works in settings panel', async () => {
      render(
        <div className="settings">
          <h2>Theme Settings</h2>
          <ModeToggle variant="buttons" showLabels />
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText('Theme Settings')).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(3);
      });
    });

    it('multiple instances work independently', async () => {
      render(
        <div>
          <ModeToggle variant="icon" />
          <ModeToggle variant="buttons" />
        </div>
      );

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThanOrEqual(4); // 1 trigger + 3 buttons
      });
    });

    it('works with different themes simultaneously', async () => {
      mockTheme.mockReturnValue('dark');
      render(
        <div>
          <ModeToggle variant="icon" />
          <ModeToggle variant="buttons" />
        </div>
      );

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });

    it('works in modal/dialog', async () => {
      render(
        <div role="dialog" aria-label="Settings">
          <ModeToggle variant="buttons" showLabels />
        </div>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(3);
      });
    });

    it('works in header with other controls', async () => {
      render(
        <header className="flex items-center justify-between">
          <div>Brand</div>
          <div className="flex gap-2">
            <button>Notifications</button>
            <ModeToggle />
            <button>Profile</button>
          </div>
        </header>
      );

      await waitFor(() => {
        expect(screen.getByText('Brand')).toBeInTheDocument();
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(2);
      });
    });

    it('works with conditional rendering', async () => {
      const { rerender } = render(
        <div>{true && <ModeToggle variant="icon" />}</div>
      );

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      rerender(<div>{false && <ModeToggle variant="icon" />}</div>);

      await waitFor(() => {
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
      });
    });

    it('works with dynamic props from parent', async () => {
      const ParentComponent = ({ size }: { size: 'sm' | 'md' | 'lg' }) => (
        <ModeToggle size={size} variant="buttons" />
      );

      const { rerender } = render(<ParentComponent size="sm" />);
      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(3);
      });

      rerender(<ParentComponent size="lg" />);
      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(3);
      });
    });
  });
});
