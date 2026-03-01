'use client';

import { useState, useMemo, useCallback } from 'react';
import { Calendar, Clock, Play, CheckCircle, XCircle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { RequestStatus } from '@alkitu/shared';
import { useTranslations } from '@/context/TranslationsContext';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/primitives/ui/button';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
import { CalendarOrganism } from '@/components/organisms/calendar';
import type {
  CalendarLabels,
  CalendarEvent,
  CalendarEventVariant,
} from '@/components/organisms/calendar';

/**
 * Status filter configuration
 * Maps each RequestStatus to its icon, translation key, and calendar event variant.
 */
const STATUS_CONFIG: Record<
  RequestStatus,
  {
    icon: typeof Clock;
    filterKey: string;
    variant: CalendarEventVariant;
    activeClass: string;
  }
> = {
  [RequestStatus.PENDING]: {
    icon: Clock,
    filterKey: 'pending',
    variant: 'pending',
    activeClass: 'bg-warning text-warning-foreground hover:bg-warning/90',
  },
  [RequestStatus.ONGOING]: {
    icon: Play,
    filterKey: 'ongoing',
    variant: 'ongoing',
    activeClass: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
  [RequestStatus.COMPLETED]: {
    icon: CheckCircle,
    filterKey: 'completed',
    variant: 'completed',
    activeClass: 'bg-success text-success-foreground hover:bg-success/90',
  },
  [RequestStatus.CANCELLED]: {
    icon: XCircle,
    filterKey: 'cancelled',
    variant: 'cancelled',
    activeClass:
      'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  },
};

const ALL_STATUSES = Object.values(RequestStatus);

export default function AdminCalendarPage() {
  const t = useTranslations('admin.calendar');
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();

  // Filter state: all statuses active by default
  // Uses string set to avoid Prisma vs shared enum type mismatch
  const [activeStatuses, setActiveStatuses] = useState<Set<string>>(
    () => new Set<string>(ALL_STATUSES)
  );

  // Fetch requests (no status filter — we filter client-side for toggle UX)
  const { data: requestsData, isLoading: requestsLoading } =
    trpc.request.getFilteredRequests.useQuery({
      page: 1,
      limit: 100,
      sortBy: 'executionDateTime',
      sortOrder: 'asc',
    });

  // Fetch stats for badge counts
  const { data: statsData } = trpc.request.getRequestStats.useQuery({});

  // Toggle a status filter on/off
  const toggleStatus = useCallback((status: string) => {
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  }, []);

  // Map requests → CalendarEvents, filtered by active statuses
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    // Cast to break deep tRPC type instantiation (TS2589)
    const requests = (requestsData?.requests ?? []) as Array<{
      id: string;
      status: string;
      executionDateTime: string;
      service?: { name: string } | null;
    }>;
    return requests
      .filter((req) => activeStatuses.has(req.status))
      .map((req) => {
        const start = new Date(req.executionDateTime);
        const end = new Date(start.getTime() + 60 * 60 * 1000); // 1h duration
        const config = STATUS_CONFIG[req.status as RequestStatus];
        return {
          id: req.id,
          title: req.service?.name ?? 'Request',
          start,
          end,
          variant: config.variant,
        };
      });
  }, [requestsData, activeStatuses]);

  // Navigate to request detail on event click
  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      router.push(`/${lang}/admin/requests/${event.id}`);
    },
    [router, lang]
  );

  const labels: CalendarLabels = {
    today: t('toolbar.today'),
    previous: t('toolbar.previous'),
    next: t('toolbar.next'),
    month: t('toolbar.month'),
    week: t('toolbar.week'),
    day: t('toolbar.day'),
    agenda: t('toolbar.agenda'),
    noEvents: t('noEvents'),
    showMore: t('showMore'),
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <AdminPageHeader
        title={t('title')}
        description={t('description')}
        icon={<Calendar className="h-6 w-6" />}
      />

      <div className="max-w-7xl mx-auto space-y-4">
        {/* Status filter chips */}
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map((status) => {
            const config = STATUS_CONFIG[status];
            const Icon = config.icon;
            const isActive = activeStatuses.has(status);
            const count = statsData?.byStatus?.[status] ?? 0;

            return (
              <Button
                key={status}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={isActive ? config.activeClass : ''}
                onClick={() => toggleStatus(status)}
              >
                <Icon className="mr-1.5 h-4 w-4" />
                {t(`filters.${config.filterKey}`)}
                <span className="ml-1.5 rounded-full bg-background/20 px-1.5 py-0.5 text-xs font-medium">
                  {count}
                </span>
              </Button>
            );
          })}
        </div>

        <CalendarOrganism
          events={calendarEvents}
          labels={labels}
          isLoading={requestsLoading}
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </div>
  );
}
