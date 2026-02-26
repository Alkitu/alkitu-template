'use client';

import { useState } from 'react';
import type { DriveFile } from '@alkitu/shared';
import { useTranslations } from '@/context/TranslationsContext';
import { Button } from '@ui/button';
import { Card, CardContent } from '@ui/card';
import { Download, ExternalLink, FileX, ShieldAlert } from 'lucide-react';
import {
  getPreviewType,
  getGoogleDriveEmbedUrl,
  getLargeThumbnailUrl,
  getFileIcon,
  getFileIconColor,
  formatFileSize,
  formatDate,
} from '../lib/file-utils';

interface FilePreviewProps {
  file: DriveFile;
}

/**
 * FilePreview - Organism
 *
 * Renders a type-specific preview for a Google Drive file.
 * Includes graceful degradation when the user lacks Google Drive access.
 * Includes a file info bar with metadata and action buttons.
 */
export function FilePreview({ file }: FilePreviewProps) {
  const t = useTranslations('media');
  const [imageError, setImageError] = useState(false);
  const previewType = getPreviewType(file.mimeType);
  const Icon = getFileIcon(file.mimeType);
  const iconColor = getFileIconColor(file.mimeType);
  const downloadUrl = `https://drive.google.com/uc?id=${file.id}&export=download`;

  return (
    <div className="space-y-4">
      {/* Preview area */}
      <div className="flex items-center justify-center min-h-[400px] rounded-lg border bg-muted/30">
        {previewType === 'image' && !imageError && (
          <img
            src={getLargeThumbnailUrl(file.thumbnailLink) || getGoogleDriveEmbedUrl(file.id)}
            alt={file.name}
            className="max-h-[70vh] max-w-full object-contain rounded-lg"
            onError={() => setImageError(true)}
          />
        )}

        {previewType === 'image' && imageError && (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Icon className={`h-16 w-16 ${iconColor} opacity-60`} />
            <p className="text-lg font-medium">{t('preview.imageLoadError')}</p>
            <p className="text-sm text-center max-w-sm">
              {t('preview.accessRequired')}
            </p>
            {file.webViewLink && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  {t('preview.requestAccess')}
                </a>
              </Button>
            )}
          </div>
        )}

        {previewType === 'iframe' && (
          <div className="flex flex-col w-full h-full">
            <iframe
              src={getGoogleDriveEmbedUrl(file.id)}
              title={file.name}
              className="h-[70vh] w-full rounded-lg"
              sandbox="allow-scripts allow-same-origin"
              allowFullScreen
            />
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground bg-muted/50 rounded-b-lg">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <p>
                {t('preview.previewAccessHint')}
                {file.webViewLink && (
                  <>
                    {' '}
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-foreground transition-colors"
                    >
                      {t('preview.requestAccess')}
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        {previewType === 'none' && (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <FileX className="h-16 w-16 opacity-40" />
            <p className="text-lg font-medium">{t('preview.noPreview')}</p>
            <p className="text-sm">{t('preview.noPreviewHint')}</p>
          </div>
        )}
      </div>

      {/* File info bar */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} />
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground truncate">
                {file.mimeType}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {file.size != null && <span>{formatFileSize(file.size)}</span>}
                {file.modifiedTime && (
                  <span>{t('preview.modified')}: {formatDate(file.modifiedTime)}</span>
                )}
                {file.owners?.[0]?.displayName && (
                  <span>{file.owners[0].displayName}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild>
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                {t('preview.download')}
              </a>
            </Button>
            {file.webViewLink && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t('preview.openInDrive')}
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
