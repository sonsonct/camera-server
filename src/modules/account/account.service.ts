import { Multer } from 'multer';
import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { httpBadRequest, httpNotFound } from 'src/nest/exceptions/http-exception';
import { S3_FOLDER } from 'src/commons/enums';
import { UpdateUserPasswordDto } from './dto/update-password.dto';
import { comparePassword, hashPassword } from 'src/utils/brcypt-password';
import { UpdateNameDto } from './dto/update-username-user.dto';
import { Not } from 'typeorm';

@Injectable()
export class AccountService {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }
    async getMyAccount(id: number) {
        const user = await this.userRepository.getUserInfo(id);

        if (!user) {
            throw new httpNotFound("USER_NOT_FOUND");
        }

        return user;
    }

    async updatePassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto) {
        const { oldPassword, newPassword } = updateUserPasswordDto;
        const user = await this.userRepository.findOneBy({ id });

        const isPasswordCorrect = await comparePassword(oldPassword, user.password);

        if (!isPasswordCorrect) {
            throw new httpBadRequest("The old password is incorrect. Please try again.");
        }

        // //TO-DO: check in dto
        // if (newPassword != reTypeNewPassword) {
        //     throw new httpBadRequest("New password and confirm new password do not match. Please try again.");
        // }

        // if (newPassword == oldPassword) {
        //     throw new httpBadRequest("Old password and new password do not match. Please try again.");
        // }
        updateUserPasswordDto.validatePasswords();

        return await this.userRepository.update(id, { password: await hashPassword(newPassword) });
    }

    async updateUserName(id: number, updateUserNameDto: UpdateNameDto) {
        const isExistName = await this.userRepository.findOneBy({ id: Not(id), username: updateUserNameDto.username });

        if (isExistName) {
            throw new httpBadRequest("This name is already taken, please try another name");
        }

        return await this.userRepository.update(id, { username: updateUserNameDto.username });
    }

    async updateAvatar(id: number, avatar: Express.Multer.File) {
        // if (!avatar) {
        //     throw new httpBadRequest("Invalid avatar")
        // }

        // //TO DO - seperate a file module use for uploading files
        // const { buffer, originalname } = avatar;
        // const media = await this.s3Service.uploadS3(
        //     S3_FOLDER.AVATARS,
        //     buffer,
        //     originalname
        // );
        // const user = await this.userRepository.getUserInfo(id);

        // if (user.avatar) {
        //     await this.s3Service.deleteS3(user.avatar);
        // }

        // const avatarUrl = media.Key;

        // return await this.userRepository.update(id, { avatar: avatarUrl });
    }
}
