/**
 * Design System Exports
 *
 * Standard UI components (Badge, Separator, Toggle, etc.) have been migrated to alianza.
 * Import those from '@/components/atoms-alianza/' or '@/components/molecules-alianza/'.
 *
 * Standard primitives (Dialog, Card, etc.) should be imported from '@/components/primitives/ui/'.
 *
 * This barrel only exports theme-editor-specific components that have no alianza equivalent
 * or require incompatible APIs (showcase presets, CSS variable injection, etc.).
 */
export * from './atoms';
export * from './molecules';
