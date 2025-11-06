// Theme Editor 3.0 - Viewport Types
export type ViewportSize = 'tv' | 'desktop' | 'tablet' | 'smartphone';

export interface ViewportConfig {
  id: ViewportSize;
  name: string;
  width: number;
  height: number;
  icon: string;
  description: string;
}

export interface ViewportState {
  current: ViewportSize;
  isResponsive: boolean;
  customWidth?: number;
  customHeight?: number;
}

export const VIEWPORT_CONFIGS: Record<ViewportSize, ViewportConfig> = {
  tv: {
    id: 'tv',
    name: 'TV',
    width: 1920,
    height: 1080,
    icon: 'Monitor',
    description: 'Large screen TV (1920x1080)'
  },
  desktop: {
    id: 'desktop',
    name: 'Desktop',
    width: 1440,
    height: 900,
    icon: 'Monitor',
    description: 'Desktop computer (1440x900)'
  },
  tablet: {
    id: 'tablet',
    name: 'Tablet',
    width: 768,
    height: 1024,
    icon: 'Tablet',
    description: 'Tablet device (768x1024)'
  },
  smartphone: {
    id: 'smartphone',
    name: 'Smartphone',
    width: 375,
    height: 667,
    icon: 'Smartphone',
    description: 'Mobile phone (375x667)'
  }
} as const;