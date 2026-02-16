'use client';

import * as React from 'react';
import type { ToggleFieldEditorProps, ToggleStyleType, ToggleValueType } from './ToggleFieldEditor.types';
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

/**
 * ToggleFieldEditor Molecule
 *
 * Editor for toggle/checkbox field types with:
 * - Style selector (toggle switch vs. checkbox)
 * - Required field toggle
 * - Default checked state
 * - Custom checked/unchecked values (boolean or string)
 * - Label and description editing with i18n support
 *
 * @example
 * ```tsx
 * <ToggleFieldEditor
 *   field={toggleField}
 *   onChange={handleChange}
 *   onDelete={handleDelete}
 *   editingLocale="en"
 *   defaultLocale="en"
 * />
 * ```
 */
export function ToggleFieldEditor({
  field,
  onChange,
  onDelete,
  onDuplicate,
  supportedLocales = ['en', 'es'],
  defaultLocale = 'en',
  editingLocale = 'en',
}: ToggleFieldEditorProps) {
  const isDefaultLocale = editingLocale === defaultLocale;

  // Get label from i18n or default
  const currentLabel = isDefaultLocale
    ? field.label
    : field.i18n?.[editingLocale]?.label || '';

  // Get description from i18n or default
  const currentDescription = isDefaultLocale
    ? field.description || ''
    : field.i18n?.[editingLocale]?.description || '';

  // Update field helpers
  const updateField = (updates: Partial<typeof field>) => {
    onChange({ ...field, ...updates });
  };

  const updateI18n = (key: 'label' | 'description', value: string) => {
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

  const updateToggleOptions = (updates: Partial<NonNullable<typeof field.toggleOptions>>) => {
    onChange({
      ...field,
      toggleOptions: {
        checkedValue: true,
        uncheckedValue: false,
        defaultChecked: false,
        style: 'toggle',
        ...field.toggleOptions,
        ...updates,
      },
    });
  };

  // Ensure toggleOptions exists with defaults
  const toggleOptions = field.toggleOptions || {
    checkedValue: true,
    uncheckedValue: false,
    defaultChecked: false,
    style: 'toggle' as ToggleStyleType,
  };

  // Determine value type
  const valueType: ToggleValueType =
    typeof toggleOptions.checkedValue === 'string' ? 'string' : 'boolean';

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

      {/* Style Selector */}
      {isDefaultLocale && (
        <div>
          <Label>Toggle Style</Label>
          <Select
            value={toggleOptions.style || 'toggle'}
            onValueChange={(value: ToggleStyleType) => updateToggleOptions({ style: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toggle">Switch Toggle</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

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

      {/* Default Checked State */}
      {isDefaultLocale && (
        <div className="flex items-center justify-between">
          <Label>Default Checked</Label>
          <Switch
            checked={toggleOptions.defaultChecked || false}
            onCheckedChange={(checked) => updateToggleOptions({ defaultChecked: checked })}
          />
        </div>
      )}

      {/* Value Type Selector */}
      {isDefaultLocale && (
        <div>
          <Label>Value Type</Label>
          <Select
            value={valueType}
            onValueChange={(type: ToggleValueType) => {
              if (type === 'boolean') {
                updateToggleOptions({
                  checkedValue: true,
                  uncheckedValue: false,
                });
              } else {
                updateToggleOptions({
                  checkedValue: 'yes',
                  uncheckedValue: 'no',
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boolean">Boolean (true/false)</SelectItem>
              <SelectItem value="string">Text (custom values)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Custom Checked Value */}
      {isDefaultLocale && valueType === 'string' && (
        <div>
          <Label>Checked Value</Label>
          <Input
            value={(toggleOptions.checkedValue as string) || 'yes'}
            onChange={(e) => updateToggleOptions({ checkedValue: e.target.value })}
            placeholder="yes"
          />
        </div>
      )}

      {/* Custom Unchecked Value */}
      {isDefaultLocale && valueType === 'string' && (
        <div>
          <Label>Unchecked Value</Label>
          <Input
            value={(toggleOptions.uncheckedValue as string) || 'no'}
            onChange={(e) => updateToggleOptions({ uncheckedValue: e.target.value })}
            placeholder="no"
          />
        </div>
      )}

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
