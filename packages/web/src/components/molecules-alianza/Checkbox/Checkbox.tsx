import { Icon } from '../../atoms-alianza/Icon';
import type { CheckboxProps } from './Checkbox.types';

const CHECK_PATH = "M10.665 1.56249L3.79 8.43749L0.665 5.31249";

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
    >
      <Icon
        paths={[CHECK_PATH]}
        viewBox="0 0 11.33 10"
        color="white"
        className={checked ? 'opacity-100 size-[var(--icon-size-xs)]' : 'opacity-0 size-[var(--icon-size-xs)]'}
        strokeWidth="1.33"
      />
    </button>
  );
}
