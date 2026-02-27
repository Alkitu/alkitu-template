'use client';

import * as React from 'react';
import { FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FormResponsesPreviewProps, DriveAttachment } from './FormResponsesPreview.types';
import type { FormField, SupportedLocale } from '../../types';

/**
 * Get localized value from a field's i18n data.
 */
function getLocalizedFieldValue(
  field: any,
  fieldKey: string,
  locale: SupportedLocale,
  defaultLocale: SupportedLocale,
): string {
  if (locale === defaultLocale) {
    return field[fieldKey] || '';
  }
  return field.i18n?.[locale]?.[fieldKey] || field[fieldKey] || '';
}

/**
 * Resolve a field value into a human-readable display string.
 * Handles select/radio/multiselect/toggle/imageSelect lookups.
 */
function resolveDisplayValue(
  field: FormField,
  raw: unknown,
  locale: SupportedLocale,
  defaultLocale: SupportedLocale,
): string {
  if (raw === undefined || raw === null || raw === '') return '-';

  // Select / radio — look up label from items
  if (field.type === 'select' || field.type === 'radio' || field.type === 'imageSelect') {
    const items =
      field.selectOptions?.items ||
      field.radioOptions?.items ||
      field.imageSelectOptions?.items ||
      [];
    const match = items.find((i) => i.value === raw);
    if (match) return getLocalizedFieldValue(match, 'label', locale, defaultLocale);
    return String(raw);
  }

  // Multi-select / imageSelectMulti — array of values
  if (field.type === 'multiselect' || field.type === 'imageSelectMulti') {
    const items =
      field.multiSelectOptions?.items ||
      field.imageSelectMultiOptions?.items ||
      [];
    if (Array.isArray(raw)) {
      return raw
        .map((v) => {
          const match = items.find((i) => i.value === v);
          return match ? getLocalizedFieldValue(match, 'label', locale, defaultLocale) : String(v);
        })
        .join(', ') || '-';
    }
    return String(raw);
  }

  // Toggle — show checked/unchecked label
  if (field.type === 'toggle') {
    const checkedVal = field.toggleOptions?.checkedValue ?? true;
    const isChecked = raw === checkedVal;
    if (locale === 'es') return isChecked ? 'Sí' : 'No';
    return isChecked ? 'Yes' : 'No';
  }

  // FileUpload — text fallback (rich rendering handled in renderFileUploadField)
  if (field.type === 'fileUpload') {
    if (Array.isArray(raw)) {
      return raw.map((f: any) => f.name || String(f)).join(', ') || '-';
    }
    return String(raw);
  }

  // Date/time — attempt to format nicely
  if (field.type === 'date' || field.type === 'datetime') {
    const d = new Date(String(raw));
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...(field.type === 'datetime' && { hour: '2-digit', minute: '2-digit' }),
      });
    }
  }

  if (Array.isArray(raw)) {
    return raw.join(', ');
  }

  return String(raw);
}

/**
 * Get the base name of a file (without extension).
 */
function getBaseName(filename: string): string {
  const dot = filename.lastIndexOf('.');
  return dot > 0 ? filename.slice(0, dot) : filename;
}

/**
 * Match a file metadata entry (from __filesMeta__) to a Drive attachment
 * by base name. This handles extension changes from compression (e.g. .jpg → .webp).
 */
function findDriveAttachment(
  fileName: string,
  attachments: DriveAttachment[],
): DriveAttachment | undefined {
  // Exact match first
  const exact = attachments.find((a) => a.name === fileName);
  if (exact) return exact;
  // Fuzzy: match base name ignoring extension
  const base = getBaseName(fileName).toLowerCase();
  return attachments.find(
    (a) => getBaseName(a.name).toLowerCase() === base,
  );
}

/**
 * FormResponsesPreview Organism Component
 *
 * Read-only display of a client's form responses rendered against
 * the form schema. Groups are shown as labeled sections.
 * Field labels come from the schema; values come from templateResponses.
 */
export function FormResponsesPreview({
  formSettings,
  responses,
  attachments = [],
  locale = 'es',
  className,
}: FormResponsesPreviewProps) {
  const defaultLocale = formSettings.defaultLocale || 'es';

  /**
   * Render a fileUpload field with Drive thumbnails / file links.
   */
  const renderFileUploadField = (field: FormField) => {
    const label = getLocalizedFieldValue(field, 'label', locale, defaultLocale);

    // __filesMeta__ stores per-field metadata: { [fieldId]: [{ name, size }] }
    const metaKey = `__filesMeta__`;
    const allMeta = responses[metaKey] as Record<string, Array<{ name: string; size?: number }>> | undefined;
    const fileMeta = allMeta?.[field.id] || [];

    // Also check if raw value is an array of file objects
    const raw = responses[field.id];
    const rawFiles = Array.isArray(raw) ? raw as Array<{ name?: string }> : [];

    // Merge: prefer fileMeta, fall back to rawFiles
    const fileEntries = fileMeta.length > 0
      ? fileMeta
      : rawFiles.filter((f) => f.name).map((f) => ({ name: f.name!, size: undefined }));

    if (fileEntries.length === 0) {
      return (
        <div key={field.id} className="flex justify-between gap-4 py-2 border-b border-dashed last:border-0">
          <dt className="text-sm text-muted-foreground shrink-0">{label}</dt>
          <dd className="text-sm font-medium text-right">-</dd>
        </div>
      );
    }

    return (
      <div key={field.id} className="space-y-2">
        <dt className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest">
          {label}
        </dt>
        <dd className="flex flex-wrap gap-3">
          {fileEntries.map((entry, idx) => {
            const driveFile = findDriveAttachment(entry.name, attachments);

            if (driveFile && driveFile.mimeType.startsWith('image/')) {
              // Image thumbnail
              return (
                <a
                  key={`${field.id}-${idx}`}
                  href={driveFile.webViewLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-colors"
                >
                  <img
                    src={`/api/drive/files/${driveFile.fileId}/thumbnail`}
                    alt={entry.name}
                    className="h-24 w-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ExternalLink className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              );
            }

            if (driveFile) {
              // Non-image file link
              return (
                <a
                  key={`${field.id}-${idx}`}
                  href={driveFile.webViewLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 hover:bg-muted/50 transition-colors"
                >
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {entry.name}
                  </span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                </a>
              );
            }

            // No matching Drive attachment — show plain text
            return (
              <div
                key={`${field.id}-${idx}`}
                className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2"
              >
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {entry.name}
                </span>
              </div>
            );
          })}
        </dd>
      </div>
    );
  };

  const renderFieldRow = (field: FormField) => {
    // Skip groups — handled separately
    if (field.type === 'group') return null;

    // File uploads get special rendering with Drive attachments
    if (field.type === 'fileUpload') return renderFileUploadField(field);

    const label = getLocalizedFieldValue(field, 'label', locale, defaultLocale);
    const raw = responses[field.id];
    const display = resolveDisplayValue(field, raw, locale, defaultLocale);

    // Image select with image — show thumbnail
    if (
      (field.type === 'imageSelect' || field.type === 'imageSelectMulti') &&
      raw !== undefined &&
      raw !== null &&
      raw !== ''
    ) {
      const items =
        field.imageSelectOptions?.items ||
        field.imageSelectMultiOptions?.items ||
        [];
      const selectedValues = Array.isArray(raw) ? raw : [raw];
      const selectedItems = items.filter((i) => selectedValues.includes(i.value));

      return (
        <div key={field.id} className="space-y-1.5">
          <dt className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest">
            {label}
          </dt>
          <dd className="flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-md border bg-muted/30 px-2 py-1"
              >
                {item.images?.[0]?.url ? (
                  <img
                    src={item.images[0].url}
                    alt={item.label}
                    className="h-8 w-8 rounded object-cover"
                  />
                ) : (
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">
                  {getLocalizedFieldValue(item, 'label', locale, defaultLocale)}
                </span>
              </div>
            ))}
          </dd>
        </div>
      );
    }

    return (
      <div key={field.id} className="flex justify-between gap-4 py-2 border-b border-dashed last:border-0">
        <dt className="text-sm text-muted-foreground shrink-0">{label}</dt>
        <dd className="text-sm font-medium text-right max-w-[65%] break-words">
          {display}
        </dd>
      </div>
    );
  };

  const renderGroup = (group: FormField) => {
    const groupTitle = getLocalizedFieldValue(
      group.groupOptions || group,
      'title',
      locale,
      defaultLocale,
    ) || getLocalizedFieldValue(group, 'label', locale, defaultLocale);

    const fields = group.groupOptions?.fields || [];

    return (
      <div key={group.id} className="space-y-2">
        <h4 className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest">
          {groupTitle}
        </h4>
        <dl className="space-y-0">
          {fields.map((f) => renderFieldRow(f))}
        </dl>
      </div>
    );
  };

  // Determine if all top-level fields are groups
  const allGroups = formSettings.fields.every((f) => f.type === 'group');

  return (
    <div className={cn('space-y-6', className)}>
      {allGroups
        ? formSettings.fields.map((group) => renderGroup(group))
        : (
          <dl className="space-y-0">
            {formSettings.fields.map((field) =>
              field.type === 'group' ? renderGroup(field) : renderFieldRow(field),
            )}
          </dl>
        )}
    </div>
  );
}
