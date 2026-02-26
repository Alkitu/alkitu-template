'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { DriveFile } from '@alkitu/shared';
import { useTranslations } from '@/context/TranslationsContext';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
import { FilePreview } from '@/components/features/media-manager/organisms/FilePreview';
import { Skeleton } from '@ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@ui/alert';
import { Button } from '@ui/button';
import Link from 'next/link';

export default function FilePreviewPage() {
  const params = useParams<{ fileId: string; lang: string }>();
  const fileId = params.fileId;
  const lang = params.lang || 'es';
  const t = useTranslations('media');

  const [file, setFile] = useState<DriveFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFile() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/drive/files/${fileId}`);
        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? t('fileNotFound')
              : `${t('fileLoadError')} (${res.status})`,
          );
        }
        const data = await res.json();
        setFile(data.file);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : t('fileLoadError'),
        );
      } finally {
        setLoading(false);
      }
    }

    if (fileId) fetchFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- t creates a new ref each render (namespaced useTranslations), including it causes an infinite fetch loop
  }, [fileId]);

  const backHref =
    file?.parents?.[0]
      ? `/${lang}/admin/media?folder=${file.parents[0]}`
      : `/${lang}/admin/media`;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="p-6 space-y-6">
        <AdminPageHeader
          title={t('fileNotFound')}
          backHref={`/${lang}/admin/media`}
          backLabel={t('backToMedia')}
        />
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error || t('fileLoadErrorGeneric')}
          </AlertDescription>
        </Alert>
        <Button variant="outline" asChild>
          <Link href={`/${lang}/admin/media`}>{t('backToMedia')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title={file.name}
        backHref={backHref}
        backLabel={t('backToMedia')}
      />
      <FilePreview file={file} />
    </div>
  );
}
