import { TokenPayloadModel } from 'src/nest/common/auth/basic-auth';
import { UserRepository } from './../../repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { Not } from 'typeorm';
import { GetListUserDto } from './dto/list-user.dto';
import { UserStatus } from 'src/commons/enums';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async getAllUsers(user: TokenPayloadModel, query: GetListUserDto) {
        return await this.userRepository.getListUser(query, user.id);
    }

    async deleteUser(id: number) {
        return await this.userRepository.update({ id: id }, { status: UserStatus.DELETE });
    }
}
