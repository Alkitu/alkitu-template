// @ts-nocheck
// 
import { z } from 'zod';

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const NotificationPreferencesSchema = z.object({
  emailEnabled: z.boolean().default(true),
  emailTypes: z.array(z.string()).default(['welcome', 'security', 'system']),

  pushEnabled: z.boolean().default(true),
  pushTypes: z.array(z.string()).default(['urgent', 'mentions', 'system']),

  inAppEnabled: z.boolean().default(true),
  inAppTypes: z.array(z.string()).default(['all']),

  emailFrequency: z
    .enum(['immediate', 'hourly', 'daily', 'weekly'])
    .default('immediate'),
  digestEnabled: z.boolean().default(false),

  quietHoursEnabled: z.boolean().default(false),
  quietHoursStart: z
    .string()
    .regex(timeRegex, 'Time must be in HH:mm format')
    .nullable()
    .optional(),
  quietHoursEnd: z
    .string()
    .regex(timeRegex, 'Time must be in HH:mm format')
    .nullable()
    .optional(),

  marketingEnabled: z.boolean().default(false),
  promotionalEnabled: z.boolean().default(false),
});

export class NotificationPreferencesDto {
  emailEnabled!: boolean;
  emailTypes!: string[];
  pushEnabled!: boolean;
  pushTypes!: string[];
  inAppEnabled!: boolean;
  inAppTypes!: string[];
  emailFrequency!: 'immediate' | 'hourly' | 'daily' | 'weekly';
  digestEnabled!: boolean;
  quietHoursEnabled!: boolean;
  quietHoursStart?: string | null;
  quietHoursEnd?: string | null;
  marketingEnabled!: boolean;
  promotionalEnabled!: boolean;
}
