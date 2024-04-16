import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ type: 'number' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    categoryId: number;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    productName: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    content: string;

    @ApiProperty({ type: "number" })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    count: number;

    @ApiProperty({ type: "string" })
    @IsOptional()
    image: string;
}