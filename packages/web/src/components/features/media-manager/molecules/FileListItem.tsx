'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useTranslations } from '@/context/TranslationsContext';
import { FileActions } from './FileActions';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@ui/alert-dialog';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { Pencil, Trash2, ExternalLink, Download } from 'lucide-react';
import {
  getFileIcon,
  getFileIconColor,
  formatFileSize,
  formatDate,
  getThumbnailUrl,
  FOLDER_MIME,
} from '../lib/file-utils';
import type { FileItemBaseProps } from '../types';

interface FileListItemProps extends FileItemBaseProps {
  isDragTarget?: boolean;
  compactFolder?: boolean;
}

/**
 * FileListItem - Molecule
 *
 * Renders a single file or folder item in either grid or list mode.
 * Composes FileActions (dropdown) and uses file-utils for icon/color mapping.
 * Folders navigate on click; files open in Google Drive.
 * Supports drag-and-drop: all items are draggable, folders are droppable.
 */
export function FileListItem({
  file,
  viewMode,
  onFolderClick,
  onRename,
  onDelete,
  isDragTarget = false,
  compactFolder = false,
}: FileListItemProps) {
  const router = useRouter();
  const currentPathname = usePathname();
  const t = useTranslations('media');
  const isFolder = file.mimeType === FOLDER_MIME;
  const Icon = getFileIcon(file.mimeType);
  const iconColor = getFileIconColor(file.mimeType);
  const downloadUrl = `https://drive.google.com/uc?id=${file.id}&export=download`;

  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const [actionLoading, setActionLoading] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  const handleRename = async () => {
    if (!newName.trim() || newName === file.name) {
      setRenameOpen(false);
      return;
    }
    setActionLoading(true);
    try {
      if (onRename) await onRename(file.id, newName.trim());
      setRenameOpen(false);
    } catch {
      // Toast shown by useMediaManager hook
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      if (onDelete) await onDelete(file.id);
      setDeleteOpen(false);
    } catch {
      // Toast shown by useMediaManager hook
    } finally {
      setActionLoading(false);
    }
  };

  const onRenameClick = () => {
    setNewName(file.name);
    setRenameOpen(true);
  };

  const onDeleteClick = () => {
    setDeleteOpen(true);
  };

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({ id: file.id });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: file.id,
    disabled: !isFolder,
  });

  // Merge both refs into one callback ref
  const setNodeRef = (node: HTMLElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.3 : undefined,
  };

  const dropHighlight =
    isDragTarget || isOver
      ? 'ring-2 ring-primary border-primary bg-primary/5'
      : '';

  const handleClick = () => {
    if (isFolder) {
      onFolderClick(file.id, file.name);
    } else {
      // Navigate to in-app preview page (preserves locale prefix)
      const basePath = currentPathname.split('?')[0];
      router.push(`${basePath}/${file.id}`);
    }
  };

  const contextMenuContent = (
    <ContextMenuContent className="w-48">
      {file.webViewLink && (
        <ContextMenuItem
          onClick={() => window.open(file.webViewLink, '_blank')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          {t('fileActions.openInDrive')}
        </ContextMenuItem>
      )}
      {!isFolder && downloadUrl && (
        <ContextMenuItem onClick={() => window.open(downloadUrl, '_blank')}>
          <Download className="mr-2 h-4 w-4" />
          {t('fileActions.download')}
        </ContextMenuItem>
      )}
      {(file.webViewLink || (!isFolder && downloadUrl)) && (
        <ContextMenuSeparator />
      )}
      <ContextMenuItem onClick={onRenameClick}>
        <Pencil className="mr-2 h-4 w-4" />
        {t('fileActions.rename')}
      </ContextMenuItem>
      <ContextMenuItem
        onClick={onDeleteClick}
        className="text-destructive focus:text-destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {t('fileActions.delete')}
      </ContextMenuItem>
    </ContextMenuContent>
  );

  const dialogs = (
    <>
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('fileActions.renameTitle')}</DialogTitle>
            <DialogDescription>
              {t('fileActions.renameDescription').replace('{name}', file.name)}
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
            }}
            placeholder={t('fileActions.newNamePlaceholder')}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameOpen(false)}
              disabled={actionLoading}
            >
              {t('fileActions.cancel')}
            </Button>
            <Button onClick={handleRename} disabled={actionLoading}>
              {actionLoading ? t('fileActions.renaming') : t('fileActions.rename')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('fileActions.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('fileActions.deleteDescription').replace('{name}', file.name)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              {t('fileActions.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading ? t('fileActions.deleting') : t('fileActions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

  if (viewMode === 'grid') {
    if (isFolder && compactFolder) {
      return (
        <>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                className={`group flex items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-colors hover:bg-accent/50 data-[state=open]:bg-accent/50 ${dropHighlight}`}
              >
                <button
                  onClick={handleClick}
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer text-left outline-hidden"
                  title={file.name}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} />
                  <span className="text-sm font-medium truncate flex-1">
                    {file.name}
                  </span>
                </button>
                <div className="opacity-0 focus-within:opacity-100 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity shrink-0">
                  <FileActions
                    webViewLink={file.webViewLink}
                    downloadUrl={undefined}
                    onRenameClick={onRenameClick}
                    onDeleteClick={onDeleteClick}
                  />
                </div>
              </div>
            </ContextMenuTrigger>
            {contextMenuContent}
          </ContextMenu>
          {dialogs}
        </>
      );
    }

    return (
      <>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div
              ref={setNodeRef}
              style={style}
              {...listeners}
              {...attributes}
              className={`group flex flex-col rounded-xl border bg-card overflow-hidden transition-all hover:bg-accent/50 hover:border-accent data-[state=open]:bg-accent/50 data-[state=open]:border-accent ${dropHighlight} h-48 sm:h-56`}
            >
              {/* Header */}
              <div className="flex items-center gap-2 px-3 py-2 w-full shrink-0 border-b bg-card/50">
                <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} />
                <button
                  onClick={handleClick}
                  className="text-sm font-medium truncate flex-1 text-left outline-hidden"
                  title={file.name}
                >
                  {file.name}
                </button>
                <div className="opacity-0 focus-within:opacity-100 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity shrink-0">
                  <FileActions
                    webViewLink={file.webViewLink}
                    downloadUrl={isFolder ? undefined : downloadUrl}
                    onRenameClick={onRenameClick}
                    onDeleteClick={onDeleteClick}
                  />
                </div>
              </div>

              {/* Body */}
              <button
                onClick={handleClick}
                className="flex-1 w-full flex items-center justify-center p-2 relative overflow-hidden bg-muted/20 hover:bg-muted/40 transition-colors outline-hidden"
                title={file.name}
              >
                {!isFolder && !thumbnailError ? (
                  <img
                    src={getThumbnailUrl(file.id)}
                    alt={file.name}
                    className="max-h-full max-w-full object-contain rounded-sm drop-shadow-sm"
                    onError={() => setThumbnailError(true)}
                  />
                ) : (
                  <Icon
                    className={`h-16 w-16 sm:h-20 sm:w-20 ${iconColor} opacity-70`}
                  />
                )}
              </button>
            </div>
          </ContextMenuTrigger>
          {contextMenuContent}
        </ContextMenu>
        {dialogs}
      </>
    );
  }

  // List view
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`group flex items-center gap-3 rounded-md border bg-card px-4 py-3 transition-colors hover:bg-accent/50 data-[state=open]:bg-accent/50 ${dropHighlight}`}
          >
            <button
              onClick={handleClick}
              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer text-left"
            >
              <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} />
              <span className="text-sm font-medium truncate flex-1">
                {file.name}
              </span>
              <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                {formatDate(file.modifiedTime)}
              </span>
              <span className="text-xs text-muted-foreground shrink-0 w-20 text-right hidden md:block">
                {isFolder ? '-' : formatFileSize(file.size)}
              </span>
            </button>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <FileActions
                webViewLink={file.webViewLink}
                downloadUrl={isFolder ? undefined : downloadUrl}
                onRenameClick={onRenameClick}
                onDeleteClick={onDeleteClick}
              />
            </div>
          </div>
        </ContextMenuTrigger>
        {contextMenuContent}
      </ContextMenu>
      {dialogs}
    </>
  );
}
