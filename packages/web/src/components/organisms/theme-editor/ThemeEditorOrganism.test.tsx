import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ThemeEditorOrganism } from './ThemeEditorOrganism';
import type { ThemeEditorOrganismProps } from './ThemeEditorOrganism.types';

// Mock the ThemeEditor 3.0 component
vi.mock('@/components/features/theme-editor-3.0', () => ({
  ThemeEditor: () => <div data-testid="theme-editor-3.0">Theme Editor 3.0</div>,
}));

describe('ThemeEditorOrganism', () => {
  const mockLabels = {
    selector: {
      search: 'Search themes',
      dropdown: 'Select theme',
    },
    actions: {
      save: 'Save theme',
      reset: 'Reset theme',
    },
    editor: {
      colors: 'Colors',
      typography: 'Typography',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render ThemeEditor 3.0 component', () => {
    render(<ThemeEditorOrganism />);

    expect(screen.getByTestId('theme-editor-3.0')).toBeInTheDocument();
    expect(screen.getByText('Theme Editor 3.0')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(<ThemeEditorOrganism />);

    const wrapper = container.querySelector('[data-testid="theme-editor-organism"]');
    expect(wrapper).toHaveClass('theme-editor-organism');
    expect(wrapper).toHaveClass('h-full');
    expect(wrapper).toHaveClass('w-full');
    expect(wrapper).toHaveClass('overflow-hidden');
  });

  it('should apply custom className', () => {
    const { container } = render(<ThemeEditorOrganism className="custom-editor" />);

    const wrapper = container.querySelector('[data-testid="theme-editor-organism"]');
    expect(wrapper).toHaveClass('custom-editor');
  });

  it('should apply theme override styles', () => {
    const themeOverride = {
      'primary-color': '#ff0000',
      'background-color': '#000000',
    };

    const { container } = render(<ThemeEditorOrganism themeOverride={themeOverride} />);

    const wrapper = container.querySelector('[data-testid="theme-editor-organism"]');
    expect(wrapper).toHaveStyle({
      '--primary-color': '#ff0000',
      '--background-color': '#000000',
    });
  });

  it('should render without theme override', () => {
    const { container } = render(<ThemeEditorOrganism />);

    const wrapper = container.querySelector('[data-testid="theme-editor-organism"]');
    expect(wrapper).not.toHaveAttribute('style');
  });

  it('should accept labels prop', () => {
    render(<ThemeEditorOrganism labels={mockLabels} />);

    // Labels are passed to ThemeEditor 3.0, which is mocked
    expect(screen.getByTestId('theme-editor-3.0')).toBeInTheDocument();
  });

  it('should accept initialTheme prop', () => {
    const initialTheme = {
      colors: {
        primary: '#ff0000',
        secondary: '#00ff00',
      },
    };

    render(<ThemeEditorOrganism initialTheme={initialTheme} />);

    expect(screen.getByTestId('theme-editor-3.0')).toBeInTheDocument();
  });

  it('should accept onThemeChange callback', () => {
    const onThemeChange = vi.fn();

    render(<ThemeEditorOrganism onThemeChange={onThemeChange} />);

    expect(screen.getByTestId('theme-editor-3.0')).toBeInTheDocument();
  });

  it('should accept onThemeSave callback', () => {
    const onThemeSave = vi.fn();

    render(<ThemeEditorOrganism onThemeSave={onThemeSave} />);

    expect(screen.getByTestId('theme-editor-3.0')).toBeInTheDocument();
  });

  it('should accept useSystemColors prop', () => {
    render(<ThemeEditorOrganism useSystemColors={false} />);

    expect(screen.getByTestId('theme-editor-3.0')).toBeInTheDocument();
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<ThemeEditorOrganism ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('should render with all props combined', () => {
    const onThemeChange = vi.fn();
    const onThemeSave = vi.fn();
    const initialTheme = {
      colors: {
        primary: '#ff0000',
      },
    };
    const themeOverride = {
      'editor-background': '#ffffff',
    };

    const { container } = render(
      <ThemeEditorOrganism
        className="custom-theme-editor"
        labels={mockLabels}
        initialTheme={initialTheme}
        onThemeChange={onThemeChange}
        onThemeSave={onThemeSave}
        themeOverride={themeOverride}
        useSystemColors={false}
      />
    );

    const wrapper = container.querySelector('[data-testid="theme-editor-organism"]');
    expect(wrapper).toHaveClass('custom-theme-editor');
    expect(wrapper).toHaveStyle({
      '--editor-background': '#ffffff',
    });
    expect(screen.getByTestId('theme-editor-3.0')).toBeInTheDocument();
  });

  it('should have semantic HTML structure', () => {
    const { container } = render(<ThemeEditorOrganism />);

    const wrapper = container.querySelector('[data-testid="theme-editor-organism"]');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.tagName).toBe('DIV');
  });

  it('should maintain full dimensions', () => {
    const { container } = render(<ThemeEditorOrganism />);

    const wrapper = container.querySelector('[data-testid="theme-editor-organism"]');
    expect(wrapper).toHaveClass('h-full', 'w-full');
  });

  it('should have overflow hidden', () => {
    const { container } = render(<ThemeEditorOrganism />);

    const wrapper = container.querySelector('[data-testid="theme-editor-organism"]');
    expect(wrapper).toHaveClass('overflow-hidden');
  });

  it('should render within a full-height container', () => {
    const { container } = render(
      <div style={{ height: '100vh' }}>
        <ThemeEditorOrganism />
      </div>
    );

    const wrapper = container.querySelector('[data-testid="theme-editor-organism"]');
    expect(wrapper).toHaveClass('h-full');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(<ThemeEditorOrganism className="extra-class another-class" />);

    const wrapper = container.querySelector('[data-testid="theme-editor-organism"]');
    expect(wrapper).toHaveClass('theme-editor-organism');
    expect(wrapper).toHaveClass('h-full');
    expect(wrapper).toHaveClass('w-full');
    expect(wrapper).toHaveClass('overflow-hidden');
    expect(wrapper).toHaveClass('extra-class');
    expect(wrapper).toHaveClass('another-class');
  });

  it('should handle empty themeOverride object', () => {
    const { container } = render(<ThemeEditorOrganism themeOverride={{}} />);

    const wrapper = container.querySelector('[data-testid="theme-editor-organism"]');
    expect(wrapper).not.toHaveAttribute('style');
  });

  it('should handle multiple theme override properties', () => {
    const themeOverride = {
      'primary-color': '#ff0000',
      'secondary-color': '#00ff00',
      'background-color': '#ffffff',
      'text-color': '#000000',
      'border-radius': '8px',
    };

    const { container } = render(<ThemeEditorOrganism themeOverride={themeOverride} />);

    const wrapper = container.querySelector('[data-testid="theme-editor-organism"]');
    expect(wrapper).toHaveStyle({
      '--primary-color': '#ff0000',
      '--secondary-color': '#00ff00',
      '--background-color': '#ffffff',
      '--text-color': '#000000',
      '--border-radius': '8px',
    });
  });

  it('should render wrapper as direct child of parent', () => {
    const { container } = render(<ThemeEditorOrganism />);

    const wrapper = container.querySelector('[data-testid="theme-editor-organism"]');
    expect(wrapper?.parentElement).toBe(container);
  });

  it('should display name correctly', () => {
    expect(ThemeEditorOrganism.displayName).toBe('ThemeEditorOrganism');
  });
});
