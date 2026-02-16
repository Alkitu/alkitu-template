'use client';

import * as React from 'react';
import { Input } from '@/components/primitives/ui/input';
import { Label } from '@/components/primitives/ui/label';
import { Switch } from '@/components/primitives/ui/switch';
import { Button } from '@/components/primitives/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/ui/select';
import { Trash2, Copy, DollarSign, Percent, Hash } from 'lucide-react';
import type {
  NumberFieldEditorProps,
  NumberFieldDisplayType,
  CurrencyCode,
  ExtendedNumberOptions,
} from './NumberFieldEditor.types';
import { CURRENCY_PRESETS, formatNumber, validateNumberValue } from './NumberFieldEditor.types';

/**
 * NumberFieldEditor Molecule Component
 *
 * Editor for number field types with support for:
 * - Basic number input with step increments
 * - Currency formatting with multiple currencies
 * - Percentage display
 * - Min/max validation
 * - Decimal places configuration
 * - Thousands separators
 * - Prefix/suffix customization
 * - Real-time validation feedback
 * - i18n support for labels and descriptions
 *
 * @component
 * @example
 * ```tsx
 * <NumberFieldEditor
 *   field={numberField}
 *   onChange={handleChange}
 *   onDelete={handleDelete}
 *   editingLocale="en"
 * />
 * ```
 */
export function NumberFieldEditor({
  field,
  onChange,
  onDelete,
  onDuplicate,
  supportedLocales = ['en', 'es'],
  defaultLocale = 'en',
  editingLocale = 'en',
}: NumberFieldEditorProps) {
  const [previewValue, setPreviewValue] = React.useState<number>(100);
  const [validationError, setValidationError] = React.useState<string | undefined>();

  const isDefaultLocale = editingLocale === defaultLocale;

  // Get extended number options (with display type, currency, etc.)
  const numberOptions = (field.numberOptions || {}) as ExtendedNumberOptions;
  const displayType: NumberFieldDisplayType = numberOptions.displayType || 'number';

  // ============================================================================
  // LOCALIZATION HELPERS
  // ============================================================================

  const getLocalizedValue = (key: 'label' | 'placeholder' | 'description'): string => {
    if (isDefaultLocale) return field[key] || '';
    return field.i18n?.[editingLocale]?.[key] || field[key] || '';
  };

  const updateLocalizedValue = (
    key: 'label' | 'placeholder' | 'description',
    value: string
  ) => {
    if (isDefaultLocale) {
      onChange({ ...field, [key]: value });
    } else {
      onChange({
        ...field,
        i18n: {
          ...field.i18n,
          [editingLocale]: {
            ...field.i18n?.[editingLocale],
            [key]: value,
          },
        },
      });
    }
  };

  // ============================================================================
  // FIELD HANDLERS
  // ============================================================================

  const updateValidation = (updates: Partial<typeof field.validation>) => {
    onChange({
      ...field,
      validation: {
        ...field.validation,
        ...updates,
      },
    });
  };

  const updateNumberOptions = (updates: Partial<ExtendedNumberOptions>) => {
    onChange({
      ...field,
      numberOptions: {
        ...numberOptions,
        ...updates,
      },
    });
  };

  // ============================================================================
  // VALIDATION
  // ============================================================================

  React.useEffect(() => {
    const validation = validateNumberValue(previewValue, field);
    setValidationError(validation.isValid ? undefined : validation.error);
  }, [previewValue, field.validation?.min, field.validation?.max]);

  // ============================================================================
  // DISPLAY TYPE HANDLERS
  // ============================================================================

  const handleDisplayTypeChange = (type: NumberFieldDisplayType) => {
    const updates: Partial<ExtendedNumberOptions> = { displayType: type };

    if (type === 'currency' && !numberOptions.currencyCode) {
      updates.currencyCode = 'USD';
      updates.decimals = 2;
      updates.thousandsSeparator = true;
    } else if (type === 'percentage') {
      updates.decimals = 1;
      updates.suffix = undefined;
      updates.prefix = undefined;
    } else {
      // Reset to basic number
      updates.currencyCode = undefined;
      updates.prefix = undefined;
      updates.suffix = undefined;
    }

    updateNumberOptions(updates);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderBasicSettings = () => (
    <div className="space-y-4">
      {/* Label */}
      <div>
        <Label htmlFor={`${field.id}-label`}>
          Label {!isDefaultLocale && `(${editingLocale.toUpperCase()})`}
        </Label>
        <Input
          id={`${field.id}-label`}
          value={getLocalizedValue('label')}
          onChange={(e) => updateLocalizedValue('label', e.target.value)}
          placeholder="Enter label"
        />
      </div>

      {/* Placeholder */}
      <div>
        <Label htmlFor={`${field.id}-placeholder`}>
          Placeholder {!isDefaultLocale && `(${editingLocale.toUpperCase()})`}
        </Label>
        <Input
          id={`${field.id}-placeholder`}
          value={getLocalizedValue('placeholder')}
          onChange={(e) => updateLocalizedValue('placeholder', e.target.value)}
          placeholder={!isDefaultLocale ? field.placeholder : '0'}
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor={`${field.id}-description`}>
          Description {!isDefaultLocale && `(${editingLocale.toUpperCase()})`}
        </Label>
        <Input
          id={`${field.id}-description`}
          value={getLocalizedValue('description')}
          onChange={(e) => updateLocalizedValue('description', e.target.value)}
          placeholder="Optional help text"
        />
      </div>

      {/* Required Toggle */}
      <div className="flex items-center justify-between">
        <Label
          htmlFor={`${field.id}-required`}
          className={!isDefaultLocale ? 'text-muted-foreground' : ''}
        >
          Required field
        </Label>
        <Switch
          id={`${field.id}-required`}
          checked={field.validation?.required || false}
          onCheckedChange={(checked) => updateValidation({ required: checked })}
          disabled={!isDefaultLocale}
        />
      </div>
    </div>
  );

  const renderDisplayTypeSelector = () => (
    <div className="space-y-4 pt-4 border-t">
      <h4 className="text-sm font-medium">Display Type</h4>

      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant={displayType === 'number' ? 'default' : 'outline'}
          className="flex flex-col items-center gap-1 h-auto py-3"
          onClick={() => handleDisplayTypeChange('number')}
          disabled={!isDefaultLocale}
        >
          <Hash className="h-4 w-4" />
          <span className="text-xs">Number</span>
        </Button>

        <Button
          type="button"
          variant={displayType === 'currency' ? 'default' : 'outline'}
          className="flex flex-col items-center gap-1 h-auto py-3"
          onClick={() => handleDisplayTypeChange('currency')}
          disabled={!isDefaultLocale}
        >
          <DollarSign className="h-4 w-4" />
          <span className="text-xs">Currency</span>
        </Button>

        <Button
          type="button"
          variant={displayType === 'percentage' ? 'default' : 'outline'}
          className="flex flex-col items-center gap-1 h-auto py-3"
          onClick={() => handleDisplayTypeChange('percentage')}
          disabled={!isDefaultLocale}
        >
          <Percent className="h-4 w-4" />
          <span className="text-xs">Percentage</span>
        </Button>
      </div>
    </div>
  );

  const renderNumberOptions = () => (
    <div className="space-y-4 pt-4 border-t">
      <h4 className="text-sm font-medium">Number Options</h4>

      {/* Step Increment */}
      <div>
        <Label htmlFor={`${field.id}-step`}>Step Increment</Label>
        <Input
          id={`${field.id}-step`}
          type="number"
          min="0"
          step="any"
          value={numberOptions.step ?? 1}
          onChange={(e) => {
            const value = e.target.value ? parseFloat(e.target.value) : 1;
            updateNumberOptions({ step: value });
          }}
          placeholder="1"
          disabled={!isDefaultLocale}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Amount to increase/decrease when using arrow buttons
        </p>
      </div>

      {/* Decimal Places */}
      {displayType !== 'currency' && (
        <div>
          <Label htmlFor={`${field.id}-decimals`}>Decimal Places</Label>
          <Input
            id={`${field.id}-decimals`}
            type="number"
            min="0"
            max="10"
            value={numberOptions.decimals ?? 2}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value) : 2;
              updateNumberOptions({ decimals: value });
            }}
            placeholder="2"
            disabled={!isDefaultLocale}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Number of digits after decimal point
          </p>
        </div>
      )}

      {/* Thousands Separator */}
      <div className="flex items-center justify-between">
        <Label
          htmlFor={`${field.id}-thousandsSeparator`}
          className={!isDefaultLocale ? 'text-muted-foreground' : ''}
        >
          Show thousands separator
        </Label>
        <Switch
          id={`${field.id}-thousandsSeparator`}
          checked={numberOptions.thousandsSeparator ?? false}
          onCheckedChange={(checked) => updateNumberOptions({ thousandsSeparator: checked })}
          disabled={!isDefaultLocale}
        />
      </div>

      {/* Allow Negative */}
      <div className="flex items-center justify-between">
        <Label
          htmlFor={`${field.id}-allowNegative`}
          className={!isDefaultLocale ? 'text-muted-foreground' : ''}
        >
          Allow negative numbers
        </Label>
        <Switch
          id={`${field.id}-allowNegative`}
          checked={numberOptions.allowNegative ?? true}
          onCheckedChange={(checked) => updateNumberOptions({ allowNegative: checked })}
          disabled={!isDefaultLocale}
        />
      </div>
    </div>
  );

  const renderCurrencyOptions = () => {
    if (displayType !== 'currency') return null;

    const currencyCode = (numberOptions.currencyCode || 'USD') as CurrencyCode;
    const currency = CURRENCY_PRESETS[currencyCode];

    return (
      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-medium">Currency Options</h4>

        {/* Currency Selector */}
        <div>
          <Label htmlFor={`${field.id}-currency`}>Currency</Label>
          <Select
            value={currencyCode}
            onValueChange={(value: CurrencyCode) => {
              const selected = CURRENCY_PRESETS[value];
              updateNumberOptions({
                currencyCode: value,
                decimals: selected.decimals,
              });
            }}
            disabled={!isDefaultLocale}
          >
            <SelectTrigger id={`${field.id}-currency`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CURRENCY_PRESETS).map(([code, preset]) => (
                <SelectItem key={code} value={code}>
                  {preset.symbol} {preset.name} ({code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Currency Preview */}
        <div className="bg-muted p-3 rounded-md">
          <p className="text-xs text-muted-foreground mb-1">Preview:</p>
          <p className="text-lg font-mono">
            {formatNumber(previewValue, { displayType, currencyCode, decimals: currency.decimals, thousandsSeparator: numberOptions.thousandsSeparator })}
          </p>
        </div>
      </div>
    );
  };

  const renderCustomPrefixSuffix = () => {
    if (displayType !== 'number') return null;

    return (
      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-medium">Prefix / Suffix</h4>

        {/* Prefix */}
        <div>
          <Label htmlFor={`${field.id}-prefix`}>Prefix</Label>
          <Input
            id={`${field.id}-prefix`}
            value={numberOptions.prefix || ''}
            onChange={(e) => updateNumberOptions({ prefix: e.target.value || undefined })}
            placeholder="e.g., $, #"
            disabled={!isDefaultLocale}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Text shown before the number
          </p>
        </div>

        {/* Suffix */}
        <div>
          <Label htmlFor={`${field.id}-suffix`}>Suffix</Label>
          <Input
            id={`${field.id}-suffix`}
            value={numberOptions.suffix || ''}
            onChange={(e) => updateNumberOptions({ suffix: e.target.value || undefined })}
            placeholder="e.g., kg, units"
            disabled={!isDefaultLocale}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Text shown after the number
          </p>
        </div>

        {/* Preview */}
        {(numberOptions.prefix || numberOptions.suffix) && (
          <div className="bg-muted p-3 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Preview:</p>
            <p className="text-lg font-mono">
              {formatNumber(previewValue, {
                displayType,
                prefix: numberOptions.prefix,
                suffix: numberOptions.suffix,
                decimals: numberOptions.decimals,
                thousandsSeparator: numberOptions.thousandsSeparator,
              })}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderValidationOptions = () => (
    <div className="space-y-4 pt-4 border-t">
      <h4 className="text-sm font-medium">Validation</h4>

      {/* Min Value */}
      <div>
        <Label htmlFor={`${field.id}-min`}>Minimum Value</Label>
        <Input
          id={`${field.id}-min`}
          type="number"
          value={field.validation?.min ?? ''}
          onChange={(e) =>
            updateValidation({
              min: e.target.value ? parseFloat(e.target.value) : undefined,
            })
          }
          placeholder="No minimum"
          disabled={!isDefaultLocale}
        />
      </div>

      {/* Max Value */}
      <div>
        <Label htmlFor={`${field.id}-max`}>Maximum Value</Label>
        <Input
          id={`${field.id}-max`}
          type="number"
          value={field.validation?.max ?? ''}
          onChange={(e) =>
            updateValidation({
              max: e.target.value ? parseFloat(e.target.value) : undefined,
            })
          }
          placeholder="No maximum"
          disabled={!isDefaultLocale}
        />
      </div>

      {/* Validation Preview */}
      <div>
        <Label htmlFor={`${field.id}-preview`}>Test Validation</Label>
        <Input
          id={`${field.id}-preview`}
          type="number"
          value={previewValue}
          onChange={(e) => setPreviewValue(e.target.value ? parseFloat(e.target.value) : 0)}
          placeholder="Enter a number to test"
          className={validationError ? 'border-destructive' : ''}
        />
        {validationError && (
          <p className="text-xs text-destructive mt-1">{validationError}</p>
        )}
        {!validationError && (field.validation?.min !== undefined || field.validation?.max !== undefined) && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">Valid value</p>
        )}
      </div>

      {/* Error Message */}
      <div>
        <Label htmlFor={`${field.id}-errorMessage`}>Custom Error Message</Label>
        <Input
          id={`${field.id}-errorMessage`}
          value={field.validation?.errorMessage || ''}
          onChange={(e) =>
            updateValidation({ errorMessage: e.target.value || undefined })
          }
          placeholder="Please enter a valid number"
          disabled={!isDefaultLocale}
        />
      </div>
    </div>
  );

  const renderPercentagePreview = () => {
    if (displayType !== 'percentage') return null;

    return (
      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-medium">Percentage Preview</h4>
        <div className="bg-muted p-3 rounded-md">
          <p className="text-xs text-muted-foreground mb-1">Preview:</p>
          <p className="text-lg font-mono">
            {formatNumber(previewValue, {
              displayType,
              decimals: numberOptions.decimals,
            })}
          </p>
        </div>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-4 border rounded-lg p-4">
      {/* Header with Actions */}
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h3 className="text-sm font-medium">Number Field</h3>
          <p className="text-xs text-muted-foreground">ID: {field.id}</p>
        </div>
        <div className="flex gap-2">
          {onDuplicate && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDuplicate}
              aria-label="Duplicate field"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            aria-label="Delete field"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Basic Settings */}
      {renderBasicSettings()}

      {/* Display Type Selector */}
      {renderDisplayTypeSelector()}

      {/* Number Options */}
      {renderNumberOptions()}

      {/* Currency-specific options */}
      {renderCurrencyOptions()}

      {/* Custom prefix/suffix for basic numbers */}
      {renderCustomPrefixSuffix()}

      {/* Percentage preview */}
      {renderPercentagePreview()}

      {/* Validation Options */}
      {renderValidationOptions()}

      {/* Locale Indicator for non-default locales */}
      {!isDefaultLocale && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Currently editing {editingLocale.toUpperCase()} translations. Technical settings are
            disabled - switch to {defaultLocale.toUpperCase()} to modify.
          </p>
        </div>
      )}
    </div>
  );
}
