'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

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

  return (
    <div
      className={cn(
        'w-full max-w-[850px] mx-auto bg-card rounded-3xl border border-border shadow-sm flex flex-col overflow-hidden',
        className,
      )}
    >
      {/* ── TOP HEADER (Full Width) ── */}
      <div className="w-full flex flex-col items-center md:items-start p-6 sm:p-8 border-b border-border/50 bg-muted/10">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-foreground">
          <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          {lang === 'en' ? 'Select Date and Time' : 'Seleccionar Fecha y Hora'}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground text-center md:text-left">
          {lang === 'en'
            ? 'Choose an available slot for your request execution.'
            : 'Elige un horario disponible para la ejecución de la solicitud.'}
        </p>
      </div>

      {/* ── BOTTOM CONTENT (Split Columns) ── */}
      <div className="flex flex-col md:flex-row w-full flex-1">
        {/* LEFT PANE: CALENDAR */}
        <div className="flex-1 p-6 sm:p-8 flex justify-center border-b md:border-b-0 md:border-r border-border/50 min-h-[400px]">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              if (!d) setTime(null);
            }}
            defaultMonth={date || new Date()}
            locale={locale}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today;
            }}
            className="p-0 bg-transparent flex justify-center [--cell-size:2.8rem] sm:[--cell-size:3rem] md:[--cell-size:3.5rem]"
          />
        </div>

        {/* RIGHT PANE: TIMEPICKER */}
        <div className="relative h-[350px] w-full shrink-0 overflow-hidden md:h-auto md:min-h-[500px] md:w-[320px] bg-muted/5">
          <div className="absolute inset-0 flex flex-col pt-6 md:pt-8">
            <div className="flex items-center justify-center gap-2 px-6 pb-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-center text-sm font-semibold text-foreground">
                {lang === 'en' ? 'Available Times' : 'Horarios'}
              </p>
            </div>
            <ScrollArea className="flex-1 px-6 pb-6 overflow-y-auto">
              <div className="flex flex-col gap-3 pb-8">
                {availableTimes.map((t) => {
                  const isSelected = time === t;
                  const isPast = (() => {
                    if (!date) return false;
                    const today = new Date();
                    if (date.toDateString() !== today.toDateString())
                      return false;
                    const [hour, minute] = t.split(':').map(Number);
                    const timeDate = new Date();
                    timeDate.setHours(hour, minute, 0, 0);
                    return timeDate < new Date();
                  })();

                  return (
                    <Button
                      key={t}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      className={cn(
                        'w-full h-11 sm:h-12 rounded-xl transition-all duration-200 text-sm sm:text-base cursor-pointer shadow-none',
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                          : 'border-border/60 bg-background text-foreground hover:border-primary hover:text-primary hover:bg-primary/5',
                        isPast &&
                          'pointer-events-none cursor-not-allowed opacity-40 text-muted-foreground bg-muted/20',
                      )}
                      disabled={!date || isPast}
                      onClick={() => setTime(t)}
                    >
                      {t}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
