import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThemePreview } from './ThemePreview';
import type { Theme } from '@/types/theme';

expect.extend(toHaveNoViolations);

const mockTheme: Partial<Theme> = {
  name: 'Ocean Blue',
  description: 'A calming blue theme',
  isDefault: false,
  colors: {
    primary: '#0066cc',
    secondary: '#66b2ff',
    accent: '#00aaff',
    muted: '#e0e0e0',
    background: '#ffffff',
    foreground: '#000000',
  },
};

describe('ThemePreview - Molecule', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders theme preview', () => {
      const { container } = render(<ThemePreview theme={mockTheme} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders theme name', () => {
      render(<ThemePreview theme={mockTheme} />);
      expect(screen.getByText('Ocean Blue')).toBeInTheDocument();
    });

    it('renders theme description', () => {
      render(<ThemePreview theme={mockTheme} />);
      expect(screen.getByText('A calming blue theme')).toBeInTheDocument();
    });

    it('renders color palette', () => {
      const { container } = render(<ThemePreview theme={mockTheme} />);
      const colorSwatches = container.querySelectorAll('.h-8.w-8.rounded-md');
      expect(colorSwatches.length).toBeGreaterThanOrEqual(4); // Primary, Secondary, Accent, Muted
    });

    it('renders interactive elements by default', () => {
      render(<ThemePreview theme={mockTheme} />);
      expect(screen.getByText('Primary')).toBeInTheDocument();
      expect(screen.getByText('Secondary')).toBeInTheDocument();
      expect(screen.getByText('Outline')).toBeInTheDocument();
    });

    it('renders sample text', () => {
      render(<ThemePreview theme={mockTheme} />);
      expect(screen.getByText('Sample Heading')).toBeInTheDocument();
      expect(screen.getByText(/This is sample body text/)).toBeInTheDocument();
    });
  });

  // 2. THEME NAME TESTS
  describe('Theme Name', () => {
    it('shows theme name by default', () => {
      render(<ThemePreview theme={mockTheme} />);
      expect(screen.getByText('Ocean Blue')).toBeInTheDocument();
    });

    it('hides theme name when showName is false', () => {
      render(<ThemePreview theme={mockTheme} showName={false} />);
      expect(screen.queryByText('Ocean Blue')).not.toBeInTheDocument();
    });

    it('does not render header when no theme name', () => {
      const themeWithoutName = { ...mockTheme, name: undefined };
      render(<ThemePreview theme={themeWithoutName} />);
      expect(screen.queryByText('Ocean Blue')).not.toBeInTheDocument();
    });
  });

  // 3. DEFAULT BADGE TESTS
  describe('Default Badge', () => {
    it('shows "Default" badge when theme is default', () => {
      const defaultTheme = { ...mockTheme, isDefault: true };
      render(<ThemePreview theme={defaultTheme} />);
      expect(screen.getByText('Default')).toBeInTheDocument();
    });

    it('does not show badge when theme is not default', () => {
      render(<ThemePreview theme={mockTheme} />);
      expect(screen.queryByText('Default')).not.toBeInTheDocument();
    });
  });

  // 4. SIZE TESTS
  describe('Size Variants', () => {
    it('renders small size', () => {
      const { container } = render(<ThemePreview theme={mockTheme} size="sm" />);
      const preview = container.firstChild as HTMLElement;
      expect(preview).toHaveClass('scale-75');
    });

    it('renders default size', () => {
      const { container } = render(<ThemePreview theme={mockTheme} size="default" />);
      const preview = container.firstChild as HTMLElement;
      expect(preview).not.toHaveClass('scale-75');
      expect(preview).not.toHaveClass('scale-110');
    });

    it('renders large size', () => {
      const { container } = render(<ThemePreview theme={mockTheme} size="lg" />);
      const preview = container.firstChild as HTMLElement;
      expect(preview).toHaveClass('scale-110');
    });

    it('defaults to default size', () => {
      const { container } = render(<ThemePreview theme={mockTheme} />);
      const preview = container.firstChild as HTMLElement;
      expect(preview).not.toHaveClass('scale-75');
      expect(preview).not.toHaveClass('scale-110');
    });
  });

  // 5. INTERACTIVE ELEMENTS TESTS
  describe('Interactive Elements', () => {
    it('shows interactive elements by default', () => {
      render(<ThemePreview theme={mockTheme} />);
      expect(screen.getByText('Primary')).toBeInTheDocument();
      expect(screen.getByText('Badge')).toBeInTheDocument();
    });

    it('hides interactive elements when interactive is false', () => {
      render(<ThemePreview theme={mockTheme} interactive={false} />);
      expect(screen.queryByText('Primary')).not.toBeInTheDocument();
      expect(screen.queryByText('Badge')).not.toBeInTheDocument();
    });

    it('renders button samples', () => {
      render(<ThemePreview theme={mockTheme} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    it('renders badge samples', () => {
      render(<ThemePreview theme={mockTheme} />);
      expect(screen.getByText('Badge')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Tag')).toBeInTheDocument();
    });
  });

  // 6. COLOR PALETTE TESTS
  describe('Color Palette', () => {
    it('renders primary color swatch', () => {
      const { container } = render(<ThemePreview theme={mockTheme} />);
      const primarySwatch = container.querySelector('[title="Primary"]');
      expect(primarySwatch).toBeInTheDocument();
      expect(primarySwatch).toHaveStyle({ backgroundColor: '#0066cc' });
    });

    it('renders secondary color swatch', () => {
      const { container } = render(<ThemePreview theme={mockTheme} />);
      const secondarySwatch = container.querySelector('[title="Secondary"]');
      expect(secondarySwatch).toBeInTheDocument();
    });

    it('renders accent color swatch', () => {
      const { container } = render(<ThemePreview theme={mockTheme} />);
      const accentSwatch = container.querySelector('[title="Accent"]');
      expect(accentSwatch).toBeInTheDocument();
    });

    it('renders muted color swatch', () => {
      const { container } = render(<ThemePreview theme={mockTheme} />);
      const mutedSwatch = container.querySelector('[title="Muted"]');
      expect(mutedSwatch).toBeInTheDocument();
    });

    it('uses fallback CSS variables when colors not provided', () => {
      const themeWithoutColors = { name: 'Test' };
      const { container } = render(<ThemePreview theme={themeWithoutColors} />);
      const swatches = container.querySelectorAll('.h-8.w-8.rounded-md');
      expect(swatches.length).toBeGreaterThan(0);
    });
  });

  // 7. CLICK HANDLER TESTS
  describe('Click Handler', () => {
    it('calls onClick when preview is clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<ThemePreview theme={mockTheme} onClick={onClick} />);

      const preview = screen.getByRole('button');
      await user.click(preview);

      expect(onClick).toHaveBeenCalled();
    });

    it('has role="button" when onClick is provided', () => {
      const onClick = vi.fn();
      render(<ThemePreview theme={mockTheme} onClick={onClick} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('does not have role="button" when onClick is not provided', () => {
      render(<ThemePreview theme={mockTheme} />);
      expect(screen.queryByRole('button', { name: /ocean blue/i })).not.toBeInTheDocument();
    });

    it('has tabIndex when onClick is provided', () => {
      const onClick = vi.fn();
      const { container } = render(<ThemePreview theme={mockTheme} onClick={onClick} />);
      const preview = container.firstChild as HTMLElement;
      expect(preview).toHaveAttribute('tabIndex', '0');
    });

    it('handles Enter key press', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<ThemePreview theme={mockTheme} onClick={onClick} />);

      const preview = screen.getByRole('button');
      preview.focus();
      await user.keyboard('{Enter}');

      expect(onClick).toHaveBeenCalled();
    });

    it('handles Space key press', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<ThemePreview theme={mockTheme} onClick={onClick} />);

      const preview = screen.getByRole('button');
      preview.focus();
      await user.keyboard(' ');

      expect(onClick).toHaveBeenCalled();
    });
  });

  // 8. STYLING TESTS
  describe('Styling', () => {
    it('has transition classes', () => {
      const { container } = render(<ThemePreview theme={mockTheme} />);
      const preview = container.firstChild as HTMLElement;
      expect(preview).toHaveClass('transition-transform');
    });

    it('applies custom className', () => {
      const { container } = render(
        <ThemePreview theme={mockTheme} className="custom-class" />
      );
      const preview = container.firstChild as HTMLElement;
      expect(preview).toHaveClass('custom-class');
    });

    it('has hover shadow when onClick is provided', () => {
      const { container } = render(<ThemePreview theme={mockTheme} onClick={vi.fn()} />);
      const card = container.querySelector('.hover\\:shadow-lg');
      expect(card).toBeInTheDocument();
    });

    it('has cursor-pointer when onClick is provided', () => {
      const { container } = render(<ThemePreview theme={mockTheme} onClick={vi.fn()} />);
      const card = container.querySelector('.cursor-pointer');
      expect(card).toBeInTheDocument();
    });

    it('does not have cursor-pointer when onClick is not provided', () => {
      const { container } = render(<ThemePreview theme={mockTheme} />);
      const card = container.querySelector('.cursor-pointer');
      expect(card).not.toBeInTheDocument();
    });
  });

  // 9. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ThemePreview theme={mockTheme} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when interactive', async () => {
      const { container } = render(<ThemePreview theme={mockTheme} onClick={vi.fn()} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('color swatches have title attributes', () => {
      const { container } = render(<ThemePreview theme={mockTheme} />);
      const primarySwatch = container.querySelector('[title="Primary"]');
      expect(primarySwatch).toBeInTheDocument();
    });

    it('buttons are disabled in preview', () => {
      render(<ThemePreview theme={mockTheme} />);
      const buttons = screen.getAllByRole('button').filter(
        (btn) => btn.textContent === 'Primary' ||
                 btn.textContent === 'Secondary' ||
                 btn.textContent === 'Outline'
      );
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  // 10. EDGE CASES
  describe('Edge Cases', () => {
    it('handles empty theme object', () => {
      const { container } = render(<ThemePreview theme={{}} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles undefined theme', () => {
      const { container } = render(<ThemePreview theme={undefined} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles theme without colors', () => {
      const themeWithoutColors = { name: 'Test Theme', description: 'Test' };
      render(<ThemePreview theme={themeWithoutColors} />);
      expect(screen.getByText('Test Theme')).toBeInTheDocument();
    });

    it('handles very long theme name', () => {
      const theme = { ...mockTheme, name: 'A'.repeat(100) };
      render(<ThemePreview theme={theme} />);
      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    });

    it('handles very long description', () => {
      const theme = { ...mockTheme, description: 'B'.repeat(200) };
      render(<ThemePreview theme={theme} />);
      expect(screen.getByText('B'.repeat(200))).toBeInTheDocument();
    });

    it('handles theme without description', () => {
      const theme = { ...mockTheme, description: undefined };
      render(<ThemePreview theme={theme} />);
      expect(screen.getByText('Ocean Blue')).toBeInTheDocument();
    });
  });

  // 11. CSS VARIABLES TESTS
  describe('CSS Variables', () => {
    it('applies theme colors as CSS variables', () => {
      const { container } = render(<ThemePreview theme={mockTheme} />);
      const preview = container.firstChild as HTMLElement;

      const style = preview.getAttribute('style');
      expect(style).toContain('--preview-primary');
      expect(style).toContain('#0066cc');
    });

    it('handles missing colors gracefully', () => {
      const themeWithoutColors = { name: 'Test' };
      const { container } = render(<ThemePreview theme={themeWithoutColors} />);
      const preview = container.firstChild as HTMLElement;

      // Should not have preview CSS variables when colors are missing
      const style = preview.getAttribute('style') || '';
      expect(style).toBe('');
    });
  });

  // 12. INTEGRATION TESTS
  describe('Integration', () => {
    it('works in theme selection grid', () => {
      const themes = [
        { ...mockTheme, name: 'Theme 1' },
        { ...mockTheme, name: 'Theme 2' },
        { ...mockTheme, name: 'Theme 3' },
      ];

      render(
        <div className="grid grid-cols-3 gap-4">
          {themes.map((theme, i) => (
            <ThemePreview key={i} theme={theme} />
          ))}
        </div>
      );

      expect(screen.getByText('Theme 1')).toBeInTheDocument();
      expect(screen.getByText('Theme 2')).toBeInTheDocument();
      expect(screen.getByText('Theme 3')).toBeInTheDocument();
    });

    it('works with different sizes in same layout', () => {
      render(
        <div className="flex gap-4">
          <ThemePreview theme={mockTheme} size="sm" />
          <ThemePreview theme={mockTheme} size="default" />
          <ThemePreview theme={mockTheme} size="lg" />
        </div>
      );

      const previews = screen.getAllByText('Ocean Blue');
      expect(previews).toHaveLength(3);
    });

    it('maintains independent click handlers', async () => {
      const user = userEvent.setup();
      const onClick1 = vi.fn();
      const onClick2 = vi.fn();

      render(
        <div>
          <ThemePreview theme={{ ...mockTheme, name: 'Theme 1' }} onClick={onClick1} />
          <ThemePreview theme={{ ...mockTheme, name: 'Theme 2' }} onClick={onClick2} />
        </div>
      );

      const previews = screen.getAllByRole('button');
      await user.click(previews[0]);

      expect(onClick1).toHaveBeenCalled();
      expect(onClick2).not.toHaveBeenCalled();
    });
  });
});
