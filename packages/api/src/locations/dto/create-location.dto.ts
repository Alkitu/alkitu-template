import { z } from 'zod';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * US State validation (2-letter code)
 */
const StateCodeSchema = z
  .string()
  .length(2, 'State must be a 2-letter US state code')
  .regex(/^[A-Z]{2}$/, 'State must be uppercase 2-letter code (e.g., NY, CA)');

/**
 * ZIP code validation (5 digits or 5+4 format)
 */
const ZipCodeSchema = z
  .string()
  .regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be 5 digits or 5+4 format');

/**
 * Work Location creation schema (ALI-117)
 */
export const CreateLocationSchema = z.object({
  street: z.string().min(1, 'Street is required').max(200, 'Street too long'),
  building: z.string().max(100, 'Building name too long').optional(),
  tower: z.string().max(100, 'Tower name too long').optional(),
  floor: z.string().max(50, 'Floor too long').optional(),
  unit: z.string().max(50, 'Unit too long').optional(),
  city: z.string().min(1, 'City is required').max(100, 'City name too long'),
  zip: ZipCodeSchema,
  state: StateCodeSchema,
});

/**
 * Work Location creation DTO (ALI-117)
 * Used for creating new work locations for users
 */
export class CreateLocationDto {
  @ApiProperty({
    description: 'Street address',
    example: '123 Main Street',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Street is required' })
  @MaxLength(200, { message: 'Street address is too long' })
  street!: string;

  @ApiPropertyOptional({
    description: 'Building name or number',
    example: 'Empire State Building',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Building name is too long' })
  building?: string;

  @ApiPropertyOptional({
    description: 'Tower name or identifier',
    example: 'Tower A',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Tower name is too long' })
  tower?: string;

  @ApiPropertyOptional({
    description: 'Floor number or identifier',
    example: '5th Floor',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Floor is too long' })
  floor?: string;

  @ApiPropertyOptional({
    description: 'Unit, suite, or apartment number',
    example: 'Suite 500',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Unit is too long' })
  unit?: string;

  @ApiProperty({
    description: 'City name',
    example: 'New York',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'City is required' })
  @MaxLength(100, { message: 'City name is too long' })
  city!: string;

  @ApiProperty({
    description: 'ZIP code (5 digits or 5+4 format)',
    example: '10001',
    pattern: '^\\d{5}(-\\d{4})?$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}(-\d{4})?$/, {
    message: 'ZIP code must be 5 digits or 5+4 format',
  })
  zip!: string;

  @ApiProperty({
    description: '2-letter US state code (uppercase)',
    example: 'NY',
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}$/, {
    message: 'State must be a 2-letter uppercase code (e.g., NY, CA)',
  })
  state!: string;

  @ApiPropertyOptional({
    description: 'Icon name (Lucide icon or Emoji)',
    example: 'MapPin',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: 'Set as default location',
    default: false,
  })
  @IsString()
  @IsOptional()
  iconColor?: string;

  @ApiPropertyOptional({
    description: 'Set as default location',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
