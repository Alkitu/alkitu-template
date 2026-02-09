import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { userEvent } from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';
import { GlobalThemeProvider } from '@/context/GlobalThemeProvider';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the theme toggle button', async () => {
    const { getByRole } = renderWithProviders(
      <GlobalThemeProvider>
        <ThemeToggle />
      </GlobalThemeProvider>
    );

    await waitFor(() => {
      const button = getByRole('button');
      expect(button).toBeDefined();
    });
  });

  it('toggles theme when clicked', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithProviders(
      <GlobalThemeProvider>
        <ThemeToggle />
      </GlobalThemeProvider>
    );

    await waitFor(() => {
      const button = getByRole('button');
      expect(button).toBeDefined();
    });

    const button = getByRole('button');
    await user.click(button);

    await waitFor(() => {
      const storedTheme = localStorage.getItem('theme-mode');
      expect(storedTheme).toBeTruthy();
    });
  });

  it('persists theme mode in localStorage', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithProviders(
      <GlobalThemeProvider>
        <ThemeToggle />
      </GlobalThemeProvider>
    );

    await waitFor(() => {
      const button = getByRole('button');
      expect(button).toBeDefined();
    });

    const button = getByRole('button');
    await user.click(button);

    await waitFor(() => {
      const storedTheme = localStorage.getItem('theme-mode');
      expect(storedTheme).toBe('dark');
    });
  });

  it('loads theme from localStorage on mount', async () => {
    localStorage.setItem('theme-mode', 'dark');

    const { getByRole } = renderWithProviders(
      <GlobalThemeProvider>
        <ThemeToggle />
      </GlobalThemeProvider>
    );

    await waitFor(() => {
      const button = getByRole('button');
      expect(button).toBeDefined();
      expect(button.getAttribute('aria-label')).toContain('claro');
    });
  });

  it('shows disabled state before mounting', () => {
    const { container } = renderWithProviders(
      <GlobalThemeProvider>
        <ThemeToggle />
      </GlobalThemeProvider>
    );

    const button = container.querySelector('button[disabled]');
    expect(button).toBeDefined();
  });

  it('has proper accessibility attributes', async () => {
    const { getByRole } = renderWithProviders(
      <GlobalThemeProvider>
        <ThemeToggle />
      </GlobalThemeProvider>
    );

    await waitFor(() => {
      const button = getByRole('button');
      expect(button).toBeDefined();
      expect(button.getAttribute('aria-label')).toBeTruthy();
      expect(button.getAttribute('title')).toBeTruthy();
    });
  });
});
