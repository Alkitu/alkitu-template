// @ts-nocheck
import { z } from 'zod';

export const CreateNotificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message is too long'),
  type: z
    .enum(['info', 'warning', 'error', 'success'], {
      errorMap: () => ({
        message: 'Type must be one of: info, warning, error, success',
      }),
    })
    .default('info'),
  link: z.string().url('Link must be a valid URL').optional(),
});

export class CreateNotificationDto {
  userId!: string;
  message!: string;
  type!: 'info' | 'warning' | 'error' | 'success';
  link?: string;
}

export class BulkMarkAsReadDto {
  notificationIds!: string[];
}

export class BulkDeleteDto {
  notificationIds!: string[];
}

export class DeleteByTypeDto {
  type!: string;
}
