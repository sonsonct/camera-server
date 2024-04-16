import { OtpType } from "src/commons/enums";

export interface SendOtpModel {
    email?: string;
    otpCode?: string;
    otpType: OtpType;
    userId?: number;
}

export interface VerifyOtpModel extends SendOtpModel {
    otpSignature: string;
}
