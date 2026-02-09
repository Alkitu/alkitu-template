'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/molecules-alianza/Button';
import { Input } from '@/components/atoms-alianza/Input';
import { CustomIcon } from '@/components/atoms-alianza/CustomIcon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/Dialog';
import type { IconUploaderOrganismProps } from './IconUploaderOrganism.types';

/**
 * IconUploaderOrganism - Atomic Design Organism
 *
 * Complete icon upload workflow organism that manages:
 * - SVG file selection and validation
 * - Icon name generation and sanitization
 * - Live preview with multiple sizes (sm, md, lg, 2xl)
 * - Color variant preview (primary, secondary, accent, muted, destructive)
 * - Error handling and loading states
 * - Async upload with callback
 *
 * This organism receives **translated text as props** from page components.
 * It does NOT use `useTranslations()` hook directly.
 *
 * @example
 * ```tsx
 * // In page.tsx
 * const t = useTranslations();
 * const handleUpload = async (file: File, name: string) => {
 *   // Upload logic here
 * };
 *
 * <IconUploaderOrganism
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onUpload={handleUpload}
 *   title={t('icon.upload.title')}
 *   description={t('icon.upload.description')}
 * />
 * ```
 */
export const IconUploaderOrganism = React.forwardRef<
  HTMLDivElement,
  IconUploaderOrganismProps
>(
  (
    {
      isOpen,
      onClose,
      onUpload,
      title = 'Upload Custom Icon',
      description = 'Upload an SVG icon to add to your icon library.',
      helperText = 'SVG files will be processed and optimized for the theme system.',
      chooseFileText = 'Choose SVG File',
      iconNameLabel = 'Icon Name',
      iconNamePlaceholder = 'Enter icon name',
      iconNameHelper = 'Only letters, numbers, dashes and underscores allowed',
      previewLabel = 'Preview',
      cancelText = 'Cancel',
      submitText = 'Add Icon',
      uploadingText = 'Uploading...',
      invalidSvgError = 'Invalid SVG file',
      readFileError = 'Failed to read file',
    },
    ref,
  ) => {
    // Internal state management
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [iconName, setIconName] = useState('');
    const [previewSVG, setPreviewSVG] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset state when modal closes
    const handleClose = useCallback(() => {
      setSelectedFile(null);
      setIconName('');
      setPreviewSVG(null);
      setError(null);
      setIsUploading(false);
      onClose();
    }, [onClose]);

    // Handle file selection
    const handleFileSelect = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setSelectedFile(file);

        // Generate default name from filename
        const defaultName = file.name
          .replace(/\.svg$/i, '')
          .replace(/[^a-zA-Z0-9-_]/g, '_')
          .toLowerCase();
        setIconName(defaultName);

        // Read and preview the SVG
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content.includes('<svg')) {
            setPreviewSVG(content);
          } else {
            setError(invalidSvgError);
            setPreviewSVG(null);
          }
        };
        reader.onerror = () => {
          setError(readFileError);
          setPreviewSVG(null);
        };
        reader.readAsText(file);
      },
      [invalidSvgError, readFileError],
    );

    // Handle icon name change with sanitization
    const handleIconNameChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = e.target.value.replace(/[^a-zA-Z0-9-_]/g, '_');
        setIconName(sanitized);
      },
      [],
    );

    // Handle upload
    const handleUpload = useCallback(async () => {
      if (!selectedFile || !iconName || !previewSVG) return;

      setIsUploading(true);
      setError(null);

      try {
        await onUpload(selectedFile, iconName);
        handleClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
        setIsUploading(false);
      }
    }, [selectedFile, iconName, previewSVG, onUpload, handleClose]);

    // Handle file input button click
    const handleChooseFile = useCallback(() => {
      fileInputRef.current?.click();
    }, []);

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]" ref={ref}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Upload info */}
            <div className="text-sm text-muted-foreground">
              <p>{description}</p>
              <p className="mt-1">{helperText}</p>
            </div>

            {/* File input */}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,image/svg+xml"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="SVG file input"
              />

              <Button
                variant="outline"
                className="w-full"
                onClick={handleChooseFile}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {selectedFile ? selectedFile.name : chooseFileText}
              </Button>
            </div>

            {/* Icon name input */}
            {selectedFile && (
              <div className="space-y-2">
                <label
                  className="text-sm font-medium"
                  htmlFor="icon-name-input"
                >
                  {iconNameLabel}
                </label>
                <Input
                  id="icon-name-input"
                  value={iconName}
                  onChange={handleIconNameChange}
                  placeholder={iconNamePlaceholder}
                  disabled={isUploading}
                  aria-describedby="icon-name-helper"
                />
                <p
                  id="icon-name-helper"
                  className="text-xs text-muted-foreground"
                >
                  {iconNameHelper}
                </p>
              </div>
            )}

            {/* Preview section */}
            {previewSVG && (
              <div className="space-y-2">
                <label className="text-sm font-medium">{previewLabel}</label>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center justify-center space-x-4">
                    {/* Different sizes preview */}
                    <div className="text-center">
                      <CustomIcon
                        svg={previewSVG}
                        size="sm"
                        className="mx-auto"
                      />
                      <p className="text-xs mt-1 text-muted-foreground">sm</p>
                    </div>
                    <div className="text-center">
                      <CustomIcon
                        svg={previewSVG}
                        size="md"
                        className="mx-auto"
                      />
                      <p className="text-xs mt-1 text-muted-foreground">md</p>
                    </div>
                    <div className="text-center">
                      <CustomIcon
                        svg={previewSVG}
                        size="lg"
                        className="mx-auto"
                      />
                      <p className="text-xs mt-1 text-muted-foreground">lg</p>
                    </div>
                    <div className="text-center">
                      <CustomIcon
                        svg={previewSVG}
                        size="2xl"
                        className="mx-auto"
                      />
                      <p className="text-xs mt-1 text-muted-foreground">2xl</p>
                    </div>
                  </div>

                  {/* Color variants preview */}
                  <div className="flex items-center justify-center space-x-3 mt-4 pt-4 border-t">
                    <CustomIcon svg={previewSVG} size="md" variant="primary" />
                    <CustomIcon
                      svg={previewSVG}
                      size="md"
                      variant="secondary"
                    />
                    <CustomIcon svg={previewSVG} size="md" variant="accent" />
                    <CustomIcon svg={previewSVG} size="md" variant="muted" />
                    <CustomIcon
                      svg={previewSVG}
                      size="md"
                      variant="destructive"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div
                className="flex items-center space-x-2 text-destructive text-sm"
                role="alert"
              >
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isUploading}
              >
                {cancelText}
              </Button>
              <Button
                onClick={handleUpload}
                disabled={
                  !selectedFile || !iconName || !previewSVG || isUploading
                }
              >
                {isUploading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    {uploadingText}
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {submitText}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

IconUploaderOrganism.displayName = 'IconUploaderOrganism';

export default IconUploaderOrganism;
