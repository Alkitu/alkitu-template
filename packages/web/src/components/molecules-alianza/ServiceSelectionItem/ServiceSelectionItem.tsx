import React from 'react';
import { Heart } from 'lucide-react';
import { ServiceIcon } from '@/components/atoms-alianza/ServiceIcon';
import { getDynamicBackgroundColor } from '@/lib/utils/color';
import type { ServiceSelectionItemProps } from './ServiceSelectionItem.types';

export const ServiceSelectionItem: React.FC<ServiceSelectionItemProps> = ({
  service,
  isSelected,
  onSelect,
  disabled = false,
  className = '',
  isFavorite = false,
  onToggleFavorite,
}) => {
  const isImageUrl =
    service.thumbnail &&
    (service.thumbnail.startsWith('http') || service.thumbnail.startsWith('/'));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) onSelect(service.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !disabled && onSelect(service.id)}
      onKeyDown={handleKeyDown}
      className={`
        relative flex w-full flex-col rounded-xl border transition-all overflow-hidden
        ${isSelected
          ? 'ring-2 ring-primary border-primary'
          : 'border-border hover:border-primary/30'
        }
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Title bar + Heart */}
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <p className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
          {service.name}
        </p>
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(service.id);
            }}
            className={`shrink-0 rounded-full p-1 transition-colors ${
              isFavorite
                ? 'text-red-500'
                : 'text-muted-foreground hover:text-red-400'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
            />
          </button>
        )}
      </div>

      {/* Hero image / icon fallback */}
      <div className="px-3 pb-3">
        {isImageUrl ? (
          <div className="relative h-40 w-full overflow-hidden rounded-lg bg-muted">
            <img
              src={service.thumbnail!}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-sm"
            />
            <img
              src={service.thumbnail!}
              alt={service.name}
              className="relative z-10 mx-auto h-full rounded-2xl object-contain p-2"
            />
          </div>
        ) : (
          <div
            className="flex h-40 w-full items-center justify-center rounded-lg"
            style={{ backgroundColor: getDynamicBackgroundColor(service.iconColor || '#000000') }}
          >
            <ServiceIcon
              category={service.categoryName}
              thumbnail={service.thumbnail}
              className="h-16 w-16 text-primary-foreground"
              color={service.iconColor}
            />
          </div>
        )}
      </div>
    </div>
  );
};
