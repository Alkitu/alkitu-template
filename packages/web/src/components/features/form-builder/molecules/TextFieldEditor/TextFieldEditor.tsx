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
import { Trash2, Copy, CheckCircle2, XCircle } from 'lucide-react';
import { CharacterCount } from '../../atoms/CharacterCount';
import type { TextFieldEditorProps, PhoneCountryCode } from './TextFieldEditor.types';
import { PHONE_PRESET_MASKS } from './TextFieldEditor.types';

/**
 * TextFieldEditor Molecule Component
 *
 * Unified editor for text, email, and phone field types.
 * Provides type-specific validation and input options.
 *
 * Features:
 * - Text: minLength, maxLength, pattern (regex)
 * - Email: format validation, showValidationIcon, allowMultiple
 * - Phone: format selection, mask patterns, country codes
 * - i18n support for labels, placeholders, descriptions
 * - Character count integration
 * - Required field toggle
 *
 * @component
 * @example
 * ```tsx
 * <TextFieldEditor
 *   field={textField}
 *   onChange={handleChange}
 *   onDelete={handleDelete}
 *   editingLocale="en"
 * />
 * ```
 */
export function TextFieldEditor({
  field,
  onChange,
  onDelete,
  onDuplicate,
  supportedLocales = ['en', 'es'],
  defaultLocale = 'en',
  editingLocale = 'en',
}: TextFieldEditorProps) {
  const [emailPreview, setEmailPreview] = React.useState('');
  const [isEmailValid, setIsEmailValid] = React.useState<boolean | null>(null);

  const isDefaultLocale = editingLocale === defaultLocale;

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
  // FIELD TYPE-SPECIFIC HANDLERS
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

  const updateEmailOptions = (updates: Partial<typeof field.emailOptions>) => {
    onChange({
      ...field,
      emailOptions: {
        ...field.emailOptions,
        ...updates,
      },
    });
  };

  const updatePhoneOptions = (updates: Partial<typeof field.phoneOptions>) => {
    onChange({
      ...field,
      phoneOptions: {
        ...field.phoneOptions,
        ...updates,
      },
    });
  };

  // ============================================================================
  // EMAIL VALIDATION
  // ============================================================================

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  React.useEffect(() => {
    if (field.type === 'email' && emailPreview) {
      const valid = validateEmail(emailPreview);
      setIsEmailValid(valid);
    } else {
      setIsEmailValid(null);
    }
  }, [emailPreview, field.type]);

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
          placeholder={field.type === 'text' ? 'Enter label' : field.type === 'email' ? 'Email address' : 'Phone number'}
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
          placeholder={
            !isDefaultLocale
              ? field.placeholder
              : field.type === 'text'
              ? 'Enter text...'
              : field.type === 'email'
              ? 'email@example.com'
              : '+1 (555) 123-4567'
          }
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

  const renderTextValidation = () => (
    <div className="space-y-4 pt-4 border-t">
      <h4 className="text-sm font-medium">Text Validation</h4>

      {/* Min Length */}
      <div>
        <Label htmlFor={`${field.id}-minLength`}>Minimum Length</Label>
        <Input
          id={`${field.id}-minLength`}
          type="number"
          min="0"
          value={field.validation?.minLength || ''}
          onChange={(e) =>
            updateValidation({
              minLength: e.target.value ? parseInt(e.target.value) : undefined,
            })
          }
          placeholder="No minimum"
          disabled={!isDefaultLocale}
        />
      </div>

      {/* Max Length */}
      <div>
        <Label htmlFor={`${field.id}-maxLength`}>Maximum Length</Label>
        <Input
          id={`${field.id}-maxLength`}
          type="number"
          min="1"
          value={field.validation?.maxLength || ''}
          onChange={(e) =>
            updateValidation({
              maxLength: e.target.value ? parseInt(e.target.value) : undefined,
            })
          }
          placeholder="No maximum"
          disabled={!isDefaultLocale}
        />
        {field.validation?.maxLength && (
          <CharacterCount
            current={getLocalizedValue('placeholder').length}
            max={field.validation.maxLength}
            className="mt-1"
          />
        )}
      </div>

      {/* Pattern (Regex) */}
      <div>
        <Label htmlFor={`${field.id}-pattern`}>Pattern (Regex)</Label>
        <Input
          id={`${field.id}-pattern`}
          value={field.validation?.pattern || ''}
          onChange={(e) => updateValidation({ pattern: e.target.value || undefined })}
          placeholder="^[A-Z][a-z]+"
          disabled={!isDefaultLocale}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Regular expression for custom validation
        </p>
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
          placeholder="This field is required"
          disabled={!isDefaultLocale}
        />
      </div>
    </div>
  );

  const renderEmailValidation = () => (
    <div className="space-y-4 pt-4 border-t">
      <h4 className="text-sm font-medium">Email Options</h4>

      {/* Show Validation Icon */}
      <div className="flex items-center justify-between">
        <Label
          htmlFor={`${field.id}-showValidationIcon`}
          className={!isDefaultLocale ? 'text-muted-foreground' : ''}
        >
          Show validation icon
        </Label>
        <Switch
          id={`${field.id}-showValidationIcon`}
          checked={field.emailOptions?.showValidationIcon || false}
          onCheckedChange={(checked) => updateEmailOptions({ showValidationIcon: checked })}
          disabled={!isDefaultLocale}
        />
      </div>

      {/* Allow Multiple Emails */}
      <div className="flex items-center justify-between">
        <Label
          htmlFor={`${field.id}-allowMultiple`}
          className={!isDefaultLocale ? 'text-muted-foreground' : ''}
        >
          Allow multiple emails
        </Label>
        <Switch
          id={`${field.id}-allowMultiple`}
          checked={field.emailOptions?.allowMultiple || false}
          onCheckedChange={(checked) => updateEmailOptions({ allowMultiple: checked })}
          disabled={!isDefaultLocale}
        />
      </div>

      {/* Validate on Blur */}
      <div className="flex items-center justify-between">
        <Label
          htmlFor={`${field.id}-validateOnBlur`}
          className={!isDefaultLocale ? 'text-muted-foreground' : ''}
        >
          Validate on blur
        </Label>
        <Switch
          id={`${field.id}-validateOnBlur`}
          checked={field.emailOptions?.validateOnBlur ?? true}
          onCheckedChange={(checked) => updateEmailOptions({ validateOnBlur: checked })}
          disabled={!isDefaultLocale}
        />
      </div>

      {/* Email Preview for Validation */}
      {field.emailOptions?.showValidationIcon && (
        <div>
          <Label htmlFor={`${field.id}-emailPreview`}>Preview Validation</Label>
          <div className="relative">
            <Input
              id={`${field.id}-emailPreview`}
              type="email"
              value={emailPreview}
              onChange={(e) => setEmailPreview(e.target.value)}
              placeholder="test@example.com"
              className="pr-10"
            />
            {emailPreview && isEmailValid !== null && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isEmailValid ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Type an email to see validation icon in action
          </p>
        </div>
      )}
    </div>
  );

  const renderPhoneValidation = () => {
    const currentFormat = field.phoneOptions?.format || 'national';
    const currentCountry = (field.phoneOptions?.defaultCountry || 'US') as PhoneCountryCode;

    return (
      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-medium">Phone Options</h4>

        {/* Format Selector */}
        <div>
          <Label
            htmlFor={`${field.id}-phoneFormat`}
            className={!isDefaultLocale ? 'text-muted-foreground' : ''}
          >
            Phone Format
          </Label>
          <Select
            value={currentFormat}
            onValueChange={(value: 'national' | 'international' | 'custom') => {
              updatePhoneOptions({ format: value });
              if (value === 'national' && PHONE_PRESET_MASKS[currentCountry]) {
                updatePhoneOptions({
                  format: value,
                  mask: PHONE_PRESET_MASKS[currentCountry].mask,
                });
              }
            }}
            disabled={!isDefaultLocale}
          >
            <SelectTrigger id={`${field.id}-phoneFormat`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="national">National</SelectItem>
              <SelectItem value="international">International</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Country Selector (for national format) */}
        {currentFormat === 'national' && (
          <div>
            <Label
              htmlFor={`${field.id}-defaultCountry`}
              className={!isDefaultLocale ? 'text-muted-foreground' : ''}
            >
              Default Country
            </Label>
            <Select
              value={currentCountry}
              onValueChange={(value: PhoneCountryCode) => {
                updatePhoneOptions({
                  defaultCountry: value,
                  mask: PHONE_PRESET_MASKS[value]?.mask,
                });
              }}
              disabled={!isDefaultLocale}
            >
              <SelectTrigger id={`${field.id}-defaultCountry`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States - (555) 123-4567</SelectItem>
                <SelectItem value="ES">Spain - 612 345 678</SelectItem>
                <SelectItem value="MX">Mexico - 55 1234 5678</SelectItem>
                <SelectItem value="UK">United Kingdom - 07700 900123</SelectItem>
                <SelectItem value="FR">France - 06 12 34 56 78</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Custom Mask Input */}
        {currentFormat === 'custom' && (
          <div>
            <Label
              htmlFor={`${field.id}-phoneMask`}
              className={!isDefaultLocale ? 'text-muted-foreground' : ''}
            >
              Phone Mask
            </Label>
            <Input
              id={`${field.id}-phoneMask`}
              value={field.phoneOptions?.mask || ''}
              onChange={(e) => updatePhoneOptions({ mask: e.target.value })}
              placeholder="(###) ###-####"
              disabled={!isDefaultLocale}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use # for digits. Example: (###) ###-####
            </p>
          </div>
        )}

        {/* Current Mask Display */}
        {field.phoneOptions?.mask && (
          <div className="bg-muted p-3 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Current mask pattern:</p>
            <code className="text-sm font-mono">{field.phoneOptions.mask}</code>
            {PHONE_PRESET_MASKS[currentCountry] && (
              <p className="text-xs text-muted-foreground mt-2">
                Example: {PHONE_PRESET_MASKS[currentCountry].example}
              </p>
            )}
          </div>
        )}
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
          <h3 className="text-sm font-medium capitalize">{field.type} Field</h3>
          <p className="text-xs text-muted-foreground">
            ID: {field.id}
          </p>
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

      {/* Type-Specific Validation */}
      {field.type === 'text' && renderTextValidation()}
      {field.type === 'email' && renderEmailValidation()}
      {field.type === 'phone' && renderPhoneValidation()}

      {/* Locale Indicator for non-default locales */}
      {!isDefaultLocale && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Currently editing {editingLocale.toUpperCase()} translations.
            Technical settings are disabled - switch to {defaultLocale.toUpperCase()} to modify.
          </p>
        </div>
      )}
    </div>
  );
}
