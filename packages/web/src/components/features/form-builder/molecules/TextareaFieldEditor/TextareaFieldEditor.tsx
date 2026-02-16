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
import { Button } from '@/components/primitives/ui/button';
import { Trash2, Copy } from 'lucide-react';
import { CharacterCount } from '../../atoms/CharacterCount';
import type { TextareaFieldEditorProps } from './TextareaFieldEditor.types';
import type { FormField } from '@alkitu/shared';

/**
 * TextareaFieldEditor Molecule Component
 *
 * Provides a comprehensive editor for textarea form fields with:
 * - Label, placeholder, and description (i18n support)
 * - Required validation toggle
 * - Textarea options: rows, resize mode, character count, auto-grow
 * - Validation: minLength, maxLength, pattern
 * - Live preview of character counter
 *
 * @component
 * @example
 * ```tsx
 * <TextareaFieldEditor
 *   field={textareaField}
 *   onChange={handleChange}
 *   onDelete={handleDelete}
 *   editingLocale="en"
 *   defaultLocale="en"
 * />
 * ```
 */
export function TextareaFieldEditor({
  field,
  onChange,
  onDelete,
  onDuplicate,
  supportedLocales = ['en', 'es'],
  defaultLocale = 'en',
  editingLocale = 'en',
}: TextareaFieldEditorProps) {
  const isDefaultLocale = editingLocale === defaultLocale;
  const [previewValue, setPreviewValue] = React.useState('');

  // Helper to update textarea-specific options
  const updateTextareaOptions = (updates: Partial<FormField['textareaOptions']>) => {
    onChange({
      ...field,
      textareaOptions: {
        ...field.textareaOptions,
        ...updates,
      },
    });
  };

  // Helper to update validation
  const updateValidation = (updates: Partial<FormField['validation']>) => {
    onChange({
      ...field,
      validation: {
        ...field.validation,
        ...updates,
      },
    });
  };

  // Get localized placeholder
  const getLocalizedPlaceholder = () => {
    if (isDefaultLocale) return field.placeholder;
    return field.i18n?.[editingLocale]?.placeholder;
  };

  // Update localized placeholder
  const updateLocalizedPlaceholder = (value: string) => {
    if (isDefaultLocale) {
      onChange({ ...field, placeholder: value });
    } else {
      onChange({
        ...field,
        i18n: {
          ...field.i18n,
          [editingLocale]: {
            ...field.i18n?.[editingLocale],
            placeholder: value,
          },
        },
      });
    }
  };

  // Get localized label
  const getLocalizedLabel = () => {
    if (isDefaultLocale) return field.label;
    return field.i18n?.[editingLocale]?.label;
  };

  // Update localized label
  const updateLocalizedLabel = (value: string) => {
    if (isDefaultLocale) {
      onChange({ ...field, label: value });
    } else {
      onChange({
        ...field,
        i18n: {
          ...field.i18n,
          [editingLocale]: {
            ...field.i18n?.[editingLocale],
            label: value,
          },
        },
      });
    }
  };

  // Get localized description
  const getLocalizedDescription = () => {
    if (isDefaultLocale) return field.description;
    return field.i18n?.[editingLocale]?.description;
  };

  // Update localized description
  const updateLocalizedDescription = (value: string) => {
    if (isDefaultLocale) {
      onChange({ ...field, description: value });
    } else {
      onChange({
        ...field,
        i18n: {
          ...field.i18n,
          [editingLocale]: {
            ...field.i18n?.[editingLocale],
            description: value,
          },
        },
      });
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-4" data-testid="textarea-field-editor">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Textarea Field</h3>
        <div className="flex items-center gap-2">
          {onDuplicate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDuplicate}
              aria-label="Duplicate field"
              data-testid="duplicate-button"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label="Delete field"
            data-testid="delete-button"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Label Editor */}
      <div>
        <Label htmlFor={`${field.id}-label`}>Label</Label>
        <Input
          id={`${field.id}-label`}
          value={getLocalizedLabel() || ''}
          onChange={(e) => updateLocalizedLabel(e.target.value)}
          placeholder="Enter field label"
          data-testid="label-input"
        />
      </div>

      {/* Required Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor={`${field.id}-required`}>Required</Label>
        <Switch
          id={`${field.id}-required`}
          checked={field.validation?.required || false}
          onCheckedChange={(checked) => updateValidation({ required: checked })}
          disabled={!isDefaultLocale}
          data-testid="required-toggle"
        />
      </div>

      {/* Placeholder Editor */}
      <div>
        <Label htmlFor={`${field.id}-placeholder`}>Placeholder</Label>
        <Input
          id={`${field.id}-placeholder`}
          value={getLocalizedPlaceholder() || ''}
          onChange={(e) => updateLocalizedPlaceholder(e.target.value)}
          placeholder={!isDefaultLocale ? field.placeholder : 'Enter placeholder text'}
          data-testid="placeholder-input"
        />
      </div>

      {/* Description Section */}
      <div className="flex items-center justify-between">
        <Label htmlFor={`${field.id}-show-description`}>Show Description</Label>
        <Switch
          id={`${field.id}-show-description`}
          checked={field.showDescription || false}
          onCheckedChange={(checked) => onChange({ ...field, showDescription: checked })}
          disabled={!isDefaultLocale}
          data-testid="show-description-toggle"
        />
      </div>

      {field.showDescription && (
        <div>
          <Label htmlFor={`${field.id}-description`}>Description</Label>
          <Textarea
            id={`${field.id}-description`}
            value={getLocalizedDescription() || ''}
            onChange={(e) => updateLocalizedDescription(e.target.value)}
            placeholder="Enter field description"
            rows={2}
            data-testid="description-input"
          />
        </div>
      )}

      {/* Textarea Options */}
      <div className="border-t pt-4 space-y-4">
        <h4 className="font-medium text-sm">Textarea Options</h4>

        {/* Rows */}
        <div>
          <Label htmlFor={`${field.id}-rows`}>Rows (Initial Height)</Label>
          <Input
            id={`${field.id}-rows`}
            type="number"
            min={1}
            max={20}
            value={field.textareaOptions?.rows || 4}
            onChange={(e) => updateTextareaOptions({ rows: parseInt(e.target.value) || 4 })}
            disabled={!isDefaultLocale}
            data-testid="rows-input"
          />
        </div>

        {/* Min Rows */}
        <div>
          <Label htmlFor={`${field.id}-min-rows`}>Min Rows</Label>
          <Input
            id={`${field.id}-min-rows`}
            type="number"
            min={1}
            max={20}
            value={field.textareaOptions?.minRows || ''}
            onChange={(e) =>
              updateTextareaOptions({ minRows: e.target.value ? parseInt(e.target.value) : undefined })
            }
            placeholder="Optional"
            disabled={!isDefaultLocale}
            data-testid="min-rows-input"
          />
        </div>

        {/* Max Rows */}
        <div>
          <Label htmlFor={`${field.id}-max-rows`}>Max Rows</Label>
          <Input
            id={`${field.id}-max-rows`}
            type="number"
            min={1}
            max={50}
            value={field.textareaOptions?.maxRows || ''}
            onChange={(e) =>
              updateTextareaOptions({ maxRows: e.target.value ? parseInt(e.target.value) : undefined })
            }
            placeholder="Optional"
            disabled={!isDefaultLocale}
            data-testid="max-rows-input"
          />
        </div>

        {/* Resize Mode */}
        <div>
          <Label htmlFor={`${field.id}-resize`}>Resize Mode</Label>
          <Select
            value={field.textareaOptions?.resize || 'vertical'}
            onValueChange={(value: 'none' | 'vertical' | 'horizontal' | 'both') =>
              updateTextareaOptions({ resize: value })
            }
            disabled={!isDefaultLocale}
          >
            <SelectTrigger id={`${field.id}-resize`} data-testid="resize-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="vertical">Vertical</SelectItem>
              <SelectItem value="horizontal">Horizontal</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Show Character Count */}
        <div className="flex items-center justify-between">
          <Label htmlFor={`${field.id}-show-char-count`}>Show Character Count</Label>
          <Switch
            id={`${field.id}-show-char-count`}
            checked={field.textareaOptions?.showCharacterCount || false}
            onCheckedChange={(checked) => updateTextareaOptions({ showCharacterCount: checked })}
            disabled={!isDefaultLocale}
            data-testid="show-character-count-toggle"
          />
        </div>

        {/* Auto-grow */}
        <div className="flex items-center justify-between">
          <Label htmlFor={`${field.id}-auto-grow`}>Auto-grow</Label>
          <Switch
            id={`${field.id}-auto-grow`}
            checked={field.textareaOptions?.autoGrow || false}
            onCheckedChange={(checked) => updateTextareaOptions({ autoGrow: checked })}
            disabled={!isDefaultLocale}
            data-testid="auto-grow-toggle"
          />
        </div>
      </div>

      {/* Validation Section */}
      <div className="border-t pt-4 space-y-4">
        <h4 className="font-medium text-sm">Validation</h4>

        {/* Min Length */}
        <div>
          <Label htmlFor={`${field.id}-min-length`}>Min Length</Label>
          <Input
            id={`${field.id}-min-length`}
            type="number"
            min={0}
            value={field.validation?.minLength || ''}
            onChange={(e) =>
              updateValidation({ minLength: e.target.value ? parseInt(e.target.value) : undefined })
            }
            placeholder="Optional"
            disabled={!isDefaultLocale}
            data-testid="min-length-input"
          />
        </div>

        {/* Max Length */}
        <div>
          <Label htmlFor={`${field.id}-max-length`}>Max Length</Label>
          <Input
            id={`${field.id}-max-length`}
            type="number"
            min={1}
            value={field.validation?.maxLength || ''}
            onChange={(e) =>
              updateValidation({ maxLength: e.target.value ? parseInt(e.target.value) : undefined })
            }
            placeholder={field.textareaOptions?.showCharacterCount ? 'Required for character count' : 'Optional'}
            disabled={!isDefaultLocale}
            data-testid="max-length-input"
          />
        </div>

        {/* Pattern */}
        <div>
          <Label htmlFor={`${field.id}-pattern`}>Pattern (Regex)</Label>
          <Input
            id={`${field.id}-pattern`}
            value={field.validation?.pattern || ''}
            onChange={(e) => updateValidation({ pattern: e.target.value || undefined })}
            placeholder="e.g., ^[A-Za-z]+$"
            disabled={!isDefaultLocale}
            data-testid="pattern-input"
          />
        </div>

        {/* Custom Error Message */}
        <div>
          <Label htmlFor={`${field.id}-error-message`}>Custom Error Message</Label>
          <Input
            id={`${field.id}-error-message`}
            value={field.validation?.errorMessage || ''}
            onChange={(e) => updateValidation({ errorMessage: e.target.value || undefined })}
            placeholder="Optional custom validation message"
            disabled={!isDefaultLocale}
            data-testid="error-message-input"
          />
        </div>
      </div>

      {/* Preview Section */}
      <div className="border-t pt-4 space-y-2">
        <h4 className="font-medium text-sm">Preview</h4>
        <div className="space-y-1">
          <Label>{getLocalizedLabel() || 'Label'}</Label>
          <Textarea
            value={previewValue}
            onChange={(e) => setPreviewValue(e.target.value)}
            placeholder={getLocalizedPlaceholder() || 'Placeholder'}
            rows={field.textareaOptions?.rows || 4}
            className="resize-none"
            style={{
              resize: field.textareaOptions?.resize || 'vertical',
            }}
            data-testid="preview-textarea"
          />
          {field.textareaOptions?.showCharacterCount && field.validation?.maxLength && (
            <CharacterCount
              current={previewValue.length}
              max={field.validation.maxLength}
            />
          )}
          {getLocalizedDescription() && field.showDescription && (
            <p className="text-sm text-muted-foreground" data-testid="preview-description">
              {getLocalizedDescription()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
