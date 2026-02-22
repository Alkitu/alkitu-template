'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/molecules-alianza/Card';
import { Logo } from '@/components/atoms-alianza/Logo';
import { Icon } from '@/components/atoms-alianza/Icon';
import { Typography } from '@/components/atoms-alianza/Typography';
import { Spinner } from '@/components/atoms-alianza/Spinner';
import { getCurrentLocalizedRoute } from '@/lib/locale';
import type { AuthCardWrapperProps } from './AuthCardWrapper.types';

/**
 * AuthCardWrapper - Atomic Design Molecule
 *
 * A specialized card wrapper for authentication forms with branding, navigation,
 * and responsive layout optimizations. Part of the Alianza Design System.
 *
 * Features:
 * - Responsive design (mobile-first)
 * - Logo/branding integration
 * - Icon support for visual context
 * - Back button with localization support
 * - Social auth placeholder section
 * - Footer area for additional links
 * - Loading state support
 * - Theme integration
 * - Accessibility features
 *
 * @example
 * ```tsx
 * <AuthCardWrapper
 *   title="Sign In"
 *   subtitle="Welcome back to Alianza"
 *   showLogo
 *   icon="lock"
 *   backButtonLabel="Back to home"
 *   backButtonHref="/"
 *   footer={
 *     <Typography variant="span" size="sm">
 *       Don't have an account? <Link href="/register">Sign up</Link>
 *     </Typography>
 *   }
 * >
 *   <LoginForm />
 * </AuthCardWrapper>
 * ```
 */
export const AuthCardWrapper = React.forwardRef<HTMLDivElement, AuthCardWrapperProps>(
  (
    {
      children,
      title,
      subtitle,
      icon,
      showLogo = false,
      logoAlt = 'Alianza Logo',
      backButtonLabel,
      backButtonHref,
      showSocial = false,
      socialDividerText = 'Or continue with',
      socialPlaceholderText = 'OAuth providers will be configured with backend',
      footer,
      isLoading = false,
      className,
      cardClassName,
      disableResponsive = false,
      'data-testid': dataTestId = 'auth-card-wrapper',
      ...props
    },
    ref,
  ) => {
    const pathname = usePathname();

    // Generate localized back button href
    const getLocalizedBackButtonHref = () => {
      if (!backButtonHref) return undefined;

      // Handle auth routes
      if (backButtonHref.startsWith('/auth/')) {
        return getCurrentLocalizedRoute(backButtonHref, pathname);
      }

      // Handle home route
      if (backButtonHref === '/') {
        const segments = pathname.split('/').filter(Boolean);
        const locale = segments[0] === 'en' ? 'en' : 'es';
        return `/${locale}`;
      }

      return backButtonHref;
    };

    const localizedBackButtonHref = getLocalizedBackButtonHref();

    // Desktop back button component
    const DesktopBackButton = () => {
      if (!backButtonLabel || !localizedBackButtonHref) return null;

      return (
        <div className="w-full max-w-[1200px] mx-auto mb-8 hidden md:block">
          <Link
            href={localizedBackButtonHref}
            className="inline-flex items-center gap-2 group text-primary hover:no-underline"
            data-testid="desktop-back-button"
          >
            <div className="flex items-center justify-center p-[2px] w-4 h-4">
              <Icon name="arrowLeft" size="sm" />
            </div>
            <Typography
              variant="span"
              size="sm"
              weight="light"
              className="group-hover:underline"
            >
              {backButtonLabel}
            </Typography>
          </Link>
        </div>
      );
    };

    // Mobile back button component
    const MobileBackButton = () => {
      if (!backButtonLabel || !localizedBackButtonHref) return null;

      return (
        <div className="flex items-center justify-center mt-2 md:hidden">
          <Link
            href={localizedBackButtonHref}
            className="inline-flex items-center gap-2 text-primary hover:no-underline group"
            data-testid="mobile-back-button"
          >
            <Icon
              name="arrowLeft"
              size="sm"
              className="group-hover:-translate-x-1 transition-transform"
            />
            <Typography variant="span" size="sm" weight="light">
              {backButtonLabel}
            </Typography>
          </Link>
        </div>
      );
    };

    // Social auth section component
    const SocialSection = () => {
      if (!showSocial) return null;

      return (
        <>
          <div className="w-full flex items-center gap-4 my-2" data-testid="social-divider">
            <div className="h-px bg-border flex-1" />
            <Typography
              variant="span"
              size="xs"
              weight="medium"
              className="tracking-widest text-muted-foreground uppercase"
            >
              {socialDividerText}
            </Typography>
            <div className="h-px bg-border flex-1" />
          </div>

          <div
            className="w-full p-4 border border-primary/30 bg-primary/5 rounded-lg flex items-center justify-center text-center"
            data-testid="social-placeholder"
          >
            <Typography variant="span" size="sm" weight="light" color="primary">
              {socialPlaceholderText}
            </Typography>
          </div>
        </>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full bg-background flex flex-col min-h-screen',
          disableResponsive ? 'p-8' : 'p-0 md:p-8',
          className,
        )}
        data-testid={dataTestId}
        {...props}
      >
        {/* Desktop Back Button (Top Left) */}
        <DesktopBackButton />

        {/* Main Content Area */}
        <div className={cn(
          'flex-1 flex items-start justify-center',
          disableResponsive ? 'pt-0' : 'pt-4 md:pt-0',
        )}>
          <Card
            variant="default"
            padding="none"
            className={cn(
              'w-full max-w-[520px] flex flex-col items-center gap-6 relative',
              disableResponsive
                ? 'bg-card rounded-2xl shadow-sm border border-border p-[42px]'
                : 'md:bg-card md:rounded-2xl md:shadow-sm md:border md:border-border p-6 md:p-[42px]',
              cardClassName,
            )}
          >
            {/* Loading Overlay */}
            {isLoading && (
              <div
                className="absolute inset-0 bg-background/80 rounded-2xl flex items-center justify-center z-10"
                data-testid="loading-overlay"
              >
                <Spinner size="lg" />
              </div>
            )}

            {/* Logo */}
            {showLogo && (
              <div className="mb-2" data-testid="auth-logo">
                <Logo alt={logoAlt} />
              </div>
            )}

            {/* Header Section */}
            <CardHeader className="flex flex-col items-center gap-2 text-center mb-2 p-0">
              {/* Icon */}
              {icon && (
                <div
                  className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2"
                  data-testid="auth-icon-container"
                >
                  <Icon name={icon} size="lg" variant="primary" />
                </div>
              )}

              {/* Title */}
              <Typography
                variant="h1"
                size="4xl"
                weight="bold"
                color="foreground"
                className="scroll-m-20 tracking-tight"
              >
                {title}
              </Typography>

              {/* Subtitle */}
              {subtitle && (
                <Typography
                  variant="p"
                  size="md"
                  weight="light"
                  color="muted"
                  data-testid="auth-subtitle"
                >
                  {subtitle}
                </Typography>
              )}
            </CardHeader>

            {/* Content Area (Form) */}
            <CardContent className="w-full p-0">
              {children}
            </CardContent>

            {/* Social Section */}
            <SocialSection />

            {/* Footer Section */}
            {footer && (
              <CardFooter
                className="w-full flex flex-col items-center justify-center gap-2 text-center p-0"
                data-testid="auth-footer"
              >
                {footer}
              </CardFooter>
            )}

            {/* Mobile Back Button (Bottom) */}
            <MobileBackButton />
          </Card>
        </div>
      </div>
    );
  },
);

AuthCardWrapper.displayName = 'AuthCardWrapper';

export default AuthCardWrapper;
