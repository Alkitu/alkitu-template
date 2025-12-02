import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating a new service category
 * @class CreateCategoryDto
 */
export class CreateCategoryDto {
  /**
   * Category name (must be unique)
   * @example "Plumbing"
   */
  @ApiProperty({
    description: 'Category name (must be unique)',
    example: 'Plumbing',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Category name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Category name cannot exceed 100 characters' })
  name: string;
}
