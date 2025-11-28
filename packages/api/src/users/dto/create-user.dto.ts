import { z } from 'zod';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

/**
 * Password validation schema (ALI-115)
 * - Minimum 8 characters
 * - Must contain at least one uppercase letter
 * - Must contain at least one lowercase letter
 * - Must contain at least one number
 */
const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(50, 'Password must not exceed 50 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Contact person schema (ALI-115)
 */
const ContactPersonSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  lastname: z.string().min(2, 'Lastname must be at least 2 characters'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email format'),
});

/**
 * User registration schema (ALI-115)
 * Minimal fields for quick registration, additional fields collected in onboarding
 */
export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: PasswordSchema,
  firstname: z.string().min(2, 'First name must be at least 2 characters'),
  lastname: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  contactPerson: ContactPersonSchema.optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

/**
 * Contact Person DTO (embedded in User - ALI-115)
 */
export class ContactPersonDto {
  @ApiProperty({ example: 'Jane', description: 'Contact person first name' })
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Smith', description: 'Contact person last name' })
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  lastname!: string;

  @ApiProperty({ example: '+1234567890', description: 'Contact person phone' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({
    example: 'jane@example.com',
    description: 'Contact person email',
  })
  @IsEmail({}, { message: 'Please provide a valid email for contact person' })
  @IsNotEmpty()
  email!: string;
}

/**
 * User registration DTO (ALI-115)
 * Minimal fields for quick registration, additional fields collected in onboarding
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description:
      'Password (min 8 chars, must contain uppercase, lowercase, and number)',
    example: 'SecurePass123',
    minLength: 8,
    maxLength: 50,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password!: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @IsNotEmpty()
  firstname!: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @IsNotEmpty()
  lastname!: string;

  @ApiPropertyOptional({
    description: 'Phone number (collected in onboarding)',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Company name (collected in onboarding)',
    example: 'Acme Inc.',
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({
    description: 'Address (collected in onboarding)',
    example: '123 Main St, City',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Contact person details (collected in onboarding)',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactPersonDto)
  contactPerson?: ContactPersonDto;

  @ApiProperty({
    description: 'User must accept terms and conditions',
    example: true,
  })
  @IsBoolean()
  terms!: boolean;

  @ApiPropertyOptional({
    description: 'User role (defaults to CLIENT if not specified)',
    enum: UserRole,
    example: UserRole.CLIENT,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be a valid UserRole' })
  role?: UserRole;
}
