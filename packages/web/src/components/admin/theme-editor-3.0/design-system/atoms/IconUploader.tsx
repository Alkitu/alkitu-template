'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '../primitives/button';
import { Input } from './Input';
import { CustomIcon } from './CustomIcon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../primitives/dialog';

interface IconUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, name: string) => Promise<void>;
}

/**
 * IconUploader Component
 * Modal dialog for uploading and previewing custom SVG icons
 */
export function IconUploader({
  isOpen,
  onClose,
  onUpload
}: IconUploaderProps) {
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
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
        setError('Invalid SVG file');
        setPreviewSVG(null);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setPreviewSVG(null);
    };
    reader.readAsText(file);
  }, []);

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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Custom Icon</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload info */}
          <div className="text-sm text-muted-foreground">
            <p>Upload an SVG icon to add to your icon library.</p>
            <p className="mt-1">
              SVG files will be processed and optimized for the theme system.
            </p>
          </div>

          {/* File input */}
          <>
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {selectedFile ? selectedFile.name : 'Choose SVG File'}
                </Button>
              </div>

              {/* Icon name input */}
              {selectedFile && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Icon Name</label>
                  <Input
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, '_'))}
                    placeholder="Enter icon name"
                    disabled={isUploading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Only letters, numbers, dashes and underscores allowed
                  </p>
                </div>
              )}

              {/* Preview section */}
              {previewSVG && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preview</label>
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center justify-center space-x-4">
                      {/* Different sizes preview */}
                      <div className="text-center">
                        <CustomIcon svg={previewSVG} size="sm" className="mx-auto" />
                        <p className="text-xs mt-1 text-muted-foreground">sm</p>
                      </div>
                      <div className="text-center">
                        <CustomIcon svg={previewSVG} size="md" className="mx-auto" />
                        <p className="text-xs mt-1 text-muted-foreground">md</p>
                      </div>
                      <div className="text-center">
                        <CustomIcon svg={previewSVG} size="lg" className="mx-auto" />
                        <p className="text-xs mt-1 text-muted-foreground">lg</p>
                      </div>
                      <div className="text-center">
                        <CustomIcon svg={previewSVG} size="2xl" className="mx-auto" />
                        <p className="text-xs mt-1 text-muted-foreground">2xl</p>
                      </div>
                    </div>

                    {/* Color variants preview */}
                    <div className="flex items-center justify-center space-x-3 mt-4 pt-4 border-t">
                      <CustomIcon svg={previewSVG} size="md" variant="primary" />
                      <CustomIcon svg={previewSVG} size="md" variant="secondary" />
                      <CustomIcon svg={previewSVG} size="md" variant="accent" />
                      <CustomIcon svg={previewSVG} size="md" variant="muted" />
                      <CustomIcon svg={previewSVG} size="md" variant="destructive" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="flex items-center space-x-2 text-destructive text-sm">
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
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || !iconName || !previewSVG || isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Add Icon
                    </>
                  )}
                </Button>
              </div>
            </>
        </div>
      </DialogContent>
    </Dialog>
  );
}