'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { getCurrentLocalizedRoute } from '@/lib/locale';

interface AuthCardWrapperProps {
  children: ReactNode;
  headerLabel: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  showSocial?: boolean;
  socialDividerText?: string;
  socialPlaceholderText?: string;
}

export const AuthCardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  socialDividerText = 'Or continue with',
  socialPlaceholderText = 'OAuth providers will be configured with backend',
}: AuthCardWrapperProps) => {
  const pathname = usePathname();

  // Generate localized back button href if it's an auth route
  const getLocalizedBackButtonHref = () => {
    if (!backButtonHref) return undefined;

    // If it's a hardcoded auth route, localize it
    if (backButtonHref.startsWith('/auth/')) {
      return getCurrentLocalizedRoute(backButtonHref, pathname);
    }

    // For home route '/', we want to redirect to current locale's home
    if (backButtonHref === '/') {
      const segments = pathname.split('/').filter(Boolean);
      const locale = segments[0];
      if (locale === 'es' || locale === 'en') {
        return `/${locale}`;
      }
      return '/es'; // default to Spanish
    }

    // Return as-is for other routes
    return backButtonHref;
  };

  const localizedBackButtonHref = getLocalizedBackButtonHref();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">{headerLabel}</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {children}
          {showSocial && (
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {socialDividerText}
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>
                {socialPlaceholderText}
              </Button>
            </div>
          )}
        </CardContent>
        {backButtonLabel && localizedBackButtonHref && (
          <CardFooter>
            <Button variant="link" className="w-full" asChild>
              <Link href={localizedBackButtonHref}>{backButtonLabel}</Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
