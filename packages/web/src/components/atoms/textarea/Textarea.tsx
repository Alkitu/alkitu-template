'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { TextareaProps, AutosizeTextAreaRef } from './Textarea.types';

interface UseAutosizeTextAreaProps {
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  minHeight?: number;
  maxHeight?: number;
  triggerAutoSize: string;
}

/**
 * Custom hook for textarea auto-sizing functionality
 */
const useAutosizeTextArea = ({
  textAreaRef,
  triggerAutoSize,
  maxHeight = Number.MAX_SAFE_INTEGER,
  minHeight = 0,
}: UseAutosizeTextAreaProps) => {
  const [init, setInit] = React.useState(true);
  React.useEffect(() => {
    const offsetBorder = 6;
    const textAreaElement = textAreaRef.current;
    if (textAreaElement) {
      if (init) {
        textAreaElement.style.minHeight = `${minHeight + offsetBorder}px`;
        if (maxHeight > minHeight) {
          textAreaElement.style.maxHeight = `${maxHeight}px`;
        }
        setInit(false);
      }
      textAreaElement.style.height = `${minHeight + offsetBorder}px`;
      const scrollHeight = textAreaElement.scrollHeight;
      if (scrollHeight > maxHeight) {
        textAreaElement.style.height = `${maxHeight}px`;
      } else {
        textAreaElement.style.height = `${scrollHeight + offsetBorder}px`;
      }
    }
  }, [textAreaRef.current, triggerAutoSize, maxHeight, minHeight, init]);
};

/**
 * Textarea - Atomic Design Atom
 *
 * A flexible textarea component with optional auto-resize functionality,
 * theme reactivity, and multiple variants.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Textarea placeholder="Enter text..." />
 *
 * // With autosize
 * <Textarea autosize minHeight={100} maxHeight={300} />
 *
 * // With variant
 * <Textarea variant="error" />
 * ```
 */
export const Textarea = React.forwardRef<
  HTMLTextAreaElement | AutosizeTextAreaRef,
  TextareaProps
>(
  (
    {
      variant = 'default',
      size = 'md',
      autosize = false,
      maxHeight = Number.MAX_SAFE_INTEGER,
      minHeight = 52,
      className = '',
      onChange,
      value,
      disabled = false,
      themeOverride,
      useSystemColors = true,
      useTypographyVars = true,
      ...props
    },
    ref,
  ) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [triggerAutoSize, setTriggerAutoSize] = React.useState('');

    // Apply autosize hook if enabled
    useAutosizeTextArea({
      textAreaRef,
      triggerAutoSize: autosize ? triggerAutoSize : '',
      maxHeight: autosize ? maxHeight : Number.MAX_SAFE_INTEGER,
      minHeight: autosize ? minHeight : 0,
    });

    // Expose imperative handle for autosize mode
    React.useImperativeHandle(ref, () => {
      if (autosize) {
        return {
          textArea: textAreaRef.current as HTMLTextAreaElement,
          focus: () => textAreaRef?.current?.focus(),
          maxHeight,
          minHeight,
        } as AutosizeTextAreaRef;
      }
      return textAreaRef.current as HTMLTextAreaElement;
    });

    // Sync value changes for autosize
    React.useEffect(() => {
      if (autosize) {
        setTriggerAutoSize(value as string);
      }
    }, [props?.defaultValue, value, autosize]);

    // Variant classes mapping
    const variantClasses = {
      default: 'border-input bg-background text-foreground',
      error:
        'border-destructive bg-background text-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
      success: 'border-success bg-background text-foreground',
    }[variant];

    // Size classes mapping
    const sizeClasses = {
      sm: 'min-h-12 px-2 py-1 text-sm',
      md: 'min-h-16 px-3 py-2 text-base md:text-sm',
      lg: 'min-h-20 px-4 py-3 text-lg',
    }[size];

    // Compose classes
    const classes = cn(
      // Base classes
      'flex w-full rounded-md border',
      'transition-[color,box-shadow] outline-none',
      'focus-visible:outline-none focus-visible:ring-[3px]',
      'focus-visible:border-ring focus-visible:ring-ring/50',
      'placeholder:text-muted-foreground',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'dark:bg-input/30',

      // Resize behavior
      autosize ? 'resize-none' : 'resize-none field-sizing-content',

      // Variant and size
      variantClasses,
      sizeClasses,

      // User-provided classes
      className,
    );

    // Typography variables style
    const typographyStyle = useTypographyVars
      ? {
          fontFamily: 'var(--typography-paragraph-font-family, inherit)',
          fontSize: 'var(--typography-paragraph-font-size, inherit)',
          letterSpacing: 'var(--typography-paragraph-letter-spacing, normal)',
          lineHeight: 'var(--typography-paragraph-line-height, normal)',
        }
      : {};

    // Combine all styles
    const style = {
      ...typographyStyle,
      ...themeOverride,
    };

    // Handle change event
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autosize) {
        setTriggerAutoSize(e.target.value);
      }
      onChange?.(e);
    };

    return (
      <textarea
        ref={textAreaRef}
        data-slot="textarea"
        className={classes}
        style={Object.keys(style).length > 0 ? style : undefined}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        data-use-system-colors={useSystemColors}
        data-variant={variant}
        data-size={size}
        data-autosize={autosize}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
