import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { httpBadRequest } from 'src/nest/exceptions/http-exception';

export class RegisterDto {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
  @IsEmail()
  public email: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
  public newPassword: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
  public reTypeNewPassword: string;

  @IsOptional()
  public username: string;

  public validatePasswords() {
    if (this.newPassword !== this.reTypeNewPassword) {
      throw new httpBadRequest("New password and confirm new password do not match. Please try again.");
    }
  }
}
