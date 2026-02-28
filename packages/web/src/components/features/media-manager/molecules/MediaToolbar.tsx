'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from '@/context/TranslationsContext';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog';
import {
  FolderPlus,
  RefreshCw,
  LayoutGrid,
  List,
  ExternalLink,
  Upload,
  Search,
  X,
} from 'lucide-react';
import type { DriveFile } from '@alkitu/shared';
import type { ViewMode, SortConfig, FileTypeFilter } from '../types';
import { getAvailableFilters } from '../lib/file-utils';

/** Composite value encoding field + direction for the sort Select */
type SortOption = `${SortConfig['field']}_${SortConfig['direction']}`;

interface MediaToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateFolder: (name: string) => Promise<void>;
  onRefresh: () => void;
  currentFolderId: string;
  loading: boolean;
  onToggleUpload: () => void;
  showUpload: boolean;
  sortConfig: SortConfig;
  onSortChange: (config: SortConfig) => void;
  typeFilter: FileTypeFilter;
  onTypeFilterChange: (filter: FileTypeFilter) => void;
  /** Raw (unfiltered) files — used to determine which filter options are available */
  files: DriveFile[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

/**
 * MediaToolbar - Molecule
 *
 * Action bar with: create folder (dialog), upload toggle,
 * open in Drive, sort dropdown, filter chips, refresh, and grid/list view toggle.
 */
export function MediaToolbar({
  viewMode,
  onViewModeChange,
  onCreateFolder,
  onRefresh,
  currentFolderId,
  loading,
  onToggleUpload,
  showUpload,
  sortConfig,
  onSortChange,
  typeFilter,
  onTypeFilterChange,
  files,
  searchQuery,
  onSearchChange,
}: MediaToolbarProps) {
  const t = useTranslations('media');
  const [folderName, setFolderName] = useState('');
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external searchQuery changes (e.g. clearing from parent)
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!localSearch.trim()) {
      onSearchChange('');
      return;
    }

    if (localSearch.trim().length < 2) return;

    debounceRef.current = setTimeout(() => {
      onSearchChange(localSearch.trim());
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  const availableFilters = getAvailableFilters(files);

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'name_asc', label: t('sort.nameAZ') },
    { value: 'name_desc', label: t('sort.nameZA') },
    { value: 'modifiedTime_desc', label: t('sort.newest') },
    { value: 'modifiedTime_asc', label: t('sort.oldest') },
    { value: 'size_desc', label: t('sort.largestSize') },
    { value: 'size_asc', label: t('sort.smallestSize') },
    { value: 'type_asc', label: t('sort.byType') },
  ];

  const FILTER_OPTIONS: { value: FileTypeFilter; label: string }[] = [
    { value: 'all', label: t('filter.all') },
    { value: 'folders', label: t('filter.folders') },
    { value: 'images', label: t('filter.images') },
    { value: 'videos', label: t('filter.videos') },
    { value: 'audio', label: t('filter.audio') },
    { value: 'pdf', label: t('filter.pdf') },
    { value: 'spreadsheets', label: t('filter.spreadsheets') },
    { value: 'presentations', label: t('filter.presentations') },
    { value: 'documents', label: t('filter.documents') },
    { value: 'archives', label: t('filter.archives') },
  ];

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    setCreating(true);
    try {
      await onCreateFolder(folderName.trim());
      setFolderName('');
      setDialogOpen(false);
    } catch {
      // Toast shown by useMediaManager hook
    } finally {
      setCreating(false);
    }
  };

  const currentSortValue: SortOption = `${sortConfig.field}_${sortConfig.direction}`;

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split('_') as [
      SortConfig['field'],
      SortConfig['direction'],
    ];
    onSortChange({ field, direction });
  };

  const driveUrl = `https://drive.google.com/drive/folders/${currentFolderId}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <FolderPlus className="mr-2 h-4 w-4" />
            {t('toolbar.newFolder')}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('toolbar.createFolder')}</DialogTitle>
            <DialogDescription>
              {t('toolbar.createFolderDescription')}
            </DialogDescription>
          </DialogHeader>
          <Input
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFolder();
            }}
            placeholder={t('toolbar.folderNamePlaceholder')}
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={creating}
            >
              {t('toolbar.cancel')}
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={creating || !folderName.trim()}
            >
              {creating ? t('toolbar.creating') : t('toolbar.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        variant={showUpload ? 'default' : 'outline'}
        size="sm"
        onClick={onToggleUpload}
      >
        <Upload className="mr-2 h-4 w-4" />
        {t('toolbar.uploadFiles')}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(driveUrl, '_blank')}
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        {t('toolbar.openInDrive')}
      </Button>

      <div className="relative w-[220px]">
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
            onClick={() => {
              setLocalSearch('');
              onSearchChange('');
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex-1" />

      <Select
        value={typeFilter}
        onValueChange={(v) => onTypeFilterChange(v as FileTypeFilter)}
      >
        <SelectTrigger className="h-8 w-[140px]">
          <SelectValue placeholder={t('filter.filterType')} />
        </SelectTrigger>
        <SelectContent>
          {FILTER_OPTIONS.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              disabled={!availableFilters.has(opt.value)}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {viewMode !== 'grid' && (
        <Select value={currentSortValue} onValueChange={handleSortChange}>
          <SelectTrigger className="h-8 w-[160px]">
            <SelectValue placeholder={t('sort.sortBy')} />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Button
        variant="nude"
        size="sm"
        iconOnly
        iconLeft={<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />}
        onClick={onRefresh}
        disabled={loading}
      />

      <div className="flex items-center border rounded-md">
        <Button
          variant={viewMode === 'grid' ? 'active' : 'nude'}
          size="sm"
          iconOnly
          iconLeft={<LayoutGrid className="h-4 w-4" />}
          className="rounded-r-none"
          onClick={() => onViewModeChange('grid')}
        />
        <Button
          variant={viewMode === 'list' ? 'active' : 'nude'}
          size="sm"
          iconOnly
          iconLeft={<List className="h-4 w-4" />}
          className="rounded-l-none"
          onClick={() => onViewModeChange('list')}
        />
      </div>
    </div>
  );
}
