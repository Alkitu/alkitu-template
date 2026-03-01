'use client';

import React, { useMemo, useCallback } from 'react';
import {
  Calendar,
  dateFnsLocalizer,
  type Messages,
  type EventPropGetter,
} from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Skeleton } from '@/components/primitives/ui/skeleton';
import { cn } from '@/lib/utils';

import '@/styles/shadcn-big-calendar.css';

import type {
  CalendarOrganismProps,
  CalendarEvent,
  CalendarView,
} from './CalendarOrganism.types';

const locales = { es, 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

/**
 * CalendarOrganism
 *
 * Renders a full-featured calendar using react-big-calendar
 * with shadcn theme integration (Month/Week/Day/Agenda views).
 *
 * All text/labels must be pre-translated and passed via the `labels` prop.
 */
export function CalendarOrganism({
  events,
  labels,
  defaultView = 'month',
  onSelectEvent,
  onSelectSlot,
  isLoading = false,
  className,
  height = 700,
}: CalendarOrganismProps) {
  const messages: Messages = useMemo(
    () => ({
      today: labels.today,
      previous: labels.previous,
      next: labels.next,
      month: labels.month,
      week: labels.week,
      day: labels.day,
      agenda: labels.agenda,
      noEventsInRange: labels.noEvents,
      showMore: (total: number) =>
        labels.showMore.replace('{count}', String(total)),
    }),
    [labels]
  );

  const eventPropGetter: EventPropGetter<CalendarEvent> = useCallback(
    (event) => ({
      className: event.variant ? `event-variant-${event.variant}` : undefined,
    }),
    []
  );

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      <Calendar<CalendarEvent>
        localizer={localizer}
        events={events}
        defaultView={defaultView as CalendarView}
        views={['month', 'week', 'day', 'agenda']}
        messages={messages}
        selectable
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        eventPropGetter={eventPropGetter}
        style={{ height }}
        popup
      />
    </div>
  );
}
