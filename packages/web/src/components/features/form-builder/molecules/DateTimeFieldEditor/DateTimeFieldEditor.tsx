'use client';

import * as React from 'react';
import { ChevronRight, X } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Label } from '@/components/primitives/ui/label';
import { Switch } from '@/components/primitives/ui/switch';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Textarea } from '@/components/primitives/ui/textarea';
import { TimePicker } from '../../atoms/TimePicker';
import { translations } from '../../lib/date-time-i18n';
import type { DateTimeFieldEditorProps, DateTimeMode, HourCycle } from './DateTimeFieldEditor.types';
import type { DateFieldOptions } from '@alkitu/shared';

/**
 * DateTimeFieldEditor Molecule Component
 *
 * A comprehensive field editor for date, time, and datetime fields.
 * Supports extensive configuration including:
 * - Mode selection (date/time/datetime)
 * - Date range restrictions (min/max)
 * - Time range restrictions (min/max)
 * - Disabled dates and weekends
 * - Business hours restrictions
 * - 12h/24h time format
 * - Locale support (EN/ES)
 * - i18n for placeholders and descriptions
 *
 * @component
 * @example
 * ```tsx
 * <DateTimeFieldEditor
 *   field={dateField}
 *   onChange={handleFieldChange}
 *   editingLocale="en"
 *   defaultLocale="en"
 * />
 * ```
 */
export function DateTimeFieldEditor({
  field,
  onChange,
  editingLocale = 'en',
  defaultLocale = 'en',
  disabled = false,
}: DateTimeFieldEditorProps) {
  const dateOptions = field.dateOptions || {};
  const isDefaultLocale = editingLocale === defaultLocale;
  const t = translations[editingLocale];

  // Determine which sections to show based on mode
  const mode: DateTimeMode = dateOptions.mode || 'date';
  const showDateOptions = mode === 'date' || mode === 'datetime';
  const showTimeOptions = mode === 'time' || mode === 'datetime';

  /**
   * Update date options while preserving existing values
   */
  const updateDateOptions = React.useCallback(
    (updates: Partial<DateFieldOptions>) => {
      onChange({
        ...field,
        dateOptions: {
          ...dateOptions,
          ...updates,
        },
      });
    },
    [field, dateOptions, onChange]
  );

  /**
   * Get localized placeholder based on editing locale
   */
  const getLocalizedPlaceholder = React.useCallback(() => {
    if (isDefaultLocale) return dateOptions.placeholder;
    return field.i18n?.[editingLocale]?.placeholder;
  }, [isDefaultLocale, dateOptions.placeholder, field.i18n, editingLocale]);

  /**
   * Update placeholder with i18n support
   */
  const updateLocalizedPlaceholder = React.useCallback(
    (value: string) => {
      if (isDefaultLocale) {
        updateDateOptions({ placeholder: value });
      } else {
        onChange({
          ...field,
          i18n: {
            ...field.i18n,
            [editingLocale]: {
              ...field.i18n?.[editingLocale],
              placeholder: value,
            },
          },
        });
      }
    },
    [isDefaultLocale, updateDateOptions, onChange, field, editingLocale]
  );

  /**
   * Get localized description based on editing locale
   */
  const getLocalizedDescription = React.useCallback(() => {
    if (isDefaultLocale) return field.description;
    return field.i18n?.[editingLocale]?.description;
  }, [isDefaultLocale, field.description, field.i18n, editingLocale]);

  /**
   * Update description with i18n support
   */
  const updateLocalizedDescription = React.useCallback(
    (value: string) => {
      if (isDefaultLocale) {
        onChange({ ...field, description: value });
      } else {
        onChange({
          ...field,
          i18n: {
            ...field.i18n,
            [editingLocale]: {
              ...field.i18n?.[editingLocale],
              description: value,
            },
          },
        });
      }
    },
    [isDefaultLocale, onChange, field, editingLocale]
  );

  /**
   * Add a date to the disabled dates array
   */
  const handleAddDisabledDate = React.useCallback(
    (dateString: string) => {
      if (!dateString) return;
      const currentDisabledDates = dateOptions.disabledDates || [];
      const newDate = new Date(dateString);
      updateDateOptions({
        disabledDates: [...currentDisabledDates, newDate],
      });
    },
    [dateOptions.disabledDates, updateDateOptions]
  );

  /**
   * Remove a date from the disabled dates array
   */
  const handleRemoveDisabledDate = React.useCallback(
    (index: number) => {
      const currentDisabledDates = dateOptions.disabledDates || [];
      updateDateOptions({
        disabledDates: currentDisabledDates.filter((_, i) => i !== index),
      });
    },
    [dateOptions.disabledDates, updateDateOptions]
  );

  /**
   * Format date for display (handles both Date and string)
   */
  const formatDateDisplay = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(editingLocale === 'es' ? 'es-ES' : 'en-US');
  };

  /**
   * Get default placeholder based on mode and locale
   */
  const getDefaultPlaceholder = (): string => {
    if (mode === 'date') return t.pickDate;
    if (mode === 'time') return t.pickTime;
    return t.pickDateTime;
  };

  return (
    <Collapsible.Root defaultOpen={true}>
      <Collapsible.Trigger className="flex items-center gap-2 w-full py-2 text-sm font-medium hover:underline">
        <ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
        <span>{t.mode}</span>
      </Collapsible.Trigger>

      <Collapsible.Content className="pt-4">
        <div className="space-y-6 border rounded-lg p-4 bg-card">
          {/* Mode Selection */}
          <div>
            <Label className={!isDefaultLocale ? 'text-muted-foreground block mb-3' : 'mb-3 block'}>
              {t.mode}
            </Label>
            <RadioGroup.Root
              value={mode}
              onValueChange={(value: DateTimeMode) => updateDateOptions({ mode: value })}
              disabled={!isDefaultLocale || disabled}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroup.Item
                  value="date"
                  id="mode-date"
                  className="w-4 h-4 rounded-full border border-primary text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-primary" />
                </RadioGroup.Item>
                <Label htmlFor="mode-date" className="font-normal cursor-pointer">
                  {t.modeDate}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroup.Item
                  value="time"
                  id="mode-time"
                  className="w-4 h-4 rounded-full border border-primary text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-primary" />
                </RadioGroup.Item>
                <Label htmlFor="mode-time" className="font-normal cursor-pointer">
                  {t.modeTime}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroup.Item
                  value="datetime"
                  id="mode-datetime"
                  className="w-4 h-4 rounded-full border border-primary text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-primary" />
                </RadioGroup.Item>
                <Label htmlFor="mode-datetime" className="font-normal cursor-pointer">
                  {t.modeDateTime}
                </Label>
              </div>
            </RadioGroup.Root>
          </div>

          {/* Locale Selection */}
          <div>
            <Label className={!isDefaultLocale ? 'text-muted-foreground block mb-3' : 'mb-3 block'}>
              {t.language}
            </Label>
            <RadioGroup.Root
              value={dateOptions.locale || 'en'}
              onValueChange={(value: 'en' | 'es') => updateDateOptions({ locale: value })}
              disabled={!isDefaultLocale || disabled}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroup.Item
                  value="en"
                  id="locale-en"
                  className="w-4 h-4 rounded-full border border-primary text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-primary" />
                </RadioGroup.Item>
                <Label htmlFor="locale-en" className="font-normal cursor-pointer">
                  English (EN)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroup.Item
                  value="es"
                  id="locale-es"
                  className="w-4 h-4 rounded-full border border-primary text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-primary" />
                </RadioGroup.Item>
                <Label htmlFor="locale-es" className="font-normal cursor-pointer">
                  Español (ES)
                </Label>
              </div>
            </RadioGroup.Root>
          </div>

          {/* Date Options Section */}
          {showDateOptions && (
            <Collapsible.Root defaultOpen={true}>
              <Collapsible.Trigger className="flex items-center gap-2 w-full text-sm font-medium hover:underline">
                <ChevronRight className="h-3 w-3 transition-transform data-[state=open]:rotate-90" />
                <span>{t.dateOptions}</span>
              </Collapsible.Trigger>
              <Collapsible.Content className="pt-3">
                <div className="space-y-4 pl-4 border-l-2 border-muted">
                  {/* Min Date */}
                  <div>
                    <Label className={!isDefaultLocale ? 'text-muted-foreground block mb-2' : 'mb-2 block'}>
                      {t.minDate}
                    </Label>
                    {isDefaultLocale && !disabled ? (
                      <Input
                        type="date"
                        value={
                          dateOptions.minDate
                            ? typeof dateOptions.minDate === 'string'
                              ? dateOptions.minDate.split('T')[0]
                              : dateOptions.minDate.toISOString().split('T')[0]
                            : ''
                        }
                        onChange={(e) =>
                          updateDateOptions({
                            minDate: e.target.value ? new Date(e.target.value) : undefined,
                          })
                        }
                        className="w-full"
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        {dateOptions.minDate
                          ? formatDateDisplay(dateOptions.minDate)
                          : editingLocale === 'es'
                            ? 'No editable en traducción'
                            : 'Not editable in translation'}
                      </div>
                    )}
                  </div>

                  {/* Max Date */}
                  <div>
                    <Label className={!isDefaultLocale ? 'text-muted-foreground block mb-2' : 'mb-2 block'}>
                      {t.maxDate}
                    </Label>
                    {isDefaultLocale && !disabled ? (
                      <Input
                        type="date"
                        value={
                          dateOptions.maxDate
                            ? typeof dateOptions.maxDate === 'string'
                              ? dateOptions.maxDate.split('T')[0]
                              : dateOptions.maxDate.toISOString().split('T')[0]
                            : ''
                        }
                        onChange={(e) =>
                          updateDateOptions({
                            maxDate: e.target.value ? new Date(e.target.value) : undefined,
                          })
                        }
                        className="w-full"
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        {dateOptions.maxDate
                          ? formatDateDisplay(dateOptions.maxDate)
                          : editingLocale === 'es'
                            ? 'No editable en traducción'
                            : 'Not editable in translation'}
                      </div>
                    )}
                  </div>

                  {/* Disable Weekends */}
                  <div className="flex items-center justify-between">
                    <Label className={!isDefaultLocale ? 'text-muted-foreground' : ''}>
                      {t.disableWeekends}
                    </Label>
                    <Switch
                      checked={dateOptions.disableWeekends || false}
                      onCheckedChange={(checked) => updateDateOptions({ disableWeekends: checked })}
                      disabled={!isDefaultLocale || disabled}
                    />
                  </div>

                  {/* Disabled Dates */}
                  <div>
                    <Label className={!isDefaultLocale ? 'text-muted-foreground block mb-2' : 'mb-2 block'}>
                      {t.disabledDates}
                    </Label>

                    {/* List of disabled dates */}
                    {dateOptions.disabledDates && dateOptions.disabledDates.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {dateOptions.disabledDates.map((date, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-muted p-2 rounded"
                          >
                            <span className="text-sm">{formatDateDisplay(date)}</span>
                            {isDefaultLocale && !disabled && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveDisabledDate(index)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove date</span>
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add disabled date */}
                    {isDefaultLocale && !disabled && (
                      <Input
                        type="date"
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddDisabledDate(e.target.value);
                            e.target.value = ''; // Clear input after adding
                          }
                        }}
                        placeholder={t.addDate}
                        className="w-full"
                      />
                    )}
                  </div>
                </div>
              </Collapsible.Content>
            </Collapsible.Root>
          )}

          {/* Time Options Section */}
          {showTimeOptions && (
            <Collapsible.Root defaultOpen={true}>
              <Collapsible.Trigger className="flex items-center gap-2 w-full text-sm font-medium hover:underline">
                <ChevronRight className="h-3 w-3 transition-transform data-[state=open]:rotate-90" />
                <span>{t.timeOptions}</span>
              </Collapsible.Trigger>
              <Collapsible.Content className="pt-3">
                <div className="space-y-4 pl-4 border-l-2 border-muted">
                  {/* Hour Format */}
                  <div>
                    <Label className={!isDefaultLocale ? 'text-muted-foreground block mb-3' : 'mb-3 block'}>
                      {t.hourFormat}
                    </Label>
                    <RadioGroup.Root
                      value={String(dateOptions.hourCycle || 24)}
                      onValueChange={(value) =>
                        updateDateOptions({ hourCycle: Number(value) as HourCycle })
                      }
                      disabled={!isDefaultLocale || disabled}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroup.Item
                          value="12"
                          id="format-12"
                          className="w-4 h-4 rounded-full border border-primary text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-primary" />
                        </RadioGroup.Item>
                        <Label htmlFor="format-12" className="font-normal cursor-pointer">
                          {t.format12h}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroup.Item
                          value="24"
                          id="format-24"
                          className="w-4 h-4 rounded-full border border-primary text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-primary" />
                        </RadioGroup.Item>
                        <Label htmlFor="format-24" className="font-normal cursor-pointer">
                          {t.format24h}
                        </Label>
                      </div>
                    </RadioGroup.Root>
                  </div>

                  {/* Include Seconds */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className={!isDefaultLocale ? 'text-muted-foreground' : ''}>
                        {t.includeSeconds}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {editingLocale === 'es'
                          ? 'Incluir selector de segundos en el campo de hora'
                          : 'Include seconds selector in time field'}
                      </p>
                    </div>
                    <Switch
                      checked={dateOptions.includeSeconds || false}
                      onCheckedChange={(checked) => updateDateOptions({ includeSeconds: checked })}
                      disabled={!isDefaultLocale || disabled}
                    />
                  </div>

                  {/* Min Time */}
                  <div>
                    <Label className={!isDefaultLocale ? 'text-muted-foreground block mb-2' : 'mb-2 block'}>
                      {t.minTime}
                    </Label>
                    {isDefaultLocale && !disabled ? (
                      <Input
                        type="time"
                        value={dateOptions.minTime || ''}
                        onChange={(e) => updateDateOptions({ minTime: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        {dateOptions.minTime ||
                          (editingLocale === 'es'
                            ? 'No editable en traducción'
                            : 'Not editable in translation')}
                      </div>
                    )}
                  </div>

                  {/* Max Time */}
                  <div>
                    <Label className={!isDefaultLocale ? 'text-muted-foreground block mb-2' : 'mb-2 block'}>
                      {t.maxTime}
                    </Label>
                    {isDefaultLocale && !disabled ? (
                      <Input
                        type="time"
                        value={dateOptions.maxTime || ''}
                        onChange={(e) => updateDateOptions({ maxTime: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        {dateOptions.maxTime ||
                          (editingLocale === 'es'
                            ? 'No editable en traducción'
                            : 'Not editable in translation')}
                      </div>
                    )}
                  </div>

                  {/* Business Hours */}
                  <Collapsible.Root>
                    <Collapsible.Trigger className="flex items-center gap-2 w-full text-sm hover:underline">
                      <ChevronRight className="h-3 w-3 transition-transform data-[state=open]:rotate-90" />
                      <span className="font-medium">{t.businessHours}</span>
                    </Collapsible.Trigger>
                    <Collapsible.Content className="pt-3">
                      <div className="space-y-3 pl-4">
                        {/* Enable Business Hours */}
                        <div className="flex items-center justify-between">
                          <Label className={!isDefaultLocale ? 'text-muted-foreground' : ''}>
                            {t.enableBusinessHours}
                          </Label>
                          <Switch
                            checked={dateOptions.businessHours?.enabled || false}
                            onCheckedChange={(checked) =>
                              updateDateOptions({
                                businessHours: {
                                  ...dateOptions.businessHours,
                                  enabled: checked,
                                },
                              })
                            }
                            disabled={!isDefaultLocale || disabled}
                          />
                        </div>

                        {dateOptions.businessHours?.enabled && (
                          <>
                            {/* Start Time */}
                            <div>
                              <Label
                                className={!isDefaultLocale ? 'text-muted-foreground block mb-2' : 'mb-2 block'}
                              >
                                {t.startTime}
                              </Label>
                              {isDefaultLocale && !disabled ? (
                                <Input
                                  type="time"
                                  value={dateOptions.businessHours?.start || '09:00'}
                                  onChange={(e) =>
                                    updateDateOptions({
                                      businessHours: {
                                        ...dateOptions.businessHours,
                                        start: e.target.value,
                                      },
                                    })
                                  }
                                  className="w-full"
                                />
                              ) : (
                                <div className="text-sm text-muted-foreground italic">
                                  {dateOptions.businessHours?.start || '09:00'}
                                </div>
                              )}
                            </div>

                            {/* End Time */}
                            <div>
                              <Label
                                className={!isDefaultLocale ? 'text-muted-foreground block mb-2' : 'mb-2 block'}
                              >
                                {t.endTime}
                              </Label>
                              {isDefaultLocale && !disabled ? (
                                <Input
                                  type="time"
                                  value={dateOptions.businessHours?.end || '17:00'}
                                  onChange={(e) =>
                                    updateDateOptions({
                                      businessHours: {
                                        ...dateOptions.businessHours,
                                        end: e.target.value,
                                      },
                                    })
                                  }
                                  className="w-full"
                                />
                              ) : (
                                <div className="text-sm text-muted-foreground italic">
                                  {dateOptions.businessHours?.end || '17:00'}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </Collapsible.Content>
                  </Collapsible.Root>
                </div>
              </Collapsible.Content>
            </Collapsible.Root>
          )}

          {/* Common Options */}
          <Collapsible.Root defaultOpen={true}>
            <Collapsible.Trigger className="flex items-center gap-2 w-full text-sm font-medium hover:underline">
              <ChevronRight className="h-3 w-3 transition-transform data-[state=open]:rotate-90" />
              <span>{t.commonOptions}</span>
            </Collapsible.Trigger>
            <Collapsible.Content className="pt-3">
              <div className="space-y-4 pl-4 border-l-2 border-muted">
                {/* Required */}
                <div className="flex items-center justify-between">
                  <Label className={!isDefaultLocale ? 'text-muted-foreground' : ''}>
                    {t.required}
                  </Label>
                  <Switch
                    checked={field.validation?.required || false}
                    onCheckedChange={(checked) =>
                      onChange({
                        ...field,
                        validation: { ...field.validation, required: checked },
                      })
                    }
                    disabled={!isDefaultLocale || disabled}
                  />
                </div>

                {/* Placeholder */}
                <div>
                  <Label>{t.placeholder}</Label>
                  <Input
                    value={getLocalizedPlaceholder() || ''}
                    onChange={(e) => updateLocalizedPlaceholder(e.target.value)}
                    placeholder={getDefaultPlaceholder()}
                    disabled={disabled}
                    className="w-full"
                  />
                </div>

                {/* Description */}
                <div className="flex items-center justify-between">
                  <Label className={!isDefaultLocale ? 'text-muted-foreground' : ''}>
                    {t.showDescription}
                  </Label>
                  <Switch
                    checked={field.showDescription || false}
                    onCheckedChange={(checked) => onChange({ ...field, showDescription: checked })}
                    disabled={disabled}
                  />
                </div>

                {field.showDescription && (
                  <div>
                    <Label>{t.description}</Label>
                    <Textarea
                      value={getLocalizedDescription() || ''}
                      onChange={(e) => updateLocalizedDescription(e.target.value)}
                      placeholder={t.description}
                      disabled={disabled}
                      className="w-full min-h-[80px]"
                    />
                  </div>
                )}
              </div>
            </Collapsible.Content>
          </Collapsible.Root>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
