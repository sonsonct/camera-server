import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApplyAuthGuard } from 'src/nest/guards/auth.guard';
import { GetTokenDecorator } from 'src/nest/decorators/get-token.decorator';
import { TokenPayloadModel } from 'src/nest/common/auth/basic-auth';
import { UpdateUserPasswordDto } from './dto/update-password.dto';
import { UpdateNameDto } from './dto/update-username-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Account')
@ApplyAuthGuard()
@Controller('account')
export class AccountController {

    constructor(
        private readonly accountService: AccountService,
    ) { }

    @ApiOperation({ summary: 'My account' })
    @Get('myAccount')
    async getMyAccount(@GetTokenDecorator() user: TokenPayloadModel) {
        return await this.accountService.getMyAccount(user.id);
    }

    @ApiOperation({ summary: 'Edit password' })
    @Put('update-password')
    async changePassword(
        @Body() body: UpdateUserPasswordDto,
        @GetTokenDecorator() user: TokenPayloadModel
    ) {
        return await this.accountService.updatePassword(user.id, body);
    }

    @ApiOperation({ summary: 'Edit username' })
    @Put('update-username')
    async changeUsername(
        @Body() body: UpdateNameDto,
        @GetTokenDecorator() user: TokenPayloadModel
    ) {
        return await this.accountService.updateUserName(user.id, body);
    }

    @ApiOperation({ summary: 'Edit avatar' })
    @UseInterceptors(FileInterceptor('avatar'))
    @Put('update-avatar')
    async changeAvatar(
        @UploadedFile(new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                new FileTypeValidator({ fileType: '.(png|jpeg|jpg|mp4)' }),
            ],
        })) avatar: Express.Multer.File,
        @GetTokenDecorator() user: TokenPayloadModel,
    ) {
        return await this.accountService.updateAvatar(user.id, avatar);
    }
}
