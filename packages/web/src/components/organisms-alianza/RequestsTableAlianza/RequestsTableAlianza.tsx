import React from 'react';
import { RequestsTableAlianzaProps } from './RequestsTableAlianza.types';
import { Eye, UserPlus, Clock, MapPin, UserCog } from 'lucide-react';
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
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      PENDING: {
        label: 'Pendiente',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30',
      },
      ONGOING: {
        label: 'En Progreso',
        className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30',
      },
      COMPLETED: {
        label: 'Completada',
        className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30',
      },
      CANCELLED: {
        label: 'Cancelada',
        className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30',
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium border ${config.className}`}
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
                  <div className="shrink-0 mt-0.5">
                    <ServiceIcon
                      category={request.categoryName}
                      thumbnail={request.serviceThumbnail}
                      className="h-5 w-5 text-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span
                      className="text-sm font-medium text-foreground"
                      title={`Servicio: ${request.categoryName}`}
                    >
                      {request.serviceName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {request.categoryName}
                    </span>
                    {(request.executionTime || request.locationCity) && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {request.executionTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {request.executionTime}
                          </span>
                        )}
                        {request.executionTime && request.locationCity && (
                          <span>•</span>
                        )}
                        {request.locationCity && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {request.locationCity}, {request.locationState}
                          </span>
                        )}
                      </div>
                    )}
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
              <td className="py-3 px-4">{getStatusBadge(request.status)}</td>

              {/* Execution Date */}
              <td className="py-3 px-4 text-sm text-foreground">
                {formatDate(request.executionDateTime)}
              </td>

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
