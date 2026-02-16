import React from 'react';
import { RequestsTableAlianzaProps, RequestTableItem } from './RequestsTableAlianza.types';
import { Eye, UserPlus, Clock, MapPin, UserCog } from 'lucide-react';
import { ServiceIcon } from '@/components/atoms-alianza/ServiceIcon';

/**
 * RequestsTableAlianza Component (Alianza Design System)
 *
 * Professional table for displaying service requests
 * Similar to UsersTableAlianza but for requests
 */
export const RequestsTableAlianza: React.FC<RequestsTableAlianzaProps> = ({
  requests,
  lang,
  onViewRequest,
  onAssignRequest,
  onCompleteRequest,
  onCancelRequest,
  onEditRequest,
  className = '',
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      PENDING: {
        label: 'Pendiente',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      },
      ONGOING: {
        label: 'En Progreso',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
      },
      COMPLETED: {
        label: 'Completada',
        className: 'bg-green-100 text-green-800 border-green-200',
      },
      CANCELLED: {
        label: 'Cancelada',
        className: 'bg-red-100 text-red-800 border-red-200',
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <span
        className={`px-2 py-1 rounded-[4px] text-xs font-medium border ${config.className}`}
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
          {requests.map((request, index) => (
            <tr
              key={request.id}
              className={`
                border-b border-secondary-foreground/50 hover:bg-secondary/50 transition-colors
                ${index % 2 === 0 ? 'bg-secondary/20' : 'bg-transparent'}
              `}
            >
              {/* Service Name */}
              <td className="py-3 px-4">
                <div className="flex items-start gap-3">
                  {/* Service Icon */}
                  <div className="shrink-0 mt-0.5">
                    <ServiceIcon
                      category={request.categoryName}
                      thumbnail={request.serviceThumbnail}
                      className="h-5 w-5 text-primary"
                    />
                  </div>

                  {/* Service Details */}
                  <div className="flex flex-col gap-1">
                    {/* Request Title (serviceName now contains the specific request title) */}
                    <span
                      className="text-sm font-medium text-foreground"
                      title={`Servicio: ${request.categoryName}`}
                    >
                      {request.serviceName}
                    </span>

                    {/* Category Name */}
                    <span className="text-xs text-muted-foreground">
                      {request.categoryName}
                    </span>

                    {/* Time and Location */}
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

              {/* Status */}
              <td className="py-3 px-4">{getStatusBadge(request.status)}</td>

              {/* Execution Date */}
              <td className="py-3 px-4 text-sm text-foreground">
                {formatDate(request.executionDateTime)}
              </td>

              {/* Assigned To */}
              <td className="py-3 px-4">
                {request.assignedTo ? (
                  // Only allow reassigning if not completed or cancelled
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

              {/* Actions */}
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-2">
                  {/* View Details */}
                  <button
                    onClick={() => onViewRequest(request.id, request.clientEmail || '')}
                    className="p-2 hover:bg-secondary rounded-[4px] transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="h-4 w-4 text-foreground" />
                  </button>

                  {/* Assign (only for PENDING status) */}
                  {request.status === 'PENDING' && onAssignRequest && (
                    <button
                      onClick={() => onAssignRequest(request.id)}
                      className="p-2 hover:bg-blue-100 rounded-[4px] transition-colors"
                      title="Asignar"
                    >
                      <UserPlus className="h-4 w-4 text-blue-600" />
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
