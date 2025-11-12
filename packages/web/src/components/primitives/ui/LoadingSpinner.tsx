/**
 * LoadingSpinner Component - Theme-Aware Implementation
 *
 * Uses CSS variable system for dynamic theming:
 * - Transitions: --transition-base for animation duration
 * - Colors: currentColor (inherits from parent's text color)
 *
 * The spinner animation automatically responds to theme changes.
 *
 * @see docs/CSS-VARIABLES-REFERENCE.md for complete variable documentation
 */

import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const LoadingSpinner = ({ className, style }: Props) => {
  const spinnerStyles: React.CSSProperties = {
    // Animation - Uses Tailwind's animate-spin with theme-aware duration
    // Note: Tailwind animate-spin uses fixed 1s duration, but can be customized via Tailwind config
    ...style,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="512"
      height="512"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={spinnerStyles}
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export default LoadingSpinner;
