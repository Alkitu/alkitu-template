'use client';

import * as React from 'react';
import { format, addMonths } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { addYears, subYears } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar } from '@/components/primitives/ui/calendar';
import { ScrollArea } from '@/components/primitives/ui/scroll-area';
import { Button } from '@/components/primitives/ui/button';
import { cn } from '@/lib/utils';
import {
  isWeekend,
  isDateDisabled,
  isDateInRange,
  isWithinBusinessHours,
  formatTimeForDisplay,
  formatDateToYMD,
} from '../../lib/date-time-validation';
import { t as translate } from '../../lib/date-time-i18n';
import type { DateTimePickerProps } from './DateTimePicker.types';
import type { DateFieldOptions } from '@alkitu/shared';

const dateFnsLocales = { en: enUS, es } as const;

function generateTimeSlots(
  minTime = '00:00',
  maxTime = '23:45',
  interval = 15,
  businessHours?: DateFieldOptions['businessHours'],
): string[] {
  const slots: string[] = [];
  const [minH, minM] = minTime.split(':').map(Number);
  const [maxH, maxM] = maxTime.split(':').map(Number);
  const startMinutes = minH * 60 + minM;
  const endMinutes = maxH * 60 + maxM;

  for (let m = startMinutes; m <= endMinutes; m += interval) {
    const hh = String(Math.floor(m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    const slot = `${hh}:${mm}`;
    if (isWithinBusinessHours(slot, businessHours)) {
      slots.push(slot);
    }
  }
  return slots;
}

function parseValue(value: string | undefined, mode: DateTimePickerProps['mode']) {
  if (!value) return { date: undefined, time: undefined };

  if (mode === 'date') {
    return { date: new Date(value + 'T00:00:00'), time: undefined };
  }
  if (mode === 'time') {
    return { date: undefined, time: value };
  }
  // datetime
  if (value.includes('T')) {
    const [datePart, timePart] = value.split('T');
    return {
      date: new Date(datePart + 'T00:00:00'),
      time: timePart?.slice(0, 5),
    };
  }
  return { date: undefined, time: undefined };
}

export function DateTimePicker({
  mode,
  value,
  onChange,
  dateOptions,
  locale = 'en',
  placeholder,
  disabled = false,
  className,
}: DateTimePickerProps) {
  const parsed = parseValue(value, mode);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(parsed.date);
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>(parsed.time);

  // Sync internal state when value prop changes externally
  React.useEffect(() => {
    const p = parseValue(value, mode);
    setSelectedDate(p.date);
    setSelectedTime(p.time);
  }, [value, mode]);

  const showCalendar = mode === 'date' || mode === 'datetime';
  const showTimeSlots = mode === 'time' || mode === 'datetime';

  const hourCycle = dateOptions?.hourCycle ?? 24;
  const dfLocale = dateFnsLocales[locale] ?? enUS;
  const t = (key: Parameters<typeof translate>[0]) => translate(key, locale);

  const now = new Date();

  // Controlled month state for custom navigation
  const [month, setMonth] = React.useState<Date>(selectedDate ?? now);

  // Sync height between calendar and time slots panes
  const [calendarHeight, setCalendarHeight] = React.useState<number | undefined>(undefined);
  const calendarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (mode !== 'datetime') return;
    const el = calendarRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCalendarHeight(entry.borderBoxSize[0].blockSize);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [mode]);

  const startMonth = dateOptions?.minDate
    ? new Date(typeof dateOptions.minDate === 'string' ? dateOptions.minDate : dateOptions.minDate)
    : subYears(now, 10);
  const endMonth = dateOptions?.maxDate
    ? new Date(typeof dateOptions.maxDate === 'string' ? dateOptions.maxDate : dateOptions.maxDate)
    : addYears(now, 10);

  const timeSlots = React.useMemo(
    () =>
      generateTimeSlots(
        dateOptions?.minTime,
        dateOptions?.maxTime,
        15,
        dateOptions?.businessHours,
      ),
    [dateOptions?.minTime, dateOptions?.maxTime, dateOptions?.businessHours],
  );

  const isDateDisabledFn = React.useCallback(
    (date: Date) => {
      if (dateOptions?.disableWeekends && isWeekend(date)) return true;
      if (dateOptions?.disabledDates?.length && isDateDisabled(date, dateOptions.disabledDates))
        return true;
      const rangeCheck = isDateInRange(date, dateOptions?.minDate, dateOptions?.maxDate);
      return !rangeCheck.valid;
    },
    [dateOptions?.disableWeekends, dateOptions?.disabledDates, dateOptions?.minDate, dateOptions?.maxDate],
  );

  const emitValue = React.useCallback(
    (date: Date | undefined, time: string | undefined) => {
      if (mode === 'date' && date) {
        onChange(formatDateToYMD(date));
      } else if (mode === 'time' && time) {
        onChange(time);
      } else if (mode === 'datetime') {
        if (date) {
          const datePart = formatDateToYMD(date);
          const timePart = time ?? '00:00';
          onChange(`${datePart}T${timePart}`);
        }
      }
    },
    [mode, onChange],
  );

  const handleDateSelect = React.useCallback(
    (day: Date | undefined) => {
      if (!day) return;
      setSelectedDate(day);
      emitValue(day, selectedTime);
    },
    [emitValue, selectedTime],
  );

  const handleTimeSelect = React.useCallback(
    (slot: string) => {
      setSelectedTime(slot);
      emitValue(selectedDate, slot);
    },
    [emitValue, selectedDate],
  );

  // Ref to scroll the selected time into view
  const selectedTimeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    selectedTimeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selectedTime]);

  return (
    <div
      className={cn(
        'w-full',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      {/* Section Labels (datetime mode, desktop) */}
      {mode === 'datetime' && (
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">
              {t('selectDate')}
            </h3>
          </div>
          <div className="flex-1 hidden md:block">
            <h3 className="text-sm font-semibold text-foreground">
              {t('selectTime')}
            </h3>
          </div>
        </div>
      )}

      <div
        className={cn(
          mode === 'datetime' && 'flex flex-col md:flex-row gap-4 md:gap-6 md:items-start',
        )}
      >
        {/* ─── Calendar Pane ─── */}
        {showCalendar && (
          <div
            ref={calendarRef}
            className="w-full md:w-auto rounded-2xl border border-border/60 bg-card p-5 md:p-6"
          >
            {/* Custom header: month name LEFT, navigation arrows RIGHT */}
            <div className="flex items-center justify-between w-full mb-4">
              <h4 className="text-base md:text-lg font-semibold capitalize text-foreground whitespace-nowrap">
                {format(month, 'MMMM yyyy', { locale: dfLocale })}
              </h4>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={locale === 'es' ? 'Mes anterior' : 'Previous month'}
                  className="h-8 w-8 rounded-full inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMonth(addMonths(month, -1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={locale === 'es' ? 'Mes siguiente' : 'Next month'}
                  className="h-8 w-8 rounded-full inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMonth(addMonths(month, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabledFn}
              locale={dfLocale}
              month={month}
              onMonthChange={setMonth}
              startMonth={startMonth}
              endMonth={endMonth}
              showOutsideDays={false}
              className="p-0 w-full bg-transparent"
              classNames={{
                months: 'w-full',
                month: 'w-full',
                month_caption: 'hidden',
                nav: 'hidden',
                month_grid: 'w-full border-collapse',
                weekdays: 'flex w-full mb-2',
                weekday:
                  'text-muted-foreground font-medium text-xs w-full text-center',
                week: 'flex w-full mt-1',
                day: cn(
                  'relative p-0.5 text-center text-sm w-full',
                  'focus-within:relative focus-within:z-20',
                ),
                day_button: cn(
                  'relative h-10 w-10 md:h-11 md:w-11 mx-auto p-0 font-normal rounded-full',
                  'inline-flex items-center justify-center cursor-pointer',
                  'text-sm transition-colors',
                  'hover:bg-muted',
                  'aria-selected:bg-primary aria-selected:text-primary-foreground',
                  'aria-selected:font-semibold aria-selected:shadow-md',
                  'aria-selected:hover:bg-primary',
                ),
                selected: '',
                today: '[&>button]:font-semibold [&>button]:text-primary',
                outside: 'text-muted-foreground opacity-50',
                disabled:
                  'text-muted-foreground opacity-40 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent',
                hidden: 'invisible',
              }}
            />
          </div>
        )}

        {/* ─── Time Slots Pane ─── */}
        {showTimeSlots && (
          <div className="w-full md:w-auto flex flex-col">
            {/* Mobile-only label for datetime mode */}
            {mode === 'datetime' && (
              <h3 className="text-sm font-semibold text-foreground text-center mb-3 md:hidden">
                {t('selectTime')}
              </h3>
            )}

            <div
              className="rounded-2xl border border-border/60 bg-card overflow-hidden"
              style={
                mode === 'datetime'
                  ? { height: calendarHeight || undefined, minWidth: '220px' }
                  : undefined
              }
            >
              {/* Header for time-only mode */}
              {mode === 'time' && (
                <div className="px-5 py-3 text-sm font-semibold text-foreground border-b border-border/60">
                  {t('selectTime')}
                </div>
              )}

              <ScrollArea className={mode === 'datetime' ? 'h-full' : 'h-[300px]'}>
                <div className="p-4 md:p-5">
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <Button
                          key={slot}
                          ref={isSelected ? selectedTimeRef : undefined}
                          type="button"
                          variant="outline"
                          className={cn(
                            'w-full justify-center transition-all duration-150 h-10 text-sm font-medium rounded-lg',
                            isSelected
                              ? 'bg-primary text-primary-foreground shadow-md border-primary hover:bg-primary hover:text-primary-foreground'
                              : 'bg-card text-foreground hover:bg-muted hover:border-border border-border/60',
                          )}
                          onClick={() => handleTimeSelect(slot)}
                        >
                          <span className="tabular-nums">
                            {formatTimeForDisplay(slot, hourCycle)}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
