import {
  IsNotEmpty,
  IsString,
  IsObject,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating a new service request
 * @class CreateRequestDto
 */
export class CreateRequestDto {
  /**
   * Service ID
   * @example "507f1f77bcf86cd799439011"
   */
  @ApiProperty({
    description: 'Service ID being requested',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  /**
   * Work location ID
   * @example "507f1f77bcf86cd799439012"
   */
  @ApiProperty({
    description: 'Work location ID where service will be performed',
    example: '507f1f77bcf86cd799439012',
  })
  @IsString()
  @IsNotEmpty()
  locationId: string;

  /**
   * Execution date and time
   * @example "2024-12-15T10:00:00Z"
   */
  @ApiProperty({
    description: 'Desired execution date and time (must be in the future)',
    example: '2024-12-15T10:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  executionDateTime: string;

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
  })
  @IsObject()
  @IsNotEmpty()
  templateResponses: Record<string, unknown>;

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
  note?: Record<string, unknown>;
}
