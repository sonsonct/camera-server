import { Multer } from 'multer';
import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { httpBadRequest, httpNotFound } from 'src/nest/exceptions/http-exception';
import { S3_FOLDER } from 'src/commons/enums';
import { UpdateUserPasswordDto } from './dto/update-password.dto';
import { comparePassword, hashPassword } from 'src/utils/brcypt-password';
import { UpdateNameDto } from './dto/update-username-user.dto';
import { Not } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async getMyAccount(id: number) {
    const user = await this.userRepository.getUserInfo(id);

    if (!user) {
      throw new httpNotFound('USER_NOT_FOUND');
    }

    return user;
  }

  async updatePassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto) {
    const { oldPassword, newPassword } = updateUserPasswordDto;
    const user = await this.userRepository.findOneBy({ id });

    const isPasswordCorrect = await comparePassword(oldPassword, user.password);

    if (!isPasswordCorrect) {
      throw new httpBadRequest('The old password is incorrect. Please try again.');
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
    // const isExistName = await this.userRepository.findOneBy({
    //   id: Not(id),
    //   username: updateUserNameDto.username,
    // });

    // if (isExistName) {
    //   throw new httpBadRequest('This name is already taken, please try another name');
    // }

    return await this.userRepository.update(id, { username: updateUserNameDto.username });
  }

  async updateAvatar(id: number, avatar: Express.Multer.File) {
    if (!avatar) {
      throw new httpBadRequest('Invalid avatar');
    }

    const user = await this.userRepository.getUserInfo(id);

    const media = await this.cloudinaryService.uploadFile(avatar);

    const avatarUrl = media['url'];
    console.log(media);

    return await this.userRepository.update(id, { avatar: avatarUrl });
  }
}
