import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({ type: 'number' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    @IsOptional()
    productId: number;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    content: string;

    @ApiProperty({ type: 'number' })
    @IsOptional()
    rate: number;
}

export class CreateReplyCommentDto extends CreateCommentDto {
    @ApiProperty({ type: 'number' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    parentId: number;
}