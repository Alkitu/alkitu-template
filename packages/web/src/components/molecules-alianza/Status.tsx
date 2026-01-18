import { cn } from '@/lib/utils';
import { Icon } from '../atoms-alianza/Icon';

// SVG Paths from import
const STAR_PATH = "M5.42743 0.812417C5.44934 0.768156 5.48318 0.7309 5.52514 0.704851C5.5671 0.678803 5.6155 0.665 5.66489 0.665C5.71427 0.665 5.76267 0.678803 5.80463 0.704851C5.84659 0.7309 5.88043 0.768156 5.90234 0.812417L7.0571 3.15144C7.13318 3.30539 7.24547 3.43859 7.38435 3.53959C7.52323 3.64059 7.68454 3.70639 7.85444 3.73132L10.4369 4.10925C10.4859 4.11634 10.5318 4.13698 10.5696 4.16884C10.6074 4.20069 10.6356 4.2425 10.6509 4.28951C10.6662 4.33653 10.668 4.38689 10.6562 4.4349C10.6443 4.48291 10.6193 4.52664 10.5839 4.56116L8.71627 6.37979C8.5931 6.49981 8.50095 6.64797 8.44774 6.81151C8.39453 6.97505 8.38187 7.14908 8.41083 7.3186L8.85174 9.88808C8.86038 9.93699 8.85509 9.98734 8.83649 10.0334C8.81789 10.0794 8.78672 10.1193 8.74653 10.1485C8.70635 10.1777 8.65877 10.195 8.60922 10.1985C8.55968 10.2019 8.51016 10.1914 8.46632 10.168L6.15779 8.95427C6.00568 8.87439 5.83644 8.83267 5.66464 8.83267C5.49283 8.83267 5.3236 8.87439 5.17149 8.95427L2.86345 10.168C2.81963 10.1912 2.77017 10.2017 2.72071 10.1981C2.67125 10.1946 2.62376 10.1773 2.58366 10.1481C2.54355 10.119 2.51244 10.0791 2.49386 10.0332C2.47527 9.98718 2.46996 9.93692 2.47853 9.88808L2.91894 7.3191C2.94804 7.1495 2.93543 6.97537 2.88222 6.81172C2.82901 6.64808 2.73678 6.49984 2.6135 6.37979L0.745884 4.56166C0.710188 4.52718 0.684892 4.48337 0.67288 4.43522C0.660867 4.38707 0.662619 4.33651 0.677937 4.28931C0.693255 4.2421 0.721522 4.20015 0.759519 4.16823C0.797516 4.13631 0.843715 4.1157 0.892854 4.10875L3.47483 3.73132C3.64492 3.70658 3.80646 3.64087 3.94553 3.53986C4.0846 3.43884 4.19704 3.30555 4.27317 3.15144L5.42743 0.812417Z";
const CHECK_PATH = "M10.665 1.56249L3.79 8.43749L0.665 5.31249";

export type StatusVariant = 'default' | 'highlighted' | 'radio' | 'checkbox' | 'toggle';

interface StatusProps {
  label?: string;
  variant?: StatusVariant;
  className?: string;
}

export function Status({ label = "Input text...", variant = 'default', className }: StatusProps) {
  
  // Icon Components based on variant
  const renderIcon = () => {
    switch (variant) {
      case 'default':
        return (
          <div className="relative shrink-0 size-[var(--icon-size-md)] flex items-center justify-center">
            <Icon
              paths={[STAR_PATH]}
              viewBox="0 0 11.33 10.86"
              className="size-[var(--icon-size-xs)] text-muted-foreground-m"
              strokeWidth="1.33"
            />
          </div>
        );
      case 'highlighted':
        return (
           <div className="relative shrink-0 size-[var(--icon-size-md)] flex items-center justify-center">
             <Icon
               paths={[STAR_PATH]}
               viewBox="0 0 11.33 10.86"
               className="size-[var(--icon-size-xs)] text-warning"
               strokeWidth="1.33"
             />
           </div>
        );
      case 'radio':
        return (
          <div className="size-[var(--icon-size-md)] rounded-full border border-accent-a bg-white flex items-center justify-center p-[var(--space-1)]">
            <div className="size-[var(--icon-size-xs)] rounded-full bg-accent-a" />
          </div>
        );
      case 'checkbox':
        return (
          <div className="size-[var(--icon-size-md)] rounded-[var(--radius-xs)] bg-accent-a flex items-center justify-center">
             <Icon
               paths={[CHECK_PATH]}
               viewBox="0 0 11.33 10"
               className="size-[var(--icon-size-xs)]"
               strokeWidth="1.33"
               color="white"
             />
          </div>
        );
      case 'toggle':
        return (
          <div className="w-[var(--size-toggle-width)] h-[var(--size-toggle-height)] bg-accent-a rounded-[var(--radius-pill)] relative flex items-center justify-end px-[var(--space-1)]">
            <div className="size-[var(--size-toggle-thumb)] bg-white rounded-full" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-[var(--space-3-5)] px-[var(--space-4)] py-[var(--space-3)] rounded-[var(--radius-xs)] w-fit",
        variant === 'highlighted' && "bg-warning-foreground",
        className
      )}
    >
      {renderIcon()}
      <span
        className={cn(
          "font-sans font-light body-sm whitespace-nowrap",
          variant === 'highlighted' ? "text-warning" : "text-muted-foreground-m"
        )}
      >
        {label}
      </span>
    </div>
  );
}
