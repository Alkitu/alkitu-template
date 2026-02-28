'use client';

import { useState, useEffect, useRef } from 'react';
import type { DriveFile } from '@alkitu/shared';
import { useTranslations } from '@/context/TranslationsContext';
import { useMediaManagerLocal } from '../hooks/useMediaManagerLocal';
import { FolderBreadcrumb } from '../molecules/FolderBreadcrumb';
import { FileGrid } from './FileGrid';
import { Input } from '@ui/input';
import { Button } from '@ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select';
import { LayoutGrid, List, Search, X, RefreshCw } from 'lucide-react';
import type { FileTypeFilter, ViewMode } from '../types';
import { getAvailableFilters } from '../lib/file-utils';

interface MediaBrowserPickerProps {
  rootFolderId: string;
  rootFolderName?: string;
  onFileSelect: (file: DriveFile) => void;
}

/**
 * MediaBrowserPicker - Organism
 *
 * Simplified variant of MediaBrowser for use inside modals/pickers.
 * Uses local state navigation (useMediaManagerLocal) instead of URL params.
 * No drag-and-drop, no upload, no create folder, no context menus.
 * Defaults to showing only images.
 */
export function MediaBrowserPicker({
  rootFolderId,
  rootFolderName,
  onFileSelect,
}: MediaBrowserPickerProps) {
  const t = useTranslations('media');
  const {
    files,
    displayFiles,
    loading,
    error,
    folderStack,
    viewMode,
    setViewMode,
    typeFilter,
    setTypeFilter,
    navigateToFolder,
    navigateBack,
    navigateRoot,
    refresh,
  } = useMediaManagerLocal(rootFolderId);

  const [localSearch, setLocalSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Filter displayed files by local search query
  const filteredFiles = localSearch.trim()
    ? displayFiles.filter((f) =>
        f.name.toLowerCase().includes(localSearch.trim().toLowerCase()),
      )
    : displayFiles;

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const availableFilters = getAvailableFilters(files);

  const FILTER_OPTIONS: { value: FileTypeFilter; label: string }[] = [
    { value: 'all', label: t('filter.all') },
    { value: 'images', label: t('filter.images') },
    { value: 'folders', label: t('filter.folders') },
    { value: 'videos', label: t('filter.videos') },
    { value: 'documents', label: t('filter.documents') },
    { value: 'pdf', label: t('filter.pdf') },
  ];

  // Stub handlers for FileGrid (not used in picker mode, but required by interface)
  const noopRename = async () => {};
  const noopDelete = async () => {};

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Breadcrumb */}
      <FolderBreadcrumb
        folderStack={folderStack}
        currentFolderName={
          folderStack.length > 0 ? undefined : rootFolderName
        }
        onNavigateBack={navigateBack}
        onNavigateRoot={navigateRoot}
      />

      {/* Simplified toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[140px]">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={t('toolbar.searchPlaceholder')}
            className="h-8 pl-8 pr-8 text-sm"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => setLocalSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as FileTypeFilter)}
        >
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                disabled={
                  opt.value !== 'all' && !availableFilters.has(opt.value)
                }
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="nude"
          size="sm"
          iconOnly
          iconLeft={<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />}
          onClick={refresh}
          disabled={loading}
        />

        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'active' : 'nude'}
            size="sm"
            iconOnly
            iconLeft={<LayoutGrid className="h-4 w-4" />}
            className="rounded-r-none"
            onClick={() => setViewMode('grid')}
          />
          <Button
            variant={viewMode === 'list' ? 'active' : 'nude'}
            size="sm"
            iconOnly
            iconLeft={<List className="h-4 w-4" />}
            className="rounded-l-none"
            onClick={() => setViewMode('list')}
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="text-sm text-destructive text-center py-4">
          {error}
        </div>
      )}

      {/* File grid */}
      <div className="flex-1 overflow-auto">
        <FileGrid
          files={filteredFiles}
          viewMode={viewMode}
          loading={loading}
          onFolderClick={navigateToFolder}
          onRename={noopRename}
          onDelete={noopDelete}
          selectable
          onFileSelect={onFileSelect}
        />
      </div>
    </div>
  );
}
