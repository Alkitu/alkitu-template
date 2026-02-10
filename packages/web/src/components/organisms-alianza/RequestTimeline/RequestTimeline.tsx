'use client';

import * as React from 'react';
import {
  CheckCircle2,
  Clock,
  Calendar,
  XCircle,
  Circle,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RequestStatus } from '@prisma/client';
import type { RequestTimelineProps, TimelineStep } from './RequestTimeline.types';

/**
 * RequestTimeline - Visual timeline organism for tracking request progress
 *
 * Displays request lifecycle with visual indicators and timestamps.
 * Provides clear status communication for clients.
 *
 * Timeline Flow:
 * 1. Solicitud Creada (always completed)
 * 2. En Proceso (active when ONGOING)
 * 3. Programada (shows execution date)
 * 4. Completada/Cancelada (final state)
 *
 * Features:
 * - Visual progress indicators
 * - Timestamp display for each step
 * - Active step highlighting
 * - Status-based styling (success/destructive)
 * - Responsive layout
 *
 * @example
 * ```tsx
 * <RequestTimeline
 *   request={{
 *     id: '123',
 *     status: 'ONGOING',
 *     createdAt: new Date('2024-01-01'),
 *     executionDateTime: new Date('2024-01-15'),
 *     completedAt: null,
 *     cancelledAt: null,
 *   }}
 * />
 * ```
 */
export const RequestTimeline = React.forwardRef<HTMLDivElement, RequestTimelineProps>(
  ({ request, showDates = true, compact = false, className, ...props }, ref) => {
    const formatDate = (date?: Date | string | null) => {
      if (!date) return null;

      const dateObj = typeof date === 'string' ? new Date(date) : date;

      return dateObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...(compact ? {} : { hour: '2-digit', minute: '2-digit' }),
      });
    };

    // Build timeline steps based on request status
    const steps: TimelineStep[] = React.useMemo(() => {
      const isCancelled = request.status === RequestStatus.CANCELLED;
      const isCompleted = request.status === RequestStatus.COMPLETED;
      const isOngoing = request.status === RequestStatus.ONGOING;
      const isPending = request.status === RequestStatus.PENDING;

      return [
        {
          label: 'Solicitud Creada',
          date: request.createdAt,
          completed: true,
          icon: CheckCircle2,
          variant: 'success' as const,
        },
        {
          label: 'En Proceso',
          date: isOngoing || isCompleted ? request.createdAt : null,
          completed: isOngoing || isCompleted,
          active: isOngoing,
          icon: isOngoing ? Clock : isPending ? Circle : CheckCircle2,
          variant: isOngoing ? 'default' : 'success',
        },
        {
          label: 'Programada',
          date: request.executionDateTime,
          completed: isCompleted,
          active: false,
          icon: Calendar,
          variant: isCompleted ? 'success' : 'default',
        },
        {
          label: isCancelled ? 'Cancelada' : 'Completada',
          date: isCancelled ? request.cancelledAt : request.completedAt,
          completed: isCompleted || isCancelled,
          icon: isCancelled ? XCircle : CheckCircle2,
          variant: isCancelled ? ('destructive' as const) : ('success' as const),
        },
      ];
    }, [request]);

    return (
      <div
        ref={ref}
        className={cn('relative flex flex-col space-y-4', className)}
        data-testid="request-timeline"
        {...props}
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="relative flex items-start gap-4">
              {/* Timeline connector */}
              {!isLast && (
                <div
                  className={cn(
                    'absolute left-4 top-10 bottom-0 w-0.5 -translate-x-1/2',
                    step.completed
                      ? 'bg-primary'
                      : 'bg-muted-foreground/20 border-l-2 border-dashed',
                  )}
                  aria-hidden="true"
                />
              )}

              {/* Step indicator */}
              <div
                className={cn(
                  'relative z-10 flex items-center justify-center rounded-full border-2 transition-all',
                  compact ? 'h-8 w-8' : 'h-10 w-10',
                  step.completed && step.variant === 'success'
                    ? 'border-green-500 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                    : step.completed && step.variant === 'destructive'
                      ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      : step.active
                        ? 'border-primary bg-primary/10 text-primary animate-pulse'
                        : 'border-muted-foreground/30 bg-background text-muted-foreground',
                )}
                data-testid={`timeline-step-${index}`}
                aria-label={step.label}
              >
                <Icon className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
              </div>

              {/* Step content */}
              <div className="flex-1 pb-8">
                <div className="flex flex-col gap-1">
                  <span
                    className={cn(
                      'font-medium transition-colors',
                      compact ? 'text-sm' : 'text-base',
                      step.completed
                        ? 'text-foreground'
                        : step.active
                          ? 'text-primary font-semibold'
                          : 'text-muted-foreground',
                    )}
                  >
                    {step.label}
                  </span>

                  {showDates && step.date && (
                    <time
                      className={cn(
                        'text-muted-foreground',
                        compact ? 'text-xs' : 'text-sm',
                      )}
                      dateTime={
                        typeof step.date === 'string'
                          ? step.date
                          : step.date.toISOString()
                      }
                    >
                      {formatDate(step.date)}
                    </time>
                  )}

                  {step.active && (
                    <span className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-1">
                      <AlertCircle className="h-3 w-3" />
                      En progreso
                    </span>
                  )}

                  {!step.completed && !step.active && step.label !== 'En Proceso' && (
                    <span className="text-xs text-muted-foreground mt-1">
                      Pendiente
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);

RequestTimeline.displayName = 'RequestTimeline';

export default RequestTimeline;
