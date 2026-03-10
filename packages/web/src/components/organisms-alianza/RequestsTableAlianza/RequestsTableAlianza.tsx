import React from 'react';
import { RequestsTableAlianzaProps } from './RequestsTableAlianza.types';
import { Eye, UserPlus, MapPin, UserCog } from 'lucide-react';
import { ServiceIcon } from '@/components/atoms-alianza/ServiceIcon';

/**
 * RequestsTableAlianza Component (Alianza Design System)
 *
 * Professional table for displaying service requests
 */
export const RequestsTableAlianza: React.FC<RequestsTableAlianzaProps> = ({
  requests,
  lang,
  onViewRequest,
  onAssignRequest,
  onCompleteRequest,
  onCancelRequest,
  onEditRequest,
  hideColumns = [],
  className = '',
}) => {
  const getStatusBadge = (status: string, isServiceActive?: boolean) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      PENDING: {
        label: 'Pendiente',
        className: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30',
      },
      ONGOING: {
        label: 'En Progreso',
        className: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30',
      },
      COMPLETED: {
        label: 'Completada',
        className: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30',
      },
      CANCELLED: {
        label: 'Cancelada',
        className: 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800/30',
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    // Override active badge styles if the parent service is inactive
    const isInactiveService = isServiceActive === false;
    const finalClassName = isInactiveService
      ? 'bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700'
      : config.className;

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium border ${finalClassName}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className={`w-full overflow-auto rounded-[var(--radius-card)] border border-border ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Servicio
            </th>
            {!hideColumns.includes('client') && (
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                Cliente
              </th>
            )}
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Estado
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              Fecha Ejecución
            </th>
            {!hideColumns.includes('location') && (
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                Ubicación
              </th>
            )}
            {!hideColumns.includes('assignedTo') && (
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                Asignado a
              </th>
            )}
            <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr
              key={request.id}
              className="border-b border-border/50 bg-background hover:bg-muted/30 transition-colors"
            >
              {/* Service Name */}
              <td className="py-3 px-4">
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 mt-0.5 ${request.isServiceActive === false ? 'grayscale opacity-60' : ''}`}>
                    <ServiceIcon
                      category={request.categoryName}
                      thumbnail={request.serviceThumbnail}
                      className={`h-10 w-10 ${request.isServiceActive === false ? 'text-muted-foreground' : 'text-primary'}`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span
                      className={`text-sm font-medium ${request.isServiceActive === false ? 'text-muted-foreground' : 'text-foreground'}`}
                      title={`Servicio: ${request.categoryName}`}
                    >
                      {request.serviceName}
                    </span>
                    <span className="inline-flex w-fit max-w-[200px] flex-wrap items-center gap-1">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border/50">
                        {request.categoryName}
                      </span>
                      {request.isServiceActive === false && (
                        <span className="text-[10px] text-muted-foreground italic leading-tight">
                          (este servicio esta inactivo)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </td>

              {/* Client */}
              {!hideColumns.includes('client') && (
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">
                      {request.clientName}
                    </span>
                    {request.clientEmail && (
                      <span className="text-xs text-muted-foreground">
                        {request.clientEmail}
                      </span>
                    )}
                  </div>
                </td>
              )}

              {/* Status */}
              <td className="py-3 px-4">{getStatusBadge(request.status, request.isServiceActive)}</td>

              {/* Execution Date */}
              <td className="py-3 px-4 text-sm text-foreground whitespace-nowrap">
                {formatDate(request.executionDateTime)}
              </td>

              {/* Location */}
              {!hideColumns.includes('location') && (
                <td className="py-3 px-4 text-sm text-foreground">
                  {request.locationCity ? (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                      {request.locationCity}{request.locationState ? `, ${request.locationState}` : ''}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              )}

              {/* Assigned To */}
              {!hideColumns.includes('assignedTo') && (
                <td className="py-3 px-4">
                  {request.assignedTo ? (
                    request.status !== 'COMPLETED' && request.status !== 'CANCELLED' && onAssignRequest ? (
                      <button
                        onClick={() => onAssignRequest(request.id)}
                        className="group flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
                        title="Cambiar empleado asignado"
                      >
                        <span>{request.assignedTo}</span>
                        <UserCog className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </button>
                    ) : (
                      <span className="text-sm text-foreground">
                        {request.assignedTo}
                      </span>
                    )
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      Sin asignar
                    </span>
                  )}
                </td>
              )}

              {/* Actions */}
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onViewRequest(request.id, request.clientEmail || '')}
                    className="p-2 hover:bg-muted rounded-[var(--radius)] transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="h-4 w-4 text-foreground" />
                  </button>
                  {request.status === 'PENDING' && onAssignRequest && (
                    <button
                      onClick={() => onAssignRequest(request.id)}
                      className="p-2 hover:bg-primary/20 rounded-[var(--radius)] transition-colors"
                      title="Asignar"
                    >
                      <UserPlus className="h-4 w-4 text-primary" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {requests.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No se encontraron solicitudes</p>
        </div>
      )}
    </div>
  );
};
