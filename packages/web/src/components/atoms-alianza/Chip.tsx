import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center justify-center rounded-md px-[12px] transition-colors whitespace-nowrap h-[36px] overflow-clip",
  {
    variants: {
      variant: {
        outline: "border border-secondary-foreground text-secondary-foreground bg-secondary font-light text-sm",
        solid: "bg-primary text-primary-foreground border border-transparent font-light text-sm",
        destructive: "bg-destructive text-destructive-foreground border border-transparent font-light text-sm",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof chipVariants> { }

function Chip({ className, variant, ...props }: ChipProps) {
  return (
    <div className={cn(chipVariants({ variant }), className)} {...props} />
  )
}

export { Chip, chipVariants }
