'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/atoms-alianza/Badge';
import { Icon } from '@/components/atoms-alianza/Icon';
import { Typography } from '@/components/atoms-alianza/Typography';
import { Button } from '@/components/molecules-alianza/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/primitives/Card';
import type { PricingCardProps } from './PricingCard.types';

export const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      badge,
      title,
      price,
      originalPrice,
      discount,
      description,
      features,
      ctaText,
      ctaHref,
      ctaOnClick,
      guarantee,
      featuresColumns = 2,
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
    const renderCTA = () => {
      const buttonContent = (
        <Button size="lg" className="w-full text-lg py-6">
          {ctaText}
        </Button>
      );

      if (ctaHref) {
        return <Link href={ctaHref}>{buttonContent}</Link>;
      }

      return <div onClick={ctaOnClick}>{buttonContent}</div>;
    };

    return (
      <section
        ref={ref}
        className={cn('py-16 sm:py-24', className)}
        style={styles}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Section Header */}
          <Card className="relative border-2 border-primary">
            {/* Badge at top */}
            {badge && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge variant="default" className="px-4 py-1">
                  {badge}
                </Badge>
              </div>
            )}

            {/* Card Header */}
            <CardHeader className="text-center pb-8 pt-8">
              <CardTitle className="text-2xl">{title}</CardTitle>

              {/* Pricing Display */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-4xl font-bold">{price}</span>
                {(originalPrice || discount) && (
                  <div className="text-left">
                    {originalPrice && (
                      <Typography
                        variant="caption"
                        color="muted"
                        className="line-through"
                      >
                        {originalPrice}
                      </Typography>
                    )}
                    {discount && (
                      <Typography
                        variant="caption"
                        className="text-green-600 font-medium"
                      >
                        {discount}
                      </Typography>
                    )}
                  </div>
                )}
              </div>

              <CardDescription className="text-lg mt-2">
                {description}
              </CardDescription>
            </CardHeader>

            {/* Card Content */}
            <CardContent className="space-y-4">
              {/* Features List */}
              <div
                className={cn(
                  'grid gap-4',
                  featuresColumns === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1',
                )}
              >
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Icon
                      name="checkCircle"
                      size="sm"
                      className="text-green-500 flex-shrink-0"
                    />
                    <Typography variant="span">{feature}</Typography>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-6">
                {renderCTA()}
                {guarantee && (
                  <Typography
                    variant="caption"
                    color="muted"
                    className="text-center block mt-3"
                  >
                    {guarantee}
                  </Typography>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  },
);

PricingCard.displayName = 'PricingCard';

export default PricingCard;
