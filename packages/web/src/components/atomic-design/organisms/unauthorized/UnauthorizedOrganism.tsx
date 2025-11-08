'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Typography } from '@/components/atomic-design/atoms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { UnauthorizedOrganismProps } from './UnauthorizedOrganism.types';

/**
 * UnauthorizedOrganism
 *
 * A specialized organism for displaying unauthorized access pages following
 * Atomic Design principles. Shows a clear error state with navigation options.
 *
 * @example
 * ```tsx
 * import { UnauthorizedOrganism } from '@/components/atomic-design/organisms';
 * import { useTranslations } from '@/context/TranslationContext';
 *
 * export default function UnauthorizedPage() {
 *   const t = useTranslations();
 *
 *   return (
 *     <UnauthorizedOrganism
 *       title={t('auth.unauthorized.title')}
 *       description={t('auth.unauthorized.description')}
 *       message={t('auth.unauthorized.message')}
 *       dashboardButtonText={t('auth.unauthorized.goToDashboard')}
 *       loginButtonText={t('auth.unauthorized.goToLogin')}
 *     />
 *   );
 * }
 * ```
 */
export const UnauthorizedOrganism = React.forwardRef<HTMLDivElement, UnauthorizedOrganismProps>(
  (
    {
      title,
      description,
      message,
      dashboardButtonText,
      dashboardButtonHref = '/dashboard',
      loginButtonText,
      loginButtonHref = '/auth/login',
      className,
      themeOverride,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4',
          className,
        )}
        style={themeOverride}
        {...props}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Typography
                variant="p"
                className="text-sm text-gray-500 dark:text-gray-400 mb-4"
              >
                {message}
              </Typography>
              <div className="flex flex-col gap-2">
                <Button asChild>
                  <Link href={dashboardButtonHref}>{dashboardButtonText}</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={loginButtonHref}>{loginButtonText}</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);

UnauthorizedOrganism.displayName = 'UnauthorizedOrganism';

export default UnauthorizedOrganism;
