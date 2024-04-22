import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ListQueryDto } from 'src/commons/dtos/list-query.dto';

export class GetListProductDto extends ListQueryDto {
  @ApiProperty({
    type: 'string',
    required: false,
    description: 'category name',
  })
  @IsOptional()
  public category?: string;

  @ApiProperty({
    type: 'number',
    required: false,
    description: 'category id',
  })
  @IsOptional()
  public categoryId?: number;

  @ApiProperty({
    type: 'number',
    required: false,
    description: '1: sale, -1: no sale',
  })
  @IsOptional()
  public sale?: number;
}
