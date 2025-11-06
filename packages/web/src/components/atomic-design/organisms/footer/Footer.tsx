'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Typography } from '../../atoms';
import type { FooterProps } from './Footer.types';

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  (
    {
      brand,
      sections,
      copyright,
      className = '',
      themeOverride,
      useSystemColors = true,
    },
    ref,
  ) => {
    // Apply theme override styles
    const styles = themeOverride
      ? Object.entries(themeOverride).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [`--${key}`]: value,
          }),
          {} as Record<string, string>,
        )
      : undefined;

    return (
      <footer
        ref={ref}
        className={cn(
          'border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          className,
        )}
        style={styles}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {brand.logo || (
                  <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                    <Typography
                      variant="span"
                      weight="bold"
                      className="text-primary-foreground text-sm"
                    >
                      {brand.name.charAt(0)}
                    </Typography>
                  </div>
                )}
                <Typography variant="h3" weight="bold">
                  {brand.name}
                </Typography>
              </div>
              <Typography variant="p" color="muted">
                {brand.description}
              </Typography>
            </div>

            {/* Dynamic Sections */}
            {sections.map((section, index) => (
              <div key={index}>
                <Typography variant="h4" weight="semibold" className="mb-4">
                  {section.title}
                </Typography>
                <div className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.text}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="border-t mt-8 pt-8 text-center">
            <Typography variant="caption" color="muted">
              {copyright}
            </Typography>
          </div>
        </div>
      </footer>
    );
  },
);

Footer.displayName = 'Footer';

export default Footer;
