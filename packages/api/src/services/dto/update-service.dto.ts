import { PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';

/**
 * DTO for updating an existing service
 * @class UpdateServiceDto
 * @extends {PartialType(CreateServiceDto)}
 */
export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
