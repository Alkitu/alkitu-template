import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders icon variant by default', async () => {
      render(<ModeToggle />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('renders after mounting', async () => {
      render(<ModeToggle />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('renders buttons variant', async () => {
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(3); // Light, Dark, System
      });
    });

    it('shows theme icons in icon variant', async () => {
      render(<ModeToggle variant="icon" />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button.querySelector('svg')).toBeInTheDocument();
      });
    });
  });

  // 2. VARIANT TESTS
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
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Toggle theme mode');
      });
    });
  });

  // 3. SIZE TESTS
  describe('Size Props', () => {
    it('accepts sm size', async () => {
      render(<ModeToggle size="sm" />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('accepts default size', async () => {
      render(<ModeToggle size="default" />);

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

    it('accepts icon size', async () => {
      render(<ModeToggle size="icon" />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  // 4. THEME SWITCHING TESTS
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

      const lightOption = screen.getByText('Light');
      await user.click(lightOption);

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

      const darkOption = screen.getByText('Dark');
      await user.click(darkOption);

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

      const systemOption = screen.getByText('System');
      await user.click(systemOption);

      expect(mockSetTheme).toHaveBeenCalledWith('system');
    });

    it('switches to light in buttons variant', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        const lightButton = screen.getByRole('button', { name: /light mode/i });
        expect(lightButton).toBeInTheDocument();
      });

      const lightButton = screen.getByRole('button', { name: /light mode/i });
      await user.click(lightButton);

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('switches to dark in buttons variant', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        const darkButton = screen.getByRole('button', { name: /dark mode/i });
        expect(darkButton).toBeInTheDocument();
      });

      const darkButton = screen.getByRole('button', { name: /dark mode/i });
      await user.click(darkButton);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('switches to system in buttons variant', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        const systemButton = screen.getByRole('button', { name: /system mode/i });
        expect(systemButton).toBeInTheDocument();
      });

      const systemButton = screen.getByRole('button', { name: /system mode/i });
      await user.click(systemButton);

      expect(mockSetTheme).toHaveBeenCalledWith('system');
    });
  });

  // 5. LABEL TESTS
  describe('Labels', () => {
    it('shows labels when showLabels is true', async () => {
      render(<ModeToggle variant="buttons" showLabels />);

      await waitFor(() => {
        expect(screen.getByText('Light')).toBeInTheDocument();
        expect(screen.getByText('Dark')).toBeInTheDocument();
        expect(screen.getByText('System')).toBeInTheDocument();
      });
    });

    it('hides labels when showLabels is false', async () => {
      render(<ModeToggle variant="buttons" showLabels={false} />);

      await waitFor(() => {
        expect(screen.queryByText('Light')).not.toBeInTheDocument();
      });
    });

    it('defaults to hiding labels', async () => {
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        expect(screen.queryByText('Light')).not.toBeInTheDocument();
      });
    });
  });

  // 6. ACTIVE STATE TESTS
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
        const content = screen.getByText('Light').closest('[role="menuitem"]');
        expect(content?.textContent).toContain('✓');
      });
    });

    it('buttons variant shows active state with aria-pressed', async () => {
      mockTheme.mockReturnValue('dark');

      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        const darkButton = screen.getByRole('button', { name: /dark mode/i });
        expect(darkButton).toHaveAttribute('aria-pressed', 'true');
      });
    });
  });

  // 7. ACCESSIBILITY TESTS
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

    it('has screen reader text', async () => {
      render(<ModeToggle variant="icon" />);

      await waitFor(() => {
        const srText = screen.getByText('Toggle theme');
        expect(srText).toHaveClass('sr-only');
      });
    });
  });

  // 8. STYLING TESTS
  describe('Styling', () => {
    it('applies custom className', async () => {
      render(<ModeToggle variant="icon" className="custom-toggle" />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-toggle');
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

    it('icon has transition classes', async () => {
      const { container } = render(<ModeToggle variant="icon" />);

      await waitFor(() => {
        const icon = container.querySelector('.transition-all');
        expect(icon).toBeInTheDocument();
      });
    });
  });

  // 9. EDGE CASES
  describe('Edge Cases', () => {
    it('handles rapid theme changes', async () => {
      const user = userEvent.setup();
      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(3);
      });

      const lightButton = screen.getByRole('button', { name: /light mode/i });
      const darkButton = screen.getByRole('button', { name: /dark mode/i });

      await user.click(lightButton);
      await user.click(darkButton);
      await user.click(lightButton);

      expect(mockSetTheme).toHaveBeenCalledTimes(3);
    });

    it('works when theme is undefined', async () => {
      mockTheme.mockReturnValue(undefined);

      render(<ModeToggle variant="buttons" />);

      await waitFor(() => {
        expect(screen.getAllByRole('button')).toHaveLength(3);
      });
    });
  });

  // 10. INTEGRATION TESTS
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
        expect(buttons.length).toBeGreaterThan(1);
      });
    });
  });
});
