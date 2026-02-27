'use client';

import * as React from 'react';
import { Upload, X, FileText, Image, Video, Music, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/primitives/ui/button';
import { cn } from '@/lib/utils';
import { compressToWebP, isCompressibleImage } from '@/lib/utils/image-compression';
import { FORM_UPLOAD_MAX_TOTAL_MB } from '@/lib/utils/file-types';
import type { FormFileDropZoneProps } from './FormFileDropZone.types';

/**
 * Get icon component for a file based on its MIME type
 */
function getFileIcon(file: File) {
  const type = file.type.toLowerCase();
  if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
  if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
  if (type.startsWith('audio/')) return <Music className="h-4 w-4" />;
  if (type.includes('pdf') || type.includes('document') || type.includes('word'))
    return <FileText className="h-4 w-4" />;
  return <File className="h-4 w-4" />;
}

/**
 * Format bytes to human-readable size
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * FormFileDropZone Molecule Component
 *
 * A collect-mode drop zone that stores files in memory without uploading.
 * Same UX as EnhancedDropZone but operates without requiring a folderId.
 * The parent component handles the actual upload after creation.
 *
 * Features:
 * - Drag-and-drop with visual feedback
 * - File list with icons, size, and remove button
 * - Automatic WebP compression for images
 * - Capacity indicator (used / total MB)
 * - Per-file and total size validation
 * - MIME type validation
 */
export function FormFileDropZone({
  fieldId,
  files,
  onFilesChanged,
  maxFiles = 10,
  maxSizeMB,
  maxTotalMB = FORM_UPLOAD_MAX_TOTAL_MB,
  accept,
  displayStyle = 'dropzone',
  placeholder,
  disabled = false,
  enableWebPCompression = true,
}: FormFileDropZoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isCompressing, setIsCompressing] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [brokenImages, setBrokenImages] = React.useState<Set<File>>(new Set);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const previewUrlsRef = React.useRef<Map<File, string>>(new Map());

  const canAddMore = files.length < maxFiles;
  const totalSizeBytes = files.reduce((sum, f) => sum + f.size, 0);
  const totalSizeMB = totalSizeBytes / (1024 * 1024);
  const maxTotalBytes = maxTotalMB * 1024 * 1024;

  const acceptAttr = accept?.join(',') || undefined;

  // Classify files into images and non-images
  const imageFiles = files.filter(
    (f) => f.type.startsWith('image/') && !brokenImages.has(f),
  );
  const nonImageFiles = files.filter(
    (f) => !f.type.startsWith('image/') || brokenImages.has(f),
  );

  /**
   * Get or create an object URL for a file preview.
   * URLs are stored in a ref to avoid re-creating on every render.
   */
  const getPreviewUrl = React.useCallback((file: File): string => {
    const existing = previewUrlsRef.current.get(file);
    if (existing) return existing;
    const url = URL.createObjectURL(file);
    previewUrlsRef.current.set(file, url);
    return url;
  }, []);

  // Cleanup object URLs for files no longer in the list, and on unmount
  React.useEffect(() => {
    const currentFiles = new Set(files);
    for (const [file, url] of previewUrlsRef.current) {
      if (!currentFiles.has(file)) {
        URL.revokeObjectURL(url);
        previewUrlsRef.current.delete(file);
      }
    }
  }, [files]);

  React.useEffect(() => {
    return () => {
      for (const url of previewUrlsRef.current.values()) {
        URL.revokeObjectURL(url);
      }
      previewUrlsRef.current.clear();
    };
  }, []);

  /**
   * Validate and process incoming files
   */
  const processFiles = React.useCallback(
    async (incoming: FileList | null) => {
      if (!incoming || incoming.length === 0) return;

      const newErrors: string[] = [];
      const maxPerFileBytes = maxSizeMB ? maxSizeMB * 1024 * 1024 : undefined;
      const validFiles: File[] = [];

      for (let i = 0; i < incoming.length; i++) {
        const file = incoming[i];

        // MIME type check
        if (accept && accept.length > 0) {
          const isAllowed = accept.some((a) => {
            if (a.endsWith('/*')) return file.type.startsWith(a.replace('/*', '/'));
            if (a.startsWith('.')) return file.name.toLowerCase().endsWith(a.toLowerCase());
            return file.type === a;
          });
          if (!isAllowed) {
            newErrors.push(`"${file.name}": type not allowed`);
            continue;
          }
        }

        // Per-file size check
        if (maxPerFileBytes && file.size > maxPerFileBytes) {
          newErrors.push(`"${file.name}": exceeds ${maxSizeMB}MB limit`);
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) {
        setErrors(newErrors);
        return;
      }

      // WebP compression for images
      let processed = validFiles;
      if (enableWebPCompression) {
        const hasCompressible = validFiles.some(isCompressibleImage);
        if (hasCompressible) {
          setIsCompressing(true);
          try {
            processed = await Promise.all(validFiles.map((f) => compressToWebP(f)));
          } finally {
            setIsCompressing(false);
          }
        }
      }

      // Combine with existing files, check total limits
      const existing = files;
      const combined = [...existing];

      for (const file of processed) {
        if (combined.length >= maxFiles) {
          newErrors.push(`Max ${maxFiles} files allowed`);
          break;
        }
        const newTotal = combined.reduce((s, f) => s + f.size, 0) + file.size;
        if (newTotal > maxTotalBytes) {
          newErrors.push(`Total size would exceed ${maxTotalMB}MB limit`);
          break;
        }
        combined.push(file);
      }

      setErrors(newErrors);
      onFilesChanged(combined);

      // Reset input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [accept, maxSizeMB, maxFiles, maxTotalMB, maxTotalBytes, enableWebPCompression, files, onFilesChanged],
  );

  const handleRemove = React.useCallback(
    (index: number) => {
      const next = files.filter((_, i) => i !== index);
      onFilesChanged(next);
      setErrors([]);
    },
    [files, onFilesChanged],
  );

  const handleDragOver = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled && canAddMore) setIsDragOver(true);
    },
    [disabled, canAddMore],
  );

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (!disabled && canAddMore) {
        processFiles(e.dataTransfer.files);
      }
    },
    [disabled, canAddMore, processFiles],
  );

  return (
    <div className="space-y-3">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={acceptAttr}
        multiple={maxFiles > 1}
        onChange={(e) => processFiles(e.target.files)}
        disabled={disabled}
      />

      {/* Dropzone or Button */}
      {displayStyle === 'dropzone' ? (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragOver && 'border-primary bg-primary/5',
            !isDragOver && !disabled && canAddMore && 'cursor-pointer hover:border-primary/50 hover:bg-muted/30',
            (disabled || !canAddMore) && 'opacity-50 cursor-not-allowed',
          )}
          onClick={() => {
            if (!disabled && canAddMore) fileInputRef.current?.click();
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isCompressing ? (
            <>
              <Loader2 className="h-8 w-8 mx-auto text-primary mb-2 animate-spin" />
              <p className="text-sm text-muted-foreground">Compressing images...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {placeholder || 'Drop files here or click to upload'}
              </p>
              {maxSizeMB && (
                <p className="text-xs text-muted-foreground mt-1">
                  Max per file: {maxSizeMB}MB
                </p>
              )}
            </>
          )}
        </div>
      ) : (
        <div>
          <Button
            type="button"
            variant="outline"
            disabled={disabled || !canAddMore || isCompressing}
            onClick={() => fileInputRef.current?.click()}
          >
            {isCompressing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {isCompressing ? 'Compressing...' : placeholder || 'Choose file'}
          </Button>
          {maxSizeMB && (
            <p className="text-xs text-muted-foreground mt-1">
              Max per file: {maxSizeMB}MB
            </p>
          )}
        </div>
      )}

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-destructive">
              {err}
            </p>
          ))}
        </div>
      )}

      {/* Selected files */}
      {files.length > 0 && (
        <div className="space-y-2">
          {/* Image previews grid */}
          {imageFiles.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {imageFiles.map((file) => {
                const idx = files.indexOf(file);
                return (
                  <div
                    key={`${fieldId}-img-${idx}`}
                    className="relative group aspect-square rounded-lg overflow-hidden border bg-muted/30"
                  >
                    <img
                      src={getPreviewUrl(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onError={() =>
                        setBrokenImages((prev) => new Set(prev).add(file))
                      }
                    />
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => handleRemove(idx)}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <span className="absolute bottom-0 inset-x-0 px-1 py-0.5 bg-black/50 text-white text-[10px] truncate">
                      {file.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Non-image files list */}
          {nonImageFiles.map((file) => {
            const idx = files.indexOf(file);
            return (
              <div
                key={`${fieldId}-file-${idx}`}
                className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm"
              >
                <span className="text-muted-foreground shrink-0">{getFileIcon(file)}</span>
                <span className="truncate flex-1">{file.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatFileSize(file.size)}
                </span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Capacity indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {files.length}/{maxFiles} file{maxFiles !== 1 ? 's' : ''}
            </span>
            <span>
              {totalSizeMB.toFixed(1)} MB / {maxTotalMB} MB
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
