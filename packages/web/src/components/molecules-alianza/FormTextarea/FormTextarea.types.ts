import React from 'react';

/**
 * Props for the FormTextarea component
 */
export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Label text for the textarea
   */
  label: string;

  /**
   * Error message to display below the textarea
   */
  error?: string;
}
