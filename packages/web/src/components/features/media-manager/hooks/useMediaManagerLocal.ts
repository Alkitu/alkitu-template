'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { DriveFile } from '@alkitu/shared';
import type {
  ViewMode,
  FolderStackItem,
  FolderContentsResponse,
  SortConfig,
  FileTypeFilter,
} from '../types';
import { filterFiles, sortFiles, FOLDER_MIME } from '../lib/file-utils';

/**
 * useMediaManagerLocal - Read-only hook for browsing Drive files inside modals
 *
 * Unlike `useMediaManager`, this hook uses local `useState` for folder navigation
 * instead of URL search params. This prevents router.push calls that would break
 * the parent page when used inside a modal/dialog.
 *
 * No CRUD operations (create, delete, rename, move) — display-only.
 */
export function useMediaManagerLocal(rootFolderId: string) {
  const [currentFolderId, setCurrentFolderId] = useState(rootFolderId);
  const [folderStack, setFolderStack] = useState<FolderStackItem[]>([]);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'name',
    direction: 'asc',
    foldersOnTop: true,
  });
  const [typeFilter, setTypeFilter] = useState<FileTypeFilter>('images');
  const [searchQuery, setSearchQueryState] = useState('');

  const displayFiles = useMemo(() => {
    const filtered = filterFiles(files, typeFilter);
    // Always preserve folders so users can navigate to subfolders,
    // even when a non-'all' type filter (e.g. 'images') is active.
    if (typeFilter !== 'all' && typeFilter !== 'folders') {
      const folders = files.filter((f) => f.mimeType === FOLDER_MIME);
      const withFolders = [
        ...folders,
        ...filtered.filter((f) => f.mimeType !== FOLDER_MIME),
      ];
      return sortFiles(withFolders, sortConfig);
    }
    return sortFiles(filtered, sortConfig);
  }, [files, typeFilter, sortConfig]);

  const fetchContents = useCallback(async (folderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/drive/folders/${folderId}/contents`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.message ||
            data.error ||
            `Failed to fetch folder contents (${res.status})`,
        );
      }
      const data: FolderContentsResponse = await res.json();
      setFiles(data.items);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load folder contents';
      setError(message);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const navigateToFolder = useCallback(
    (folderId: string, folderName: string) => {
      setSearchQueryState('');
      setFolderStack((prev) => [
        ...prev,
        { id: currentFolderId, name: folderName },
      ]);
      setCurrentFolderId(folderId);
    },
    [currentFolderId],
  );

  const navigateBack = useCallback(
    (index: number) => {
      if (index < 0) {
        setFolderStack([]);
        setCurrentFolderId(rootFolderId);
        return;
      }
      const item = folderStack[index];
      if (!item) return;
      setFolderStack((prev) => prev.slice(0, index));
      setCurrentFolderId(item.id);
    },
    [folderStack, rootFolderId],
  );

  const navigateRoot = useCallback(() => {
    setFolderStack([]);
    setCurrentFolderId(rootFolderId);
  }, [rootFolderId]);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
  }, []);

  const refresh = useCallback(() => {
    fetchContents(currentFolderId);
  }, [currentFolderId, fetchContents]);

  // Reset state when rootFolderId changes
  useEffect(() => {
    setCurrentFolderId(rootFolderId);
    setFolderStack([]);
  }, [rootFolderId]);

  // Fetch contents whenever the current folder changes
  useEffect(() => {
    fetchContents(currentFolderId);
  }, [currentFolderId, fetchContents]);

  return {
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
    navigateToFolder,
    navigateBack,
    navigateRoot,
    refresh,
  };
}
