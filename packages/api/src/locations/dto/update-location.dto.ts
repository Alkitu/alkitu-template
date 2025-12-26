import { z } from 'zod';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateLocationDto } from './create-location.dto';

/**
 * Work Location update schema (ALI-117)
 * All fields are optional for partial updates
 */
export const UpdateLocationSchema = z
  .object({
    street: z.string().min(1).max(200).optional(),
    building: z.string().max(100).optional(),
    tower: z.string().max(100).optional(),
    floor: z.string().max(50).optional(),
    unit: z.string().max(50).optional(),
    city: z.string().min(1).max(100).optional(),
    zip: z
      .string()
      .regex(/^\d{5}(-\d{4})?$/)
      .optional(),
    state: z
      .string()
      .regex(/^[A-Z]{2}$/)
      .optional(),
  })
  .partial();

/**
 * Work Location update DTO (ALI-117)
 * Extends CreateLocationDto with all fields optional for partial updates
 */
export class UpdateLocationDto extends PartialType(CreateLocationDto) {
  @ApiPropertyOptional({
    description: 'Street address',
    example: '123 Main Street',
    minLength: 1,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  street?: string;

  @ApiPropertyOptional({
    description: 'Building name or number',
    example: 'Empire State Building',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  building?: string;

  @ApiPropertyOptional({
    description: 'Tower name or identifier',
    example: 'Tower A',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tower?: string;

  @ApiPropertyOptional({
    description: 'Floor number or identifier',
    example: '5th Floor',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  floor?: string;

  @ApiPropertyOptional({
    description: 'Unit, suite, or apartment number',
    example: 'Suite 500',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string;

  @ApiPropertyOptional({
    description: 'City name',
    example: 'New York',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({
    description: 'ZIP code (5 digits or 5+4 format)',
    example: '10001',
    pattern: '^\\d{5}(-\\d{4})?$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{5}(-\d{4})?$/)
  zip?: string;

  @ApiPropertyOptional({
    description: '2-letter US state code (uppercase)',
    example: 'NY',
    minLength: 2,
    maxLength: 2,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{2}$/)
  state?: string;
}
