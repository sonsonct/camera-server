import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";


export class CreateCartDto {
    @ApiProperty({ type: 'number' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    public userId: number;

    @ApiProperty({ type: 'number', isArray: true })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    @IsArray({ message: 'productId must be an array' })
    public productId: number[];
}
