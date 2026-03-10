import React from 'react';
import { ServiceIcon } from '@/components/atoms-alianza/ServiceIcon';
import { getDynamicBackgroundColor } from '@/lib/utils/color';
import type { ServiceSelectionItemProps } from './ServiceSelectionItem.types';

export const ServiceSelectionItem: React.FC<ServiceSelectionItemProps> = ({
  service,
  isSelected,
  onSelect,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(service.id)}
      disabled={disabled}
      className={`
        relative flex w-full flex-col items-center justify-center gap-4 rounded-xl border p-6 text-center transition-all
        ${isSelected
          ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20'
          : 'border-border hover:border-primary/30 hover:bg-accent/50'
        }
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Radio indicator */}
      <div
        className={`
          absolute right-4 top-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors
          ${isSelected ? 'border-primary' : 'border-muted-foreground/40'}
        `}
      >
        {isSelected && (
          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
        )}
      </div>

      {/* Icon */}
      <div
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full transition-colors overflow-hidden"
        style={{ backgroundColor: getDynamicBackgroundColor(service.iconColor || '#000000') }}
      >
        <ServiceIcon
          category={service.categoryName}
          thumbnail={service.thumbnail}
          className="h-10 w-10 text-primary-foreground"
          color={service.iconColor}
        />
      </div>

      {/* Name + Description */}
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-foreground">{service.name}</p>
        {service.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {service.description}
          </p>
        )}
      </div>
    </button>
  );
};
