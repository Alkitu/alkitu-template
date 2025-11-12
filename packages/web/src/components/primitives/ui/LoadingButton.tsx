/**
 * LoadingButton Component - Theme-Aware Implementation
 *
 * Extends the Button component with loading state functionality.
 * Inherits all CSS variable system from Button component:
 * - Typography: --typography-button-*
 * - Border Radius: --radius-button
 * - Shadows: --shadow-button
 * - Spacing: --spacing-* for padding
 * - Transitions: --transition-fast
 *
 * All variables automatically respond to theme changes via DynamicThemeProvider.
 *
 * @see Button component for detailed CSS variable documentation
 * @see docs/CSS-VARIABLES-REFERENCE.md for complete variable documentation
 */

import * as React from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import LoadingSpinner from './LoadingSpinner';

export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, className, isLoading = false, ...props }, ref) => {
    const spinnerStyles: React.CSSProperties = {
      // Spacing - Use spacing system for margin
      marginRight: 'var(--spacing-sm, 0.5rem)',
    };

    return (
      <div className="relative">
        <Button
          className={cn(className)}
          ref={ref}
          disabled={isLoading}
          {...props}
        >
          {isLoading && (
            <LoadingSpinner
              className="w-6 h-6"
              style={spinnerStyles}
            />
          )}
          {children}
        </Button>
      </div>
    );
  },
);
LoadingButton.displayName = 'LoadingButton';

export default LoadingButton;
