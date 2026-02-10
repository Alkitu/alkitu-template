'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ServiceRequestLinkProps } from './ServiceRequestLink.types';

/**
 * ServiceRequestLink - Cross-linking molecule for Service → Request navigation
 *
 * Displays request statistics for a service with interactive link to filtered request view.
 * Enables seamless navigation between catalog and operations.
 *
 * Features:
 * - Total request count display
 * - Pending/ongoing status indicators
 * - Direct link to filtered requests
 * - Compact and detailed views
 * - Responsive hover states
 * - Zero-state handling
 *
 * @example Compact view
 * ```tsx
 * <ServiceRequestLink
 *   serviceId="service-123"
 *   serviceName="Limpieza de Oficina"
 *   requestCount={15}
 *   pendingCount={5}
 * />
 * ```
 *
 * @example Detailed view
 * ```tsx
 * <ServiceRequestLink
 *   serviceId="service-123"
 *   serviceName="Limpieza de Oficina"
 *   requestCount={15}
 *   pendingCount={5}
 *   ongoingCount={8}
 *   detailed
 * />
 * ```
 */
export const ServiceRequestLink = React.forwardRef<HTMLAnchorElement, ServiceRequestLinkProps>(
  (
    {
      serviceId,
      serviceName,
      requestCount = 0,
      pendingCount = 0,
      ongoingCount = 0,
      baseHref = '/admin/requests',
      lang = 'es',
      detailed = false,
      className,
      ...props
    },
    ref,
  ) => {
    const href = `/${lang}${baseHref}?serviceId=${serviceId}`;
    const hasRequests = requestCount > 0;
    const hasPending = pendingCount > 0;
    const hasOngoing = ongoingCount > 0;

    // Zero state
    if (!hasRequests) {
      return (
        <div
          className={cn(
            'text-sm text-muted-foreground flex items-center gap-1.5',
            className,
          )}
          data-testid="service-request-link-zero"
        >
          <span>Sin solicitudes</span>
        </div>
      );
    }

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          'group inline-flex items-center gap-2 text-sm transition-colors',
          'hover:text-primary focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1',
          className,
        )}
        data-testid="service-request-link"
        aria-label={`Ver ${requestCount} solicitudes de ${serviceName}`}
        {...props}
      >
        {/* Request count */}
        <span className="font-medium text-foreground group-hover:text-primary">
          {requestCount} {requestCount === 1 ? 'solicitud' : 'solicitudes'}
        </span>

        {/* Status indicators */}
        {detailed ? (
          <div className="flex items-center gap-2 text-xs">
            {hasPending && (
              <span
                className="flex items-center gap-1 text-amber-600 dark:text-amber-400"
                title="Pendientes"
              >
                <AlertCircle className="h-3 w-3" />
                {pendingCount}
              </span>
            )}
            {hasOngoing && (
              <span
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400"
                title="En progreso"
              >
                <Clock className="h-3 w-3" />
                {ongoingCount}
              </span>
            )}
          </div>
        ) : (
          hasPending && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
              title="Solicitudes pendientes"
            >
              {pendingCount} pendiente{pendingCount !== 1 && 's'}
            </span>
          )
        )}

        {/* Arrow icon */}
        <ArrowRight
          className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    );
  },
);

ServiceRequestLink.displayName = 'ServiceRequestLink';

export default ServiceRequestLink;
