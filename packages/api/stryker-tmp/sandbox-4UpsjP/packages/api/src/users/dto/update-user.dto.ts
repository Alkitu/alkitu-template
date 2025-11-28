// @ts-nocheck
import { z } from 'zod';
import { UserRole, UserStatus } from '@prisma/client';

export const UpdateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .optional(),
  contactNumber: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export class UpdateUserDto {
  name?: string;
  lastName?: string;
  contactNumber?: string;
  role?: UserRole;
  status?: UserStatus;
}
