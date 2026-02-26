'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { DriveFile } from '@alkitu/shared';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useTranslations } from '@/context/TranslationsContext';
import { useMediaManager } from '../hooks/useMediaManager';
import { FolderBreadcrumb } from '../molecules/FolderBreadcrumb';
import { MediaToolbar } from '../molecules/MediaToolbar';
import { FileGrid } from './FileGrid';
import { EnhancedDropZone } from '@/components/drive/upload';
import { Alert, AlertDescription } from '@ui/alert';
import { AlertTriangle, ArrowDown, ArrowUp, Search } from 'lucide-react';
import { FOLDER_MIME, getFileIcon, getFileIconColor } from '../lib/file-utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { Button } from '@ui/button';

interface MediaBrowserProps {
  rootFolderId: string;
  rootFolderName?: string;
}

/**
 * MediaBrowser - Organism
 *
 * Main container composing all Media Manager molecules/organisms:
 * FolderBreadcrumb, MediaToolbar, EnhancedDropZone, FileGrid.
 * Manages folder navigation, CRUD operations, upload integration,
 * and drag-and-drop file moves via @dnd-kit.
 */
export function MediaBrowser({
  rootFolderId,
  rootFolderName = 'Media',
}: MediaBrowserProps) {
  const t = useTranslations('media');
  const {
    files,
    displayFiles,
    loading,
    error,
    currentFolderId,
    folderStack,
    viewMode,
    setViewMode,
    sortConfig,
    setSortConfig,
    typeFilter,
    setTypeFilter,
    searchQuery,
    setSearchQuery,
    isSearchActive,
    navigateToFolder,
    navigateBack,
    createFolder,
    deleteFile,
    renameFile,
    moveFile,
    addFile,
    refresh,
  } = useMediaManager(rootFolderId);

  const [showUpload, setShowUpload] = useState(false);
  const [activeDragFile, setActiveDragFile] = useState<DriveFile | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

  // Require 8px of movement before starting a drag — prevents stealing clicks
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(pointerSensor, keyboardSensor);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const file = files.find((f) => f.id === event.active.id);
      setActiveDragFile(file || null);
    },
    [files],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const overId = event.over?.id as string | undefined;
      if (!overId) {
        setDragOverFolderId(null);
        return;
      }
      const overFile = files.find((f) => f.id === overId);
      if (overFile && overFile.mimeType === FOLDER_MIME) {
        setDragOverFolderId(overId);
      } else {
        setDragOverFolderId(null);
      }
    },
    [files],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDragFile(null);
      setDragOverFolderId(null);

      if (!over || active.id === over.id) return;

      const targetFile = files.find((f) => f.id === over.id);
      if (!targetFile || targetFile.mimeType !== FOLDER_MIME) return;

      moveFile(active.id as string, over.id as string);
    },
    [files, moveFile],
  );

  const handleDragCancel = useCallback(() => {
    setActiveDragFile(null);
    setDragOverFolderId(null);
  }, []);

  const currentFolderName =
    folderStack.length > 0
      ? folderStack[folderStack.length - 1]?.name
      : rootFolderName;

  const DragOverlayContent = activeDragFile
    ? (() => {
        const Icon = getFileIcon(activeDragFile.mimeType);
        const iconColor = getFileIconColor(activeDragFile.mimeType);
        return (
          <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 shadow-lg opacity-90">
            <Icon className={`h-4 w-4 ${iconColor}`} />
            <span className="text-sm font-medium truncate max-w-[200px]">
              {activeDragFile.name}
            </span>
          </div>
        );
      })()
    : null;

  const getSortLabel = () => {
    switch (sortConfig.field) {
      case 'name':
        return t('sort.name');
      case 'modifiedTime':
        return t('sort.modified');
      case 'size':
        return t('sort.size');
      case 'type':
        return t('sort.type');
      default:
        return t('sort.order');
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="space-y-4">
        {isSearchActive ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            <span>
              {t('toolbar.searchResultsFor')}{' '}
              <span className="font-medium text-foreground">
                &ldquo;{searchQuery}&rdquo;
              </span>
            </span>
          </div>
        ) : (
          <FolderBreadcrumb
            folderStack={folderStack}
            onNavigateBack={navigateBack}
            onNavigateRoot={() => navigateBack(-1)}
          />
        )}

        <MediaToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onCreateFolder={createFolder}
          onRefresh={refresh}
          currentFolderId={currentFolderId}
          loading={loading}
          onToggleUpload={() => setShowUpload(!showUpload)}
          showUpload={showUpload}
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          files={files}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showUpload && (
          <div className="rounded-lg border bg-muted/30 p-4">
            <EnhancedDropZone
              folderId={currentFolderId}
              folderName={currentFolderName || rootFolderName}
              onFileUploaded={(driveFile) =>
                addFile(driveFile as unknown as DriveFile)
              }
              onUploadComplete={() => {
                toast.success(t('toast.uploadSuccess'));
              }}
            />
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="flex items-center pb-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 px-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 rounded-full gap-2"
                >
                  {getSortLabel()}
                  {sortConfig.direction === 'desc' ? (
                    <ArrowDown className="h-4 w-4 rounded-full bg-accent text-accent-foreground p-0.5" />
                  ) : (
                    <ArrowUp className="h-4 w-4 rounded-full bg-accent text-accent-foreground p-0.5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  {t('sort.sortBy')}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ ...sortConfig, field: 'name' })
                  }
                >
                  <div className="flex items-center gap-2 w-full">
                    {sortConfig.field === 'name' && (
                      <span className="text-primary w-4">✓</span>
                    )}
                    <span className={sortConfig.field !== 'name' ? 'ml-6' : ''}>
                      {t('sort.name')}
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ ...sortConfig, field: 'modifiedTime' })
                  }
                >
                  <div className="flex items-center gap-2 w-full">
                    {sortConfig.field === 'modifiedTime' && (
                      <span className="text-primary w-4">✓</span>
                    )}
                    <span
                      className={
                        sortConfig.field !== 'modifiedTime' ? 'ml-6' : ''
                      }
                    >
                      {t('sort.modifiedDate')}
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ ...sortConfig, field: 'size' })
                  }
                >
                  <div className="flex items-center gap-2 w-full">
                    {sortConfig.field === 'size' && (
                      <span className="text-primary w-4">✓</span>
                    )}
                    <span className={sortConfig.field !== 'size' ? 'ml-6' : ''}>
                      {t('sort.size')}
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  {t('sort.order')}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({
                      ...sortConfig,
                      direction:
                        sortConfig.direction === 'asc' ? 'desc' : 'asc',
                    })
                  }
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-primary w-4">✓</span>
                    <span>
                      {sortConfig.direction === 'asc'
                        ? t('sort.ascending')
                        : t('sort.descending')}
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  {t('sort.folders')}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ ...sortConfig, foldersOnTop: true })
                  }
                >
                  <div className="flex items-center gap-2 w-full">
                    {sortConfig.foldersOnTop !== false && (
                      <span className="text-primary w-4">✓</span>
                    )}
                    <span
                      className={
                        sortConfig.foldersOnTop !== false ? '' : 'ml-6'
                      }
                    >
                      {t('sort.foldersOnTop')}
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ ...sortConfig, foldersOnTop: false })
                  }
                >
                  <div className="flex items-center gap-2 w-full">
                    {sortConfig.foldersOnTop === false && (
                      <span className="text-primary w-4">✓</span>
                    )}
                    <span
                      className={
                        sortConfig.foldersOnTop === false ? '' : 'ml-6'
                      }
                    >
                      {t('sort.foldersMixed')}
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <FileGrid
          files={displayFiles}
          viewMode={viewMode}
          loading={loading}
          onFolderClick={navigateToFolder}
          onRename={renameFile}
          onDelete={deleteFile}
          dragOverFolderId={dragOverFolderId}
          foldersOnTop={sortConfig.foldersOnTop !== false}
        />
      </div>

      <DragOverlay dropAnimation={null}>{DragOverlayContent}</DragOverlay>
    </DndContext>
  );
}
