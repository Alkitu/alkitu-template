import type { DriveFile } from '@alkitu/shared';

/**
 * View mode for file display (grid or list layout)
 */
export type ViewMode = 'grid' | 'list';

/**
 * Represents a folder in the navigation stack (breadcrumb)
 */
export interface FolderStackItem {
  id: string;
  name: string;
}

/**
 * Response shape from the BFF folder contents endpoint
 */
export interface FolderContentsResponse {
  folder: { id: string; name: string };
  items: DriveFile[];
  totalCount: number;
  folderCount: number;
  fileCount: number;
}

/**
 * Sortable fields for file listing
 */
export type SortField = 'name' | 'modifiedTime' | 'size' | 'type';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Combined sort configuration
 */
export interface SortConfig {
  field: SortField;
  direction: SortDirection;
  foldersOnTop?: boolean;
}

/**
 * File type filter for showing subsets of files
 */
export type FileTypeFilter =
  | 'all'
  | 'folders'
  | 'images'
  | 'videos'
  | 'audio'
  | 'pdf'
  | 'spreadsheets'
  | 'presentations'
  | 'documents'
  | 'archives';

/**
 * Common action handlers used across Media Manager components
 */
export interface FileActionHandlers {
  onRename: (fileId: string, newName: string) => Promise<void>;
  onDelete: (fileId: string) => Promise<void>;
}

/**
 * Props for components that display a single file/folder item
 */
export interface FileItemBaseProps extends FileActionHandlers {
  file: DriveFile;
  viewMode: ViewMode;
  onFolderClick: (folderId: string, folderName: string) => void;
}
