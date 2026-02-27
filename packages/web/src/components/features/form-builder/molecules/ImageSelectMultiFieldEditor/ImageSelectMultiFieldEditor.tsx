'use client';

import * as React from 'react';
import type { ImageSelectMultiFieldEditorProps } from './ImageSelectMultiFieldEditor.types';
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
 * ImageSelectMultiFieldEditor Molecule
 *
 * Editor for multi-image select field types with:
 * - Label and description editing (i18n support)
 * - Required toggle
 * - Placeholder text (i18n)
 * - Layout selection (grid/list)
 * - Column count for grid layout
 * - Max selections limit
 * - Options with image upload support
 */
export function ImageSelectMultiFieldEditor({
  field,
  onChange,
  editingLocale = 'en',
  defaultLocale = 'en',
  driveFolderId,
}: ImageSelectMultiFieldEditorProps) {
  const isDefaultLocale = editingLocale === defaultLocale;

  const currentLabel = isDefaultLocale
    ? field.label
    : field.i18n?.[editingLocale]?.label || '';

  const currentPlaceholder = isDefaultLocale
    ? field.imageSelectMultiOptions?.placeholder || field.placeholder || ''
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

  const updateImageSelectMultiOptions = (updates: Partial<NonNullable<typeof field.imageSelectMultiOptions>>) => {
    onChange({
      ...field,
      imageSelectMultiOptions: {
        items: field.imageSelectMultiOptions?.items || [],
        ...field.imageSelectMultiOptions,
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

  const imageSelectMultiOptions = field.imageSelectMultiOptions || { items: [] };

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
              updateImageSelectMultiOptions({ placeholder: e.target.value });
            } else {
              updateI18n('placeholder', e.target.value);
            }
          }}
          placeholder={isDefaultLocale ? 'Select images...' : field.imageSelectMultiOptions?.placeholder || ''}
          className={!isDefaultLocale && !currentPlaceholder ? 'italic' : ''}
        />
      </div>

      {/* Layout Selector */}
      {isDefaultLocale && (
        <div>
          <Label>Layout</Label>
          <Select
            value={imageSelectMultiOptions.layout || 'grid'}
            onValueChange={(value: 'grid' | 'list') =>
              updateImageSelectMultiOptions({ layout: value })
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
      {isDefaultLocale && imageSelectMultiOptions.layout !== 'list' && (
        <div>
          <Label>Columns</Label>
          <Select
            value={String(imageSelectMultiOptions.columns || 3)}
            onValueChange={(value) =>
              updateImageSelectMultiOptions({ columns: Number(value) as 2 | 3 | 4 })
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

      {/* Max Selections */}
      {isDefaultLocale && (
        <div>
          <Label>Max Selections</Label>
          <Input
            type="number"
            min={1}
            value={imageSelectMultiOptions.maxSelections || ''}
            onChange={(e) =>
              updateImageSelectMultiOptions({
                maxSelections: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            placeholder="No limit"
          />
        </div>
      )}

      {/* Options Editor with Image Upload */}
      <OptionsEditor
        options={imageSelectMultiOptions.items || []}
        onChange={(items) => updateImageSelectMultiOptions({ items })}
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
