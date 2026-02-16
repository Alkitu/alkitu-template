'use client';

import * as React from 'react';
import type { SelectFieldEditorProps } from './SelectFieldEditor.types';
import { Label } from '@/components/primitives/ui/label';
import { Input } from '@/components/primitives/ui/input';
import { Switch } from '@/components/primitives/ui/switch';
import { Textarea } from '@/components/primitives/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/ui/select';
import { OptionsEditor } from './OptionsEditor';

/**
 * SelectFieldEditor Molecule
 *
 * Editor for select dropdown field types with:
 * - Label and description editing (i18n support)
 * - Required toggle
 * - Placeholder text (i18n)
 * - Select options management (add, edit, delete, duplicate)
 * - Default value selection
 * - Allow clear option toggle
 * - Duplicate value validation
 *
 * @example
 * ```tsx
 * <SelectFieldEditor
 *   field={selectField}
 *   onChange={handleChange}
 *   onDelete={handleDelete}
 *   editingLocale="en"
 *   defaultLocale="en"
 * />
 * ```
 */
export function SelectFieldEditor({
  field,
  onChange,
  onDelete,
  onDuplicate,
  supportedLocales = ['en', 'es'],
  defaultLocale = 'en',
  editingLocale = 'en',
}: SelectFieldEditorProps) {
  const isDefaultLocale = editingLocale === defaultLocale;

  // Get label from i18n or default
  const currentLabel = isDefaultLocale
    ? field.label
    : field.i18n?.[editingLocale]?.label || '';

  // Get placeholder from i18n or default (check both field.placeholder and selectOptions.placeholder)
  const currentPlaceholder = isDefaultLocale
    ? field.selectOptions?.placeholder || field.placeholder || ''
    : field.i18n?.[editingLocale]?.placeholder || '';

  // Get description from i18n or default
  const currentDescription = isDefaultLocale
    ? field.description || ''
    : field.i18n?.[editingLocale]?.description || '';

  // Get option translations
  const optionTranslations = field.i18n?.[editingLocale]?.options || {};

  // Update field helpers
  const updateField = (updates: Partial<typeof field>) => {
    onChange({ ...field, ...updates });
  };

  const updateI18n = (key: 'label' | 'placeholder' | 'description', value: string) => {
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
  };

  const updateSelectOptions = (updates: Partial<NonNullable<typeof field.selectOptions>>) => {
    onChange({
      ...field,
      selectOptions: {
        items: field.selectOptions?.items || [],
        ...field.selectOptions,
        ...updates,
      },
    });
  };

  const handleOptionTranslationChange = (optionId: string, label: string) => {
    onChange({
      ...field,
      i18n: {
        ...field.i18n,
        [editingLocale]: {
          ...field.i18n?.[editingLocale],
          options: {
            ...field.i18n?.[editingLocale]?.options,
            [optionId]: label,
          },
        },
      },
    });
  };

  // Ensure selectOptions exists
  const selectOptions = field.selectOptions || { items: [] };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      {/* Field Label */}
      <div>
        <Label className={!isDefaultLocale ? 'text-muted-foreground' : ''}>
          Field Label {!isDefaultLocale && `(${editingLocale})`}
        </Label>
        <Input
          value={currentLabel}
          onChange={(e) => {
            if (isDefaultLocale) {
              updateField({ label: e.target.value });
            } else {
              updateI18n('label', e.target.value);
            }
          }}
          placeholder="Enter field label"
          className={!isDefaultLocale && !currentLabel ? 'italic' : ''}
        />
      </div>

      {/* Required Toggle */}
      {isDefaultLocale && (
        <div className="flex items-center justify-between">
          <Label>Required</Label>
          <Switch
            checked={field.validation?.required || false}
            onCheckedChange={(checked) =>
              updateField({
                validation: { ...field.validation, required: checked },
              })
            }
          />
        </div>
      )}

      {/* Placeholder Text */}
      <div>
        <Label className={!isDefaultLocale ? 'text-muted-foreground' : ''}>
          Placeholder {!isDefaultLocale && `(${editingLocale})`}
        </Label>
        <Input
          value={currentPlaceholder}
          onChange={(e) => {
            if (isDefaultLocale) {
              updateSelectOptions({ placeholder: e.target.value });
            } else {
              updateI18n('placeholder', e.target.value);
            }
          }}
          placeholder={isDefaultLocale ? 'Select an option...' : field.selectOptions?.placeholder || ''}
          className={!isDefaultLocale && !currentPlaceholder ? 'italic' : ''}
        />
      </div>

      {/* Default Value Selector */}
      {isDefaultLocale && (
        <div>
          <Label>Default Value</Label>
          <Select
            value={selectOptions.defaultValue || '__none__'}
            onValueChange={(value) =>
              updateSelectOptions({
                defaultValue: value === '__none__' ? undefined : value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="No default value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">No default value</SelectItem>
              {selectOptions.items
                ?.filter((option) => option.value && option.value.trim() !== '')
                .map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.label || option.value}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Allow Clear Toggle */}
      {isDefaultLocale && (
        <div className="flex items-center justify-between">
          <Label>Allow Clear</Label>
          <Switch
            checked={selectOptions.allowClear || false}
            onCheckedChange={(checked) => updateSelectOptions({ allowClear: checked })}
          />
        </div>
      )}

      {/* Options Editor */}
      <OptionsEditor
        options={selectOptions.items || []}
        onChange={(items) => updateSelectOptions({ items })}
        editingLocale={editingLocale}
        defaultLocale={defaultLocale}
        translations={optionTranslations}
        onTranslationChange={handleOptionTranslationChange}
      />

      {/* Show Description Toggle */}
      {isDefaultLocale && (
        <div className="flex items-center justify-between">
          <Label>Show Description</Label>
          <Switch
            checked={field.showDescription || false}
            onCheckedChange={(checked) => updateField({ showDescription: checked })}
          />
        </div>
      )}

      {/* Description */}
      {field.showDescription && (
        <div>
          <Label className={!isDefaultLocale ? 'text-muted-foreground' : ''}>
            Description {!isDefaultLocale && `(${editingLocale})`}
          </Label>
          <Textarea
            value={currentDescription}
            onChange={(e) => {
              if (isDefaultLocale) {
                updateField({ description: e.target.value });
              } else {
                updateI18n('description', e.target.value);
              }
            }}
            placeholder="Enter field description"
            className={!isDefaultLocale && !currentDescription ? 'italic' : ''}
            rows={3}
          />
        </div>
      )}
    </div>
  );
}
