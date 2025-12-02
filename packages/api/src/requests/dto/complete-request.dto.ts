import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for completing a request
 * @class CompleteRequestDto
 */
export class CompleteRequestDto {
  /**
   * Completion notes
   * @example "Service completed successfully. All issues resolved."
   */
  @ApiProperty({
    description: 'Optional notes about the completion (optional)',
    example: 'Service completed successfully. All issues resolved.',
    required: false,
    maxLength: 2000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(2000, { message: 'Notes cannot exceed 2000 characters' })
  notes?: string;
}
