'use client';

import * as React from 'react';
import type { MultiSelectFieldEditorProps } from './MultiSelectFieldEditor.types';
import { Label } from '@/components/primitives/ui/label';
import { Input } from '@/components/primitives/ui/input';
import { Switch } from '@/components/primitives/ui/switch';
import { Textarea } from '@/components/primitives/ui/textarea';
import { Checkbox } from '@/components/primitives/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/ui/select';
import { OptionsEditor } from '../SelectFieldEditor/OptionsEditor';

/**
 * MultiSelectFieldEditor Molecule
 *
 * Editor for multi-select field types with:
 * - Label and description editing (i18n support)
 * - Required toggle
 * - Placeholder text (i18n)
 * - Layout selection (vertical/horizontal)
 * - Max selections limit
 * - Default values (checkboxes)
 * - Options management via shared OptionsEditor
 */
export function MultiSelectFieldEditor({
  field,
  onChange,
  editingLocale = 'en',
  defaultLocale = 'en',
}: MultiSelectFieldEditorProps) {
  const isDefaultLocale = editingLocale === defaultLocale;

  // Get label from i18n or default
  const currentLabel = isDefaultLocale
    ? field.label
    : field.i18n?.[editingLocale]?.label || '';

  // Get placeholder from i18n or default
  const currentPlaceholder = isDefaultLocale
    ? field.multiSelectOptions?.placeholder || field.placeholder || ''
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

  const updateMultiSelectOptions = (updates: Partial<NonNullable<typeof field.multiSelectOptions>>) => {
    onChange({
      ...field,
      multiSelectOptions: {
        items: field.multiSelectOptions?.items || [],
        ...field.multiSelectOptions,
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

  const multiSelectOptions = field.multiSelectOptions || { items: [] };

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
              updateMultiSelectOptions({ placeholder: e.target.value });
            } else {
              updateI18n('placeholder', e.target.value);
            }
          }}
          placeholder={isDefaultLocale ? 'Select options...' : field.multiSelectOptions?.placeholder || ''}
          className={!isDefaultLocale && !currentPlaceholder ? 'italic' : ''}
        />
      </div>

      {/* Layout Selector */}
      {isDefaultLocale && (
        <div>
          <Label>Layout</Label>
          <Select
            value={multiSelectOptions.layout || 'vertical'}
            onValueChange={(value: 'vertical' | 'horizontal') =>
              updateMultiSelectOptions({ layout: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vertical">Vertical</SelectItem>
              <SelectItem value="horizontal">Horizontal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Max Selections */}
      {isDefaultLocale && (
        <div>
          <Label>Max Selections</Label>
          <Input
            type="number"
            min={1}
            value={multiSelectOptions.maxSelections || ''}
            onChange={(e) =>
              updateMultiSelectOptions({
                maxSelections: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            placeholder="No limit"
          />
        </div>
      )}

      {/* Default Values */}
      {isDefaultLocale && multiSelectOptions.items && multiSelectOptions.items.length > 0 && (
        <div>
          <Label>Default Values</Label>
          <div className="space-y-2 mt-2">
            {multiSelectOptions.items.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <Checkbox
                  checked={multiSelectOptions.defaultValue?.includes(option.value) || false}
                  onCheckedChange={(checked) => {
                    const current = multiSelectOptions.defaultValue || [];
                    const newValue = checked
                      ? [...current, option.value]
                      : current.filter((v) => v !== option.value);
                    updateMultiSelectOptions({ defaultValue: newValue });
                  }}
                />
                <Label className="font-normal">{option.label}</Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Options Editor */}
      <OptionsEditor
        options={multiSelectOptions.items || []}
        onChange={(items) => updateMultiSelectOptions({ items })}
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
