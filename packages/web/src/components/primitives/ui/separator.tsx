/**
 * Separator Component - Theme-Aware Implementation
 *
 * Uses comprehensive CSS variable system for dynamic theming:
 * - Spacing: --spacing-* for padding and margins
 * - Border Radius: --radius-separator (for decorative separators)
 * - Transitions: --transition-base for smooth changes
 * - Colors: Tailwind classes with CSS variables
 *
 * All variables automatically respond to theme changes via DynamicThemeProvider.
 *
 * @see docs/CSS-VARIABLES-REFERENCE.md for complete variable documentation
 */

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  separatorColor?: string;
  style?: React.CSSProperties;
};

const Separator = ({ children, className, separatorColor, style }: Props) => {
  const separatorStyles: React.CSSProperties = {
    // Spacing - Use spacing system for padding
    paddingLeft: 'var(--spacing-sm, 0.5rem)',
    paddingRight: 'var(--spacing-sm, 0.5rem)',
  };

  const textStyles: React.CSSProperties = {
    // Spacing - Use spacing system for margins
    marginLeft: 'var(--spacing-md, 1rem)',
    marginRight: 'var(--spacing-md, 1rem)',
  };

  return (
    <div
      style={{ ...separatorStyles, ...style }}
      className={cn("w-full flex", className)}
    >
      <span className={cn("border-t grow", separatorColor)} />
      <span
        style={textStyles}
        className="text-center text-xs bg-inherit opacity-100 -mt-2"
      >
        {children}
      </span>
      <span className={cn("border-t grow", separatorColor)} />
    </div>
  );
};

export { Separator };
export default Separator;
