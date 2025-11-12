"use client";

/**
 * Table Components - Theme-Aware Implementation
 *
 * Uses comprehensive CSS variable system for dynamic theming:
 * - Spacing: --spacing-* for padding
 * - Transitions: --transition-base for hover effects
 * - Colors: Tailwind classes with CSS variables (text-foreground, bg-muted, border)
 *
 * All variables automatically respond to theme changes via DynamicThemeProvider.
 *
 * @see docs/CSS-VARIABLES-REFERENCE.md for complete variable documentation
 */

import * as React from "react";

import { cn } from "./utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, style, ...props }: React.ComponentProps<"tr">) {
  const rowStyles: React.CSSProperties = {
    // Transition - Use standardized transition for smooth hover effects
    transition: 'background-color var(--transition-base, 200ms cubic-bezier(0.4, 0, 0.2, 1))',
  };

  return (
    <tr
      data-slot="table-row"
      style={{ ...rowStyles, ...style }}
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, style, ...props }: React.ComponentProps<"th">) {
  const headStyles: React.CSSProperties = {
    // Spacing - Use spacing system for padding
    paddingLeft: 'var(--spacing-sm, 0.5rem)',
    paddingRight: 'var(--spacing-sm, 0.5rem)',
  };

  return (
    <th
      data-slot="table-head"
      style={{ ...headStyles, ...style }}
      className={cn(
        "text-foreground h-10 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, style, ...props }: React.ComponentProps<"td">) {
  const cellStyles: React.CSSProperties = {
    // Spacing - Use spacing system for padding
    padding: 'var(--spacing-sm, 0.5rem)',
  };

  return (
    <td
      data-slot="table-cell"
      style={{ ...cellStyles, ...style }}
      className={cn(
        "align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
