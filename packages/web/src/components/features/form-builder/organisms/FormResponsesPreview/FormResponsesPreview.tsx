'use client';

import * as React from 'react';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FormResponsesPreviewProps } from './FormResponsesPreview.types';
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

  // FileUpload — just show metadata if present
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
 * FormResponsesPreview Organism Component
 *
 * Read-only display of a client's form responses rendered against
 * the form schema. Groups are shown as labeled sections.
 * Field labels come from the schema; values come from templateResponses.
 */
export function FormResponsesPreview({
  formSettings,
  responses,
  locale = 'es',
  className,
}: FormResponsesPreviewProps) {
  const defaultLocale = formSettings.defaultLocale || 'es';

  const renderFieldRow = (field: FormField) => {
    // Skip groups — handled separately
    if (field.type === 'group') return null;

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
