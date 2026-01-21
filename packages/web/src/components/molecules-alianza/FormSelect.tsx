import React from 'react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/Select';

interface FormSelectProps {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export function FormSelect({ label, icon, value, onValueChange, options, placeholder, disabled, className, error }: FormSelectProps) {
  return (
    <div className={cn("flex flex-col gap-2 items-start w-full", className)}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={cn(
          "w-full",
          error && "border-destructive focus:ring-destructive"
        )}>
          <div className="flex items-center gap-2 w-full text-left">
            {icon && (
              <span className="shrink-0 flex items-center justify-center text-muted-foreground [&>svg]:size-4">
                {icon}
              </span>
            )}
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
}