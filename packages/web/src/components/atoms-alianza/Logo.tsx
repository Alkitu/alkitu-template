'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useCompanyTheme } from '@/context/GlobalThemeProvider';
import { getDefaultBrandAssets } from '@/components/features/theme-editor-3.0/theme-editor/editor/brand/default-logos';
import { getCurrentModeVariants } from '@/components/features/theme-editor-3.0/theme-editor/editor/brand/utils';
import type { LogoProps } from './Logo.types';

const DEFAULT_ASSETS = getDefaultBrandAssets();

export function Logo({ className, alt = "Alkitu Logo", variant = 'horizontal' }: LogoProps) {
  const { theme } = useCompanyTheme();

  const logo = theme?.brand?.logos?.[variant] ?? DEFAULT_ASSETS[variant];

  const lightSvg = useMemo(() => getCurrentModeVariants(logo, false).original, [logo]);
  const darkSvg = useMemo(() => getCurrentModeVariants(logo, true).original, [logo]);

  return (
    <div
      className={cn('relative shrink-0 w-[131px] h-[43px]', className)}
      data-name="Logo"
      role="img"
      aria-label={alt}
    >
      <div
        className="absolute inset-0 size-full dark:hidden [&>svg]:w-full [&>svg]:h-full"
        dangerouslySetInnerHTML={{ __html: lightSvg }}
      />
      <div
        className="absolute inset-0 size-full hidden dark:block [&>svg]:w-full [&>svg]:h-full"
        dangerouslySetInnerHTML={{ __html: darkSvg }}
      />
    </div>
  );
}
