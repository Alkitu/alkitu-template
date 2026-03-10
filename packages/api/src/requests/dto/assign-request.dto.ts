import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for assigning a request to an employee.
 * Pass null to unassign.
 * @class AssignRequestDto
 */
export class AssignRequestDto {
  /**
   * Assigned employee ID, or null to unassign
   * @example "507f1f77bcf86cd799439020"
   */
  @ApiProperty({
    description: 'Employee ID to assign the request to, or null to unassign',
    example: '507f1f77bcf86cd799439020',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  assignedToId: string | null;
}
