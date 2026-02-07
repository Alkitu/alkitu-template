import React from 'react';
import { RequestsTableSkeletonProps } from './RequestsTableSkeleton.types';

/**
 * RequestsTableSkeleton Component (Alianza Design System)
 *
 * Loading skeleton for RequestsTableAlianza
 */
export const RequestsTableSkeleton: React.FC<RequestsTableSkeletonProps> = ({
  rowCount = 5,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-secondary-foreground">
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Servicio
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Cliente
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Estado
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Fecha Ejecución
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Asignado a
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, index) => (
            <tr
              key={index}
              className={`
                border-b border-secondary-foreground/50
                ${index % 2 === 0 ? 'bg-secondary/20' : 'bg-transparent'}
              `}
            >
              {/* Service Name */}
              <td className="py-3 px-4">
                <div className="flex items-start gap-3">
                  {/* Icon placeholder */}
                  <div className="h-5 w-5 bg-secondary animate-pulse rounded" />

                  {/* Text placeholders */}
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-32 bg-secondary animate-pulse rounded" />
                    <div className="h-3 w-24 bg-secondary/70 animate-pulse rounded" />
                    <div className="h-3 w-40 bg-secondary/70 animate-pulse rounded" />
                  </div>
                </div>
              </td>

              {/* Client */}
              <td className="py-3 px-4">
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-28 bg-secondary animate-pulse rounded" />
                  <div className="h-3 w-36 bg-secondary/70 animate-pulse rounded" />
                </div>
              </td>

              {/* Status */}
              <td className="py-3 px-4">
                <div className="h-6 w-20 bg-secondary animate-pulse rounded" />
              </td>

              {/* Execution Date */}
              <td className="py-3 px-4">
                <div className="h-4 w-24 bg-secondary animate-pulse rounded" />
              </td>

              {/* Assigned To */}
              <td className="py-3 px-4">
                <div className="h-4 w-28 bg-secondary animate-pulse rounded" />
              </td>

              {/* Actions */}
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-2">
                  <div className="h-8 w-8 bg-secondary animate-pulse rounded" />
                  <div className="h-8 w-8 bg-secondary animate-pulse rounded" />
                  <div className="h-8 w-8 bg-secondary animate-pulse rounded" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
