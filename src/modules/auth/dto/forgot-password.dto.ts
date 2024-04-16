import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { httpBadRequest } from "src/nest/exceptions/http-exception";

export class ForgotPasswordDto {
    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    newPassword: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    reTypeNewPassword: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty({ message: 'common.REQUIRED_FIELD' })
    codeSignature: string;

    public validatePasswords() {
        if (this.newPassword !== this.reTypeNewPassword) {
            throw new httpBadRequest("New password and confirm new password do not match. Please try again.");
        }
    }
}