import type { InputHTMLAttributes, ReactNode } from 'react';

/**
 * Input variant types for InputGroup
 */
export type InputGroupVariant = 'default' | 'error' | 'success';

/**
 * Input element type for InputGroup (supports input, textarea, select)
 */
export type InputGroupAs = 'input' | 'textarea' | 'select';

/**
 * Select option type for when as="select"
 */
export interface SelectOption {
  label: string;
  value: string;
  selected?: boolean;
}

/**
 * Props for InputGroup component (Molecule - Multi-type input with label)
 *
 * This is a versatile molecule component that can render as input, textarea, or select
 * with label, icons, and validation messages. For standard form inputs, consider using
 * FormInput molecule which is more specialized.
 *
 * @example
 * ```tsx
 * // Basic input
 * <InputGroup label="Email" type="email" placeholder="your@email.com" />
 *
 * // With icons
 * <InputGroup
 *   label="Password"
 *   type="password"
 *   iconLeft={<Lock />}
 *   iconRight={<Eye />}
 *   onIconRightClick={() => togglePassword()}
 * />
 *
 * // As textarea
 * <InputGroup label="Description" as="textarea" />
 *
 * // As select
 * <InputGroup
 *   label="Country"
 *   as="select"
 *   selectOptions={[
 *     { label: 'USA', value: 'us' },
 *     { label: 'Canada', value: 'ca' }
 *   ]}
 * />
 *
 * // With error state
 * <InputGroup
 *   label="Username"
 *   variant="error"
 *   message="Username is required"
 * />
 * ```
 */
export interface InputGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label text for the input field
   */
  label?: string;

  /**
   * Helper text or error message to display below the input
   */
  message?: string;

  /**
   * Icon to display on the left side of the input
   */
  iconLeft?: ReactNode;

  /**
   * Icon to display on the right side of the input
   */
  iconRight?: ReactNode;

  /**
   * Click handler for the right icon (makes it interactive)
   */
  onIconRightClick?: () => void;

  /**
   * Visual variant of the input
   * - default: Standard input styling
   * - error: Red border with error ring
   * - success: Green border with success ring
   * @default 'default'
   */
  variant?: InputGroupVariant;

  /**
   * Type of input element to render
   * - input: Standard HTML input
   * - textarea: Auto-resizing textarea
   * - select: Dropdown select
   * @default 'input'
   */
  as?: InputGroupAs;

  /**
   * Options for select dropdown (required when as="select")
   */
  selectOptions?: SelectOption[];

  /**
   * Whether the field is required (shows * indicator)
   * @default false
   */
  required?: boolean;

  /**
   * Custom className for the container
   */
  className?: string;
}
