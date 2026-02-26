'use client';

import React from 'react';
import { useTranslations } from '@/context/TranslationsContext';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { Home } from 'lucide-react';
import type { FolderStackItem } from '../types';

interface FolderBreadcrumbProps {
  folderStack: FolderStackItem[];
  currentFolderName?: string;
  onNavigateBack: (index: number) => void;
  onNavigateRoot: () => void;
}

/**
 * FolderBreadcrumb - Molecule
 *
 * Navigation breadcrumb showing the current folder path.
 * Home > Folder1 > Folder2 > Current
 */
export function FolderBreadcrumb({
  folderStack,
  currentFolderName,
  onNavigateBack,
  onNavigateRoot,
}: FolderBreadcrumbProps) {
  const t = useTranslations('media');
  const ITEMS_TO_DISPLAY = 3;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigateRoot();
            }}
            className="flex items-center gap-1.5"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('breadcrumb.home')}</span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {folderStack.length > ITEMS_TO_DISPLAY ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-center p-1 outline-none">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">{t('breadcrumb.toggleMenu')}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {folderStack
                    .slice(0, -ITEMS_TO_DISPLAY + 1)
                    .map((item, index) => (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => onNavigateBack(index)}
                        className="cursor-pointer"
                      >
                        {item.name}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            {folderStack.slice(-ITEMS_TO_DISPLAY + 1).map((item, idx) => {
              // We need the original index to navigate back properly
              const originalIndex =
                folderStack.length - ITEMS_TO_DISPLAY + 1 + idx;
              return (
                <React.Fragment key={item.id}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateBack(originalIndex);
                      }}
                    >
                      {item.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </>
        ) : (
          folderStack.map((item, index) => (
            <React.Fragment key={item.id}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateBack(index);
                  }}
                >
                  {item.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))
        )}

        {currentFolderName && folderStack.length > 0 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentFolderName}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
