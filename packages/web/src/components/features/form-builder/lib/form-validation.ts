import * as z from 'zod'
import { FormField, ValidationRule } from '@/components/features/form-builder/types'
import {
  isWeekend,
  isDateDisabled,
  isWithinBusinessHours,
  isDateInRange,
  isTimeInRange,
  extractTime,
  extractDate,
  formatDateForDisplay,
  formatTimeForDisplay,
  formatDateToYMD,
} from './date-time-validation'

const createValidationForRule = (rule: ValidationRule, schema: z.ZodTypeAny): z.ZodTypeAny => {
  switch (rule.operator) {
    // String validations
    case 'contains':
      return schema.refine(
        (val: any) => String(val).includes(rule.value as string),
        { message: rule.errorMessage || `Debe contener "${rule.value}"` }
      )
    case 'notContains':
      return schema.refine(
        (val: any) => !String(val).includes(rule.value as string),
        { message: rule.errorMessage || `No debe contener "${rule.value}"` }
      )
    case 'equals':
      return schema.refine(
        (val: any) => val === rule.value,
        { message: rule.errorMessage || `Debe ser igual a "${rule.value}"` }
      )
    case 'notEquals':
      return schema.refine(
        (val: any) => val !== rule.value,
        { message: rule.errorMessage || `No debe ser igual a "${rule.value}"` }
      )
    case 'matches':
      return schema.refine(
        (val: any) => new RegExp(rule.value as string).test(String(val)),
        { message: rule.errorMessage || 'Formato inválido' }
      )
    case 'minLength':
      return schema.refine(
        (val: any) => String(val).length >= (rule.value as number),
        { message: rule.errorMessage || `Mínimo ${rule.value} caracteres` }
      )
    case 'maxLength':
      return schema.refine(
        (val: any) => String(val).length <= (rule.value as number),
        { message: rule.errorMessage || `Máximo ${rule.value} caracteres` }
      )
    case 'length':
      return schema.refine(
        (val: any) => String(val).length === (rule.value as number),
        { message: rule.errorMessage || `Debe tener exactamente ${rule.value} caracteres` }
      )
    case 'isEmail':
      return schema.refine(
        (val: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val)),
        { message: rule.errorMessage || 'Email inválido' }
      )
    case 'isUrl':
      return schema.refine(
        (val: any) => /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(String(val)),
        { message: rule.errorMessage || 'URL inválida' }
      )

    // Number validations
    case 'greaterThan':
      return schema.refine(
        (val: any) => Number(val) > (rule.value as number),
        { message: rule.errorMessage || `Debe ser mayor que ${rule.value}` }
      )
    case 'greaterThanOrEqual':
      return schema.refine(
        (val: any) => Number(val) >= (rule.value as number),
        { message: rule.errorMessage || `Debe ser mayor o igual a ${rule.value}` }
      )
    case 'lessThan':
      return schema.refine(
        (val: any) => Number(val) < (rule.value as number),
        { message: rule.errorMessage || `Debe ser menor que ${rule.value}` }
      )
    case 'lessThanOrEqual':
      return schema.refine(
        (val: any) => Number(val) <= (rule.value as number),
        { message: rule.errorMessage || `Debe ser menor o igual a ${rule.value}` }
      )
    case 'between':
      return schema.refine(
        (val: any) => {
          const num = Number(val);
          return num >= (rule.value as number) && num <= (rule.value2 as number);
        },
        { message: rule.errorMessage || `Debe estar entre ${rule.value} y ${rule.value2}` }
      )
    case 'notBetween':
      return schema.refine(
        (val: any) => {
          const num = Number(val);
          return num < (rule.value as number) || num > (rule.value2 as number);
        },
        { message: rule.errorMessage || `No debe estar entre ${rule.value} y ${rule.value2}` }
      )
    case 'isInteger':
      return schema.refine(
        (val: any) => Number.isInteger(Number(val)),
        { message: rule.errorMessage || 'Debe ser un número entero' }
      )

    default:
      return schema
  }
}

const createFieldValidation = (field: FormField) => {
  let schema: z.ZodTypeAny = z.any()

  // Base schema based on field type
  switch (field.type) {
    case 'text':
    case 'phone':
    case 'textarea':
      schema = z.string().transform(val => val || '')
      break
    case 'number':
      schema = z.union([z.number(), z.string().transform(val => val === '' ? '' : Number(val))])
      break
    case 'date':
    case 'time':
      schema = z.string()
      break
    case 'select':
    case 'radio':
      schema = z.string()
      break
    case 'multiselect':
      schema = z.array(z.string()).default([])
      break
    case 'imageSelect':
      schema = z.string()
      break
    case 'imageSelectMulti':
      schema = z.array(z.string()).default([])
      break
    case 'toggle':
      schema = z.boolean().default(false)
      break
    case 'range':
      schema = z.number()
      break
    default:
      schema = z.any()
  }

  // Apply date/time-specific validations
  if (field.type === 'date' && field.dateOptions) {
    const options = field.dateOptions;
    const mode = options.mode || 'date';
    const locale = options.locale || 'en';

    // Date-specific validations
    if (mode === 'date' || mode === 'datetime') {
      // Min date
      if (options.minDate) {
        schema = schema.refine(
          (val: any) => {
            if (!val) return true; // Skip if empty (handled by required)
            const date = extractDate(val);
            const result = isDateInRange(date, options.minDate, undefined);
            return result.valid;
          },
          {
            message: `Fecha mínima: ${formatDateForDisplay(options.minDate, locale)}`,
          }
        );
      }

      // Max date
      if (options.maxDate) {
        schema = schema.refine(
          (val: any) => {
            if (!val) return true;
            const date = extractDate(val);
            const result = isDateInRange(date, undefined, options.maxDate);
            return result.valid;
          },
          {
            message: `Fecha máxima: ${formatDateForDisplay(options.maxDate, locale)}`,
          }
        );
      }

      // Weekends
      if (options.disableWeekends) {
        schema = schema.refine(
          (val: any) => {
            if (!val) return true;
            const date = extractDate(val);
            return !isWeekend(date);
          },
          {
            message: locale === 'es' ? 'Fines de semana no permitidos' : 'Weekends not allowed',
          }
        );
      }

      // Disabled dates
      if (options.disabledDates && options.disabledDates.length > 0) {
        schema = schema.refine(
          (val: any) => {
            if (!val) return true;
            const date = extractDate(val);
            return !isDateDisabled(date, options.disabledDates!);
          },
          {
            message: locale === 'es' ? 'Esta fecha no está permitida' : 'This date is not allowed',
          }
        );
      }
    }

    // Time-specific validations
    if (mode === 'time' || mode === 'datetime') {
      const hourCycle = options.hourCycle || 24;

      // Min time
      if (options.minTime) {
        schema = schema.refine(
          (val: any) => {
            if (!val) return true;
            const time = mode === 'time' ? val : extractTime(val);
            const result = isTimeInRange(time, options.minTime, undefined);
            return result.valid;
          },
          {
            message: `Hora mínima: ${formatTimeForDisplay(options.minTime, hourCycle)}`,
          }
        );
      }

      // Max time
      if (options.maxTime) {
        schema = schema.refine(
          (val: any) => {
            if (!val) return true;
            const time = mode === 'time' ? val : extractTime(val);
            const result = isTimeInRange(time, undefined, options.maxTime);
            return result.valid;
          },
          {
            message: `Hora máxima: ${formatTimeForDisplay(options.maxTime, hourCycle)}`,
          }
        );
      }

      // Business hours
      if (options.businessHours?.enabled) {
        schema = schema.refine(
          (val: any) => {
            if (!val) return true;
            const time = mode === 'time' ? val : extractTime(val);
            return isWithinBusinessHours(time, options.businessHours);
          },
          {
            message:
              locale === 'es'
                ? `Horario laboral: ${formatTimeForDisplay(options.businessHours.start || '09:00', hourCycle)} - ${formatTimeForDisplay(options.businessHours.end || '17:00', hourCycle)}`
                : `Business hours: ${formatTimeForDisplay(options.businessHours.start || '09:00', hourCycle)} - ${formatTimeForDisplay(options.businessHours.end || '17:00', hourCycle)}`,
          }
        );
      }
    }
  }

  // Apply required validation
  if (field.validation?.required) {
    if (field.type === 'toggle') {
      schema = schema.refine((val) => val === true, {
        message: field.validation?.errorMessage || "Este campo es obligatorio"
      })
    } else if (field.type === 'multiselect') {
      schema = schema.refine((val) => Array.isArray(val) && val.length > 0, {
        message: field.validation?.errorMessage || "Seleccione al menos una opción"
      })
    } else {
      schema = schema.refine((val) => {
        if (val === undefined || val === null || val === '') return false;
        return true;
      }, {
        message: field.validation?.errorMessage || "Este campo es obligatorio"
      })
    }
  }

  // Apply custom validation rules
  if (field.validation?.rules && field.validation.rules.length > 0) {
    field.validation.rules.forEach(rule => {
      schema = createValidationForRule(rule, schema)
    })
  }

  return schema
}

export const createFormValidationSchema = (fields: FormField[]) => {
  const schemaShape = fields.reduce((acc, field) => {
    acc[field.id] = createFieldValidation(field)
    return acc
  }, {} as Record<string, z.ZodTypeAny>)

  return z.object(schemaShape)
}
