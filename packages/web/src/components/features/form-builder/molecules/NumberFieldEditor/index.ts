/**
 * NumberFieldEditor Molecule
 *
 * Comprehensive editor for number-based form fields with support for:
 * - Basic number input
 * - Currency formatting (USD, EUR, GBP, MXN, JPY)
 * - Percentage display
 * - Min/max validation
 * - Step increments
 * - Decimal places configuration
 * - Thousands separators
 * - Custom prefix/suffix
 * - Real-time validation feedback
 * - i18n support
 *
 * @module NumberFieldEditor
 */

export { NumberFieldEditor } from './NumberFieldEditor';
export type {
  NumberFieldEditorProps,
  NumberFieldDisplayType,
  CurrencyPreset,
  CurrencyCode,
  ExtendedNumberOptions,
} from './NumberFieldEditor.types';
export {
  CURRENCY_PRESETS,
  formatNumber,
  validateNumberValue,
} from './NumberFieldEditor.types';
