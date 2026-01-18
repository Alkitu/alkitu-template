'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@/components/atoms/icons/Icon';
import { Button } from '@/components/primitives/ui/button';
import { getCurrentLocalizedRoute } from '@/lib/locale';
import type { AuthCardWrapperProps } from './AuthCardWrapper.types';

export const AuthCardWrapper = React.forwardRef<
  HTMLDivElement,
  AuthCardWrapperProps
>(
  (
    {
      children,
      headerLabel,
      headerIcon,
      headerSubtitle,
      backButtonLabel,
      backButtonHref,
      showSocial,
      socialDividerText = 'Or continue with',
      socialPlaceholderText = 'OAuth providers will be configured with backend',
    },
    ref,
  ) => {
    const pathname = usePathname();

    // Generate localized back button href
    const getLocalizedBackButtonHref = () => {
      if (!backButtonHref) return undefined;
      if (backButtonHref.startsWith('/auth/')) {
        return getCurrentLocalizedRoute(backButtonHref, pathname);
      }
      if (backButtonHref === '/') {
        const segments = pathname.split('/').filter(Boolean);
        const locale = segments[0] === 'en' ? 'en' : 'es';
        return `/${locale}`;
      }
      return backButtonHref;
    };

    const localizedBackButtonHref = getLocalizedBackButtonHref();

    return (
      <div
        ref={ref}
        className="w-full bg-background flex flex-col min-h-screen p-0 md:p-8"
      >
        {/* Desktop Back Button (Top Left) */}
        {backButtonLabel && localizedBackButtonHref && (
          <div className="w-full max-w-[1200px] mx-auto mb-8 hidden md:block">
            <Link
              href={localizedBackButtonHref}
              className="inline-flex items-center gap-2 group text-primary hover:no-underline"
            >
              <div className="flex items-center justify-center p-[2px] w-4 h-4">
                <Icon name="arrowLeft" size="lg" />
              </div>
              <span className="text-body-sm font-light group-hover:underline">
                {backButtonLabel}
              </span>
            </Link>
          </div>
        )}

        <div className="flex-1 flex items-start justify-center pt-4 md:pt-0">
          <div className="w-full max-w-[520px] md:bg-card md:rounded-[20px] md:shadow-sm md:border md:border-border p-6 md:p-[42px] flex flex-col items-center gap-[24px] relative">
            
            {/* Header */}
            <div className="flex flex-col items-center gap-2 text-center mb-2">
              {headerIcon && (
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Icon name={headerIcon as any} size="lg" className="text-primary" />
                </div>
              )}
              <h1 className="text-heading-xl font-bold text-foreground">
                {headerLabel}
              </h1>
              {headerSubtitle && (
                <p className="text-body-md text-muted-foreground font-light">
                  {headerSubtitle}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="w-full">
              {children}
            </div>

            {/* Social Section */}
            {showSocial && (
              <>
                <div className="w-full flex items-center gap-4 my-2">
                  <div className="h-px bg-border flex-1" />
                  <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-medium">
                    {socialDividerText}
                  </span>
                  <div className="h-px bg-border flex-1" />
                </div>

                <div className="w-full p-4 border border-primary/30 bg-primary/5 rounded-lg flex items-center justify-center text-center">
                  <span className="text-primary text-sm font-light">
                    {socialPlaceholderText}
                  </span>
                </div>
              </>
            )}

            {/* Mobile Back Button (Bottom) */}
            {backButtonLabel && localizedBackButtonHref && (
              <div className="flex items-center justify-center mt-2 md:hidden">
                <Link
                  href={localizedBackButtonHref}
                  className="inline-flex items-center gap-2 text-primary hover:no-underline group"
                >
                  <Icon name="arrowLeft" size="sm" className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-light">
                    {backButtonLabel}
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

AuthCardWrapper.displayName = 'AuthCardWrapper';

export default AuthCardWrapper;
