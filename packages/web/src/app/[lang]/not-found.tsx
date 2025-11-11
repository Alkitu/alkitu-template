'use client';

import { useTranslations } from '@/context/TranslationsContext';
import { Button } from '@/components/primitives/ui/button';
import { Typography } from '@/components/atoms/typography';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6 max-w-md">
        <Typography
          variant="h1"
          className="text-6xl font-bold text-muted-foreground"
        >
          404
        </Typography>
        <Typography variant="h1" className="text-2xl font-bold">
          {t('NotFound.title')}
        </Typography>
        <Typography variant="p" className="text-muted-foreground">
          {t('NotFound.description')}
        </Typography>
        <Button asChild>
          <Link href="/">{t('Common.general.home')}</Link>
        </Button>
      </div>
    </div>
  );
}
