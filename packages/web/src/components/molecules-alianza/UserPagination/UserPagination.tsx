'use client';

/**
 * UserPagination Component - Pagination Molecule
 *
 * A complete pagination control for user lists with page size selector,
 * page navigation, and result summary display.
 *
 * Features:
 * - Page size selector with customizable options
 * - Previous/Next navigation buttons
 * - Current page and total pages display
 * - Result range summary (e.g., "Showing 1 to 10 of 100 results")
 * - Responsive layout (mobile-first)
 * - Accessible button states
 *
 * @example
 * ```tsx
 * <UserPagination
 *   currentPage={1}
 *   totalPages={10}
 *   totalItems={100}
 *   pageSize={10}
 *   onPageChange={(page) => setPage(page)}
 *   onPageSizeChange={(size) => setPageSize(size)}
 *   pageSizeOptions={[10, 20, 50, 100]}
 * />
 * ```
 */

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/primitives/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/ui/select";
import { cn } from "@/lib/utils";
import type { UserPaginationProps } from './UserPagination.types';

const defaultLabels = {
  showing: 'Mostrando',
  to: 'a',
  of: 'de',
  results: 'resultados',
  rowsPerPage: 'Filas por página',
  page: 'Página',
  previous: 'Anterior',
  next: 'Siguiente',
};

export function UserPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
  pageSizeOptions = [10, 20, 50, 100],
  labels: labelsProp,
}: UserPaginationProps) {
  const l = { ...defaultLabels, ...labelsProp };
  const startParam = (currentPage - 1) * pageSize + 1;
  const endParam = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 py-4", className)}>
      <div className="text-sm text-muted-foreground order-2 sm:order-1">
        {l.showing} <span className="font-medium">{Math.max(0, startParam)}</span> {l.to}{" "}
        <span className="font-medium">{endParam}</span> {l.of}{" "}
        <span className="font-medium">{totalItems}</span> {l.results}
      </div>

      <div className="flex items-center gap-6 order-1 sm:order-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {l.rowsPerPage}
          </span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground w-[100px] text-right mr-2">
            {l.page} {currentPage} {l.of} {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">{l.previous}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">{l.next}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
