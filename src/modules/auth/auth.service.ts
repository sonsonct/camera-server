import { OtpService } from './../otp/otp.service';
import { Injectable } from '@nestjs/common';
import { OtpStatus, OtpType, RoleScope, SocialLoginName, UserStatus } from '../../commons/enums';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../database/entities/user.entity';
import { RegisterDto } from './dto/user-dto/register.dto';
import { comparePassword, hashPassword } from 'src/utils/brcypt-password';
import { httpBadRequest, httpNotFound } from 'src/nest/exceptions/http-exception';
import { SocialLoginRepository } from 'src/repositories/login-social.repository';
import { Not } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginSocialDto } from './dto/user-dto/login-social.dto';
import { BlockDto } from './dto/admin-dto/block.dto';
import { IpBlockRepository } from 'src/repositories/ipblock.repository';
import { BasicAuth } from 'src/nest/common/auth/basic-auth';
import { RegisterAdminDto } from './dto/admin-dto/register-admin.dto';
import { decryptSignature, encryptSignature } from 'src/utils/otp-generate';
import { SendOtpToMailDto } from '../otp/dto/send-otp-to-mail.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { MailsService } from '../mails/mails.service';
import { SendOtpModel, VerifyOtpModel } from '../otp/otp.interface';


@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly socialLoginRepository: SocialLoginRepository,
    private readonly mailsService: MailsService,
    private readonly ipBlockRepository: IpBlockRepository,
    private readonly httpService: HttpService,
    private readonly otpService: OtpService,
  ) { }

  async deleteUser(body: SendOtpToMailDto) {
    return await this.userRepository.delete({ email: body.email });
  }

  async registerAdmin(registerAdminDto: RegisterAdminDto) {
    await this.exitedUserByEmail(registerAdminDto.email);

    registerAdminDto.validatePasswords();

    registerAdminDto.username = await this.generateUniqueUsername();

    const password = await hashPassword(registerAdminDto.newPassword);

    const adminInsert = await this.userRepository.insert({ email: registerAdminDto.email, password: password, username: registerAdminDto.username, role: registerAdminDto.role });

    return adminInsert;
  }

  async register(registerDto: RegisterDto) {
    await this.exitedUserByEmail(registerDto.email);

    // TODO: check in dto
    // if (registerDto.newPassword != registerDto.reTypeNewPassword) {
    //   throw new httpBadRequest("New password and confirm new password do not match. Please try again");
    // }
    registerDto.validatePasswords();
    // Ask design to add username when register
    const username = await this.generateUniqueUsername();
    const password = await hashPassword(registerDto.newPassword);
    const userInsert = await this.userRepository.insert({ email: registerDto.email, password: password, status: UserStatus.INACTIVE, username: username });

    return await this.processSendOtp({ userId: userInsert.identifiers[0].id, otpType: OtpType.REGISTER });
  }

  // Use firebase
  async loginSocial(userData: LoginSocialDto) {
    try {
      let id;

      if (userData.socialName == SocialLoginName.FACEBOOK) {
        id = await this.loginFacebook(userData);
      } else if (userData.socialName == SocialLoginName.GOOGLE) {
        id = await this.loginGoogle(userData);
      }

      const social = await this.socialLoginRepository.findOneBy({ socialId: id });

      let user: User;

      if (social) {
        user = await this.getUserById(social.userId);
      } else {
        const username = await this.generateUniqueUsername();

        const userInsert: User = {
          username
        } as User;

        if (userData.socialName == SocialLoginName.GOOGLE) {
          const user = await this.getUserByEmail(userData.email);

          if (user) {
            const token = await this.getToken(user);

            return token;
          }

          userInsert.email = userData.email;
        }

        const insertedUser = await this.userRepository.insert(userInsert);
        const userId = insertedUser.identifiers[0].id;

        await this.socialLoginRepository.insert({ socialId: id, userId, socialName: userData.socialName })

        user = await this.getUserById(userId);
      }

      const token = await this.getToken(user);

      return token;
    } catch (error) {
      throw new httpBadRequest(error);
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({
      email: loginDto.email,
      status: UserStatus.ACTIVE
    });

    if (!user) {
      throw new httpBadRequest("Account does not exist, please try again");
    }

    if (loginDto.role == RoleScope.ADMIN && user.role != RoleScope.ADMIN) {
      throw new httpBadRequest("Account does not exist, please try again");
    }

    const isPasswordCorrect = await comparePassword(loginDto.password, user.password);

    if (!isPasswordCorrect) {
      throw new httpBadRequest("Incorrect password, please try again!");
    }

    const token = await this.getToken(user);

    return token;
  }

  async blockUser(blockDto: BlockDto) {
    if (blockDto.userId) {
      const user = await this.userRepository.findOneBy({ id: blockDto.userId, role: Not(RoleScope.ADMIN) });

      if (!user) {
        throw new httpNotFound("USER_NOT_FOUND");
      }

      await this.userRepository.update(blockDto.userId, { status: UserStatus.BLOCK });
    }

    if (blockDto.ip) {
      const ipBlocked = await this.ipBlockRepository.findOneBy({ ip: blockDto.ip });

      if (ipBlocked) {
        throw new httpBadRequest("Ip has been blocked");
      }

      await this.ipBlockRepository.insert({ ip: blockDto.ip });
    }

    return true;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { newPassword, codeSignature } = forgotPasswordDto;
    const data = await decryptSignature(codeSignature);
    const otpCode = await this.otpService.getOtpById(data.otpId);

    if (!data) {
      throw new httpBadRequest("FORGOT_PASSWORD_ERROR");
    }

    if (otpCode.status != OtpStatus.OTP_USED) {
      throw new httpBadRequest("FORGOT_PASSWORD_ERROR");
    }

    await this.otpService.updateStatusOtp({ id: data.otpId, status: OtpStatus.CODE_USED });

    forgotPasswordDto.validatePasswords();

    const userUpdate = await this.userRepository.update({
      email: data.email
    }, {
      password: await hashPassword(newPassword)
    });

    return userUpdate;
  }

  async processSendOtp(body: SendOtpModel) {
    try {
      const data = await this.getMailSend(body);
      const dataSendMail: SendOtpModel = {
        email: data.generateOTP.email,
        otpCode: data.generateOTP.otpCode,
        otpType: body.otpType
      }
      const mail = await this.mailsService.sendMail(dataSendMail);

      if (!mail.messageId) {
        throw httpBadRequest("CAN_NOT_SEND_MAIL");
      }

      return { otpSignature: data.generateOTP.otpDetailEncoded }
    } catch (error) {
      throw new httpBadRequest(error);
    }
  }

  async verifyOtp(body: VerifyOtpModel) {
    try {
      const otpDetails = await this.otpService.verifyOtp(body);

      if (body.otpType == OtpType.FORGET_PASSWORD) {
        return await this.verifyOtpForgotPassword({ email: body.email, otpId: otpDetails.otpId })
      }
      else if (body.otpType == OtpType.REGISTER) {
        return await this.verifyOtpRegister({ id: otpDetails.userId });
      }

    } catch (error) {
      throw new httpBadRequest(error);
    }
  }

  async verifyOtpRegister({ id }) {
    const user = await this.userRepository.findOneBy({ id: id });

    await this.userRepository.delete({ id: Not(user.id), email: user.email, status: UserStatus.INACTIVE });

    const userUpdate = await this.userRepository.update({ id: id }, { status: UserStatus.ACTIVE });

    return userUpdate;
  }

  async verifyOtpForgotPassword({ email, otpId }) {
    const codeSignature = encryptSignature({
      email: email,
      otpId: otpId,
    });

    return {
      codeSignature,
    };
  }

  async generateUniqueUsername() {
    let username;
    let isUnique = false;

    while (!isUnique) {
      const randomNumber = Math.floor(Math.random() * 1000);

      username = `user${randomNumber}`;

      const existingUser = await this.userRepository.findOneBy({ username: username });

      if (!existingUser) {
        isUnique = true;
      }
    }

    return username;
  }

  async getToken(data: User) {
    const tokenPayload = {
      id: data.id,
      email: data.email,
      role: data.role,
    };
    const accessToken = BasicAuth.signToken(tokenPayload);

    return {
      accessToken
    };
  }

  async exitedUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email, status: UserStatus.ACTIVE });

    if (user) {
      throw new httpBadRequest("Email already exists, please try again!");
    }

    return true;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id, status: UserStatus.ACTIVE },
      select: ['id', 'username', 'email', 'avatar']
    });

    if (!user) {
      throw new httpNotFound("USER_NOT_FOUND");
    }

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email, status: UserStatus.ACTIVE },
      select: ['id', 'username', 'email', 'avatar']
    });

    return user;
  }

  async getMailSend(body: SendOtpModel) {
    let userData = {
      otpType: body.otpType,
      email: null,
      userId: null,
    }

    if (body.otpType == OtpType.REGISTER) {
      const user = await this.userRepository.findOneBy({ id: body.userId });
      userData.userId = body.userId;
      userData.email = user.email;
    } else
      if (body.otpType == OtpType.FORGET_PASSWORD) {
        const user = await this.getUserByEmail(body.email);
        userData.userId = user.id;
        userData.email = user.email;
      }

    const generateOTP = await this.otpService.generateOTP(userData);
    return {
      generateOTP: generateOTP,
    }
  }

  async loginGoogle(userData: LoginSocialDto) {
    try {
      const { data } = await firstValueFrom(this.httpService
        .get(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${userData.userData['accessToken']}`
        )
      );
      return data.user_id;
    } catch (error) {
      throw httpBadRequest(error);
    }
  }

  async loginFacebook(userData: LoginSocialDto) {
    try {
      const { data } = await firstValueFrom(this.httpService
        .get(
          `https://graph.facebook.com/v19.0/${userData.userData['user'].id}?access_token=${userData.userData['accessToken']}`
        )
      );

      return data.id;
    } catch (error) {
      throw new httpBadRequest(error);
    }
  }
}
