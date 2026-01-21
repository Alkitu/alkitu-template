import React from 'react';
import { cn } from '@/lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  error?: string;
}

export function FormInput({ label, icon, iconRight, error, className, ...props }: FormInputProps) {
  return (
    <div className={cn("flex flex-col gap-2 items-start w-full", className)}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
        {label}
      </label>
      <div className={cn(
        "flex h-10 w-full rounded-md border bg-background px-3 items-center gap-2 ring-offset-background transition-colors relative",
        error ? "border-destructive focus-within:ring-destructive" : "border-input focus-within:ring-primary",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2",
        props.disabled && "cursor-not-allowed opacity-50 bg-muted"
      )}>
        {icon && (
          <div className="shrink-0 flex items-center justify-center text-muted-foreground [&>svg]:size-4">
            {icon}
          </div>
        )}
        <input 
          className="flex-1 w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed"
          {...props}
        />
        {iconRight && (
          <div className="shrink-0 flex items-center justify-center text-muted-foreground">
            {iconRight}
          </div>
        )}
      </div>
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
}
