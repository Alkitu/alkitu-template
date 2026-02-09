import type { LogoProps } from './Logo.types';

export function Logo({ className, alt = "Alianza Logo" }: LogoProps) {
  return (
    <div className={`relative shrink-0 w-[130.943px] h-[42.811px] ${className}`} data-name="Logo">
      <img
        alt={alt}
        className="absolute inset-0 size-full object-contain dark:hidden"
        src="/alianza-logo-light.png"
      />
      <img
        alt={alt}
        className="absolute inset-0 size-full object-contain hidden dark:block"
        src="/alianza-logo-dark.png"
      />
    </div>
  );
}
