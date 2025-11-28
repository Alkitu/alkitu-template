// @ts-nocheck
import { z } from 'zod';
import { IsEmail, IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 2
  })
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name!: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 2
  })
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  lastName!: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123',
    minLength: 6
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;

  @ApiPropertyOptional({
    description: 'User contact number',
    example: '+1234567890'
  })
  @IsOptional()
  @IsString()
  contactNumber?: string;

  @ApiProperty({
    description: 'Acceptance of terms and conditions',
    example: true
  })
  @IsBoolean({ message: 'You must accept the terms and conditions' })
  terms!: boolean;
}
