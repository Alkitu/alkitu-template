import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import React from 'react';
import type { ChipProps, ChipVariant, ChipSize } from './Chip.types';

const variantClasses: Record<ChipVariant, string> = {
  default: 'bg-secondary text-secondary-foreground',
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-muted text-muted-foreground',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  outline: 'border border-input bg-background text-foreground',
};

const sizeClasses: Record<ChipSize, string> = {
  sm: 'px-2 py-1 text-xs h-6',
  md: 'px-3 py-1.5 text-sm h-8',
  lg: 'px-4 py-2 text-base h-10',
};

const baseClasses = 'inline-flex items-center gap-1 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

export const Chip: React.FC<ChipProps> = ({
  variant = 'default',
  size = 'md',
  deletable = false,
  onDelete,
  selected = false,
  onClick,
  disabled = false,
  children,
  className,
  themeOverride,
  useSystemColors = true,
  ...props
}) => {
  const variantClass = useSystemColors ? variantClasses[variant] : '';
  const sizeClass = sizeClasses[size];
  const selectedClass = selected ? 'ring-2 ring-ring ring-offset-2' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const clickableClass = onClick && !disabled ? 'cursor-pointer hover:opacity-80' : '';

  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && !disabled) {
      onDelete();
    }
  };

  return (
    <span
      className={cn(
        baseClasses,
        variantClass,
        sizeClass,
        selectedClass,
        disabledClass,
        clickableClass,
        className
      )}
      style={themeOverride}
      onClick={handleClick}
      {...props}
    >
      {children}
      {deletable && (
        <button
          type="button"
          className="ml-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
          onClick={handleDelete}
          disabled={disabled}
          aria-label="Remove chip"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

export default Chip;