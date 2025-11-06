/**
 * Test Utilities for Theme Editor 3.0
 * These utilities help with testing components WITHOUT modifying existing code
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeEditorProvider } from '../../core/context/ThemeEditorContext';
import { vi } from 'vitest';

/**
 * Custom render function that wraps components with necessary providers
 * This allows testing components in isolation without modifying their implementation
 */
export function renderWithThemeEditor(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <ThemeEditorProvider>{children}</ThemeEditorProvider>;
  };

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Mock theme data for testing
 * Matches the exact structure of the existing theme.types.ts
 */
export const mockThemeData = {
  id: 'test-theme',
  name: 'Test Theme',
  description: 'Theme for testing',
  version: '1.0.0',
  author: 'Test Author',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  lightColors: {
    background: { name: 'background', hex: '#ffffff', oklch: { l: 1, c: 0, h: 0 }, oklchString: 'oklch(1 0 0)', rgb: { r: 255, g: 255, b: 255 }, hsv: { h: 0, s: 0, v: 100 }, value: '#ffffff' },
    foreground: { name: 'foreground', hex: '#000000', oklch: { l: 0, c: 0, h: 0 }, oklchString: 'oklch(0 0 0)', rgb: { r: 0, g: 0, b: 0 }, hsv: { h: 0, s: 0, v: 0 }, value: '#000000' },
    card: { name: 'card', hex: '#ffffff', oklch: { l: 1, c: 0, h: 0 }, oklchString: 'oklch(1 0 0)', rgb: { r: 255, g: 255, b: 255 }, hsv: { h: 0, s: 0, v: 100 }, value: '#ffffff' },
    cardForeground: { name: 'cardForeground', hex: '#000000', oklch: { l: 0, c: 0, h: 0 }, oklchString: 'oklch(0 0 0)', rgb: { r: 0, g: 0, b: 0 }, hsv: { h: 0, s: 0, v: 0 }, value: '#000000' },
    popover: { name: 'popover', hex: '#ffffff', oklch: { l: 1, c: 0, h: 0 }, oklchString: 'oklch(1 0 0)', rgb: { r: 255, g: 255, b: 255 }, hsv: { h: 0, s: 0, v: 100 }, value: '#ffffff' },
    popoverForeground: { name: 'popoverForeground', hex: '#000000', oklch: { l: 0, c: 0, h: 0 }, oklchString: 'oklch(0 0 0)', rgb: { r: 0, g: 0, b: 0 }, hsv: { h: 0, s: 0, v: 0 }, value: '#000000' },
    primary: { name: 'primary', hex: '#0000ff', oklch: { l: 0.5, c: 0.3, h: 260 }, oklchString: 'oklch(0.5 0.3 260)', rgb: { r: 0, g: 0, b: 255 }, hsv: { h: 240, s: 100, v: 100 }, value: '#0000ff' },
    primaryForeground: { name: 'primaryForeground', hex: '#ffffff', oklch: { l: 1, c: 0, h: 0 }, oklchString: 'oklch(1 0 0)', rgb: { r: 255, g: 255, b: 255 }, hsv: { h: 0, s: 0, v: 100 }, value: '#ffffff' },
    secondary: { name: 'secondary', hex: '#808080', oklch: { l: 0.5, c: 0, h: 0 }, oklchString: 'oklch(0.5 0 0)', rgb: { r: 128, g: 128, b: 128 }, hsv: { h: 0, s: 0, v: 50 }, value: '#808080' },
    secondaryForeground: { name: 'secondaryForeground', hex: '#000000', oklch: { l: 0, c: 0, h: 0 }, oklchString: 'oklch(0 0 0)', rgb: { r: 0, g: 0, b: 0 }, hsv: { h: 0, s: 0, v: 0 }, value: '#000000' },
    accent: { name: 'accent', hex: '#00ff00', oklch: { l: 0.8, c: 0.4, h: 140 }, oklchString: 'oklch(0.8 0.4 140)', rgb: { r: 0, g: 255, b: 0 }, hsv: { h: 120, s: 100, v: 100 }, value: '#00ff00' },
    accentForeground: { name: 'accentForeground', hex: '#000000', oklch: { l: 0, c: 0, h: 0 }, oklchString: 'oklch(0 0 0)', rgb: { r: 0, g: 0, b: 0 }, hsv: { h: 0, s: 0, v: 0 }, value: '#000000' },
    muted: { name: 'muted', hex: '#f0f0f0', oklch: { l: 0.95, c: 0, h: 0 }, oklchString: 'oklch(0.95 0 0)', rgb: { r: 240, g: 240, b: 240 }, hsv: { h: 0, s: 0, v: 94 }, value: '#f0f0f0' },
    mutedForeground: { name: 'mutedForeground', hex: '#666666', oklch: { l: 0.4, c: 0, h: 0 }, oklchString: 'oklch(0.4 0 0)', rgb: { r: 102, g: 102, b: 102 }, hsv: { h: 0, s: 0, v: 40 }, value: '#666666' },
    destructive: { name: 'destructive', hex: '#ff0000', oklch: { l: 0.6, c: 0.3, h: 30 }, oklchString: 'oklch(0.6 0.3 30)', rgb: { r: 255, g: 0, b: 0 }, hsv: { h: 0, s: 100, v: 100 }, value: '#ff0000' },
    destructiveForeground: { name: 'destructiveForeground', hex: '#ffffff', oklch: { l: 1, c: 0, h: 0 }, oklchString: 'oklch(1 0 0)', rgb: { r: 255, g: 255, b: 255 }, hsv: { h: 0, s: 0, v: 100 }, value: '#ffffff' },
    warning: { name: 'warning', hex: '#ffaa00', oklch: { l: 0.7, c: 0.2, h: 80 }, oklchString: 'oklch(0.7 0.2 80)', rgb: { r: 255, g: 170, b: 0 }, hsv: { h: 40, s: 100, v: 100 }, value: '#ffaa00' },
    warningForeground: { name: 'warningForeground', hex: '#000000', oklch: { l: 0, c: 0, h: 0 }, oklchString: 'oklch(0 0 0)', rgb: { r: 0, g: 0, b: 0 }, hsv: { h: 0, s: 0, v: 0 }, value: '#000000' },
    success: { name: 'success', hex: '#00ff00', oklch: { l: 0.8, c: 0.4, h: 140 }, oklchString: 'oklch(0.8 0.4 140)', rgb: { r: 0, g: 255, b: 0 }, hsv: { h: 120, s: 100, v: 100 }, value: '#00ff00' },
    successForeground: { name: 'successForeground', hex: '#000000', oklch: { l: 0, c: 0, h: 0 }, oklchString: 'oklch(0 0 0)', rgb: { r: 0, g: 0, b: 0 }, hsv: { h: 0, s: 0, v: 0 }, value: '#000000' },
    border: { name: 'border', hex: '#e0e0e0', oklch: { l: 0.9, c: 0, h: 0 }, oklchString: 'oklch(0.9 0 0)', rgb: { r: 224, g: 224, b: 224 }, hsv: { h: 0, s: 0, v: 88 }, value: '#e0e0e0' },
    input: { name: 'input', hex: '#e0e0e0', oklch: { l: 0.9, c: 0, h: 0 }, oklchString: 'oklch(0.9 0 0)', rgb: { r: 224, g: 224, b: 224 }, hsv: { h: 0, s: 0, v: 88 }, value: '#e0e0e0' },
    ring: { name: 'ring', hex: '#0000ff', oklch: { l: 0.5, c: 0.3, h: 260 }, oklchString: 'oklch(0.5 0.3 260)', rgb: { r: 0, g: 0, b: 255 }, hsv: { h: 240, s: 100, v: 100 }, value: '#0000ff' },
    chart1: { name: 'chart1', hex: '#ff6384', oklch: { l: 0.6, c: 0.25, h: 20 }, oklchString: 'oklch(0.6 0.25 20)', rgb: { r: 255, g: 99, b: 132 }, hsv: { h: 347, s: 61, v: 100 }, value: '#ff6384' },
    chart2: { name: 'chart2', hex: '#36a2eb', oklch: { l: 0.65, c: 0.2, h: 230 }, oklchString: 'oklch(0.65 0.2 230)', rgb: { r: 54, g: 162, b: 235 }, hsv: { h: 204, s: 77, v: 92 }, value: '#36a2eb' },
    chart3: { name: 'chart3', hex: '#ffce56', oklch: { l: 0.85, c: 0.15, h: 90 }, oklchString: 'oklch(0.85 0.15 90)', rgb: { r: 255, g: 206, b: 86 }, hsv: { h: 43, s: 66, v: 100 }, value: '#ffce56' },
    chart4: { name: 'chart4', hex: '#4bc0c0', oklch: { l: 0.7, c: 0.15, h: 180 }, oklchString: 'oklch(0.7 0.15 180)', rgb: { r: 75, g: 192, b: 192 }, hsv: { h: 180, s: 61, v: 75 }, value: '#4bc0c0' },
    chart5: { name: 'chart5', hex: '#9966ff', oklch: { l: 0.55, c: 0.3, h: 290 }, oklchString: 'oklch(0.55 0.3 290)', rgb: { r: 153, g: 102, b: 255 }, hsv: { h: 260, s: 60, v: 100 }, value: '#9966ff' },
    sidebar: { name: 'sidebar', hex: '#f5f5f5', oklch: { l: 0.97, c: 0, h: 0 }, oklchString: 'oklch(0.97 0 0)', rgb: { r: 245, g: 245, b: 245 }, hsv: { h: 0, s: 0, v: 96 }, value: '#f5f5f5' },
    sidebarForeground: { name: 'sidebarForeground', hex: '#333333', oklch: { l: 0.2, c: 0, h: 0 }, oklchString: 'oklch(0.2 0 0)', rgb: { r: 51, g: 51, b: 51 }, hsv: { h: 0, s: 0, v: 20 }, value: '#333333' },
    sidebarPrimary: { name: 'sidebarPrimary', hex: '#0000ff', oklch: { l: 0.5, c: 0.3, h: 260 }, oklchString: 'oklch(0.5 0.3 260)', rgb: { r: 0, g: 0, b: 255 }, hsv: { h: 240, s: 100, v: 100 }, value: '#0000ff' },
    sidebarPrimaryForeground: { name: 'sidebarPrimaryForeground', hex: '#ffffff', oklch: { l: 1, c: 0, h: 0 }, oklchString: 'oklch(1 0 0)', rgb: { r: 255, g: 255, b: 255 }, hsv: { h: 0, s: 0, v: 100 }, value: '#ffffff' },
    sidebarAccent: { name: 'sidebarAccent', hex: '#00ff00', oklch: { l: 0.8, c: 0.4, h: 140 }, oklchString: 'oklch(0.8 0.4 140)', rgb: { r: 0, g: 255, b: 0 }, hsv: { h: 120, s: 100, v: 100 }, value: '#00ff00' },
    sidebarAccentForeground: { name: 'sidebarAccentForeground', hex: '#000000', oklch: { l: 0, c: 0, h: 0 }, oklchString: 'oklch(0 0 0)', rgb: { r: 0, g: 0, b: 0 }, hsv: { h: 0, s: 0, v: 0 }, value: '#000000' },
    sidebarBorder: { name: 'sidebarBorder', hex: '#e0e0e0', oklch: { l: 0.9, c: 0, h: 0 }, oklchString: 'oklch(0.9 0 0)', rgb: { r: 224, g: 224, b: 224 }, hsv: { h: 0, s: 0, v: 88 }, value: '#e0e0e0' },
    sidebarRing: { name: 'sidebarRing', hex: '#0000ff', oklch: { l: 0.5, c: 0.3, h: 260 }, oklchString: 'oklch(0.5 0.3 260)', rgb: { r: 0, g: 0, b: 255 }, hsv: { h: 240, s: 100, v: 100 }, value: '#0000ff' },
    scrollbarTrack: { name: 'scrollbarTrack', hex: '#f0f0f0', oklch: { l: 0.95, c: 0, h: 0 }, oklchString: 'oklch(0.95 0 0)', rgb: { r: 240, g: 240, b: 240 }, hsv: { h: 0, s: 0, v: 94 }, value: '#f0f0f0' },
    scrollbarThumb: { name: 'scrollbarThumb', hex: '#888888', oklch: { l: 0.55, c: 0, h: 0 }, oklchString: 'oklch(0.55 0 0)', rgb: { r: 136, g: 136, b: 136 }, hsv: { h: 0, s: 0, v: 53 }, value: '#888888' },
  },
  darkColors: {
    // Same structure but with dark theme colors
    background: { name: 'background', hex: '#1a1a1a', oklch: { l: 0.1, c: 0, h: 0 }, oklchString: 'oklch(0.1 0 0)', rgb: { r: 26, g: 26, b: 26 }, hsv: { h: 0, s: 0, v: 10 }, value: '#1a1a1a' },
    foreground: { name: 'foreground', hex: '#ffffff', oklch: { l: 1, c: 0, h: 0 }, oklchString: 'oklch(1 0 0)', rgb: { r: 255, g: 255, b: 255 }, hsv: { h: 0, s: 0, v: 100 }, value: '#ffffff' },
    // ... rest of dark colors (simplified for brevity)
  } as any,
  typography: {
    fontFamilies: {
      sans: 'Inter, sans-serif',
      serif: 'Georgia, serif',
      mono: 'JetBrains Mono, monospace',
    },
    trackingNormal: '0',
  },
  brand: {
    name: 'Test Brand',
    logos: {
      icon: null,
      horizontal: null,
      vertical: null,
    },
    primaryColor: { name: 'primary', hex: '#0000ff', oklch: { l: 0.5, c: 0.3, h: 260 }, oklchString: 'oklch(0.5 0.3 260)', rgb: { r: 0, g: 0, b: 255 }, hsv: { h: 240, s: 100, v: 100 }, value: '#0000ff' },
    secondaryColor: { name: 'secondary', hex: '#808080', oklch: { l: 0.5, c: 0, h: 0 }, oklchString: 'oklch(0.5 0 0)', rgb: { r: 128, g: 128, b: 128 }, hsv: { h: 0, s: 0, v: 50 }, value: '#808080' },
  },
  spacing: {
    spacing: '2.2rem',
    scale: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },
  },
  borders: {
    globalRadius: { value: 8, isLinked: true, formula: 'calc(var(--radius) - 2px)' },
    cardsRadius: { value: 8, isLinked: true, formula: 'calc(var(--radius) - 2px)' },
    buttonsRadius: { value: 6, isLinked: false, formula: 'calc(var(--radius) - 2px)' },
    checkboxRadius: { value: 4, isLinked: false, formula: 'calc(var(--radius) - 2px)' },
    radius: '8px',
    radiusSm: 'calc(var(--radius) - 4px)',
    radiusMd: 'calc(var(--radius) - 2px)',
    radiusLg: 'var(--radius)',
    radiusXl: 'calc(var(--radius) + 4px)',
    radiusCard: '8px',
    radiusCardInner: 'calc(var(--radius-card) - 2px)',
    radiusButton: '6px',
    radiusButtonInner: 'calc(var(--radius-button) - 2px)',
    radiusCheckbox: '4px',
    radiusCheckboxInner: 'calc(var(--radius-checkbox) - 2px)',
  },
  shadows: {
    shadow2xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    shadowXs: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    shadowSm: '0 2px 4px -1px rgb(0 0 0 / 0.1)',
    shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    shadowMd: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    shadowLg: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    shadowXl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    shadow2xl: '0 35px 60px -15px rgb(0 0 0 / 0.3)',
  },
  scroll: {
    width: '12px',
    behavior: 'smooth',
    smooth: true,
    hide: false,
    trackRadius: '6px',
    thumbRadius: '6px',
  },
  tags: [],
  isPublic: false,
  isFavorite: false,
};

/**
 * Helper function to wait for async updates
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Mock localStorage for testing
 */
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  const localStorageMock = {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  return localStorageMock;
};

/**
 * Mock ResizeObserver for components that use it
 */
export const mockResizeObserver = () => {
  const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  window.ResizeObserver = ResizeObserverMock as any;

  return ResizeObserverMock;
};

// Re-export everything from @testing-library/react for convenience
export * from '@testing-library/react';
export { vi } from 'vitest';