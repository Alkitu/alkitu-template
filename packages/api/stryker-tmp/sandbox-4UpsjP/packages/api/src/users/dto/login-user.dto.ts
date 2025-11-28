// @ts-nocheck
import { z } from 'zod';

export const LoginUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export class LoginUserDto {
  email!: string;
  password!: string;
}
