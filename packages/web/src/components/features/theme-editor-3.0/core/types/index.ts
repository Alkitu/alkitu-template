// Theme Editor 3.0 - Types Export Barrel
export * from './theme.types';
export * from './viewport.types';
export * from './editor.types';
export * from './preview.types';
// Re-export everything from editor-handlers.types EXCEPT EditorSection (conflicts with editor.types)
export type {
  ColorsChangeHandler,
  TypographyChangeHandler,
  BrandChangeHandler,
  BordersChangeHandler,
  SpacingChangeHandler,
  ShadowsChangeHandler,
  ScrollChangeHandler,
  ColorsEditorProps,
  TypographyEditorProps,
  BrandEditorProps,
  BordersEditorProps,
  SpacingEditorProps,
  ShadowsEditorProps,
  ScrollEditorProps,
  ThemeUpdateHandler,
  ThemeProperty,
} from './editor-handlers.types';
// Export the interface version as EditorSectionConfig to avoid conflict
export type { EditorSection as EditorSectionConfig } from './editor-handlers.types';
export * from './actions-bar.types';