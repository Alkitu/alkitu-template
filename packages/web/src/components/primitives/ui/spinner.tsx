// components/ui/spinner.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-primary",
  {
    variants: {
      size: {
        default: "w-4 h-4",
        sm: "w-3 h-3",
        lg: "w-6 h-6",
        xl: "w-8 h-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(spinnerVariants({ size, className }))}
        {...props}
      />
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
