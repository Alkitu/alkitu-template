// Theme Editor 3.0 - Preview Types
export type PreviewSection = 'colors' | 'typography' | 'brand';

export interface PreviewState {
  activeSection: PreviewSection;
  isFullscreen: boolean;
  showGrid: boolean;
  showRuler: boolean;
}