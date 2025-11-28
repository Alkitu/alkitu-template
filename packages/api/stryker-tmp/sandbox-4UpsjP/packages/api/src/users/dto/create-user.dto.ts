// @ts-nocheck
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  contactNumber: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

export class CreateUserDto {
  email!: string;
  name!: string;
  lastName!: string;
  password!: string;
  contactNumber?: string;
  terms!: boolean;
}
