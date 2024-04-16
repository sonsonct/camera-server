import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { httpBadRequest } from 'src/nest/exceptions/http-exception';

export class UpdateUserPasswordDto {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
  public oldPassword: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
  public newPassword: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
  public reTypeNewPassword: string;

  public validatePasswords() {
    if (this.newPassword !== this.reTypeNewPassword) {
      throw new httpBadRequest("New password and confirm new password do not match. Please try again.");
    }

    if (this.newPassword === this.oldPassword) {
      throw new httpBadRequest("Old password and new password do match. Please try again.");
    }
  }
}

