'use client';

import * as React from 'react';
import type { ImageSelectFieldEditorProps } from './ImageSelectFieldEditor.types';
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
import { OptionsEditor } from '../SelectFieldEditor/OptionsEditor';

/**
 * ImageSelectFieldEditor Molecule
 *
 * Editor for image select field types with:
 * - Label and description editing (i18n support)
 * - Required toggle
 * - Placeholder text (i18n)
 * - Layout selection (grid/list)
 * - Column count for grid layout
 * - Allow clear toggle
 * - Options with image upload support
 */
export function ImageSelectFieldEditor({
  field,
  onChange,
  editingLocale = 'en',
  defaultLocale = 'en',
  driveFolderId,
}: ImageSelectFieldEditorProps) {
  const isDefaultLocale = editingLocale === defaultLocale;

  const currentLabel = isDefaultLocale
    ? field.label
    : field.i18n?.[editingLocale]?.label || '';

  const currentPlaceholder = isDefaultLocale
    ? field.imageSelectOptions?.placeholder || field.placeholder || ''
    : field.i18n?.[editingLocale]?.placeholder || '';

  const currentDescription = isDefaultLocale
    ? field.description || ''
    : field.i18n?.[editingLocale]?.description || '';

  const optionTranslations = field.i18n?.[editingLocale]?.options || {};

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

  const updateImageSelectOptions = (updates: Partial<NonNullable<typeof field.imageSelectOptions>>) => {
    onChange({
      ...field,
      imageSelectOptions: {
        items: field.imageSelectOptions?.items || [],
        ...field.imageSelectOptions,
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

  const imageSelectOptions = field.imageSelectOptions || { items: [] };

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
              updateImageSelectOptions({ placeholder: e.target.value });
            } else {
              updateI18n('placeholder', e.target.value);
            }
          }}
          placeholder={isDefaultLocale ? 'Select an image...' : field.imageSelectOptions?.placeholder || ''}
          className={!isDefaultLocale && !currentPlaceholder ? 'italic' : ''}
        />
      </div>

      {/* Layout Selector */}
      {isDefaultLocale && (
        <div>
          <Label>Layout</Label>
          <Select
            value={imageSelectOptions.layout || 'grid'}
            onValueChange={(value: 'grid' | 'list') =>
              updateImageSelectOptions({ layout: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="list">List</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Columns Selector (grid only) */}
      {isDefaultLocale && imageSelectOptions.layout !== 'list' && (
        <div>
          <Label>Columns</Label>
          <Select
            value={String(imageSelectOptions.columns || 3)}
            onValueChange={(value) =>
              updateImageSelectOptions({ columns: Number(value) as 2 | 3 | 4 })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 columns</SelectItem>
              <SelectItem value="3">3 columns</SelectItem>
              <SelectItem value="4">4 columns</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Allow Clear Toggle */}
      {isDefaultLocale && (
        <div className="flex items-center justify-between">
          <Label>Allow Clear</Label>
          <Switch
            checked={imageSelectOptions.allowClear || false}
            onCheckedChange={(checked) => updateImageSelectOptions({ allowClear: checked })}
          />
        </div>
      )}

      {/* Options Editor with Image Upload */}
      <OptionsEditor
        options={imageSelectOptions.items || []}
        onChange={(items) => updateImageSelectOptions({ items })}
        editingLocale={editingLocale}
        defaultLocale={defaultLocale}
        translations={optionTranslations}
        onTranslationChange={handleOptionTranslationChange}
        enableImageUpload
        driveFolderId={driveFolderId}
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
