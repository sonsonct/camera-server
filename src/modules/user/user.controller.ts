
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { RoleScope } from 'src/commons/enums';
import { SetRoles } from 'src/nest/decorators/set-roles.decorator';
import { ApplyAuthGuard } from 'src/nest/guards/auth.guard';
import { UserService } from './user.service';
import { GetTokenDecorator } from 'src/nest/decorators/get-token.decorator';
import { TokenPayloadModel } from 'src/nest/common/auth/basic-auth';
import { GetListUserDto } from './dto/list-user.dto';

@ApiTags('user')
@ApplyAuthGuard()
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @ApiResponse({
        description: 'Get user success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Get user' })
    @SetRoles(RoleScope.ADMIN)
    @Get('')
    @HttpCode(HttpStatus.OK)
    async getUser(
        @Query() query: GetListUserDto,
        @GetTokenDecorator() user: TokenPayloadModel
    ) {
        return await this.userService.getAllUsers(user, query);
    }

    @ApiResponse({
        description: 'delete user  success',
        status: HttpStatus.OK,
    })
    @SetRoles(RoleScope.ADMIN)
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Param('id') id: number) {
        return await this.userService.deleteUser(id);
    }
}
