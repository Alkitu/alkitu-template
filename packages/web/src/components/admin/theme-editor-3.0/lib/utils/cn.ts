/**
 * Theme Editor 3.0 - Local Utils (cn function)
 *
 * PREPARACIÓN PRE-ETAPA 7: Standalone Utilities
 *
 * Copia LOCAL de la utility cn del sistema global
 * REGLA: Copia EXACTA sin modificaciones
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