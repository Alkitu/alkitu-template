import { z } from 'zod';
import { UserRole, UserStatus } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContactPersonDto } from './create-user.dto';

/**
 * Contact person schema for Zod validation (ALI-115)
 */
const ContactPersonSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  lastname: z.string().min(2, 'Lastname must be at least 2 characters'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email format'),
});

/**
 * Update user schema (ALI-115)
 * Updated with new field names and ALI-115 fields
 */
export const UpdateUserSchema = z.object({
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
  profileComplete: z.boolean().optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

/**
 * Update User DTO (ALI-115 refactored)
 * Updated field names: name→firstname, lastName→lastname, contactNumber→phone
 * Added fields: company, address, contactPerson, profileComplete
 */
export class UpdateUserDto {
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
    description: 'Address',
    example: '123 Main St, City, State, ZIP',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Contact person details',
    type: () => ContactPersonDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactPersonDto)
  contactPerson?: ContactPersonDto;

  @ApiPropertyOptional({
    description: 'Profile completion status',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  profileComplete?: boolean;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'User status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
