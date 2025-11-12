/**
 * FormSuccess Component - Theme-Aware Implementation
 *
 * Uses comprehensive CSS variable system for dynamic theming:
 * - Border Radius: --radius-input (consistent with form inputs)
 * - Spacing: --spacing-* for padding, gaps, and margins
 * - Transitions: --transition-base for smooth changes
 * - Colors: Tailwind classes with CSS variables (emerald/success color)
 *
 * All variables automatically respond to theme changes via DynamicThemeProvider.
 *
 * @see docs/CSS-VARIABLES-REFERENCE.md for complete variable documentation
 */

import { CheckCircle2 } from "lucide-react";
import React from "react";

interface FormSuccessProps {
  message?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FormSuccess = ({ message, className, style }: FormSuccessProps) => {
  if (!message) return null;

  const successStyles: React.CSSProperties = {
    // Border radius - Use input radius for consistency with form elements
    borderRadius: 'var(--radius-input, var(--radius, 0.375rem))',

    // Spacing - Use spacing system for padding, gaps, and margins
    padding: 'var(--spacing-sm, 0.75rem)',
    gap: 'var(--spacing-sm, 0.5rem)',
    marginTop: 'var(--spacing-md, 1rem)',

    // Transition - Use standardized transition for smooth changes
    transition: 'all var(--transition-base, 200ms cubic-bezier(0.4, 0, 0.2, 1))',
  };

  return (
    <div
      style={{ ...successStyles, ...style }}
      className={`bg-emerald-500/15 flex items-center text-sm text-emerald-500 ${className || ''}`}
    >
      <CheckCircle2 size={20} />
      <span>{message}</span>
    </div>
  );
};
