'use client';

/**
 * ImageUpload Component
 *
 * Complex image upload component with:
 * - Dual input modes: URL or File upload
 * - Drag & drop support with visual feedback
 * - Click to upload with file picker
 * - Real-time image preview
 * - File validation (size, type)
 * - Upload progress indicator
 * - Comprehensive error handling
 * - Accessibility: keyboard navigation, ARIA labels, screen reader support
 *
 * Source: fork-of-block-editor/components/form/image-upload.tsx (8.7KB)
 * Migrated to: Alkitu atomic design with Radix UI primitives
 */

import * as React from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/primitives/ui/button';
import * as Tabs from '@radix-ui/react-tabs';
import * as Progress from '@radix-ui/react-progress';
import type {
  ImageUploadProps,
  ImageUploadState,
  UploadState,
} from './ImageUpload.types';
import {
  validateImageFile,
  uploadImage,
  extractImageUrl,
  DEFAULT_ACCEPTED_TYPES,
  DEFAULT_MAX_SIZE_MB,
} from './ImageUpload.utils';

/**
 * Size classes for image preview container
 */
const sizeClasses = {
  small: 'w-24 h-24',
  medium: 'w-36 h-36',
  large: 'w-48 h-48',
};

/**
 * ImageUpload component for handling image input via URL or file upload
 */
export function ImageUpload({
  value,
  onChange,
  placeholder = 'Enter image URL',
  size = 'medium',
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  disabled = false,
  required = false,
  uploadEndpoint = '/api/upload',
  onUploadStart,
  onUploadSuccess,
  onUploadError,
  onUploadProgress,
}: ImageUploadProps) {
  // Extract URL from value (handles both string and ImageData)
  const currentUrl = extractImageUrl(value);

  // Component state
  const [state, setState] = React.useState<ImageUploadState>({
    uploadState: 'idle',
    uploadProgress: 0,
    errorMessage: null,
    isDragging: false,
    imageError: false,
    urlInput: currentUrl,
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync urlInput with value prop when it changes externally
  React.useEffect(() => {
    const newUrl = extractImageUrl(value);
    if (newUrl !== state.urlInput) {
      setState((prev) => ({
        ...prev,
        urlInput: newUrl,
        imageError: false,
      }));
    }
  }, [value]);

  /**
   * Updates component state
   */
  const updateState = (updates: Partial<ImageUploadState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  /**
   * Sets upload state and triggers callbacks
   */
  const setUploadState = (newState: UploadState, error?: string) => {
    updateState({
      uploadState: newState,
      errorMessage: error || null,
    });
  };

  /**
   * Handles URL input change
   */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState({
      urlInput: e.target.value,
      imageError: false,
    });
  };

  /**
   * Applies URL value to parent component
   */
  const handleUrlApply = () => {
    if (state.urlInput) {
      onChange(state.urlInput);
    }
  };

  /**
   * Handles Enter key in URL input
   */
  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUrlApply();
    }
  };

  /**
   * Uploads a file and handles progress/errors
   */
  const uploadFile = async (file: File) => {
    try {
      // Validate file
      const validation = validateImageFile(file, maxSizeMB, acceptedTypes);
      if (!validation.valid) {
        setUploadState('error', validation.error);
        return;
      }

      // Start upload
      setUploadState('uploading');
      updateState({ uploadProgress: 0 });
      onUploadStart?.();

      // Upload with progress tracking
      const result = await uploadImage(
        file,
        uploadEndpoint,
        (progress) => {
          updateState({ uploadProgress: progress });
          onUploadProgress?.(progress);
        }
      );

      // Success
      setUploadState('success');
      onChange(result);
      updateState({ urlInput: result.url });
      onUploadSuccess?.(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed';
      setUploadState('error', errorMessage);
      onUploadError?.(
        error instanceof Error ? error : new Error(errorMessage)
      );
    }
  };

  /**
   * Handles file selection from input
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  /**
   * Handles drag over event
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      updateState({ isDragging: true });
    }
  };

  /**
   * Handles drag leave event
   */
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateState({ isDragging: false });
  };

  /**
   * Handles file drop event
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateState({ isDragging: false });

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        uploadFile(file);
      } else {
        setUploadState('error', 'Please drop an image file');
      }
    }
  };

  /**
   * Clears current image
   */
  const handleClear = () => {
    onChange('');
    updateState({
      urlInput: '',
      uploadState: 'idle',
      errorMessage: null,
      imageError: false,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Retries failed upload
   */
  const handleRetry = () => {
    setUploadState('idle');
  };

  /**
   * Opens file picker
   */
  const handleBrowseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const hasImage = currentUrl && !state.imageError;
  const isUploading = state.uploadState === 'uploading';

  return (
    <div className="space-y-3">
      {/* Tabs for URL or Upload */}
      <Tabs.Root defaultValue="url" className="w-full">
        <Tabs.List
          className="grid w-full grid-cols-2 rounded-md bg-muted p-1"
          aria-label="Image upload method"
        >
          <Tabs.Trigger
            value="url"
            disabled={disabled}
            className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm disabled:opacity-50"
          >
            URL
          </Tabs.Trigger>
          <Tabs.Trigger
            value="upload"
            disabled={disabled}
            className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm disabled:opacity-50"
          >
            Upload
          </Tabs.Trigger>
        </Tabs.List>

        {/* URL Input Tab */}
        <Tabs.Content value="url" className="mt-2 space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder={placeholder}
              value={state.urlInput}
              onChange={handleUrlChange}
              onKeyDown={handleUrlKeyDown}
              disabled={disabled}
              required={required}
              aria-label="Image URL"
              aria-invalid={state.imageError}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleUrlApply}
              disabled={
                disabled ||
                !state.urlInput ||
                state.urlInput === currentUrl
              }
              aria-label="Apply image URL"
            >
              Apply
            </Button>
          </div>
        </Tabs.Content>

        {/* File Upload Tab */}
        <Tabs.Content value="upload" className="mt-2 space-y-2">
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
              state.isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25',
              isUploading && 'pointer-events-none opacity-50',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label="Drag and drop image or click to upload"
            aria-disabled={disabled}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes.join(',')}
              onChange={handleFileSelect}
              disabled={disabled}
              className="hidden"
              aria-label="File input"
            />

            {isUploading ? (
              <div className="space-y-2" role="status" aria-live="polite">
                <Loader2
                  className="w-8 h-8 mx-auto animate-spin text-primary"
                  aria-hidden="true"
                />
                <p className="text-sm text-muted-foreground">
                  Uploading...
                </p>
                <Progress.Root
                  className="relative h-2 w-full overflow-hidden rounded-full bg-secondary"
                  value={state.uploadProgress}
                >
                  <Progress.Indicator
                    className="h-full w-full flex-1 bg-primary transition-all"
                    style={{
                      transform: `translateX(-${100 - state.uploadProgress}%)`,
                    }}
                  />
                </Progress.Root>
                <span className="sr-only">
                  Upload progress: {Math.round(state.uploadProgress)}%
                </span>
              </div>
            ) : (
              <>
                <Upload
                  className="w-8 h-8 mx-auto mb-2 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop an image or click to browse
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleBrowseClick}
                  disabled={disabled}
                  aria-label="Choose file to upload"
                >
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Max {maxSizeMB}MB •{' '}
                  {acceptedTypes
                    .map((type) => type.split('/')[1].toUpperCase())
                    .join(', ')}
                </p>
              </>
            )}
          </div>

          {/* Error Message */}
          {state.uploadState === 'error' && state.errorMessage && (
            <div
              className="flex items-center justify-between p-3 text-sm text-destructive bg-destructive/10 rounded-md"
              role="alert"
              aria-live="assertive"
            >
              <span>{state.errorMessage}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRetry}
                aria-label="Retry upload"
              >
                Retry
              </Button>
            </div>
          )}
        </Tabs.Content>
      </Tabs.Root>

      {/* Image Preview */}
      {hasImage && (
        <div className="relative inline-block" role="img" aria-label="Image preview">
          <div
            className={cn(
              'relative overflow-hidden rounded-md border bg-muted flex items-center justify-center',
              sizeClasses[size]
            )}
          >
            <img
              src={currentUrl}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
              onError={() => updateState({ imageError: true })}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Remove image"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </Button>
        </div>
      )}

      {/* Fallback when image fails to load */}
      {currentUrl && state.imageError && (
        <div
          className={cn(
            'relative overflow-hidden rounded-md border bg-muted flex items-center justify-center',
            sizeClasses[size]
          )}
          role="alert"
          aria-live="polite"
        >
          <div className="text-center space-y-1">
            <ImageIcon
              className="w-8 h-8 mx-auto text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-xs text-muted-foreground">Failed to load</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
              className="mt-2"
              aria-label="Clear failed image"
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
