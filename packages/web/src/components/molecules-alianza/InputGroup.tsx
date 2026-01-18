import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '../primitives/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../primitives/ui/select';
import TextareaAutosize from 'react-textarea-autosize';

interface InputGroupProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  message?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onIconRightClick?: () => void;
  variant?: 'default' | 'error' | 'success';
  as?: 'input' | 'textarea' | 'select';
  selectOptions?: { label: string; value: string; selected?: boolean }[]; // For select
}

export function InputGroup({
  label,
  message,
  iconLeft,
  iconRight,
  onIconRightClick,
  variant = 'default',
  as = 'input',
  className,
  selectOptions,
  disabled,
  ...props
}: InputGroupProps) {
  
  const borderClass = React.useMemo(() => {
    switch (variant) {
      case 'error': return 'border-destructive focus-visible:ring-destructive/20';
      case 'success': return 'border-success focus-visible:ring-success/20';
      default: return 'border-input';
    }
  }, [variant]);

  return (
    <div className={cn("flex flex-col gap-[5px] w-full min-w-[200px]", className)}>
      {label && (
        <label className="text-body-sm font-light text-foreground">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Render based on 'as' prop */}
        {as === 'input' && (
          <>
            {iconLeft && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                {iconLeft}
              </div>
            )}
            <Input
              className={cn(
                "h-input py-[10px] text-body-sm font-light rounded-input", 
                iconLeft && "pl-[36px]",
                iconRight && "pr-[36px]",
                borderClass,
                "transition-colors",
                disabled && "bg-muted opacity-100 cursor-not-allowed", 
                !disabled && "bg-muted", 
                "placeholder:text-muted-foreground"
              )}
              disabled={disabled}
              {...props}
            />
            {iconRight && (
              <div 
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center",
                  onIconRightClick ? "cursor-pointer pointer-events-auto" : "pointer-events-none"
                )}
                onClick={onIconRightClick}
              >
                {iconRight}
              </div>
            )}
          </>
        )}

        {as === 'textarea' && (
          <div className="relative">
             <TextareaAutosize
                minRows={3}
                className={cn(
                  "flex w-full border bg-muted px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  "resize-y text-body-sm font-light rounded-input",
                  borderClass,
                  disabled && "opacity-50"
                )}
                disabled={disabled}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange as any}
             />
          </div>
        )}

        {as === 'select' && (
          <Select disabled={disabled}>
            <SelectTrigger className={cn(
              "h-input bg-muted border-input text-body-sm font-light rounded-input",
              borderClass
            )}>
              <SelectValue placeholder={props.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent className="bg-card-background-c">
              {selectOptions?.map((opt) => (
                <SelectItem 
                  key={opt.value} 
                  value={opt.value}
                  className={cn(
                    "text-body-sm font-light focus:bg-accent-a focus:text-accent-foreground-a",
                    opt.selected && "bg-accent-a text-accent-foreground-a" 
                  )}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {message && (
        <p className="text-body-xs font-light text-muted-foreground-m">
          {message}
        </p>
      )}
    </div>
  );
}
