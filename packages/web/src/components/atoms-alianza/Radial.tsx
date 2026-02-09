import type { RadialProps } from './Radial.types';

export function Radial({
  checked = false,
  onCheckedChange,
  className,
  disabled = false,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: RadialProps) {
  const handleClick = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      data-testid={dataTestId}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-checked={checked}
      role="radio"
      className={`
        bg-card-background-c content-stretch flex items-center justify-center relative rounded-[var(--radius-pill)] shrink-0 size-[var(--icon-size-md)] border border-solid
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${checked ? 'border-accent-a' : 'border-input'}
        ${className}
      `}
      data-name="Radial"
    >
      {checked && (
        <div
          className="bg-accent-a rounded-full shrink-0 size-[var(--icon-size-xs)]"
          data-testid={dataTestId ? `${dataTestId}-dot` : undefined}
        />
      )}
    </button>
  );
}
