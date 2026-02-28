'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/atoms-alianza/Icon';
import { Typography } from '@/components/atoms-alianza/Typography';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/primitives/ui/card';
import type { FeatureGridProps } from './FeatureGrid.types';

export const FeatureGrid = React.forwardRef<HTMLElement, FeatureGridProps>(
  (
    {
      title,
      subtitle,
      features,
      columns = { mobile: 1, tablet: 2, desktop: 3 },
      gap = 'lg',
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

    // Gap classes
    const gapClasses = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
    };

    // Column classes
    const columnClasses = cn(
      'grid',
      columns.mobile === 2 ? 'grid-cols-2' : 'grid-cols-1',
      columns.tablet === 2 && 'md:grid-cols-2',
      columns.tablet === 3 && 'md:grid-cols-3',
      columns.desktop === 2 && 'lg:grid-cols-2',
      columns.desktop === 3 && 'lg:grid-cols-3',
      columns.desktop === 4 && 'lg:grid-cols-4',
      gapClasses[gap],
    );

    // Render a single feature card
    const renderFeature = (feature: (typeof features)[0], index: number) => {
      const card = (
        <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg h-full">
          <CardHeader>
            <Icon
              name={feature.icon}
              size="lg"
              variant="primary"
              className="mb-4"
            />
            <CardTitle>{feature.title}</CardTitle>
            <CardDescription>{feature.description}</CardDescription>
          </CardHeader>
        </Card>
      );

      if (feature.href) {
        return (
          <Link key={index} href={feature.href} className="block h-full">
            {card}
          </Link>
        );
      }

      return (
        <div key={index} className="h-full">
          {card}
        </div>
      );
    };

    return (
      <section
        ref={ref}
        className={cn('py-16 sm:py-24 bg-secondary/10', className)}
        style={styles}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          {(title || subtitle) && (
            <div className="text-center mb-12 lg:mb-16">
              {title && (
                <Typography variant="h2" weight="bold" className="mb-4">
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography
                  variant="lead"
                  color="muted"
                  className="max-w-3xl mx-auto"
                >
                  {subtitle}
                </Typography>
              )}
            </div>
          )}

          {/* Features Grid */}
          <div className={columnClasses}>
            {features.map((feature, index) => renderFeature(feature, index))}
          </div>
        </div>
      </section>
    );
  },
);

FeatureGrid.displayName = 'FeatureGrid';

export default FeatureGrid;
