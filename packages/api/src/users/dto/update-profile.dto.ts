import { z } from 'zod';
import {
  IsString,
  IsOptional,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContactPersonDto } from './create-user.dto';

/**
 * Contact person schema for Zod validation (ALI-116)
 */
const ContactPersonSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  lastname: z.string().min(2, 'Lastname must be at least 2 characters'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email format'),
});

/**
 * Update profile schema (ALI-116)
 * Used for user self-service profile updates.
 * Does NOT allow changing: email, password, role, status, profileComplete
 */
export const UpdateProfileSchema = z.object({
  firstname: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .optional(),
  lastname: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  contactPerson: ContactPersonSchema.optional(),
});

/**
 * Update Profile DTO (ALI-116)
 *
 * This DTO is used when users update their own profile.
 * It's more restrictive than UpdateUserDto:
 * - Cannot change email (security concern)
 * - Cannot change password (use change-password endpoint)
 * - Cannot change role (admin only)
 * - Cannot change status (admin only)
 * - Cannot change profileComplete (automatic)
 *
 * Available fields:
 * - firstname, lastname, phone, company (all roles)
 * - address, contactPerson (CLIENT role only, validated in service)
 */
export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
    minLength: 2,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  firstname?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
    minLength: 2,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  lastname?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Company name',
    example: 'Acme Inc.',
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({
    description: 'Address (CLIENT role only)',
    example: '123 Main St, City, State, ZIP',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Contact person details (CLIENT role only)',
    type: () => ContactPersonDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactPersonDto)
  contactPerson?: ContactPersonDto;
}


