'use client';

import * as React from 'react';
import type { FileUploadFieldEditorProps } from './FileUploadFieldEditor.types';
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
import { Button } from '@/components/primitives/ui/button';
import { Badge } from '@/components/primitives/ui/badge';
import { Checkbox } from '@/components/primitives/ui/checkbox';
import { X } from 'lucide-react';

const FILE_TYPE_PRESETS: Record<string, string[]> = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  documents: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'],
  all: [],
};

interface FileTypeEntry {
  label: string;
  value: string;
}

interface FileTypeCategory {
  category: string;
  types: FileTypeEntry[];
}

/**
 * Common file types organized by category for the custom file type selector.
 * Each entry has a human-readable label and the actual accept value (MIME or extension).
 */
const FILE_TYPE_CATEGORIES: FileTypeCategory[] = [
  {
    category: 'Images',
    types: [
      { label: 'JPEG', value: 'image/jpeg' },
      { label: 'PNG', value: 'image/png' },
      { label: 'GIF', value: 'image/gif' },
      { label: 'WebP', value: 'image/webp' },
      { label: 'SVG', value: 'image/svg+xml' },
      { label: 'BMP', value: 'image/bmp' },
      { label: 'All images', value: 'image/*' },
    ],
  },
  {
    category: 'Documents',
    types: [
      { label: 'PDF', value: '.pdf' },
      { label: 'Word (.doc)', value: '.doc' },
      { label: 'Word (.docx)', value: '.docx' },
      { label: 'Plain text (.txt)', value: '.txt' },
    ],
  },
  {
    category: 'Spreadsheets',
    types: [
      { label: 'Excel (.xls)', value: '.xls' },
      { label: 'Excel (.xlsx)', value: '.xlsx' },
      { label: 'CSV', value: '.csv' },
    ],
  },
  {
    category: 'Presentations',
    types: [
      { label: 'PowerPoint (.ppt)', value: '.ppt' },
      { label: 'PowerPoint (.pptx)', value: '.pptx' },
    ],
  },
  {
    category: 'Video',
    types: [
      { label: 'MP4', value: 'video/mp4' },
      { label: 'WebM', value: 'video/webm' },
      { label: 'MOV', value: 'video/quicktime' },
      { label: 'All videos', value: 'video/*' },
    ],
  },
  {
    category: 'Audio',
    types: [
      { label: 'MP3', value: 'audio/mpeg' },
      { label: 'WAV', value: 'audio/wav' },
      { label: 'OGG', value: 'audio/ogg' },
      { label: 'All audio', value: 'audio/*' },
    ],
  },
  {
    category: 'Archives',
    types: [
      { label: 'ZIP', value: '.zip' },
      { label: 'RAR', value: '.rar' },
      { label: '7z', value: '.7z' },
    ],
  },
];

/**
 * FileUploadFieldEditor Molecule
 *
 * Editor for file upload field types with:
 * - Label and description editing (i18n support)
 * - Required toggle
 * - Accepted file types (preset or custom)
 * - Max file size (MB)
 * - Max files count
 * - Display style (dropzone/button)
 * - Show file list toggle
 */
export function FileUploadFieldEditor({
  field,
  onChange,
  editingLocale = 'en',
  defaultLocale = 'en',
}: FileUploadFieldEditorProps) {
  const isDefaultLocale = editingLocale === defaultLocale;

  const currentLabel = isDefaultLocale
    ? field.label
    : field.i18n?.[editingLocale]?.label || '';

  const currentPlaceholder = isDefaultLocale
    ? field.fileUploadOptions?.placeholder || field.placeholder || ''
    : field.i18n?.[editingLocale]?.placeholder || '';

  const currentDescription = isDefaultLocale
    ? field.description || ''
    : field.i18n?.[editingLocale]?.description || '';

  const [customType, setCustomType] = React.useState('');
  const [forceCustom, setForceCustom] = React.useState(false);

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

  const updateFileUploadOptions = (updates: Partial<NonNullable<typeof field.fileUploadOptions>>) => {
    onChange({
      ...field,
      fileUploadOptions: {
        ...field.fileUploadOptions,
        ...updates,
      },
    });
  };

  const fileUploadOptions = field.fileUploadOptions || {};
  const acceptedTypes = fileUploadOptions.accept || [];

  // Determine current preset
  const getCurrentPreset = (): string => {
    if (forceCustom) return 'custom';
    if (acceptedTypes.length === 0) return 'all';
    const isImages = FILE_TYPE_PRESETS.images.every((t) => acceptedTypes.includes(t)) &&
      acceptedTypes.length === FILE_TYPE_PRESETS.images.length;
    const isDocs = FILE_TYPE_PRESETS.documents.every((t) => acceptedTypes.includes(t)) &&
      acceptedTypes.length === FILE_TYPE_PRESETS.documents.length;
    if (isImages) return 'images';
    if (isDocs) return 'documents';
    return 'custom';
  };

  const addCustomType = () => {
    const trimmed = customType.trim();
    if (!trimmed || acceptedTypes.includes(trimmed)) return;
    updateFileUploadOptions({ accept: [...acceptedTypes, trimmed] });
    setCustomType('');
    setForceCustom(false); // Natural custom detection takes over
  };

  const removeType = (type: string) => {
    updateFileUploadOptions({ accept: acceptedTypes.filter((t) => t !== type) });
  };

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
              updateFileUploadOptions({ placeholder: e.target.value });
            } else {
              updateI18n('placeholder', e.target.value);
            }
          }}
          placeholder={isDefaultLocale ? 'Drop files here or click to upload...' : fileUploadOptions.placeholder || ''}
          className={!isDefaultLocale && !currentPlaceholder ? 'italic' : ''}
        />
      </div>

      {/* Accepted File Types */}
      {isDefaultLocale && (
        <div className="space-y-2">
          <Label>Accepted File Types</Label>
          <Select
            value={getCurrentPreset()}
            onValueChange={(value) => {
              if (value === 'custom') {
                setForceCustom(true);
                // Clear to start fresh in custom mode
                updateFileUploadOptions({ accept: [] });
                return;
              }
              setForceCustom(false);
              updateFileUploadOptions({ accept: FILE_TYPE_PRESETS[value] || [] });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Files</SelectItem>
              <SelectItem value="images">Images Only</SelectItem>
              <SelectItem value="documents">Documents Only</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {/* Custom types selector */}
          {getCurrentPreset() === 'custom' && (
            <div className="space-y-3">
              {/* Current selection badges */}
              {acceptedTypes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {acceptedTypes.map((type) => {
                    // Find friendly label
                    const entry = FILE_TYPE_CATEGORIES
                      .flatMap((c) => c.types)
                      .find((t) => t.value === type);
                    return (
                      <Badge key={type} variant="secondary" className="gap-1">
                        {entry?.label || type}
                        <button onClick={() => removeType(type)} className="hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}

              {/* Categorized checkboxes */}
              <div className="border rounded-lg p-3 space-y-3 max-h-[280px] overflow-auto">
                {FILE_TYPE_CATEGORIES.map((category) => (
                  <div key={category.category}>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">
                      {category.category}
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {category.types.map((type) => {
                        const isChecked = acceptedTypes.includes(type.value);
                        return (
                          <label
                            key={type.value}
                            className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground"
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                setForceCustom(false);
                                if (checked) {
                                  updateFileUploadOptions({
                                    accept: [...acceptedTypes, type.value],
                                  });
                                } else {
                                  removeType(type.value);
                                }
                              }}
                            />
                            {type.label}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Manual entry for truly custom types */}
              <div className="flex gap-2">
                <Input
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  placeholder="Other: .pdf, image/*, .csv"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomType();
                    }
                  }}
                  className="text-sm"
                />
                <Button variant="outline" size="sm" onClick={addCustomType}>
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Max File Size */}
      {isDefaultLocale && (
        <div>
          <Label>Max File Size (MB)</Label>
          <Input
            type="number"
            min={1}
            value={fileUploadOptions.maxSizeMB || ''}
            onChange={(e) =>
              updateFileUploadOptions({
                maxSizeMB: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            placeholder="No limit"
          />
        </div>
      )}

      {/* Max Files */}
      {isDefaultLocale && (
        <div>
          <Label>Max Files</Label>
          <Input
            type="number"
            min={1}
            value={fileUploadOptions.maxFiles || ''}
            onChange={(e) =>
              updateFileUploadOptions({
                maxFiles: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            placeholder="1 (single file)"
          />
        </div>
      )}

      {/* Display Style */}
      {isDefaultLocale && (
        <div>
          <Label>Display Style</Label>
          <Select
            value={fileUploadOptions.displayStyle || 'dropzone'}
            onValueChange={(value: 'dropzone' | 'button') =>
              updateFileUploadOptions({ displayStyle: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dropzone">Dropzone</SelectItem>
              <SelectItem value="button">Button</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Show File List */}
      {isDefaultLocale && (
        <div className="flex items-center justify-between">
          <Label>Show File List</Label>
          <Switch
            checked={fileUploadOptions.showFileList !== false}
            onCheckedChange={(checked) => updateFileUploadOptions({ showFileList: checked })}
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
