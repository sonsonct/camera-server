import { UserRepository } from './../../repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { appConfig } from 'src/configs/app.config';
import { OtpRepository } from 'src/repositories/otp.repository';
import { addTime } from 'src/utils/date.util';
import { decryptSignature, encryptSignature, randomNumber } from 'src/utils/otp-generate';
import { httpBadRequest } from 'src/nest/exceptions/http-exception';
import { OtpStatus } from 'src/commons/enums';
import { Otp } from 'src/database/entities/otp.entity';
import { VerifyOtpModel } from './otp.interface';

@Injectable()
export class OtpService {
    constructor(
        private readonly otpRepository: OtpRepository,
        private readonly userRepository: UserRepository,
    ) { }
    async verifyOtp(body: VerifyOtpModel) {
        const otpDetails = decryptSignature(body.otpSignature);
        const user = await this.userRepository.findOneBy({ id: otpDetails.userId });

        if (user.email != body.email) {
            throw new httpBadRequest("EMAIL_NOT_EXISTS");
        }

        const otpInstance = await this.otpRepository.detailById(otpDetails.otpId);

        if (!otpInstance || otpInstance.status != OtpStatus.CREATED || otpInstance.otpCode != body.otpCode) {
            throw new httpBadRequest("OTP_INVALID");
        }

        if (otpInstance.expirationTime < new Date()) {
            throw new httpBadRequest("OTP_EXPIRED");
        }

        const paramsUpdate: Otp = {
            status: OtpStatus.OTP_USED,
        } as Otp;

        await this.otpRepository.update(otpDetails.otpId, paramsUpdate);

        return otpDetails;
    }

    async generateOTP(data: any) {
        const otpCode = await randomNumber(parseInt(process.env.MIN_OTP), parseInt(process.env.MAX_OTP));
        const now = new Date();
        const expirationTime = addTime(now, appConfig.otpConfig.expiresIn, 'seconds');
        const preparedOtp = {
            otpCode,
            expirationTime,
        };
        const insertResult = await this.otpRepository.insert(preparedOtp);
        const otpDetails = {
            timestamp: now,
            userId: data.userId,
            otpType: data.otpType,
            success: true,
            otpId: insertResult.identifiers[0].id,
        };
        const otpDetailEncoded = encryptSignature(otpDetails);

        return {
            email: data.email,
            otpCode: otpCode,
            otpDetailEncoded: otpDetailEncoded
        }
    }

    async getOtpById(id: number) {
        return await this.otpRepository.findOneBy({ id });
    }

    async updateStatusOtp({ id, status }) {
        return await this.otpRepository.update(id, { status: status });
    }
}
