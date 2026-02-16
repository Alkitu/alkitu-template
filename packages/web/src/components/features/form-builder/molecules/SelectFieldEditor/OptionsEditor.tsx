'use client';

import * as React from 'react';
import { FormFieldOption, SupportedLocale } from '@/components/features/form-builder/types';
import { Label } from '@/components/primitives/ui/label';
import { Input } from '@/components/primitives/ui/input';
import { Button } from '@/components/primitives/ui/button';
import { Plus, Trash2, Copy } from 'lucide-react';
import { generateOptionId, duplicateOption } from '@/components/features/form-builder/lib/field-helpers';

interface OptionsEditorProps {
  options: FormFieldOption[];
  onChange: (options: FormFieldOption[]) => void;
  editingLocale?: SupportedLocale;
  defaultLocale?: SupportedLocale;
  translations?: Record<string, string>;
  onTranslationChange?: (optionId: string, label: string) => void;
  enableImageUpload?: boolean;
}

/**
 * OptionsEditor Sub-Component
 *
 * Manages select options with add, edit, delete, duplicate functionality.
 * Supports i18n with translation mode for option labels.
 * Validates for duplicate option values.
 *
 * @example
 * ```tsx
 * <OptionsEditor
 *   options={selectOptions}
 *   onChange={handleOptionsChange}
 *   editingLocale="en"
 *   translations={optionTranslations}
 *   onTranslationChange={handleTranslation}
 * />
 * ```
 */
export function OptionsEditor({
  options,
  onChange,
  editingLocale = 'en',
  defaultLocale = 'en',
  translations = {},
  onTranslationChange,
  enableImageUpload = false,
}: OptionsEditorProps) {
  const isDefaultLocale = editingLocale === defaultLocale;
  const [duplicateValues, setDuplicateValues] = React.useState<Set<string>>(new Set());

  // Check for duplicate values
  React.useEffect(() => {
    const valueCounts = new Map<string, number>();
    options.forEach((option) => {
      if (option.value && option.value.trim() !== '') {
        valueCounts.set(option.value, (valueCounts.get(option.value) || 0) + 1);
      }
    });

    const duplicates = new Set<string>();
    valueCounts.forEach((count, value) => {
      if (count > 1) {
        duplicates.add(value);
      }
    });

    setDuplicateValues(duplicates);
  }, [options]);

  const addOption = () => {
    if (!isDefaultLocale) return;

    const newOption: FormFieldOption = {
      id: generateOptionId(),
      label: `Option ${options.length + 1}`,
      value: `option-${options.length + 1}`,
    };
    onChange([...options, newOption]);
  };

  const removeOption = (index: number) => {
    if (!isDefaultLocale) return;
    const newOptions = options.filter((_, i) => i !== index);
    onChange(newOptions);
  };

  const duplicateOptionAt = (index: number) => {
    if (!isDefaultLocale) return;
    const optionToDuplicate = options[index];
    const duplicated = duplicateOption(optionToDuplicate);
    duplicated.label = `${duplicated.label} (copy)`;
    duplicated.value = `${duplicated.value}-copy`;
    const newOptions = [...options];
    newOptions.splice(index + 1, 0, duplicated);
    onChange(newOptions);
  };

  const updateOption = (
    index: number,
    updates: Partial<FormFieldOption>,
    isTranslation: boolean = false
  ) => {
    const option = options[index];

    if (isTranslation) {
      // Update translation
      if (onTranslationChange && updates.label !== undefined) {
        onTranslationChange(option.id, updates.label);
      }
    } else {
      // Update option
      const newOptions = [...options];
      newOptions[index] = { ...newOptions[index], ...updates };
      onChange(newOptions);
    }
  };

  // Empty state check
  const hasOptions = options.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Options</Label>
        {duplicateValues.size > 0 && (
          <span className="text-xs text-destructive">
            Duplicate values detected
          </span>
        )}
      </div>

      {/* Empty state */}
      {!hasOptions && isDefaultLocale && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            No options added yet. Add at least one option to create a select field.
          </p>
          <Button variant="outline" size="sm" onClick={addOption}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Option
          </Button>
        </div>
      )}

      {/* Options list */}
      {hasOptions && (
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
            {enableImageUpload && isDefaultLocale && <div className="w-10"></div>}
            <div className="grid grid-cols-2 gap-2 flex-1">
              <span>Label {!isDefaultLocale ? `(${editingLocale})` : ''}</span>
              <span>Value</span>
            </div>
            {isDefaultLocale && <div className="w-24"></div>}
          </div>

          {/* Options list items */}
          <div className="space-y-2">
            {options.map((option, index) => {
              const isDuplicate = duplicateValues.has(option.value);

              return (
                <div key={option.id} className="flex items-start gap-2">
                  {/* Image thumbnail */}
                  {enableImageUpload && isDefaultLocale && (
                    <div className="w-10 h-10 rounded border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                      {option.images?.[0]?.url ? (
                        <img
                          src={option.images[0].url}
                          alt={option.label}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">IMG</span>
                      )}
                    </div>
                  )}
                  {/* Inputs */}
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Label"
                      value={isDefaultLocale ? option.label : (translations[option.id] || '')}
                      onChange={(e) => updateOption(index, { label: e.target.value }, !isDefaultLocale)}
                      className={!isDefaultLocale && !translations[option.id] ? 'italic placeholder:not-italic' : ''}
                    />
                    <Input
                      placeholder="Value"
                      value={option.value}
                      onChange={(e) => updateOption(index, { value: e.target.value })}
                      disabled={!isDefaultLocale}
                      className={isDuplicate ? 'border-destructive focus-visible:ring-destructive' : ''}
                      aria-invalid={isDuplicate}
                      aria-describedby={isDuplicate ? `duplicate-error-${option.id}` : undefined}
                    />
                  </div>

                  {/* Action buttons */}
                  {isDefaultLocale && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => duplicateOptionAt(index)}
                        className="h-9 w-9 text-muted-foreground hover:text-primary"
                        title="Duplicate option"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        className="h-9 w-9 text-muted-foreground hover:text-destructive"
                        title="Delete option"
                        disabled={options.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add button */}
          {isDefaultLocale && (
            <Button
              variant="outline"
              size="sm"
              onClick={addOption}
              className="w-full mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          )}

          {/* Translation mode hint */}
          {!isDefaultLocale && (
            <p className="text-xs text-muted-foreground mt-2">
              * Translation mode: Only labels can be edited
            </p>
          )}
        </div>
      )}
    </div>
  );
}
