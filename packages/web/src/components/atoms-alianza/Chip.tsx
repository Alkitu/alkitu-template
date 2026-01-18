import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--radius-md)] px-[var(--space-3)] transition-colors whitespace-nowrap h-[var(--chip-height)]",
  {
    variants: {
      variant: {
        outline: "border border-primary-1 text-primary-1 bg-transparent font-light body-sm",
        solid: "bg-primary-1 text-primary-foreground-1 border border-transparent font-medium body-md",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {}

function Chip({ className, variant, ...props }: ChipProps) {
  return (
    <div className={cn(chipVariants({ variant }), className)} {...props} />
  )
}

export { Chip, chipVariants }
