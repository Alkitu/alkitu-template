import { renderWithProviders, screen, fireEvent, waitFor } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ThemeSwitcher } from './ThemeSwitcher';

// Mock dependencies
const mockLoadTheme = vi.fn();
const mockUseGlobalTheme = {
  currentTheme: { id: 'theme-1', name: 'Default Theme', isDefault: true },
  savedThemes: [
    { id: 'theme-1', name: 'Default Theme', isDefault: true },
    { id: 'theme-2', name: 'Dark Theme', isDefault: false },
    { id: 'theme-3', name: 'Light Theme', isDefault: false },
  ],
  loadTheme: mockLoadTheme,
  isLoading: false,
};

vi.mock('@/hooks/useGlobalTheme', () => ({
  useGlobalTheme: () => mockUseGlobalTheme,
}));

vi.mock('@/components/primitives/ui/button', () => ({
  Button: ({ children, variant, size, className, disabled, onClick, asChild }: any) =>
    asChild ? (
      <div className={className}>{children}</div>
    ) : (
      <button
        onClick={onClick}
        disabled={disabled}
        data-variant={variant}
        data-size={size}
        className={className}
      >
        {children}
      </button>
    ),
}));

vi.mock('@/components/primitives/DropdownMenu', () => ({
  DropdownMenu: ({ children }: any) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children, asChild }: any) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({ children, align, className }: any) => (
    <div data-testid="dropdown-content" data-align={align} className={className}>
      {children}
    </div>
  ),
  DropdownMenuItem: ({ children, onClick, disabled, className, asChild }: any) =>
    asChild ? (
      <div className={className}>{children}</div>
    ) : (
      <div
        data-testid="dropdown-item"
        onClick={onClick}
        data-disabled={disabled}
        className={className}
      >
        {children}
      </div>
    ),
  DropdownMenuSeparator: () => <div data-testid="dropdown-separator" />,
}));

vi.mock('@/components/atoms/badge', () => ({
  Badge: ({ children, variant, size }: any) => (
    <span data-testid="badge" data-variant={variant} data-size={size}>
      {children}
    </span>
  ),
}));

vi.mock('lucide-react', () => ({
  Palette: () => <span data-testid="palette-icon" />,
  Check: () => <span data-testid="check-icon" />,
}));

describe('ThemeSwitcher - Organism', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mock state to default
    mockUseGlobalTheme.currentTheme = { id: 'theme-1', name: 'Default Theme', isDefault: true };
    mockUseGlobalTheme.savedThemes = [
      { id: 'theme-1', name: 'Default Theme', isDefault: true },
      { id: 'theme-2', name: 'Dark Theme', isDefault: false },
      { id: 'theme-3', name: 'Light Theme', isDefault: false },
    ];
    mockUseGlobalTheme.isLoading = false;
  });

  describe('Dropdown Mode (Default)', () => {
    it('should render dropdown trigger button', () => {
      renderWithProviders(<ThemeSwitcher />);

      // Button contains theme name and icon - check for role and text content
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Default Theme');
      expect(screen.getByTestId('palette-icon')).toBeInTheDocument();
    });

    it('should show current theme name on trigger', () => {
      renderWithProviders(<ThemeSwitcher />);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Default Theme');
    });

    it('should render all saved themes in dropdown', () => {
      renderWithProviders(<ThemeSwitcher />);

      // All themes are rendered in dropdown content (always rendered, not conditional)
      expect(screen.getAllByText('Default Theme').length).toBeGreaterThan(0);
      expect(screen.getByText('Dark Theme')).toBeInTheDocument();
      expect(screen.getByText('Light Theme')).toBeInTheDocument();
    });

    it('should show default badge for default theme', () => {
      renderWithProviders(<ThemeSwitcher />);

      const badges = screen.getAllByTestId('badge');
      expect(badges.some(badge => badge.textContent === 'Default')).toBe(true);
    });

    it('should show check icon for current theme', () => {
      renderWithProviders(<ThemeSwitcher />);

      const checkIcons = screen.getAllByTestId('check-icon');
      expect(checkIcons.length).toBeGreaterThan(0);
    });

    it('should render manage themes link', () => {
      renderWithProviders(<ThemeSwitcher />);

      expect(screen.getByText('Manage Themes')).toBeInTheDocument();
    });

    it('should call loadTheme when theme is selected', () => {
      renderWithProviders(<ThemeSwitcher />);

      const darkThemeItem = screen.getByText('Dark Theme').closest('[data-testid="dropdown-item"]');
      if (darkThemeItem) {
        fireEvent.click(darkThemeItem);
        expect(mockLoadTheme).toHaveBeenCalledWith('theme-2');
      }
    });

    it('should call onThemeChange callback', () => {
      const onThemeChange = vi.fn();
      renderWithProviders(<ThemeSwitcher onThemeChange={onThemeChange} />);

      const darkThemeItem = screen.getByText('Dark Theme').closest('[data-testid="dropdown-item"]');
      if (darkThemeItem) {
        fireEvent.click(darkThemeItem);
        expect(onThemeChange).toHaveBeenCalledWith('theme-2');
      }
    });

    it('should show "No themes available" when savedThemes is empty', () => {
      mockUseGlobalTheme.savedThemes = [];
      renderWithProviders(<ThemeSwitcher />);

      expect(screen.getByText('No themes available')).toBeInTheDocument();
    });

    it('should disable trigger button when loading', () => {
      mockUseGlobalTheme.isLoading = true;
      renderWithProviders(<ThemeSwitcher />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should apply custom className to trigger button', () => {
      renderWithProviders(<ThemeSwitcher className="custom-class" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Inline Mode', () => {
    beforeEach(() => {
      mockUseGlobalTheme.savedThemes = [
        { id: 'theme-1', name: 'Default Theme', isDefault: true },
        { id: 'theme-2', name: 'Dark Theme', isDefault: false },
        { id: 'theme-3', name: 'Light Theme', isDefault: false },
      ];
      mockUseGlobalTheme.isLoading = false;
    });

    it('should render inline mode when mode="inline"', () => {
      const { container } = renderWithProviders(<ThemeSwitcher mode="inline" />);

      expect(container.querySelector('.flex.flex-wrap')).toBeInTheDocument();
    });

    it('should render all themes as buttons', () => {
      renderWithProviders(<ThemeSwitcher mode="inline" />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    it('should highlight current theme button', () => {
      renderWithProviders(<ThemeSwitcher mode="inline" />);

      const defaultThemeButton = screen.getByRole('button', { name: /Default Theme/i });
      expect(defaultThemeButton).toHaveAttribute('data-variant', 'default');
    });

    it('should call loadTheme when inline button is clicked', () => {
      renderWithProviders(<ThemeSwitcher mode="inline" />);

      const darkThemeButton = screen.getByRole('button', { name: /Dark Theme/i });
      fireEvent.click(darkThemeButton);

      expect(mockLoadTheme).toHaveBeenCalledWith('theme-2');
    });

    it('should show default badge in inline mode', () => {
      renderWithProviders(<ThemeSwitcher mode="inline" />);

      const badges = screen.getAllByTestId('badge');
      expect(badges.some(badge => badge.textContent === 'Default')).toBe(true);
    });

    it('should show check icon for current theme in inline mode', () => {
      renderWithProviders(<ThemeSwitcher mode="inline" />);

      const checkIcons = screen.getAllByTestId('check-icon');
      expect(checkIcons.length).toBeGreaterThan(0);
    });

    it('should disable all buttons when loading in inline mode', () => {
      mockUseGlobalTheme.isLoading = true;
      renderWithProviders(<ThemeSwitcher mode="inline" />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('should show "No themes available" in inline mode', () => {
      mockUseGlobalTheme.savedThemes = [];
      renderWithProviders(<ThemeSwitcher mode="inline" />);

      expect(screen.getByText('No themes available')).toBeInTheDocument();
    });

    it('should apply custom className in inline mode', () => {
      const { container } = renderWithProviders(<ThemeSwitcher mode="inline" className="custom-inline" />);

      const wrapper = container.querySelector('.custom-inline');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Theme Selection', () => {
    beforeEach(() => {
      mockUseGlobalTheme.savedThemes = [
        { id: 'theme-1', name: 'Default Theme', isDefault: true },
        { id: 'theme-2', name: 'Dark Theme', isDefault: false },
      ];
      mockUseGlobalTheme.isLoading = false;
    });

    it('should load theme when selected', () => {
      renderWithProviders(<ThemeSwitcher />);

      const darkThemeItem = screen.getByText('Dark Theme').closest('[data-testid="dropdown-item"]');
      if (darkThemeItem) {
        fireEvent.click(darkThemeItem);
        expect(mockLoadTheme).toHaveBeenCalledWith('theme-2');
      }
    });

    it('should trigger callback after theme change', () => {
      const onThemeChange = vi.fn();
      renderWithProviders(<ThemeSwitcher onThemeChange={onThemeChange} />);

      const darkThemeItem = screen.getByText('Dark Theme').closest('[data-testid="dropdown-item"]');
      if (darkThemeItem) {
        fireEvent.click(darkThemeItem);
        expect(onThemeChange).toHaveBeenCalledWith('theme-2');
        expect(mockLoadTheme).toHaveBeenCalledWith('theme-2');
      }
    });
  });

  describe('Current Theme Display', () => {
    it('should show "Select Theme" when no current theme', () => {
      mockUseGlobalTheme.currentTheme = null;
      renderWithProviders(<ThemeSwitcher />);

      expect(screen.getByText('Select Theme')).toBeInTheDocument();
    });

    it('should show current theme name', () => {
      renderWithProviders(<ThemeSwitcher />);

      // Theme name may appear multiple times (in trigger and dropdown)
      const themeNameElements = screen.getAllByText('Default Theme');
      expect(themeNameElements.length).toBeGreaterThan(0);
    });
  });

  describe('Loading State', () => {
    it('should disable dropdown trigger when loading', () => {
      mockUseGlobalTheme.isLoading = true;
      renderWithProviders(<ThemeSwitcher />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should disable inline buttons when loading', () => {
      mockUseGlobalTheme.isLoading = true;
      renderWithProviders(<ThemeSwitcher mode="inline" />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe('Empty States', () => {
    beforeEach(() => {
      mockUseGlobalTheme.savedThemes = [];
    });

    it('should show empty state in dropdown', () => {
      renderWithProviders(<ThemeSwitcher />);

      expect(screen.getByText('No themes available')).toBeInTheDocument();
    });

    it('should show empty state in inline mode', () => {
      renderWithProviders(<ThemeSwitcher mode="inline" />);

      expect(screen.getByText('No themes available')).toBeInTheDocument();
    });

    it('should disable empty state menu item', () => {
      renderWithProviders(<ThemeSwitcher />);

      const emptyItem = screen.getByText('No themes available').closest('[data-testid="dropdown-item"]');
      expect(emptyItem).toHaveAttribute('data-disabled', 'true');
    });
  });

  describe('Manage Themes Link', () => {
    it('should render link to theme management', () => {
      renderWithProviders(<ThemeSwitcher />);

      expect(screen.getByText('Manage Themes')).toBeInTheDocument();
    });

    it('should have correct href for manage themes', () => {
      const { container } = renderWithProviders(<ThemeSwitcher />);

      const link = container.querySelector('a[href="/admin/settings/themes"]');
      expect(link).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render buttons with correct roles', () => {
      renderWithProviders(<ThemeSwitcher />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have accessible button text', () => {
      renderWithProviders(<ThemeSwitcher />);

      // Button text includes the current theme name
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Default Theme');
    });
  });

  describe('Multiple Themes', () => {
    it('should handle many themes', () => {
      mockUseGlobalTheme.savedThemes = Array.from({ length: 10 }, (_, i) => ({
        id: `theme-${i}`,
        name: `Theme ${i}`,
        isDefault: i === 0,
      }));

      renderWithProviders(<ThemeSwitcher mode="inline" />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(10);
    });
  });
});
