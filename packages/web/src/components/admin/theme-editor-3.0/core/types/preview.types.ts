// Theme Editor 3.0 - Preview Types
export type PreviewSection = 'colors' | 'typography' | 'brand' | 'atomos' | 'moleculas' | 'organismos';

export interface PreviewState {
  activeSection: PreviewSection;
  isFullscreen: boolean;
  showGrid: boolean;
  showRuler: boolean;
}

export interface ComponentShowcase<T = Record<string, unknown>> {
  id: string;
  name: string;
  category: 'atomos' | 'moleculas' | 'organismos';
  component: React.ComponentType<T>;
  props?: T;
  variants?: ComponentVariant<T>[];
}

export interface ComponentVariant<T = Record<string, unknown>> {
  name: string;
  props: T;
  description?: string;
}