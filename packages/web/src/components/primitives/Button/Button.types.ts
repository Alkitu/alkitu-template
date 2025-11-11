export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * @default 'default'
   */
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'loading' | 'icon';

  /**
   * Size of the button
   * @default 'default'
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';

  /**
   * Whether the button is in loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Icon to display in the button
   */
  icon?: React.ReactNode;

  /**
   * Accessibility label (required for icon-only buttons)
   */
  'aria-label'?: string;

  /**
   * Accessibility description
   */
  'aria-describedby'?: string;

  /**
   * Accessibility live region
   */
  'aria-live'?: 'off' | 'polite' | 'assertive';
}
