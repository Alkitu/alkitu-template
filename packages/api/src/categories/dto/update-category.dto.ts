import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

/**
 * DTO for updating an existing service category
 * @class UpdateCategoryDto
 * @extends {PartialType(CreateCategoryDto)}
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
