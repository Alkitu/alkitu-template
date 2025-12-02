import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for assigning a request to an employee
 * @class AssignRequestDto
 */
export class AssignRequestDto {
  /**
   * Assigned employee ID
   * @example "507f1f77bcf86cd799439020"
   */
  @ApiProperty({
    description: 'Employee ID to assign the request to',
    example: '507f1f77bcf86cd799439020',
  })
  @IsString()
  @IsNotEmpty()
  assignedToId: string;
}
