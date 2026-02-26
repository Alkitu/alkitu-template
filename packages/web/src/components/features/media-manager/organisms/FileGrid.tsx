'use client';

import type { DriveFile } from '@alkitu/shared';
import { useTranslations } from '@/context/TranslationsContext';
import { FileListItem } from '../molecules/FileListItem';
import { Skeleton } from '@ui/skeleton';
import { FolderOpen } from 'lucide-react';
import type { ViewMode, FileActionHandlers } from '../types';

interface FileGridProps extends FileActionHandlers {
  files: DriveFile[];
  viewMode: ViewMode;
  loading: boolean;
  onFolderClick: (folderId: string, folderName: string) => void;
  dragOverFolderId?: string | null;
  foldersOnTop?: boolean;
}

/**
 * FileGrid - Organism
 *
 * Renders a collection of FileListItem molecules in grid or list layout.
 * Handles loading skeletons and empty state.
 */
export function FileGrid({
  files,
  viewMode,
  loading,
  onFolderClick,
  onRename,
  onDelete,
  dragOverFolderId,
  foldersOnTop = true,
}: FileGridProps) {
  const t = useTranslations('media');

  if (loading) {
    return viewMode === 'grid' ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 rounded-lg border p-4"
          >
            <Skeleton className="h-12 w-12 rounded-lg" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    ) : (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-md border px-4 py-3"
          >
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <FolderOpen className="h-16 w-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">{t('grid.emptyFolder')}</p>
        <p className="text-sm">{t('grid.emptyFolderHint')}</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    if (!foldersOnTop) {
      // Combined view
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {files.map((file) => (
            <FileListItem
              key={file.id}
              file={file}
              viewMode={viewMode}
              onFolderClick={onFolderClick}
              onRename={onRename}
              onDelete={onDelete}
              isDragTarget={file.id === dragOverFolderId}
            />
          ))}
        </div>
      );
    }

    const folders = files.filter(
      (f) => f.mimeType === 'application/vnd.google-apps.folder',
    );
    const documents = files.filter(
      (f) => f.mimeType !== 'application/vnd.google-apps.folder',
    );

    return (
      <div className="flex flex-col gap-6">
        {folders.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              {t('grid.foldersSection')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {folders.map((file) => (
                <FileListItem
                  key={file.id}
                  file={file}
                  viewMode={viewMode}
                  onFolderClick={onFolderClick}
                  onRename={onRename}
                  onDelete={onDelete}
                  isDragTarget={file.id === dragOverFolderId}
                  compactFolder={true}
                />
              ))}
            </div>
          </div>
        )}

        {documents.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              {t('grid.filesSection')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {documents.map((file) => (
                <FileListItem
                  key={file.id}
                  file={file}
                  viewMode={viewMode}
                  onFolderClick={onFolderClick}
                  onRename={onRename}
                  onDelete={onDelete}
                  isDragTarget={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {files.map((file) => (
        <FileListItem
          key={file.id}
          file={file}
          viewMode={viewMode}
          onFolderClick={onFolderClick}
          onRename={onRename}
          onDelete={onDelete}
          isDragTarget={file.id === dragOverFolderId}
        />
      ))}
    </div>
  );
}
