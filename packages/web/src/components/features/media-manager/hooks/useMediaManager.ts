'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import type { DriveFile } from '@alkitu/shared';
import type {
  ViewMode,
  FolderStackItem,
  FolderContentsResponse,
  SortConfig,
  FileTypeFilter,
} from '../types';
import { filterFiles, sortFiles } from '../lib/file-utils';
import { useTranslations } from '@/context/TranslationsContext';

/**
 * useMediaManager - Custom hook for Media Manager state and operations
 *
 * Encapsulates folder navigation, file CRUD operations, and view state.
 * Communicates with the BFF proxy routes for all Drive operations.
 * Derives currentFolderId from URL search params (?folder=ID) as single source of truth.
 */
export function useMediaManager(rootFolderId: string) {
  const t = useTranslations('media');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFolderId = searchParams.get('folder') || rootFolderId;

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
  const [typeFilter, setTypeFilter] = useState<FileTypeFilter>('all');
  const [searchQuery, setSearchQueryState] = useState('');
  const [searchResults, setSearchResults] = useState<DriveFile[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const displayFiles = useMemo(() => {
    const source = searchResults !== null ? searchResults : files;
    return sortFiles(filterFiles(source, typeFilter), sortConfig);
  }, [files, searchResults, typeFilter, sortConfig]);

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
        err instanceof Error ? err.message : t('toast.loadError');
      setError(message);
      setFiles([]);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const navigateToFolder = useCallback(
    (folderId: string, folderName: string) => {
      // Clear search when navigating to a folder
      setSearchQueryState('');
      setSearchResults(null);
      setFolderStack((prev) => [
        ...prev,
        { id: currentFolderId, name: folderName },
      ]);
      router.push(`${pathname}?folder=${folderId}`);
    },
    [currentFolderId, router, pathname],
  );

  const navigateBack = useCallback(
    (index: number) => {
      if (index < 0) {
        setFolderStack([]);
        router.push(pathname);
        return;
      }
      const item = folderStack[index];
      if (!item) return;
      setFolderStack((prev) => prev.slice(0, index));
      if (item.id === rootFolderId) {
        router.push(pathname);
      } else {
        router.push(`${pathname}?folder=${item.id}`);
      }
    },
    [folderStack, rootFolderId, router, pathname],
  );

  const createFolder = useCallback(
    async (name: string) => {
      try {
        const res = await fetch('/api/drive/folders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, parentId: currentFolderId }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            data.message || data.error || 'Failed to create folder',
          );
        }
        const data = await res.json();
        setFiles((prev) => [data.folder as DriveFile, ...prev]);
        toast.success(t('toast.folderCreated'));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : t('toast.folderCreateError');
        toast.error(message);
        throw err;
      }
    },
    [currentFolderId],
  );

  const deleteFile = useCallback(
    async (fileId: string) => {
      const previousFiles = files;
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      try {
        const res = await fetch(`/api/drive/files/${fileId}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            data.message || data.error || 'Failed to delete file',
          );
        }
        toast.success(t('toast.fileDeleted'));
      } catch (err) {
        setFiles(previousFiles);
        const message =
          err instanceof Error ? err.message : t('toast.fileDeleteError');
        toast.error(message);
        throw err;
      }
    },
    [files],
  );

  const renameFile = useCallback(
    async (fileId: string, newName: string) => {
      const previousFiles = files;
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, name: newName } : f)),
      );
      try {
        const res = await fetch(`/api/drive/files/${fileId}/rename`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newName }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            data.message || data.error || 'Failed to rename file',
          );
        }
        toast.success(t('toast.fileRenamed'));
      } catch (err) {
        setFiles(previousFiles);
        const message =
          err instanceof Error ? err.message : t('toast.fileRenameError');
        toast.error(message);
        throw err;
      }
    },
    [files],
  );

  const moveFile = useCallback(
    async (fileId: string, newParentId: string) => {
      const previousFiles = files;
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      try {
        const res = await fetch(`/api/drive/files/${fileId}/move`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newParentId }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || data.error || 'Failed to move file');
        }
        toast.success(t('toast.fileMoved'));
      } catch (err) {
        setFiles(previousFiles);
        const message =
          err instanceof Error ? err.message : t('toast.fileMoveError');
        toast.error(message);
        throw err;
      }
    },
    [files],
  );

  const searchFiles = useCallback(async (query: string) => {
    setSearchLoading(true);
    try {
      const res = await fetch(
        `/api/drive/search?q=${encodeURIComponent(query)}`,
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.message || data.error || `Search failed (${res.status})`,
        );
      }
      const data = await res.json();
      setSearchResults(data.files || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t('toast.loadError');
      toast.error(message);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const setSearchQuery = useCallback(
    (query: string) => {
      setSearchQueryState(query);
      if (!query) {
        setSearchResults(null);
      } else {
        searchFiles(query);
      }
    },
    [searchFiles],
  );

  const addFile = useCallback((file: DriveFile) => {
    setFiles((prev) => {
      if (prev.some((f) => f.id === file.id)) return prev;
      return [file, ...prev];
    });
  }, []);

  const refresh = useCallback(() => {
    fetchContents(currentFolderId);
  }, [currentFolderId, fetchContents]);

  useEffect(() => {
    fetchContents(currentFolderId);
  }, [currentFolderId, fetchContents]);

  return {
    files,
    displayFiles,
    loading: loading || searchLoading,
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
    isSearchActive: searchResults !== null,
    navigateToFolder,
    navigateBack,
    createFolder,
    deleteFile,
    renameFile,
    moveFile,
    addFile,
    refresh,
  };
}
