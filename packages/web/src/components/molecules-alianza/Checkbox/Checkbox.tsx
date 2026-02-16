import type { CheckboxProps } from './Checkbox.types';

const CHECK_PATH = "M10.665 1.56249L3.79 8.43749L0.665 5.31249";

/**
 * Checkbox component - A custom checkbox molecule following Atomic Design principles.
 *
 * This component provides a visually styled checkbox alternative to the native HTML checkbox,
 * with customizable appearance and controlled state management.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <Checkbox checked={isChecked} onCheckedChange={setIsChecked} />
 *
 * // With custom styling
 * <Checkbox
 *   checked={agreed}
 *   onCheckedChange={setAgreed}
 *   className="ml-2"
 * />
 * ```
 */
export function Checkbox({ checked = false, onCheckedChange, className }: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange?.(!checked)}
      className={`
        content-stretch flex items-center justify-center p-0.5 relative rounded shrink-0 w-5 h-5 border border-solid cursor-pointer
        ${checked ? 'bg-primary border-transparent' : 'bg-background border-input'}
        ${className}
      `}
      data-name="Checkbox"
      data-testid="checkbox"
    >
      <svg
        viewBox="0 0 11.33 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={checked ? 'opacity-100 size-[var(--icon-size-xs)]' : 'opacity-0 size-[var(--icon-size-xs)]'}
      >
        <path
          d={CHECK_PATH}
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
