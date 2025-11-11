export type InputVariant = 'default' | 'filled' | 'outline';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Visual variant of the input
   * @default 'default'
   */
  variant?: InputVariant;

  /**
   * Size of the input
   * @default 'md'
   */
  size?: InputSize;

  /**
   * Input label
   */
  label?: string;

  /**
   * Helper text below input
   */
  helperText?: string;

  /**
   * Error message
   */
  error?: string;

  /**
   * Whether the input is required
   * @default false
   */
  required?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Theme variable overrides for custom styling
   */
  themeOverride?: Record<string, string>;

  /**
   * Whether to use system colors (for special cases)
   * @default true
   */
  useSystemColors?: boolean;
}