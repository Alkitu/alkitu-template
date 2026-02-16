import type { FormField, SupportedLocale } from '@/components/features/form-builder/types';

/**
 * NumberFieldEditor Molecule Component Props
 *
 * Editor for number-based field types including basic number input,
 * currency fields, and percentage fields with formatting options.
 */
export interface NumberFieldEditorProps {
  /**
   * Form field being edited
   * Must be type: 'number'
   */
  field: FormField;

  /**
   * Callback when field configuration changes
   */
  onChange: (field: FormField) => void;

  /**
   * Callback when field should be deleted
   */
  onDelete: () => void;

  /**
   * Optional callback when field should be duplicated
   */
  onDuplicate?: () => void;

  /**
   * List of supported locales for i18n
   * @default ['en', 'es']
   */
  supportedLocales?: SupportedLocale[];

  /**
   * Default locale for the form
   * @default 'en'
   */
  defaultLocale?: SupportedLocale;

  /**
   * Current editing locale
   * @default 'en'
   */
  editingLocale?: SupportedLocale;
}

/**
 * Number field display type
 */
export type NumberFieldDisplayType = 'number' | 'currency' | 'percentage';

/**
 * Currency preset configuration
 */
export interface CurrencyPreset {
  code: string;
  symbol: string;
  name: string;
  position: 'prefix' | 'suffix';
  decimals: number;
  thousandsSeparator: string;
  decimalSeparator: string;
}

/**
 * Predefined currency formats
 */
export const CURRENCY_PRESETS: Record<string, CurrencyPreset> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    position: 'prefix',
    decimals: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    position: 'suffix',
    decimals: 2,
    thousandsSeparator: '.',
    decimalSeparator: ',',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    position: 'prefix',
    decimals: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  MXN: {
    code: 'MXN',
    symbol: '$',
    name: 'Mexican Peso',
    position: 'prefix',
    decimals: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    position: 'prefix',
    decimals: 0,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
} as const;

export type CurrencyCode = keyof typeof CURRENCY_PRESETS;

/**
 * Extended number options (used internally by editor)
 */
export interface ExtendedNumberOptions {
  step?: number;
  displayType?: NumberFieldDisplayType;
  currencyCode?: CurrencyCode;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  thousandsSeparator?: boolean;
  allowNegative?: boolean;
}

/**
 * Formats a number according to specified options
 */
export function formatNumber(
  value: number,
  options: Partial<ExtendedNumberOptions>
): string {
  const {
    displayType = 'number',
    currencyCode,
    decimals = 2,
    prefix,
    suffix,
    thousandsSeparator = false,
  } = options;

  let formatted = value.toFixed(decimals);

  // Add thousands separator
  if (thousandsSeparator) {
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formatted = parts.join('.');
  }

  // Add prefix/suffix based on display type
  if (displayType === 'currency' && currencyCode) {
    const currency = CURRENCY_PRESETS[currencyCode];
    if (currency.position === 'prefix') {
      formatted = `${currency.symbol}${formatted}`;
    } else {
      formatted = `${formatted}${currency.symbol}`;
    }
  } else if (displayType === 'percentage') {
    formatted = `${formatted}%`;
  } else if (prefix) {
    formatted = `${prefix}${formatted}`;
  } else if (suffix) {
    formatted = `${formatted}${suffix}`;
  }

  return formatted;
}

/**
 * Validates number against field constraints
 */
export function validateNumberValue(
  value: number,
  field: FormField
): { isValid: boolean; error?: string } {
  const min = field.validation?.min;
  const max = field.validation?.max;

  if (min !== undefined && value < min) {
    return { isValid: false, error: `Value must be at least ${min}` };
  }

  if (max !== undefined && value > max) {
    return { isValid: false, error: `Value must be at most ${max}` };
  }

  return { isValid: true };
}
