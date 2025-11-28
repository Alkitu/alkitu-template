import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class UpdateUserTagsDto {
  @ApiProperty({
    description: 'Array of tag IDs to assign to the user',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  tagIds!: string[];
}
