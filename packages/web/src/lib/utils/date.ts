/**
 * Date formatting utilities
 */

/**
 * Formats a date string to a localized date and time string
 * @param dateString - ISO date string
 * @param locale - Locale for formatting (default: 'es-ES')
 * @returns Formatted date string
 */
export function formatDate(dateString: string, locale: string = 'es-ES'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
