import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for requesting cancellation of a request
 * @class RequestCancellationDto
 */
export class RequestCancellationDto {
  /**
   * Cancellation reason
   * @example "Service no longer needed"
   */
  @ApiProperty({
    description: 'Reason for cancellation (optional)',
    example: 'Service no longer needed',
    required: false,
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Reason cannot exceed 1000 characters' })
  reason?: string;
}
