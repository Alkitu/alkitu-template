/**
 * Theme Editor 3.0 - Local Utils
 *
 * PREPARACIÓN PRE-ETAPA 7: Standalone Utilities
 *
 * Comprehensive local utilities for Theme Editor
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function para combinar class names con Tailwind merge
 * Copiada EXACTAMENTE de @/components/ui/utils
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export para compatibility
export default cn;

// Additional utils si son necesarias
export { clsx, twMerge };
export type { ClassValue };
