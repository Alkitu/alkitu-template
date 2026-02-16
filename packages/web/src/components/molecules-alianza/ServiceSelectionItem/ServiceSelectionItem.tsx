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
        flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all
        ${isSelected
          ? 'border-primary/50 bg-primary/5'
          : 'border-border hover:border-primary/30 hover:bg-accent/50'
        }
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Icon */}
      <div 
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors"
        style={{ backgroundColor: getDynamicBackgroundColor(service.iconColor || '#000000') }}
      >
        <ServiceIcon
          category={service.categoryName}
          thumbnail={service.thumbnail}
          className="h-5 w-5"
          color={service.iconColor}
        />
      </div>

      {/* Name + Description */}
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground">{service.name}</p>
        {service.description && (
          <p className="truncate text-sm text-muted-foreground">
            {service.description}
          </p>
        )}
      </div>

      {/* Radio indicator */}
      <div
        className={`
          flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors
          ${isSelected ? 'border-primary' : 'border-muted-foreground/40'}
        `}
      >
        {isSelected && (
          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
        )}
      </div>
    </button>
  );
};
