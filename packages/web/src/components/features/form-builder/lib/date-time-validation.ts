/**
 * Date and time validation helpers
 * Used by form-validation.ts for validating date/time fields
 */

import { DateFieldOptions } from '@/components/features/form-builder/types';

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

/**
 * Check if a date is in the disabled dates array
 */
export function isDateDisabled(date: Date, disabledDates: (Date | string)[]): boolean {
  const dateString = formatDateToYMD(date);
  return disabledDates.some((disabledDate) => {
    const disabledDateString =
      typeof disabledDate === 'string' ? disabledDate : formatDateToYMD(disabledDate);
    return dateString === disabledDateString;
  });
}

/**
 * Format date to YYYY-MM-DD for comparison
 */
export function formatDateToYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert time string (HH:mm or HH:mm:ss) to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const parts = time.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  return hours * 60 + minutes;
}

/**
 * Check if a time is within business hours
 */
export function isWithinBusinessHours(
  time: string,
  businessHours?: DateFieldOptions['businessHours'],
): boolean {
  if (!businessHours?.enabled) return true;
  if (!businessHours.start || !businessHours.end) return true;

  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(businessHours.start);
  const endMinutes = timeToMinutes(businessHours.end);

  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
}

/**
 * Check if a date is within the allowed date range
 */
export function isDateInRange(
  date: Date,
  minDate?: Date | string,
  maxDate?: Date | string,
): { valid: boolean; error?: 'min' | 'max' } {
  if (minDate) {
    const min = typeof minDate === 'string' ? new Date(minDate) : minDate;
    if (date < min) {
      return { valid: false, error: 'min' };
    }
  }

  if (maxDate) {
    const max = typeof maxDate === 'string' ? new Date(maxDate) : maxDate;
    if (date > max) {
      return { valid: false, error: 'max' };
    }
  }

  return { valid: true };
}

/**
 * Check if a time is within the allowed time range
 */
export function isTimeInRange(
  time: string,
  minTime?: string,
  maxTime?: string,
): { valid: boolean; error?: 'min' | 'max' } {
  const timeMinutes = timeToMinutes(time);

  if (minTime) {
    const minMinutes = timeToMinutes(minTime);
    if (timeMinutes < minMinutes) {
      return { valid: false, error: 'min' };
    }
  }

  if (maxTime) {
    const maxMinutes = timeToMinutes(maxTime);
    if (timeMinutes > maxMinutes) {
      return { valid: false, error: 'max' };
    }
  }

  return { valid: true };
}

/**
 * Extract time from a Date or datetime string
 */
export function extractTime(value: Date | string): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Extract date from a Date or datetime string
 */
export function extractDate(value: Date | string): Date {
  if (typeof value === 'string') {
    // Handle different string formats
    if (value.includes('T')) {
      // ISO datetime
      return new Date(value);
    } else if (value.includes('-')) {
      // Date only (YYYY-MM-DD)
      return new Date(value + 'T00:00:00');
    }
    // Fallback for any other string format
    return new Date(value);
  }
  return value;
}

/**
 * Format date for display in error messages
 */
export function formatDateForDisplay(date: Date | string, locale: 'en' | 'es' = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const localeString = locale === 'es' ? 'es-ES' : 'en-US';
  return d.toLocaleDateString(localeString, options);
}

/**
 * Format time for display in error messages
 */
export function formatTimeForDisplay(time: string, hourCycle: 12 | 24 = 24): string {
  if (hourCycle === 24) return time;

  // Convert to 12h format
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}
