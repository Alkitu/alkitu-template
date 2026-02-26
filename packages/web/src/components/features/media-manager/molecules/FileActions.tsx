'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { Button } from '@ui/button';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  Download,
} from 'lucide-react';
import { useTranslations } from '@/context/TranslationsContext';

interface FileActionsProps {
  webViewLink?: string;
  downloadUrl?: string;
  onRenameClick: () => void;
  onDeleteClick: () => void;
}

/**
 * FileActions - Molecule
 *
 * Dropdown menu with contextual actions for a file/folder:
 * open in Drive, download, rename, delete.
 */
export function FileActions({
  webViewLink,
  downloadUrl,
  onRenameClick,
  onDeleteClick,
}: FileActionsProps) {
  const t = useTranslations('media');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">{t('fileActions.actions')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {webViewLink && (
          <DropdownMenuItem onClick={() => window.open(webViewLink, '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            {t('fileActions.openInDrive')}
          </DropdownMenuItem>
        )}
        {downloadUrl && (
          <DropdownMenuItem onClick={() => window.open(downloadUrl, '_blank')}>
            <Download className="mr-2 h-4 w-4" />
            {t('fileActions.download')}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onRenameClick}>
          <Pencil className="mr-2 h-4 w-4" />
          {t('fileActions.rename')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDeleteClick}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t('fileActions.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
