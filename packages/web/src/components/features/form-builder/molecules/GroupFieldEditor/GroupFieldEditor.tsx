'use client';

import * as React from 'react';
import { Label } from '@/components/primitives/ui/label';
import { Input } from '@/components/primitives/ui/input';
import { Textarea } from '@/components/primitives/ui/textarea';
import { Switch } from '@/components/primitives/ui/switch';
import { Button } from '@/components/primitives/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/ui/dropdown-menu';
import {
  Copy,
  Trash2,
  GripVertical,
  MoreVertical,
  Plus,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import type { GroupFieldEditorProps } from './GroupFieldEditor.types';
import type { FormField } from '../../types';
import { FieldEditor } from '../../organisms/FieldEditor';
import { FieldTypePicker } from '../../organisms/FieldTypePicker';
import { generateFieldId, createDefaultField } from '../../lib/field-helpers';

/**
 * GroupFieldEditor Molecule Component
 *
 * Editor for group field type (used for multi-step forms).
 * Manages nested fields within a group/step.
 *
 * Features:
 * - Group metadata (title, description)
 * - Nested field management (add, edit, delete, duplicate)
 * - Collapsible nested fields
 * - Prevent recursive groups (no groups inside groups)
 * - Uses shared FieldTypePicker with search, categories, and icons
 *
 * @example
 * ```tsx
 * <GroupFieldEditor
 *   field={groupField}
 *   onChange={handleChange}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export function GroupFieldEditor({
  field,
  onChange,
  onDelete,
  supportedLocales = ['en'],
  defaultLocale = 'en',
  editingLocale = 'en',
  onLocaleChange,
}: GroupFieldEditorProps) {
  const [collapsedFields, setCollapsedFields] = React.useState<Set<string>>(
    new Set()
  );
  const [showFieldPicker, setShowFieldPicker] = React.useState(false);

  const groupOptions = field.groupOptions || { fields: [], title: '', description: '' };
  const isDefaultLocale = editingLocale === defaultLocale;

  // Get localized value
  const getLocalizedValue = (key: 'title' | 'description'): string => {
    if (isDefaultLocale) {
      return groupOptions[key] || '';
    }
    return groupOptions[key] || '';
  };

  // Update localized value
  const updateLocalizedValue = (key: 'title' | 'description', value: string) => {
    updateGroupOptions({ [key]: value });
  };

  const updateGroupOptions = (updates: Partial<typeof groupOptions>) => {
    onChange({
      ...field,
      groupOptions: {
        ...groupOptions,
        ...updates,
      },
    });
  };

  const handleAddField = (fieldType: string) => {
    const type = fieldType.replace('form-', '') as FormField['type'];

    // Prevent recursive groups
    if (type === 'group') {
      return;
    }

    const newField = createDefaultField(type);
    updateGroupOptions({
      fields: [...(groupOptions.fields || []), newField],
    });
    setShowFieldPicker(false);
  };

  const handleRemoveField = (index: number) => {
    const newFields = [...(groupOptions.fields || [])];
    newFields.splice(index, 1);
    updateGroupOptions({ fields: newFields });
  };

  const handleFieldChange = (updatedField: FormField, index: number) => {
    const newFields = [...(groupOptions.fields || [])];
    newFields[index] = updatedField;
    updateGroupOptions({ fields: newFields });
  };

  const handleDuplicateField = (index: number) => {
    const fields = groupOptions.fields || [];
    const fieldToCopy = fields[index];
    const newField: FormField = {
      ...fieldToCopy,
      id: generateFieldId(),
      label: `${fieldToCopy.label} (copy)`,
    };
    const newFields = [...fields];
    newFields.splice(index + 1, 0, newField);
    updateGroupOptions({ fields: newFields });
  };

  const toggleFieldCollapse = (fieldId: string) => {
    setCollapsedFields((prev) => {
      const next = new Set(prev);
      if (next.has(fieldId)) {
        next.delete(fieldId);
      } else {
        next.add(fieldId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Group Metadata */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${field.id}-title`} className="text-xs font-semibold">
            Step Title
            {!isDefaultLocale && (
              <span className="text-xs text-muted-foreground ml-2">
                ({editingLocale})
              </span>
            )}
          </Label>
          <Input
            id={`${field.id}-title`}
            value={getLocalizedValue('title')}
            onChange={(e) => updateLocalizedValue('title', e.target.value)}
            placeholder={
              !isDefaultLocale ? groupOptions.title : 'Enter step title'
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${field.id}-description`} className="text-xs font-semibold">
            Step Description
            {!isDefaultLocale && (
              <span className="text-xs text-muted-foreground ml-2">
                ({editingLocale})
              </span>
            )}
          </Label>
          <Textarea
            id={`${field.id}-description`}
            value={getLocalizedValue('description')}
            onChange={(e) => updateLocalizedValue('description', e.target.value)}
            placeholder={
              !isDefaultLocale
                ? groupOptions.description
                : 'Enter step description (optional)'
            }
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
          <Label htmlFor={`${field.id}-showTitle`} className="text-xs cursor-pointer">
            Show Step Title
          </Label>
          <Switch
            id={`${field.id}-showTitle`}
            checked={groupOptions.showTitle ?? true}
            onCheckedChange={(showTitle) => updateGroupOptions({ showTitle })}
            disabled={!isDefaultLocale}
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
          <Label
            htmlFor={`${field.id}-showDescription`}
            className="text-xs cursor-pointer"
          >
            Show Step Description
          </Label>
          <Switch
            id={`${field.id}-showDescription`}
            checked={groupOptions.showDescription ?? false}
            onCheckedChange={(showDescription) =>
              updateGroupOptions({ showDescription })
            }
            disabled={!isDefaultLocale}
          />
        </div>
      </div>

      {/* Nested Fields */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Fields in this Step
          </h4>
        </div>

        {groupOptions.fields && groupOptions.fields.length > 0 ? (
          <div className="space-y-3 border-l-2 border-primary/20 pl-3">
            {groupOptions.fields.map((childField, index) => (
              <div
                key={childField.id}
                className="relative border rounded-lg overflow-hidden bg-muted/30"
              >
                {/* Field Header */}
                <div className="flex items-center gap-2 p-3 bg-muted/50">
                  <div className="cursor-move text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="flex-1 font-medium text-sm">
                    {childField.label || 'Untitled Field'}
                    <span className="ml-2 text-[10px] uppercase opacity-60 font-normal px-1.5 py-0.5 bg-background border rounded">
                      {childField.type}
                    </span>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDuplicateField(index)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRemoveField(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleFieldCollapse(childField.id)}
                  >
                    <ChevronUp
                      className={cn(
                        'h-4 w-4 transition-transform',
                        collapsedFields.has(childField.id) && 'rotate-180'
                      )}
                    />
                  </Button>
                </div>

                {/* Field Editor (Collapsed/Expanded) */}
                {!collapsedFields.has(childField.id) && (
                  <div className="p-3 border-t">
                    <FieldEditor
                      field={childField}
                      onChange={(updated) => handleFieldChange(updated, index)}
                      onDelete={() => handleRemoveField(index)}
                      supportedLocales={supportedLocales}
                      defaultLocale={defaultLocale}
                      editingLocale={editingLocale}
                      onLocaleChange={onLocaleChange}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              No fields in this step yet
            </p>
            <Button onClick={() => setShowFieldPicker(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add First Field
            </Button>
          </div>
        )}

        {/* Add Field Button */}
        {groupOptions.fields && groupOptions.fields.length > 0 && (
          <Button
            onClick={() => setShowFieldPicker(true)}
            variant="outline"
            size="sm"
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Field to Step
          </Button>
        )}
      </div>

      {/* Field Type Picker Dialog (shared component - excludes group to prevent recursion) */}
      <FieldTypePicker
        open={showFieldPicker}
        onClose={() => setShowFieldPicker(false)}
        onSelect={handleAddField}
        excludeTypes={['form-group']}
      />
    </div>
  );
}
