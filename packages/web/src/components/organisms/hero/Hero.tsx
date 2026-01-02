'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge, Button, Typography, Icon } from '../../atoms';
import type { HeroProps } from './Hero.types';

export const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      badge,
      title,
      titleHighlight,
      subtitle,
      primaryCTA,
      secondaryCTA,
      features = [],
      image,
      imageAlt,
      imagePlaceholder,
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

    // Render CTA button
    const renderCTA = (cta: typeof primaryCTA) => {
      if (!cta) return null;

      const buttonContent = <Button variant={cta.variant || 'primary'} size="lg" className="text-lg px-8 py-6">{cta.text}</Button>;

      if (cta.href) {
        return (
          <Link href={cta.href} className="inline-block">
            {buttonContent}
          </Link>
        );
      }

      return (
        <div onClick={cta.onClick} className="inline-block cursor-pointer">
          {buttonContent}
        </div>
      );
    };

    // Render image/placeholder
    const renderImage = () => {
      if (typeof image === 'string') {
        return (
          <img
            src={image}
            alt={imageAlt || ''}
            className="w-full h-full object-cover rounded-lg"
          />
        );
      }

      if (image) {
        return image;
      }

      if (imagePlaceholder) {
        return imagePlaceholder;
      }

      // Default placeholder
      return (
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="h-16 w-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="code" size="lg" variant="primary" />
            </div>
            <Typography variant="p" color="muted">
              Product Screenshot
            </Typography>
            <Typography variant="caption" color="muted" className="mt-1">
              Your amazing product here
            </Typography>
          </div>
        </div>
      );
    };

    return (
      <section
        ref={ref}
        className={cn('py-16 sm:py-24 lg:py-32', className)}
        style={styles}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column: Content */}
            <div className="space-y-6">
              {badge && (
                <Badge variant="default" size="md">
                  {badge}
                </Badge>
              )}

              <div className="space-y-4">
                <Typography variant="h1" weight="bold" className="tracking-tight">
                  {title}
                  {titleHighlight && (
                    <>
                      {' '}
                      <span className="text-primary">{titleHighlight}</span>
                    </>
                  )}
                </Typography>

                <Typography variant="lead" color="muted" size="xl">
                  {subtitle}
                </Typography>
              </div>

              {/* CTAs */}
              {(primaryCTA || secondaryCTA) && (
                <div className="flex flex-col sm:flex-row gap-4">
                  {primaryCTA && renderCTA(primaryCTA)}
                  {secondaryCTA && renderCTA(secondaryCTA)}
                </div>
              )}

              {/* Features List */}
              {features.length > 0 && (
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Icon
                        name={feature.icon || 'checkCircle'}
                        size="sm"
                        className="text-green-500"
                      />
                      <Typography variant="span" size="sm" color="muted">
                        {feature.text}
                      </Typography>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Image */}
            <div className="relative">{renderImage()}</div>
          </div>
        </div>
      </section>
    );
  },
);

Hero.displayName = 'Hero';

export default Hero;
