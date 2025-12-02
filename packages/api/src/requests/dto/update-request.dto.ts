import {
  IsString,
  IsObject,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '@prisma/client';

/**
 * DTO for updating an existing request
 * @class UpdateRequestDto
 */
export class UpdateRequestDto {
  /**
   * Work location ID
   * @example "507f1f77bcf86cd799439012"
   */
  @ApiProperty({
    description: 'Work location ID where service will be performed',
    example: '507f1f77bcf86cd799439012',
    required: false,
  })
  @IsString()
  @IsOptional()
  locationId?: string;

  /**
   * Execution date and time
   * @example "2024-12-15T10:00:00Z"
   */
  @ApiProperty({
    description: 'Desired execution date and time (must be in the future)',
    example: '2024-12-15T10:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  executionDateTime?: string;

  /**
   * Template responses (dynamic form data)
   * @example { "issue_description": "Leaking pipe in bathroom", "urgency": "high" }
   */
  @ApiProperty({
    description:
      'Client responses to the service template form (must match service requestTemplate schema)',
    example: {
      issue_description: 'Leaking pipe in bathroom',
      urgency: 'high',
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  templateResponses?: Record<string, unknown>;

  /**
   * Optional rich text notes (TipTap JSON format)
   * @example { "type": "doc", "content": [...] }
   */
  @ApiProperty({
    description: 'Optional additional notes from client (TipTap JSON format)',
    example: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Additional notes here' }],
        },
      ],
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  note?: Record<string, unknown> | null;

  /**
   * Request status (ADMIN/EMPLOYEE only)
   * @example "ONGOING"
   */
  @ApiProperty({
    description: 'Request status (ADMIN/EMPLOYEE only)',
    enum: RequestStatus,
    example: 'ONGOING',
    required: false,
  })
  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;

  /**
   * Assigned employee ID (ADMIN/EMPLOYEE only)
   * @example "507f1f77bcf86cd799439020"
   */
  @ApiProperty({
    description: 'Assigned employee ID (ADMIN/EMPLOYEE only)',
    example: '507f1f77bcf86cd799439020',
    required: false,
  })
  @IsString()
  @IsOptional()
  assignedToId?: string | null;
}
