'use client';

import { Suspense } from 'react';
import { useTranslations } from '@/context/TranslationsContext';
import { MediaBrowser } from '@/components/features/media-manager';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
import { FolderOpen } from 'lucide-react';
import { Skeleton } from '@ui/skeleton';

const ROOT_FOLDER_ID = process.env.NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID || '';

function MediaBrowserSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function MediaManagerPage() {
  const t = useTranslations('media');

  if (!ROOT_FOLDER_ID) {
    return (
      <div className="p-6 space-y-6">
        <AdminPageHeader
          title={t('title')}
          description={t('description')}
          backHref="/admin/settings"
          backLabel={t('backToSettings')}
        />
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-2">
            {t('notConfigured')}
          </p>
          <p className="text-sm">
            {t('notConfiguredDescription')}{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID
            </code>{' '}
            {t('notConfiguredOrGoTo')}{' '}
            <a
              href="/admin/settings/drive"
              className="underline text-primary"
            >
              {t('driveSettings')}
            </a>{' '}
            {t('notConfiguredSetRoot')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title={t('title')}
        description={t('description')}
      />
      <Suspense fallback={<MediaBrowserSkeleton />}>
        <MediaBrowser rootFolderId={ROOT_FOLDER_ID} rootFolderName={t('breadcrumb.home')} />
      </Suspense>
    </div>
  );
}
