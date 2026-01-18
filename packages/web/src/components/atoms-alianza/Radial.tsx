
interface RadialProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function Radial({ checked = false, onCheckedChange, className }: RadialProps) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange?.(!checked)}
      className={`
        bg-card-background-c content-stretch flex items-center justify-center relative rounded-[var(--radius-pill)] shrink-0 size-[var(--icon-size-md)] border border-solid cursor-pointer
        ${checked ? 'border-accent-a' : 'border-input'}
        ${className}
      `}
      data-name="Radial"
    >
      {checked && <div className="bg-accent-a rounded-full shrink-0 size-[var(--icon-size-xs)]" />}
    </button>
  );
}
