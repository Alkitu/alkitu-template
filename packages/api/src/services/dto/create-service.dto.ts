import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating a new service
 * @class CreateServiceDto
 */
export class CreateServiceDto {
  /**
   * Service name
   * @example "Emergency Plumbing Repair"
   */
  @ApiProperty({
    description: 'Service name',
    example: 'Emergency Plumbing Repair',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Service name must be at least 2 characters long' })
  @MaxLength(200, { message: 'Service name cannot exceed 200 characters' })
  name: string;

  /**
   * Category ID
   * @example "507f1f77bcf86cd799439011"
   */
  @ApiProperty({
    description: 'Category ID that this service belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  /**
   * Optional thumbnail image URL
   * @example "https://example.com/images/plumbing.jpg"
   */
  @ApiProperty({
    description: 'Thumbnail image URL (optional)',
    example: 'https://example.com/images/plumbing.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  /**
   * Dynamic request template (JSON schema for form fields)
   * @example { "version": "1.0", "fields": [...] }
   */
  @ApiProperty({
    description:
      'Dynamic form template defining the fields clients fill when requesting this service',
    example: {
      version: '1.0',
      fields: [
        {
          id: 'issue_description',
          type: 'textarea',
          label: 'Describe the Issue',
          required: true,
        },
      ],
    },
  })
  @IsObject()
  @IsNotEmpty()
  requestTemplate: Record<string, any>;
}
