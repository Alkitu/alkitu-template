'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/molecules-alianza/Card';
import { Badge } from '@/components/atoms-alianza/Badge';
import { Button } from '@/components/molecules-alianza/Button';
import { Icon } from '@/components/atoms-alianza/Icon';
import { Typography } from '@/components/atoms-alianza/Typography';
import type { LocationCardProps, LocationAddress, WeeklyHours } from './LocationCard.types';

/**
 * Format address into a single line string
 */
const formatAddress = (address: LocationAddress): string => {
  const parts = [
    address.street,
    address.street2,
    address.city,
    `${address.state} ${address.zip}`,
    address.country,
  ].filter(Boolean);

  return parts.join(', ');
};

/**
 * Format address into multiple lines for display
 */
const formatAddressMultiline = (address: LocationAddress): string[] => {
  const lines: string[] = [];

  if (address.street) lines.push(address.street);
  if (address.street2) lines.push(address.street2);

  const cityStateZip = [address.city, `${address.state} ${address.zip}`]
    .filter(Boolean)
    .join(', ');
  if (cityStateZip) lines.push(cityStateZip);

  if (address.country) lines.push(address.country);

  return lines;
};

/**
 * Format phone number for display
 */
const formatPhone = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX for US numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Return as-is if not a standard US number
  return phone;
};

/**
 * Get current day's operating hours
 */
const getTodayHours = (hours?: WeeklyHours): string => {
  if (!hours) return 'Hours not available';

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  const todayHours = hours[today as keyof WeeklyHours];

  if (!todayHours) return 'Hours not available';
  if (todayHours.closed) return 'Closed today';

  return `${todayHours.open} - ${todayHours.close}`;
};

/**
 * LocationCard - Atomic Design Molecule
 *
 * A comprehensive card component for displaying location information including
 * address, contact details, operating hours, map preview, and action buttons.
 *
 * @example
 * ```tsx
 * <LocationCard
 *   location={{
 *     id: '1',
 *     name: 'Downtown Office',
 *     address: {
 *       street: '123 Main St',
 *       city: 'San Francisco',
 *       state: 'CA',
 *       zip: '94102',
 *       country: 'USA'
 *     },
 *     contact: {
 *       phone: '4155551234',
 *       email: 'downtown@example.com'
 *     },
 *     distance: 2.5,
 *     distanceUnit: 'mi'
 *   }}
 *   onGetDirections={(location) => console.log('Navigate to', location)}
 *   onToggleFavorite={(id, favorite) => console.log('Favorite', id, favorite)}
 * />
 * ```
 */
export const LocationCard = React.forwardRef<HTMLDivElement, LocationCardProps>(
  (
    {
      location,
      layout = 'default',
      clickable = false,
      onClick,
      onGetDirections,
      onCall,
      onEmail,
      onToggleFavorite,
      showMap = true,
      showDistance = true,
      showContact = true,
      showHours = true,
      showActions = true,
      showFavorite = true,
      loading = false,
      className,
      'data-testid': dataTestId,
      ...props
    },
    ref,
  ) => {
    const handleCardClick = () => {
      if (clickable && onClick) {
        onClick(location);
      }
    };

    const handleDirections = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onGetDirections) {
        onGetDirections(location);
      } else if (location.mapUrl) {
        window.open(location.mapUrl, '_blank', 'noopener,noreferrer');
      }
    };

    const handleCall = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (location.contact?.phone) {
        if (onCall) {
          onCall(location.contact.phone);
        } else {
          window.location.href = `tel:${location.contact.phone}`;
        }
      }
    };

    const handleEmail = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (location.contact?.email) {
        if (onEmail) {
          onEmail(location.contact.email);
        } else {
          window.location.href = `mailto:${location.contact.email}`;
        }
      }
    };

    const handleFavoriteToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onToggleFavorite) {
        onToggleFavorite(location.id, !location.isFavorite);
      }
    };

    const addressLines = formatAddressMultiline(location.address);
    const todayHours = getTodayHours(location.hours);
    const isCompact = layout === 'compact';
    const isDetailed = layout === 'detailed';

    return (
      <Card
        ref={ref}
        variant="bordered"
        padding={isCompact ? 'sm' : 'md'}
        className={cn(
          'transition-all duration-200',
          clickable && 'cursor-pointer hover:shadow-md hover:border-primary',
          loading && 'opacity-60 pointer-events-none',
          className,
        )}
        onClick={handleCardClick}
        data-testid={dataTestId || 'location-card'}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick();
                }
              }
            : undefined
        }
        aria-label={`Location: ${location.name}`}
        {...props}
      >
        {/* Header with name, distance, and favorite */}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Icon
                  name="mapPin"
                  size="sm"
                  variant="primary"
                  aria-hidden="true"
                />
                <Typography
                  variant="h4"
                  className="truncate font-semibold"
                  data-testid="location-name"
                >
                  {location.name}
                </Typography>
              </div>

              {showDistance && location.distance !== undefined && (
                <Badge
                  variant="secondary"
                  size="sm"
                  icon={<Icon name="navigation" size="xs" aria-hidden="true" />}
                  className="mt-1"
                  data-testid="location-distance"
                  aria-label={`Distance: ${location.distance} ${location.distanceUnit || 'mi'}`}
                >
                  {location.distance.toFixed(1)} {location.distanceUnit || 'mi'}
                </Badge>
              )}
            </div>

            {showFavorite && (
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                onClick={handleFavoriteToggle}
                aria-label={location.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                data-testid="favorite-button"
              >
                <Icon
                  name={location.isFavorite ? 'heart' : 'heart'}
                  size="md"
                  variant={location.isFavorite ? 'error' : 'default'}
                  className={location.isFavorite ? 'fill-current' : ''}
                  aria-hidden="true"
                />
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Map preview */}
        {showMap && location.mapImageUrl && !isCompact && (
          <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden mb-3">
            <img
              src={location.mapImageUrl}
              alt={`Map showing ${location.name}`}
              className="w-full h-full object-cover"
              loading="lazy"
              data-testid="location-map"
            />
          </div>
        )}

        {/* Content */}
        <CardContent className="space-y-3 py-0">
          {/* Address */}
          <div className="space-y-1" data-testid="location-address">
            <div className="flex items-start gap-2">
              <Icon
                name="home"
                size="xs"
                className="mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div className="text-sm text-foreground">
                {addressLines.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact information */}
          {showContact && (location.contact?.phone || location.contact?.email) && (
            <div className="space-y-2" data-testid="location-contact">
              {location.contact.phone && (
                <div className="flex items-center gap-2">
                  <Icon
                    name="phone"
                    size="xs"
                    aria-hidden="true"
                  />
                  <Typography
                    variant="body2"
                    className="text-foreground"
                  >
                    {formatPhone(location.contact.phone)}
                  </Typography>
                </div>
              )}

              {location.contact.email && (
                <div className="flex items-center gap-2">
                  <Icon
                    name="mail"
                    size="xs"
                    aria-hidden="true"
                  />
                  <Typography
                    variant="body2"
                    className="text-foreground truncate"
                  >
                    {location.contact.email}
                  </Typography>
                </div>
              )}
            </div>
          )}

          {/* Operating hours */}
          {showHours && isDetailed && location.hours && (
            <div className="space-y-1" data-testid="location-hours">
              <div className="flex items-center gap-2">
                <Icon
                  name="clock"
                  size="xs"
                  aria-hidden="true"
                />
                <Typography
                  variant="body2"
                  className="text-foreground"
                >
                  {todayHours}
                </Typography>
              </div>
            </div>
          )}
        </CardContent>

        {/* Actions */}
        {showActions && (
          <CardFooter className="pt-4 gap-2">
            {(onGetDirections || location.mapUrl) && (
              <Button
                variant="outline"
                size="sm"
                iconLeft={<Icon name="navigation" size="sm" aria-hidden="true" />}
                onClick={handleDirections}
                className="flex-1"
                data-testid="directions-button"
              >
                Directions
              </Button>
            )}

            {location.contact?.phone && (
              <Button
                variant="outline"
                size="sm"
                iconOnly={!isDetailed}
                iconLeft={<Icon name="phone" size="sm" aria-hidden="true" />}
                onClick={handleCall}
                className={isDetailed ? 'flex-1' : ''}
                aria-label="Call location"
                data-testid="call-button"
              >
                {isDetailed && 'Call'}
              </Button>
            )}

            {location.contact?.email && isDetailed && (
              <Button
                variant="outline"
                size="sm"
                iconLeft={<Icon name="mail" size="sm" aria-hidden="true" />}
                onClick={handleEmail}
                className="flex-1"
                data-testid="email-button"
              >
                Email
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    );
  },
);

LocationCard.displayName = 'LocationCard';

export default LocationCard;
