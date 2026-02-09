import type { TextareaHTMLAttributes } from 'react';

/**
 * Textarea variant types
 */
export type TextareaVariant = 'default' | 'filled' | 'outline';

/**
 * Textarea size types
 */
export type TextareaSize = 'sm' | 'md' | 'lg';

/**
 * Textarea validation state types
 */
export type TextareaState = 'default' | 'error' | 'success' | 'warning';

/**
 * Autosize reference type for imperative handle
 */
export interface AutosizeTextAreaRef {
  textArea: HTMLTextAreaElement;
  focus: () => void;
  maxHeight: number;
  minHeight: number;
}

/**
 * Props for Textarea component (Pure Atom - No label/description)
 *
 * This is a pure atom component that handles only the textarea element itself.
 * For composed textareas with labels, use FormInput molecule.
 *
 * Features:
 * - Multiple variants (default, filled, outline)
 * - Three sizes (sm, md, lg)
 * - Validation states (default, error, success, warning)
 * - Auto-resize functionality (optional)
 * - Theme integration with CSS variables
 * - Accessibility built-in (ARIA attributes)
 * - forwardRef for parent component access
 *
 * @example
 * ```tsx
 * // Pure atom usage
 * <Textarea placeholder="Enter text..." />
 * <Textarea variant="filled" size="lg" />
 * <Textarea state="error" />
 *
 * // With autosize
 * <Textarea autosize minHeight={100} maxHeight={300} />
 * ```
 */
export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /**
   * Visual variant of the textarea
   * @default 'default'
   */
  variant?: TextareaVariant;

  /**
   * Size of the textarea
   * @default 'md'
   */
  size?: TextareaSize;

  /**
   * Validation state of the textarea
   * @default 'default'
   */
  state?: TextareaState;

  /**
   * Enable auto-resize functionality
   * @default false
   */
  autosize?: boolean;

  /**
   * Maximum height for autosize (in pixels)
   * @default Number.MAX_SAFE_INTEGER
   */
  maxHeight?: number;

  /**
   * Minimum height for autosize (in pixels)
   * @default 52
   */
  minHeight?: number;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Theme variable overrides for custom styling
   */
  themeOverride?: React.CSSProperties;

  /**
   * Whether to use system colors (for special cases)
   * @default true
   */
  useSystemColors?: boolean;
}
