'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';
import type { TimePickerProps } from './TimePicker.types';

/**
 * Translation labels for the TimePicker component
 */
const TRANSLATIONS = {
  en: {
    selectTime: 'Select time',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    accept: 'Accept',
    cancel: 'Cancel',
  },
  es: {
    selectTime: 'Seleccionar hora',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    accept: 'Aceptar',
    cancel: 'Cancelar',
  },
};

/**
 * TimePicker Atom Component
 *
 * Provides a time selection interface with support for:
 * - 12h/24h format
 * - Optional seconds
 * - Time intervals for quick selection
 * - Hour range restrictions
 * - Keyboard navigation
 * - Full accessibility (ARIA labels)
 *
 * @component
 * @example
 * ```tsx
 * // 24-hour format
 * <TimePicker
 *   value="14:30"
 *   onChange={(time) => console.log(time)}
 *   format24
 * />
 *
 * // 12-hour format with 15-minute intervals
 * <TimePicker
 *   value="02:30"
 *   onChange={(time) => console.log(time)}
 *   interval={15}
 * />
 * ```
 */
export function TimePicker({
  value,
  onChange,
  format24 = false,
  includeSeconds = false,
  interval,
  minHour,
  maxHour,
  placeholder,
  disabled = false,
  className,
  locale = 'en',
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hours, setHours] = React.useState('00');
  const [minutes, setMinutes] = React.useState('00');
  const [seconds, setSeconds] = React.useState('00');
  const [period, setPeriod] = React.useState<'AM' | 'PM'>('AM');

  const t = TRANSLATIONS[locale];

  // Parse the incoming value
  React.useEffect(() => {
    if (value) {
      const [time, meridian] = value.split(' ');
      const [h, m, s] = time.split(':');

      if (format24) {
        setHours(h.padStart(2, '0'));
        setPeriod(parseInt(h) >= 12 ? 'PM' : 'AM');
      } else {
        const hour24 = parseInt(h);
        const hour12 = hour24 % 12 || 12;
        setHours(hour12.toString().padStart(2, '0'));
        setPeriod(hour24 >= 12 ? 'PM' : 'AM');
      }

      setMinutes(m.padStart(2, '0'));
      if (s) setSeconds(s.padStart(2, '0'));
    }
  }, [value, format24]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setHours('00');
      return;
    }
    const numeric = parseInt(val);
    const maxHourValue = maxHour ?? (format24 ? 23 : 12);
    const minHourValue = minHour ?? (format24 ? 0 : 1);

    if (format24) {
      if (numeric >= minHourValue && numeric <= maxHourValue) {
        setHours(numeric.toString().padStart(2, '0'));
      }
    } else {
      if (numeric >= minHourValue && numeric <= maxHourValue) {
        setHours(numeric.toString().padStart(2, '0'));
      }
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setMinutes('00');
      return;
    }
    const numeric = parseInt(val);
    if (numeric >= 0 && numeric <= 59) {
      setMinutes(numeric.toString().padStart(2, '0'));
    }
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setSeconds('00');
      return;
    }
    const numeric = parseInt(val);
    if (numeric >= 0 && numeric <= 59) {
      setSeconds(numeric.toString().padStart(2, '0'));
    }
  };

  const updateTime = () => {
    let h = parseInt(hours);
    if (!format24) {
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
    }
    const timeString = `${h.toString().padStart(2, '0')}:${minutes}${
      includeSeconds ? `:${seconds}` : ''
    }`;
    onChange(timeString);
    setIsOpen(false);
  };

  const generateIntervalOptions = () => {
    if (!interval) return null;

    const options: string[] = [];
    const maxHourValue = maxHour ?? (format24 ? 23 : 12);
    const minHourValue = minHour ?? (format24 ? 0 : 1);

    for (let h = minHourValue; h <= maxHourValue; h++) {
      for (let m = 0; m < 60; m += interval) {
        const displayHour = format24 ? h : h % 12 || 12;
        const timeStr = `${displayHour.toString().padStart(2, '0')}:${m
          .toString()
          .padStart(2, '0')}`;
        const hour24 = format24 ? h : h;
        const displayPeriod = !format24 ? (h >= 12 ? ' PM' : ' AM') : '';
        options.push(timeStr + displayPeriod);
      }
    }

    return options;
  };

  const intervalOptions = generateIntervalOptions();

  const displayValue =
    value || placeholder || t.selectTime;

  const formatDisplayTime = (time: string) => {
    if (!time || time === placeholder || time === t.selectTime) return time;

    const [timePart, periodPart] = time.split(' ');
    const [h, m, s] = timePart.split(':');

    if (format24) {
      return includeSeconds ? `${h}:${m}:${s || '00'}` : `${h}:${m}`;
    } else {
      const hour24 = parseInt(h);
      const hour12 = hour24 % 12 || 12;
      const displayPeriod = hour24 >= 12 ? ' PM' : ' AM';
      return includeSeconds
        ? `${hour12.toString().padStart(2, '0')}:${m}:${s || '00'}${displayPeriod}`
        : `${hour12.toString().padStart(2, '0')}:${m}${displayPeriod}`;
    }
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'inline-flex items-center justify-start w-full px-3 py-2',
            'border border-input rounded-md',
            'bg-background text-sm font-normal',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            !value && 'text-muted-foreground',
            className
          )}
          aria-label={t.selectTime}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <Clock className="mr-2 h-4 w-4" aria-hidden="true" />
          {formatDisplayTime(displayValue)}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 w-auto p-4 bg-popover text-popover-foreground border border-border rounded-md shadow-md outline-none"
          sideOffset={5}
          align="start"
        >
          {intervalOptions ? (
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
              {intervalOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    const [time, period] = option.split(' ');
                    const [h, m] = time.split(':');
                    let hour24 = parseInt(h);

                    if (!format24 && period) {
                      if (period === 'PM' && hour24 !== 12) hour24 += 12;
                      if (period === 'AM' && hour24 === 12) hour24 = 0;
                    }

                    onChange(`${hour24.toString().padStart(2, '0')}:${m}`);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'px-3 py-2 text-sm text-left rounded hover:bg-accent hover:text-accent-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-ring'
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex gap-2 items-end">
                <div className="grid gap-1">
                  <label
                    htmlFor="hours"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    {t.hours}
                  </label>
                  <input
                    id="hours"
                    className="w-[64px] px-2 py-1 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={hours}
                    onChange={handleHoursChange}
                    type="number"
                    min={minHour ?? (format24 ? 0 : 1)}
                    max={maxHour ?? (format24 ? 23 : 12)}
                    aria-label={t.hours}
                  />
                </div>
                <div className="grid gap-1">
                  <label
                    htmlFor="minutes"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    {t.minutes}
                  </label>
                  <input
                    id="minutes"
                    className="w-[64px] px-2 py-1 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={minutes}
                    onChange={handleMinutesChange}
                    type="number"
                    min={0}
                    max={59}
                    aria-label={t.minutes}
                  />
                </div>
                {includeSeconds && (
                  <div className="grid gap-1">
                    <label
                      htmlFor="seconds"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      {t.seconds}
                    </label>
                    <input
                      id="seconds"
                      className="w-[64px] px-2 py-1 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      value={seconds}
                      onChange={handleSecondsChange}
                      type="number"
                      min={0}
                      max={59}
                      aria-label={t.seconds}
                    />
                  </div>
                )}
                {!format24 && (
                  <div className="grid gap-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      AM/PM
                    </label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setPeriod('AM')}
                        className={cn(
                          'px-3 py-1 text-sm rounded border',
                          period === 'AM'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-input hover:bg-accent',
                          'focus:outline-none focus:ring-2 focus:ring-ring'
                        )}
                        aria-pressed={period === 'AM'}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() => setPeriod('PM')}
                        className={cn(
                          'px-3 py-1 text-sm rounded border',
                          period === 'PM'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-input hover:bg-accent',
                          'focus:outline-none focus:ring-2 focus:ring-ring'
                        )}
                        aria-pressed={period === 'PM'}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-sm rounded border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={updateTime}
                  className="px-3 py-1.5 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {t.accept}
                </button>
              </div>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
