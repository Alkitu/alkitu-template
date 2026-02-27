'use client';

import * as React from 'react';
import { useState, useCallback, useRef } from 'react';
import type { ImagePickerModalProps } from './ImagePickerModal.types';
import type { DriveFile } from '@alkitu/shared';
import { ResponsiveModal } from '@/components/primitives/ui/responsive-modal';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/primitives/ui/tabs';
import { Input } from '@/components/primitives/ui/input';
import { Button } from '@/components/primitives/ui/button';
import { Upload, Link, HardDrive, Loader2, ImageOff } from 'lucide-react';
import { compressToWebP } from '@/lib/utils/image-compression';
import { getThumbnailUrl } from '@/components/features/media-manager/lib/file-utils';
import { MediaBrowserPicker } from '@/components/features/media-manager/organisms/MediaBrowserPicker';
import { useTranslations } from '@/context/TranslationsContext';

/**
 * ImagePickerModal - Molecule
 *
 * Modal with 3 tabs for selecting an image:
 * 1. Upload — drag-and-drop or click to select, compress to WebP, upload
 * 2. URL — paste any image URL with live preview
 * 3. Drive — browse Google Drive Media Manager in picker mode
 */
export function ImagePickerModal({
  open,
  onOpenChange,
  onImageSelected,
  onImageUpload,
  driveFolderId,
}: ImagePickerModalProps) {
  const t = useTranslations('imagePicker');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload tab state
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'compressing' | 'uploading'>('idle');
  const [isDragOver, setIsDragOver] = useState(false);

  // URL tab state
  const [urlInput, setUrlInput] = useState('');
  const [urlPreviewError, setUrlPreviewError] = useState(false);
  const [urlPreviewLoaded, setUrlPreviewLoaded] = useState(false);

  const driveRootId =
    driveFolderId || process.env.NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID || '';
  const isDriveConfigured = !!driveRootId;

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (!open) {
      setUrlInput('');
      setUrlPreviewError(false);
      setUrlPreviewLoaded(false);
      setUploading(false);
      setUploadStatus('idle');
      setIsDragOver(false);
    }
  }, [open]);

  // ─── Upload helpers ────────────────────────────────────────────────

  /**
   * Converts a File to a base64 data string (without the data:... prefix).
   */
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Strip the "data:...;base64," prefix
        resolve(result.split(',')[1] || result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /**
   * Upload a file directly to Drive via the BFF endpoint.
   * Returns the thumbnail proxy URL for the uploaded file.
   */
  const uploadToDrive = useCallback(
    async (file: File): Promise<string> => {
      const base64Data = await fileToBase64(file);
      const res = await fetch('/api/drive/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderId: driveRootId,
          files: [
            {
              name: file.name,
              data: base64Data,
              mimeType: file.type,
              size: file.size,
            },
          ],
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || 'Upload failed');
      }

      const data = await res.json();
      // Response shape: { uploadedFiles: [{ file: { id, ... } }] }
      const fileId = data.uploadedFiles?.[0]?.file?.id;
      if (!fileId) {
        throw new Error('Upload succeeded but no file ID returned');
      }

      return getThumbnailUrl(fileId);
    },
    [driveRootId],
  );

  // ─── Upload tab handlers ─────────────────────────────────────────────

  const handleFileProcess = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;
      setUploading(true);
      try {
        setUploadStatus('compressing');
        const compressed = await compressToWebP(file);

        let url: string;
        if (onImageUpload) {
          // Use the provided upload handler
          setUploadStatus('uploading');
          url = await onImageUpload(compressed);
        } else if (isDriveConfigured) {
          // Upload directly to Drive via BFF
          setUploadStatus('uploading');
          url = await uploadToDrive(compressed);
        } else {
          // Last resort: data URL preview (no persistent storage)
          url = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(compressed);
          });
        }

        onImageSelected(url);
        onOpenChange(false);
      } finally {
        setUploading(false);
        setUploadStatus('idle');
      }
    },
    [onImageUpload, isDriveConfigured, uploadToDrive, onImageSelected, onOpenChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileProcess(file);
    },
    [handleFileProcess],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileProcess(file);
      e.target.value = '';
    },
    [handleFileProcess],
  );

  // ─── URL tab handlers ────────────────────────────────────────────────

  const handleUrlConfirm = useCallback(() => {
    if (urlInput.trim() && urlPreviewLoaded && !urlPreviewError) {
      onImageSelected(urlInput.trim());
      onOpenChange(false);
    }
  }, [urlInput, urlPreviewLoaded, urlPreviewError, onImageSelected, onOpenChange]);

  // ─── Drive tab handler ───────────────────────────────────────────────

  const handleDriveSelect = useCallback(
    (file: DriveFile) => {
      onImageSelected(getThumbnailUrl(file.id));
      onOpenChange(false);
    },
    [onImageSelected, onOpenChange],
  );

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('title')}
      description={t('description')}
      contentClassName="sm:max-w-[600px]"
    >
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="upload" className="flex-1 gap-1.5">
            <Upload className="h-4 w-4" />
            {t('tabs.upload')}
          </TabsTrigger>
          <TabsTrigger value="url" className="flex-1 gap-1.5">
            <Link className="h-4 w-4" />
            {t('tabs.url')}
          </TabsTrigger>
          <TabsTrigger value="drive" className="flex-1 gap-1.5">
            <HardDrive className="h-4 w-4" />
            {t('tabs.drive')}
          </TabsTrigger>
        </TabsList>

        {/* ─── Upload Tab ──────────────────────────────────────────── */}
        <TabsContent value="upload" className="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            disabled={uploading}
            className={`w-full border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer
              ${isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'}
              ${uploading ? 'opacity-60 pointer-events-none' : ''}
            `}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {uploadStatus === 'compressing'
                    ? t('upload.compressing')
                    : t('upload.uploading')}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {t('upload.dropzone')}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {t('upload.hint')}
                </p>
              </div>
            )}
          </button>
        </TabsContent>

        {/* ─── URL Tab ─────────────────────────────────────────────── */}
        <TabsContent value="url" className="mt-4 space-y-4">
          <Input
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              setUrlPreviewError(false);
              setUrlPreviewLoaded(false);
            }}
            placeholder={t('url.placeholder')}
            type="url"
          />

          {urlInput.trim() && (
            <div className="flex items-center justify-center rounded-lg border bg-muted/20 p-4 min-h-[160px]">
              {urlPreviewError ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageOff className="h-8 w-8" />
                  <p className="text-sm">{t('url.loadError')}</p>
                </div>
              ) : (
                <img
                  src={urlInput.trim()}
                  alt="Preview"
                  className="max-h-[200px] max-w-full object-contain rounded-sm"
                  onLoad={() => setUrlPreviewLoaded(true)}
                  onError={() => setUrlPreviewError(true)}
                />
              )}
            </div>
          )}

          <Button
            onClick={handleUrlConfirm}
            disabled={!urlInput.trim() || !urlPreviewLoaded || urlPreviewError}
            className="w-full"
          >
            {t('url.confirm')}
          </Button>
        </TabsContent>

        {/* ─── Drive Tab ───────────────────────────────────────────── */}
        <TabsContent value="drive" className="mt-4">
          {isDriveConfigured ? (
            <div className="h-[50vh] overflow-auto">
              <MediaBrowserPicker
                rootFolderId={driveRootId}
                onFileSelect={handleDriveSelect}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <HardDrive className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">{t('drive.notConfigured')}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ResponsiveModal>
  );
}
