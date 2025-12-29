import { HTMLAttributes } from 'react';

export interface BackToLoginButtonProps extends Omit<HTMLAttributes<HTMLAnchorElement>, 'href'> {
  /**
   * The text label for the button
   */
  label: string;

  /**
   * The href to navigate to when clicked
   * @default '/auth/login'
   */
  href?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}
