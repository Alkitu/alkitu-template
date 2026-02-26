import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MoveFileDto {
  @ApiProperty({ description: 'ID of the destination folder' })
  @IsString()
  @MinLength(1)
  newParentId: string;
}
