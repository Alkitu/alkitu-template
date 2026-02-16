/**
 * Translation helpers for date-time components
 * Supports English (en) and Spanish (es)
 */

export const translations = {
  en: {
    // Picker placeholders
    pickDate: 'Pick a date',
    pickTime: 'Pick a time',
    pickDateTime: 'Pick date and time',
    selectDate: 'Select date',
    selectTime: 'Select time',

    // Editor labels
    mode: 'Field mode',
    modeDate: 'Date only',
    modeTime: 'Time only',
    modeDateTime: 'Date and time',
    language: 'Language',
    dateOptions: 'Date options',
    timeOptions: 'Time options',
    commonOptions: 'Common options',

    // Date restrictions
    minDate: 'Minimum date',
    maxDate: 'Maximum date',
    disableWeekends: 'Block weekends',
    disabledDates: 'Blocked dates',
    addDate: 'Add date',

    // Time restrictions
    hourFormat: 'Hour format',
    format12h: '12 hours (AM/PM)',
    format24h: '24 hours',
    includeSeconds: 'Include seconds',
    minTime: 'Minimum time',
    maxTime: 'Maximum time',
    businessHours: 'Business hours',
    enableBusinessHours: 'Enable business hours restriction',
    startTime: 'Start time',
    endTime: 'End time',

    // Common
    placeholder: 'Placeholder',
    showDescription: 'Show description',
    description: 'Description',
    required: 'Required field',

    // Validation messages
    weekendsDisabled: 'Weekends are not allowed',
    dateNotAllowed: 'This date is not allowed',
    timeNotAllowed: 'This time is not allowed',
    dateMinError: 'Date must be after',
    dateMaxError: 'Date must be before',
    timeMinError: 'Time must be after',
    timeMaxError: 'Time must be before',
    businessHoursError: 'Time must be within business hours',
  },
  es: {
    // Picker placeholders
    pickDate: 'Seleccionar fecha',
    pickTime: 'Seleccionar hora',
    pickDateTime: 'Seleccionar fecha y hora',
    selectDate: 'Seleccionar fecha',
    selectTime: 'Seleccionar hora',

    // Editor labels
    mode: 'Modo del campo',
    modeDate: 'Solo fecha',
    modeTime: 'Solo hora',
    modeDateTime: 'Fecha y hora',
    language: 'Idioma',
    dateOptions: 'Opciones de fecha',
    timeOptions: 'Opciones de hora',
    commonOptions: 'Opciones comunes',

    // Date restrictions
    minDate: 'Fecha mínima',
    maxDate: 'Fecha máxima',
    disableWeekends: 'Bloquear fines de semana',
    disabledDates: 'Fechas bloqueadas',
    addDate: 'Añadir fecha',

    // Time restrictions
    hourFormat: 'Formato de hora',
    format12h: '12 horas (AM/PM)',
    format24h: '24 horas',
    includeSeconds: 'Incluir segundos',
    minTime: 'Hora mínima',
    maxTime: 'Hora máxima',
    businessHours: 'Horario laboral',
    enableBusinessHours: 'Habilitar restricción de horario laboral',
    startTime: 'Hora de inicio',
    endTime: 'Hora de fin',

    // Common
    placeholder: 'Marcador de posición',
    showDescription: 'Mostrar descripción',
    description: 'Descripción',
    required: 'Campo obligatorio',

    // Validation messages
    weekendsDisabled: 'Fines de semana no permitidos',
    dateNotAllowed: 'Esta fecha no está permitida',
    timeNotAllowed: 'Esta hora no está permitida',
    dateMinError: 'La fecha debe ser posterior a',
    dateMaxError: 'La fecha debe ser anterior a',
    timeMinError: 'La hora debe ser posterior a',
    timeMaxError: 'La hora debe ser anterior a',
    businessHoursError: 'La hora debe estar dentro del horario laboral',
  },
};

export type TranslationKey = keyof typeof translations.en;
export type SupportedLocale = keyof typeof translations;

/**
 * Get translated string for a given key and locale
 */
export function t(key: TranslationKey, locale: SupportedLocale = 'en'): string {
  return translations[locale][key] || translations.en[key];
}

/**
 * Get translator function bound to a specific locale
 */
export function getTranslator(locale: SupportedLocale = 'en') {
  return (key: TranslationKey) => t(key, locale);
}
