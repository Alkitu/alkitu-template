import type { InputHTMLAttributes } from 'react';

/**
 * Props for Input component
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Custom className for the input
   */
  className?: string;

  /**
   * Input type
   * @default 'text'
   */
  type?: React.HTMLInputTypeAttribute;
}
