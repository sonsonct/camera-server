import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateShipDto {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
  public phoneNumber: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
  public address: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
  public nameUser: string;

  @ApiProperty({ type: 'number' })
  @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
  public cartId: number;
}
