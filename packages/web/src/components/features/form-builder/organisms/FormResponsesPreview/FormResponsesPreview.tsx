'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';
import { FileText, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
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

/** Image data for the lightbox */
interface LightboxImage {
  src: string;
  alt: string;
}

/**
 * Image Lightbox — fullscreen preview with arrow navigation
 */
function ImageLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = React.useRef({ x: 0, y: 0 });
  const panStart = React.useRef({ x: 0, y: 0 });

  const isZoomed = zoom > 1;

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.length);
    resetZoom();
  }, [images.length, resetZoom]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
    resetZoom();
  }, [images.length, resetZoom]);

  const handleZoomToggle = useCallback(() => {
    if (isZoomed) {
      resetZoom();
    } else {
      setZoom(2.5);
      setPan({ x: 0, y: 0 });
    }
  }, [isZoomed, resetZoom]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    setZoom((prev) => {
      const next = prev - e.deltaY * 0.002;
      if (next <= 1) { setPan({ x: 0, y: 0 }); return 1; }
      return Math.min(next, 5);
    });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!isZoomed) return;
    e.stopPropagation();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...pan };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [isZoomed, pan]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    setPan({
      x: panStart.current.x + (e.clientX - dragStart.current.x),
      y: panStart.current.y + (e.clientY - dragStart.current.y),
    });
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Keyboard navigation
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (isZoomed) resetZoom(); else onClose(); }
      if (e.key === 'ArrowRight' && !isZoomed) goNext();
      if (e.key === 'ArrowLeft' && !isZoomed) goPrev();
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 0.5, 5));
      if (e.key === '-') setZoom((z) => { const n = Math.max(z - 0.5, 1); if (n === 1) setPan({ x: 0, y: 0 }); return n; });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goNext, goPrev, isZoomed, resetZoom]);

  const current = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={() => { if (!isZoomed) onClose(); else resetZoom(); }}
    >
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-10"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Counter + zoom level */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white/70 text-sm font-medium z-10">
        {images.length > 1 && <span>{currentIndex + 1} / {images.length}</span>}
        {isZoomed && <span>{Math.round(zoom * 100)}%</span>}
      </div>

      {/* Previous arrow */}
      {images.length > 1 && !isZoomed && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-10"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      {/* Image with zoom + pan */}
      <div
        className="overflow-visible"
        style={{ cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={handleZoomToggle}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <img
          src={current.src}
          alt={current.alt}
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl select-none"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
          draggable={false}
        />
      </div>

      {/* Next arrow */}
      {images.length > 1 && !isZoomed && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-10"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}
    </div>
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

  // Lightbox state
  const [lightbox, setLightbox] = useState<{ images: LightboxImage[]; index: number } | null>(null);

  const openLightbox = (images: LightboxImage[], index: number) => {
    setLightbox({ images, index });
  };

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
        <div key={field.id} className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <dt className="text-xs uppercase font-black text-muted-foreground tracking-widest mb-2">{label}</dt>
          <dd className="text-base font-bold text-foreground">-</dd>
        </div>
      );
    }

    // Separate images from other files
    const imageFiles: { entry: typeof fileEntries[0]; driveFile: DriveAttachment; idx: number }[] = [];
    const otherFiles: { entry: typeof fileEntries[0]; driveFile?: DriveAttachment; idx: number }[] = [];

    fileEntries.forEach((entry, idx) => {
      const driveFile = findDriveAttachment(entry.name, attachments);
      if (driveFile && driveFile.mimeType.startsWith('image/')) {
        imageFiles.push({ entry, driveFile, idx });
      } else {
        otherFiles.push({ entry, driveFile, idx });
      }
    });

    // Build lightbox images array for this field (high-res for fullscreen viewing)
    const lightboxImages: LightboxImage[] = imageFiles.map(({ entry, driveFile }) => ({
      src: `/api/drive/files/${driveFile.fileId}/thumbnail?size=1600`,
      alt: entry.name,
    }));

    return (
      <div key={field.id} className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <dt className="text-xs uppercase font-black text-muted-foreground tracking-widest mb-3">
          {label}
        </dt>
        <dd className="space-y-3">
          {/* Image thumbnails grid */}
          {imageFiles.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {imageFiles.map(({ entry, driveFile }, lightboxIdx) => (
                <button
                  key={`${field.id}-img-${lightboxIdx}`}
                  type="button"
                  onClick={() => openLightbox(lightboxImages, lightboxIdx)}
                  className="group relative block rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-all hover:shadow-md cursor-pointer"
                >
                  <img
                    src={`/api/drive/files/${driveFile.fileId}/thumbnail`}
                    alt={entry.name}
                    className="h-28 w-28 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <ZoomIn className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Non-image files */}
          {otherFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {otherFiles.map(({ entry, driveFile }) => (
                driveFile ? (
                  <a
                    key={`${field.id}-file-${entry.name}`}
                    href={driveFile.webViewLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    {entry.name}
                  </a>
                ) : (
                  <span
                    key={`${field.id}-file-${entry.name}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {entry.name}
                  </span>
                )
              ))}
            </div>
          )}
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

    return (
      <div key={field.id} className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <dt className="text-xs uppercase font-black text-muted-foreground tracking-widest mb-2">
          {label}
        </dt>
        <dd className="text-base font-bold text-foreground break-words">
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
      <div key={group.id} className="space-y-3">
        <h4 className="text-xs uppercase font-black text-muted-foreground tracking-widest">
          {groupTitle}
        </h4>
        <dl className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => renderFieldRow(f))}
        </dl>
      </div>
    );
  };

  // Determine if all top-level fields are groups
  const allGroups = formSettings.fields.every((f) => f.type === 'group');

  return (
    <>
      <div className={cn('space-y-6', className)}>
        {allGroups
          ? formSettings.fields.map((group) => renderGroup(group))
          : (
            <dl className="grid gap-4 sm:grid-cols-2">
              {formSettings.fields.map((field) =>
                field.type === 'group' ? renderGroup(field) : renderFieldRow(field),
              )}
            </dl>
          )}
      </div>

      {/* Image Lightbox */}
      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
