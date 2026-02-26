'use client';

/**
 * Textarea Component - Pure Atom (No Label/Description)
 *
 * A theme-aware textarea atom that handles only the textarea element itself.
 * For composed textareas with labels and error messages, use FormInput molecule.
 *
 * Features:
 * - Multiple variants (default, filled, outline)
 * - Three sizes (sm, md, lg)
 * - Validation states (default, error, success, warning)
 * - Auto-resize functionality (optional)
 * - Theme integration with CSS variables
 * - Accessibility built-in (ARIA attributes)
 * - forwardRef for parent component access
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Textarea placeholder="Enter your message..." />
 *
 * // With variant and size
 * <Textarea variant="filled" size="lg" placeholder="Large filled textarea" />
 *
 * // Error state
 * <Textarea state="error" placeholder="Invalid input" />
 *
 * // With autosize
 * <Textarea autosize minHeight={100} maxHeight={300} />
 *
 * // With ref
 * const textareaRef = useRef<HTMLTextAreaElement>(null);
 * <Textarea ref={textareaRef} />
 * ```
 */

import React, { forwardRef, useRef, useState, useEffect, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';
import type {
  TextareaProps,
  TextareaVariant,
  TextareaSize,
  TextareaState,
  AutosizeTextAreaRef,
} from './Textarea.types';

// Variant style mappings
const variantClasses: Record<TextareaVariant, string> = {
  default: 'border-input bg-background',
  filled: 'border-transparent bg-muted',
  outline: 'border-2 border-input bg-transparent',
};

// Size style mappings
const sizeClasses: Record<TextareaSize, string> = {
  sm: 'min-h-20 px-3 py-2 text-sm',
  md: 'min-h-24 px-3 py-2 text-sm',
  lg: 'min-h-32 px-4 py-3 text-base',
};

// State style mappings
const stateClasses: Record<TextareaState, string> = {
  default: '',
  error: 'border-destructive focus-visible:ring-destructive',
  success: 'border-success focus-visible:ring-success',
  warning: 'border-warning focus-visible:ring-warning',
};

// Base classes applied to all textareas
const baseClasses =
  'flex w-full rounded-[var(--radius-input)] border transition-colors ' +
  'placeholder:text-muted-foreground ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

/**
 * Custom hook for textarea auto-sizing functionality
 */
interface UseAutosizeTextAreaProps {
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  minHeight?: number;
  maxHeight?: number;
  triggerAutoSize: string;
}

const useAutosizeTextArea = ({
  textAreaRef,
  triggerAutoSize,
  maxHeight = Number.MAX_SAFE_INTEGER,
  minHeight = 0,
}: UseAutosizeTextAreaProps) => {
  const [init, setInit] = useState(true);

  useEffect(() => {
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
 * Textarea atom component - Pure textarea element without label/description composition
 */
export const Textarea = forwardRef<HTMLTextAreaElement | AutosizeTextAreaRef, TextareaProps>(
  (
    {
      variant = 'default',
      size = 'md',
      state = 'default',
      autosize = false,
      maxHeight = Number.MAX_SAFE_INTEGER,
      minHeight = 52,
      className,
      themeOverride,
      useSystemColors = true,
      onChange,
      value,
      ...props
    },
    ref,
  ) => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const [triggerAutoSize, setTriggerAutoSize] = useState('');

    // Apply autosize hook if enabled
    useAutosizeTextArea({
      textAreaRef,
      triggerAutoSize: autosize ? triggerAutoSize : '',
      maxHeight: autosize ? maxHeight : Number.MAX_SAFE_INTEGER,
      minHeight: autosize ? minHeight : 0,
    });

    // Expose imperative handle for autosize mode
    useImperativeHandle(ref, () => {
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
    useEffect(() => {
      if (autosize) {
        setTriggerAutoSize(value as string);
      }
    }, [props?.defaultValue, value, autosize]);

    // Handle change event
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autosize) {
        setTriggerAutoSize(e.target.value);
      }
      onChange?.(e);
    };

    // Build class names based on props
    const variantClass = useSystemColors ? variantClasses[variant] : '';
    const sizeClass = sizeClasses[size];
    const stateClass = stateClasses[state];

    // Apply resize behavior
    const resizeClass = autosize ? 'resize-none' : 'resize-y';

    return (
      <textarea
        ref={textAreaRef}
        className={cn(baseClasses, variantClass, sizeClass, stateClass, resizeClass, className)}
        style={themeOverride}
        value={value}
        onChange={handleChange}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
