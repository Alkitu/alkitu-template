import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Local implementation of cn function to make theme-editor-3.0 self-contained
 * Combines clsx and tailwind-merge for efficient class name handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}