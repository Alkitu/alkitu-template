import React from 'react';

/**
 * FormInput Component Props
 *
 * Props interface for the FormInput molecule component, which provides
 * a complete form input with label, optional icons, and error display.
 *
 * @interface FormInputProps
 * @extends {React.InputHTMLAttributes<HTMLInputElement>}
 */
export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * The label text displayed above the input field.
   * Required for accessibility and user guidance.
   *
   * @type {string}
   */
  label: string;

  /**
   * Optional icon to display on the left side of the input.
   * Can be any React node (SVG, component, etc.).
   *
   * @type {React.ReactNode}
   * @optional
   */
  icon?: React.ReactNode;

  /**
   * Optional icon to display on the right side of the input.
   * Commonly used for visibility toggles, validation indicators, etc.
   *
   * @type {React.ReactNode}
   * @optional
   */
  iconRight?: React.ReactNode;

  /**
   * Error message to display below the input field.
   * When present, the input will be styled with error colors
   * and the message will be displayed in red.
   *
   * @type {string}
   * @optional
   */
  error?: string;
}
