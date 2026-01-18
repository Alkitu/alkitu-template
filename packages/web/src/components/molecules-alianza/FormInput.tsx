import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../atoms-alianza/Icon';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export function FormInput({ label, icon, className, ...props }: FormInputProps) {
  return (
    <div className={cn("flex flex-col gap-[3px] items-start w-full", className)}>
      <label className="body-sm text-base-foreground-b w-full">
        {label}
      </label>
      <div className="relative w-full">
        <div className="bg-muted-background-m h-[var(--input-height)] rounded-[var(--input-radius)] flex items-center px-[12px] gap-[5px] border border-transparent focus-within:border-primary-1 transition-colors w-full">
          {icon && (
            <div className="shrink-0 flex items-center justify-center size-[16px] text-muted-foreground-m">
              {icon}
            </div>
          )}
          <input 
            className="bg-transparent border-none outline-none body-sm text-muted-foreground-m placeholder:text-muted-foreground-m w-full h-full"
            {...props}
          />
        </div>
        {/* Border overlay if needed for specific style, but border on div works */}
        <div className="absolute inset-0 rounded-[var(--input-radius)] border border-input pointer-events-none" />
      </div>
    </div>
  );
}
