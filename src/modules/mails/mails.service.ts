import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtpType } from 'src/commons/enums';
import { SendOtpModel } from '../otp/otp.interface';

@Injectable()
export class MailsService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {
    }

    async sendMail(sendOtpModel: SendOtpModel) {
        const emailSend = {
            from: this.configService.get("MAIL_FROM"),
            to: sendOtpModel.email,
            subject: sendOtpModel.otpType,
            template: null,
            context: {
                otpCode: sendOtpModel.otpCode,
                email: sendOtpModel.email,
            },
        }

        if (sendOtpModel.otpType == OtpType.FORGET_PASSWORD) {
            emailSend.template = 'forgotPassword';
        } else if (sendOtpModel.otpType == OtpType.REGISTER) {
            emailSend.template = 'register';
        }

        return await this.mailerService.sendMail(emailSend)
    }


}
