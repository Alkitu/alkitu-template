import React from 'react';
import { Skeleton } from '@/components/primitives/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/primitives/ui/table';
import type { UsersTableSkeletonProps } from './UsersTableSkeleton.types';

export function UsersTableSkeleton({ rowCount = 5 }: UsersTableSkeletonProps) {
  return (
    <div className="w-full relative max-h-[600px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary border-b border-secondary-foreground h-[46px] sticky top-0 z-20">
            <TableHead className="px-[9px] w-[316px]">
              <Skeleton className="h-4 w-20 bg-secondary-foreground/20" />
            </TableHead>
            <TableHead className="px-[9px] w-[149px]">
              <Skeleton className="h-4 w-16 bg-secondary-foreground/20" />
            </TableHead>
            <TableHead className="px-[9px] w-[149px]">
              <Skeleton className="h-4 w-24 bg-secondary-foreground/20" />
            </TableHead>
            <TableHead className="px-[9px] text-right w-[100px] sticky right-0 z-20 bg-secondary shadow-[-1px_0_0_0_rgba(0,0,0,0.1)]">
              <div className="flex justify-end">
                <Skeleton className="h-4 w-16 bg-secondary-foreground/20" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, i) => (
            <TableRow key={i} className="border-b border-border/50">
              {/* User Column */}
              <TableCell className="py-4 bg-background">
                <div className="flex items-center gap-4">
                  <Skeleton className="size-10 rounded-full shrink-0" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </TableCell>

              {/* Role Column */}
              <TableCell className="py-4 bg-background">
                <Skeleton className="h-4 w-24" />
              </TableCell>

              {/* Phone Column */}
              <TableCell className="py-4 bg-background">
                <Skeleton className="h-4 w-32" />
              </TableCell>

              {/* Actions Column */}
              <TableCell className="py-4 sticky right-0 z-10 bg-background shadow-[-1px_0_0_0_rgba(0,0,0,0.1)]">
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
