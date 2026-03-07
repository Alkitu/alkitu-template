'use client';

import * as React from 'react';
import { format, addMonths, addYears } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/primitives/ui/button';
import { Calendar } from '@/components/primitives/ui/calendar';
import { ScrollArea } from '@/components/primitives/ui/scroll-area';

interface CalendarAppointmentProps {
  date?: Date;
  setDate: (date?: Date) => void;
  time: string | null;
  setTime: (time: string | null) => void;
  lang?: 'en' | 'es';
  availableTimes?: string[];
  className?: string;
}

// Default generic times if none provided
const DEFAULT_TIMES = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
];

export function CalendarAppointment({
  date,
  setDate,
  time,
  setTime,
  lang = 'es',
  availableTimes = DEFAULT_TIMES,
  className,
}: CalendarAppointmentProps) {
  const locale = lang === 'en' ? enUS : es;

  // Controlled month state for custom navigation header
  const [month, setMonth] = React.useState<Date>(date || new Date());

  // ── ResizeObserver: Calendar pane dictates height/width ──
  const [calendarHeight, setCalendarHeight] = React.useState<number | undefined>(undefined);
  const [calendarWidth, setCalendarWidth] = React.useState<number | undefined>(undefined);
  const calendarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = calendarRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCalendarHeight(entry.borderBoxSize[0].blockSize);
        setCalendarWidth(entry.borderBoxSize[0].inlineSize);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sync month view when date prop changes externally
  React.useEffect(() => {
    if (date) setMonth(date);
  }, [date]);

  const dateLabel = lang === 'en' ? 'Select date' : 'Selecciona fecha';
  const timeLabel = lang === 'en' ? 'Select time' : 'Selecciona hora';

  const isDateDisabled = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  const handleDateSelect = (d: Date | undefined) => {
    setDate(d);
    if (!d) setTime(null);
  };

  // Check if a time slot is in the past (for today only)
  const isTimePast = (t: string): boolean => {
    if (!date) return false;
    const today = new Date();
    if (date.toDateString() !== today.toDateString()) return false;
    const [hour, minute] = t.split(':').map(Number);
    const timeDate = new Date();
    timeDate.setHours(hour, minute, 0, 0);
    return timeDate < new Date();
  };

  return (
    <div className={cn('w-full max-w-5xl mx-auto', className)}>
      {/* ── Section Labels Row ── */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-10 mb-4">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground text-center md:text-left">
            {dateLabel}
          </h3>
        </div>
        <div className="flex-1 hidden md:block">
          <h3 className="text-base font-semibold text-foreground text-center md:text-left">
            {timeLabel}
          </h3>
        </div>
      </div>

      {/* ── Main Content: Calendar + Time Slots ── */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-10 md:items-start md:justify-center">

        {/* ─── Left Pane: Calendar (height/width authority) ─── */}
        <div
          ref={calendarRef}
          className="w-full md:w-auto rounded-2xl border border-border/60 bg-card p-5 md:p-6"
        >
          {/* Custom Header: Month name LEFT, navigation arrows RIGHT */}
          <div className="flex items-center justify-between w-full mb-4">
            <h4 className="text-base md:text-lg font-semibold capitalize text-foreground whitespace-nowrap">
              {format(month, 'MMMM yyyy', { locale })}
            </h4>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label={lang === 'es' ? 'Mes anterior' : 'Previous month'}
                className="h-8 w-8 rounded-full inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setMonth(addMonths(month, -1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={lang === 'es' ? 'Mes siguiente' : 'Next month'}
                className="h-8 w-8 rounded-full inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setMonth(addMonths(month, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            month={month}
            onMonthChange={setMonth}
            disabled={isDateDisabled}
            locale={locale}
            startMonth={new Date()}
            endMonth={addYears(new Date(), 2)}
            showOutsideDays={false}
            className="p-0 w-full bg-transparent"
            classNames={{
              months: 'w-full flex-col',
              month: 'w-full',
              month_caption: 'hidden',
              nav: 'hidden',
              month_grid: 'w-full border-collapse',
              weekdays: 'flex w-full justify-between mb-2',
              weekday:
                'text-muted-foreground font-semibold text-xs w-full uppercase tracking-wider text-center',
              week: 'flex w-full mt-1 justify-between',
              day: cn(
                'text-center text-sm p-0.5 w-full relative',
                'focus-within:relative focus-within:z-20',
              ),
              day_button: cn(
                'relative h-10 w-10 md:h-11 md:w-11 mx-auto p-0 font-normal rounded-full',
                'inline-flex items-center justify-center cursor-pointer',
                'text-sm md:text-base transition-colors',
                'hover:bg-muted',
              ),
              selected:
                '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:font-bold [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
              today: '[&>button]:font-semibold [&>button]:text-primary',
              outside: 'day-outside text-muted-foreground opacity-70',
              disabled:
                'text-muted-foreground opacity-70 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent',
              hidden: 'invisible',
            }}
          />
        </div>

        {/* ─── Right Pane: Time Slots (dimensions synced to calendar) ─── */}
        <div className="w-full md:w-auto flex flex-col">
          {/* Mobile-only label */}
          <h3 className="text-base font-semibold text-foreground text-center mb-4 md:hidden">
            {timeLabel}
          </h3>

          <div
            className="rounded-2xl border border-border/60 bg-card overflow-hidden"
            style={{
              height: calendarHeight || undefined,
              width: calendarWidth || undefined,
            }}
          >
            <ScrollArea className="h-full">
              <div className="p-4 md:p-5">
                {!date ? (
                  /* Empty state: no date selected */
                  <div className="flex min-h-[200px] items-center justify-center text-center text-sm text-muted-foreground px-4">
                    {lang === 'en'
                      ? 'Select a day on the calendar to see available times.'
                      : 'Selecciona un día en el calendario para ver los horarios disponibles.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {availableTimes.map((t) => {
                      const isSelected = time === t;
                      const isPast = isTimePast(t);

                      // Hide past time slots
                      if (isPast) return null;

                      return (
                        <Button
                          key={`${date.toISOString()}-${t}`}
                          type="button"
                          variant="outline"
                          className={cn(
                            'w-full justify-center transition-all duration-200 h-12 text-sm font-medium rounded-lg',
                            isSelected
                              ? 'bg-primary text-primary-foreground shadow-md border-primary hover:bg-primary hover:text-primary-foreground'
                              : 'bg-card text-foreground hover:bg-muted hover:border-border border-border/80',
                          )}
                          onClick={() => setTime(t)}
                        >
                          <span className="tabular-nums">{t}</span>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarAppointment;
