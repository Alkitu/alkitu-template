'use client';

import React from 'react';
import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/primitives/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/DropdownMenu';
import { Button } from '@/components/primitives/ui/button';
import { Heading } from '@/components/atoms-alianza/Typography';
import { ServiceRequestLink } from '@/components/molecules-alianza/ServiceRequestLink';
import { ServiceIcon } from '@/components/atoms-alianza/ServiceIcon';
import { getDynamicBackgroundColor } from '@/lib/utils/color';
import type { ServicesTableAlianzaProps, ServiceTableItem } from './ServicesTableAlianza.types';

const defaultLabels = {
  service: 'Servicio',
  category: 'Categoría',
  status: 'Estado',
  questions: 'Preguntas',
  requests: 'Solicitudes',
  actions: 'Acciones',
  edit: 'Editar',
  delete: 'Eliminar',
  active: 'Activo',
  inactive: 'Inactivo',
};

const StatusBadge = ({ status, labels }: { status: ServiceTableItem['status'], labels: any }) => {
  const isActive = status === 'ACTIVE';
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        isActive
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
          : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400"
      )}
    >
      {isActive ? labels.active : labels.inactive}
    </span>
  );
};

export function ServicesTableAlianza({
  services,
  onEdit,
  onDelete,
  showRequestsColumn = false,
  lang = 'es',
  requestsBaseHref = '/admin/requests',
  labels = defaultLabels,
  requestLinkLabels,
  className,
}: ServicesTableAlianzaProps) {
  // Merge default labels with custom labels
  const mergedLabels = { ...defaultLabels, ...labels };

  return (
    <div className={cn("w-full relative max-h-[600px] overflow-auto rounded-lg border border-border", className)}>
      <table className="w-full caption-bottom text-sm">
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border h-[46px] sticky top-0 z-20">
            <TableHead className={cn("text-foreground font-semibold text-sm px-4", showRequestsColumn ? "w-[30%]" : "w-[35%]")}>
              {mergedLabels.service}
            </TableHead>
            <TableHead className="text-foreground font-semibold text-sm px-4 w-[20%]">
              {mergedLabels.category}
            </TableHead>
            <TableHead className="text-foreground font-semibold text-sm px-4 w-[15%]">
              {mergedLabels.status}
            </TableHead>
            <TableHead className="text-foreground font-semibold text-sm px-4 w-[10%] text-center">
              {mergedLabels.questions}
            </TableHead>
            {showRequestsColumn && (
              <TableHead className="text-foreground font-semibold text-sm px-4 w-[15%]">
                {mergedLabels.requests}
              </TableHead>
            )}
            <TableHead className={cn("text-foreground font-semibold text-sm px-4 text-right sticky right-0 z-20 bg-muted/50 shadow-[-12px_0_15px_-4px_rgba(0,0,0,0.1)] clip-inset-left", showRequestsColumn ? "w-[10%]" : "w-[15%]")}>
              {mergedLabels.actions}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow
              key={service.id}
              className="group bg-background hover:bg-muted/30 border-b border-border/50 transition-colors"
            >
              <TableCell className="py-4 px-[18px] font-semibold text-foreground">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: getDynamicBackgroundColor(service.iconColor || '#000000') }}
                  >
                    <ServiceIcon
                      category={service.category}
                      thumbnail={service.thumbnail}
                      className="h-4 w-4"
                      color={service.iconColor}
                    />
                  </div>
                  {service.name}
                </div>
              </TableCell>
              <TableCell className="py-4 px-[9px] text-muted-foreground">
                {service.category}
              </TableCell>
              <TableCell className="py-4 px-[9px]">
                <StatusBadge status={service.status} labels={mergedLabels} />
              </TableCell>
              <TableCell className="py-4 px-[9px] text-center text-muted-foreground">
                {service.questionsCount}
              </TableCell>
              {showRequestsColumn && (
                <TableCell className="py-4 px-[9px]">
                  <ServiceRequestLink
                    serviceId={service.id}
                    serviceName={service.name}
                    requestCount={service.requestStats?.total || 0}
                    pendingCount={service.requestStats?.pending || 0}
                    ongoingCount={service.requestStats?.ongoing || 0}
                    baseHref={requestsBaseHref}
                    lang={lang}
                    labels={requestLinkLabels}
                  />
                </TableCell>
              )}
              <TableCell className="text-right py-4 px-4 sticky right-0 z-10 bg-background group-hover:bg-muted/30 transition-colors shadow-[-12px_0_15px_-4px_rgba(0,0,0,0.05)] clip-inset-left h-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">{labels.actions}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(service.id)}>
                        {labels.edit}
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(service.id)}
                      >
                        {labels.delete}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </table>
    </div>
  );
}
