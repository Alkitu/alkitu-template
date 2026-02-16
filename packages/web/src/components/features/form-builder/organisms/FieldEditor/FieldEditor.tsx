'use client';

import * as React from 'react';
import { Label } from '@/components/primitives/ui/label';
import { Input } from '@/components/primitives/ui/input';
import { Textarea } from '@/components/primitives/ui/textarea';
import { Switch } from '@/components/primitives/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/primitives/ui/collapsible';
import { ChevronRight, Globe } from 'lucide-react';
import type { FieldEditorProps } from './FieldEditor.types';

// Import all field editor molecules
import { TextFieldEditor } from '../../molecules/TextFieldEditor';
import { TextareaFieldEditor } from '../../molecules/TextareaFieldEditor';
import { NumberFieldEditor } from '../../molecules/NumberFieldEditor';
import { SelectFieldEditor } from '../../molecules/SelectFieldEditor';
import { RadioFieldEditor } from '../../molecules/RadioFieldEditor';
import { ToggleFieldEditor } from '../../molecules/ToggleFieldEditor';
import { DateTimeFieldEditor } from '../../molecules/DateTimeFieldEditor';
import { GroupFieldEditor } from '../../molecules/GroupFieldEditor';
import { MultiSelectFieldEditor } from '../../molecules/MultiSelectFieldEditor';
import { ImageSelectFieldEditor } from '../../molecules/ImageSelectFieldEditor';
import { ImageSelectMultiFieldEditor } from '../../molecules/ImageSelectMultiFieldEditor';
import { FileUploadFieldEditor } from '../../molecules/FileUploadFieldEditor';

/**
 * FieldEditor Organism Component
 *
 * Top-level integration component that manages field editing by routing to
 * the appropriate molecule editor based on field type. Handles:
 * - Locale management and switching
 * - Common field properties (label, placeholder, description)
 * - Field type routing to specialized editors
 * - Basic field options (required, showDescription, showTitle)
 *
 * Supported field types:
 * - text, email, phone -> TextFieldEditor
 * - textarea -> TextareaFieldEditor
 * - number -> NumberFieldEditor (handles number, currency, percentage)
 * - select -> SelectFieldEditor
 * - radio -> RadioFieldEditor
 * - toggle -> ToggleFieldEditor
 * - date, time, datetime -> DateTimeFieldEditor
 * - group -> GroupFieldEditor (for multi-step forms)
 *
 * @component
 * @example
 * ```tsx
 * <FieldEditor
 *   field={formField}
 *   onChange={handleFieldChange}
 *   onDelete={handleFieldDelete}
 *   editingLocale="en"
 *   defaultLocale="en"
 * />
 * ```
 */
export function FieldEditor({
  field,
  onChange,
  onDelete,
  onDuplicate,
  supportedLocales = ['en', 'es'],
  defaultLocale = 'en',
  editingLocale: propEditingLocale,
  onLocaleChange,
  showTypeSelector = false,
  onTypeChange,
}: FieldEditorProps) {
  // ============================================================================
  // LOCALE STATE MANAGEMENT
  // ============================================================================

  // Use prop if available (controlled mode), otherwise use internal state
  const [internalEditingLocale, setInternalEditingLocale] = React.useState<
    typeof defaultLocale
  >(defaultLocale);
  const editingLocale = propEditingLocale || internalEditingLocale;

  const handleLocaleChange = (locale: typeof defaultLocale) => {
    if (onLocaleChange) {
      onLocaleChange(locale);
    } else {
      setInternalEditingLocale(locale);
    }
  };

  // Ensure editing locale is valid (must be in supportedLocales)
  React.useEffect(() => {
    if (!supportedLocales.includes(editingLocale)) {
      handleLocaleChange(defaultLocale);
    }
  }, [supportedLocales, defaultLocale, editingLocale]);

  const isDefaultLocale = editingLocale === defaultLocale;

  // ============================================================================
  // LOCALIZATION HELPERS
  // ============================================================================

  /**
   * Get localized value for label, placeholder, or description
   */
  const getLocalizedValue = (key: 'label' | 'placeholder' | 'description'): string => {
    if (isDefaultLocale) {
      return field[key] || '';
    }
    // For non-default locales, return i18n value or fallback to default
    return field.i18n?.[editingLocale]?.[key] || field[key] || '';
  };

  /**
   * Update localized value based on current locale
   */
  const updateLocalizedValue = (
    key: 'label' | 'placeholder' | 'description',
    value: string
  ) => {
    if (isDefaultLocale) {
      // Update default locale values directly on field
      onChange({ ...field, [key]: value });
    } else {
      // Update i18n translations for non-default locale
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
  // FIELD UPDATE HELPERS
  // ============================================================================

  /**
   * Update field with partial updates (deep merge validation)
   */
  const updateField = (updates: Partial<typeof field>) => {
    onChange({
      ...field,
      ...updates,
      validation: {
        ...field.validation,
        ...updates.validation,
      },
    });
  };

  // ============================================================================
  // RENDER: LOCALE SELECTOR
  // ============================================================================

  const renderLocaleSelector = () => {
    if (supportedLocales.length <= 1) return null;

    return (
      <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md border border-dashed">
        <div className="flex items-center gap-2 text-xs font-medium">
          <Globe className="h-3 w-3" />
          <span>Editing Language:</span>
        </div>
        <Select
          value={editingLocale}
          onValueChange={(value) => handleLocaleChange(value as typeof defaultLocale)}
        >
          <SelectTrigger className="w-[130px] h-7 text-xs bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from(new Set(supportedLocales)).map((locale) => (
              <SelectItem key={locale} value={locale} className="text-xs">
                {locale === 'en' ? 'English' : 'Spanish'}{' '}
                {locale === defaultLocale ? '(Default)' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  // ============================================================================
  // RENDER: COMMON FIELD SETTINGS (Label, Placeholder, Description)
  // ============================================================================

  const renderCommonSettings = () => {
    // Skip common settings for field types that have their own complete editors
    if (
      [
        'text',
        'email',
        'phone',
        'textarea',
        'number',
        'select',
        'radio',
        'toggle',
        'date',
        'time',
        'datetime',
        'multiselect',
        'imageSelect',
        'imageSelectMulti',
        'fileUpload',
      ].includes(field.type)
    ) {
      return null;
    }

    return (
      <div className="space-y-4">
        {/* Label */}
        <div>
          <Label htmlFor={`${field.id}-label`}>
            Field Label {!isDefaultLocale && `(${editingLocale.toUpperCase()})`}
          </Label>
          <Input
            id={`${field.id}-label`}
            value={getLocalizedValue('label')}
            onChange={(e) => updateLocalizedValue('label', e.target.value)}
            placeholder={field.label || 'Enter label'}
          />
        </div>

        {/* Placeholder (skip for some field types) */}
        {!['range', 'select', 'radio', 'multiselect', 'toggle', 'date', 'time', 'datetime', 'group', 'imageSelect', 'imageSelectMulti', 'map'].includes(
          field.type
        ) && (
          <div>
            <Label htmlFor={`${field.id}-placeholder`}>
              Placeholder {!isDefaultLocale && `(${editingLocale.toUpperCase()})`}
            </Label>
            <Input
              id={`${field.id}-placeholder`}
              value={getLocalizedValue('placeholder')}
              onChange={(e) => updateLocalizedValue('placeholder', e.target.value)}
              placeholder={!isDefaultLocale ? field.placeholder : 'Enter placeholder'}
            />
          </div>
        )}

        {/* Description for group fields */}
        {field.type === 'group' && (
          <div>
            <Label htmlFor={`${field.id}-description`}>
              Group Description {!isDefaultLocale && `(${editingLocale.toUpperCase()})`}
            </Label>
            <Textarea
              id={`${field.id}-description`}
              value={getLocalizedValue('description')}
              onChange={(e) => updateLocalizedValue('description', e.target.value)}
              placeholder={!isDefaultLocale ? field.description : 'Enter description'}
              className="min-h-[80px]"
            />
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  // RENDER: FIELD OPTIONS (Required, Show Description, Show Title)
  // ============================================================================

  const renderFieldOptions = () => {
    // Skip for field types that have their own complete option editors
    if (
      [
        'text',
        'email',
        'phone',
        'textarea',
        'number',
        'select',
        'radio',
        'toggle',
        'date',
        'time',
        'datetime',
        'multiselect',
        'imageSelect',
        'imageSelectMulti',
        'fileUpload',
      ].includes(field.type)
    ) {
      return null;
    }

    return (
      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-2 w-full">
          <ChevronRight className="h-4 w-4" />
          <span className="text-sm font-medium">Field Options</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="space-y-4 border rounded-lg p-4">
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
                onCheckedChange={(required) =>
                  updateField({
                    validation: {
                      ...field.validation,
                      required,
                    },
                  })
                }
                disabled={!isDefaultLocale}
              />
            </div>

            {/* Show Description Toggle */}
            <div className="flex items-center justify-between">
              <Label
                htmlFor={`${field.id}-showDescription`}
                className={
                  field.type === 'group' || !isDefaultLocale ? 'text-muted-foreground' : ''
                }
              >
                Show description
              </Label>
              <Switch
                id={`${field.id}-showDescription`}
                checked={field.type === 'group' ? true : field.showDescription || false}
                onCheckedChange={(showDescription) => updateField({ showDescription })}
                disabled={!isDefaultLocale || field.type === 'group'}
              />
            </div>

            {/* Show Title Toggle */}
            <div className="flex items-center justify-between">
              <Label
                htmlFor={`${field.id}-showTitle`}
                className={!isDefaultLocale ? 'text-muted-foreground' : ''}
              >
                Show title
              </Label>
              <Switch
                id={`${field.id}-showTitle`}
                checked={field.showTitle !== false}
                onCheckedChange={(showTitle) => updateField({ showTitle })}
                disabled={!isDefaultLocale}
              />
            </div>

            {/* Description Textarea (when showDescription is enabled) */}
            {field.showDescription && field.type !== 'group' && (
              <div>
                <Label htmlFor={`${field.id}-description`}>
                  Description {!isDefaultLocale && `(${editingLocale.toUpperCase()})`}
                </Label>
                <Textarea
                  id={`${field.id}-description`}
                  value={getLocalizedValue('description')}
                  onChange={(e) => updateLocalizedValue('description', e.target.value)}
                  placeholder={!isDefaultLocale ? field.description : 'Enter description'}
                />
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  // ============================================================================
  // RENDER: FIELD TYPE-SPECIFIC EDITOR
  // ============================================================================

  const renderFieldEditor = () => {
    // Common props passed to all field editors
    const commonProps = {
      field,
      onChange,
      onDelete,
      onDuplicate,
      supportedLocales,
      defaultLocale,
      editingLocale,
    };

    switch (field.type) {
      // Text-based fields (text, email, phone)
      case 'text':
      case 'email':
      case 'phone':
        return <TextFieldEditor {...commonProps} />;

      // Textarea
      case 'textarea':
        return <TextareaFieldEditor {...commonProps} />;

      // Number (handles number, currency, percentage)
      case 'number':
        return <NumberFieldEditor {...commonProps} />;

      // Select dropdown
      case 'select':
        return <SelectFieldEditor {...commonProps} />;

      // Radio buttons
      case 'radio':
        return <RadioFieldEditor {...commonProps} />;

      // Toggle/Checkbox
      case 'toggle':
        return <ToggleFieldEditor {...commonProps} />;

      // Date/Time fields
      case 'date':
      case 'time':
      case 'datetime':
        return <DateTimeFieldEditor {...commonProps} />;

      // Group field (for multi-step forms)
      case 'group':
        return <GroupFieldEditor {...commonProps} />;

      // Multi-select
      case 'multiselect':
        return <MultiSelectFieldEditor {...commonProps} />;

      // Image select (single)
      case 'imageSelect':
        return <ImageSelectFieldEditor {...commonProps} />;

      // Image select (multi)
      case 'imageSelectMulti':
        return <ImageSelectMultiFieldEditor {...commonProps} />;

      // File upload
      case 'fileUpload':
        return <FileUploadFieldEditor {...commonProps} />;

      // Unsupported field types (range, map)
      case 'range':
      case 'map':
        return (
          <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Field type &quot;{field.type}&quot; is not yet implemented.</strong>
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
              This field type will be available in a future milestone. Common settings are
              shown above.
            </p>
          </div>
        );

      // Unknown field type
      default:
        return (
          <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Unsupported field type: {field.type}</strong>
            </p>
            <p className="text-xs text-red-700 dark:text-red-300 mt-2">
              Please select a different field type or contact support.
            </p>
          </div>
        );
    }
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-4">
      {/* Locale Selector (shown when multiple locales are supported) */}
      {renderLocaleSelector()}

      {/* Common Field Settings (for unsupported field types) */}
      {renderCommonSettings()}

      {/* Field Type-Specific Editor */}
      {renderFieldEditor()}

      {/* Field Options (for unsupported field types) */}
      {renderFieldOptions()}

      {/* Locale Indicator for non-default locales */}
      {!isDefaultLocale && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Currently editing {editingLocale.toUpperCase()} translations. Technical
            settings are disabled - switch to {defaultLocale.toUpperCase()} to modify
            validation rules and field options.
          </p>
        </div>
      )}
    </div>
  );
}
