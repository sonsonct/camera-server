import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, UseGuards, } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../auth.service";
import { AuthGuard } from "@nestjs/passport";
import { OtpType, SocialLoginName } from "src/commons/enums";
import { RegisterDto } from "../dto/user-dto/register.dto";
import { VerifyOtpDto } from "src/modules/otp/dto/verify-otp.dto";
import { LoginDto } from "../dto/login.dto";
import { LoginSocialDto } from "../dto/user-dto/login-social.dto";
import { ForgotPasswordDto } from "../dto/forgot-password.dto";
import { SendOtpToMailDto } from "src/modules/otp/dto/send-otp-to-mail.dto";
import { RecaptchaGuard } from "src/nest/guards/recaptcha.guard";
import { SendOtpModel, VerifyOtpModel } from "src/modules/otp/otp.interface";

@ApiTags('Auth-User')
@Controller('user/auth')
export class UserAuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @ApiResponse({
        description: 'Register success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Register user' })
    @ApiBody({ type: RegisterDto })
    @Post('register')
    @HttpCode(HttpStatus.OK)
    async register(@Body() body: RegisterDto) {
        return await this.authService.register(body);
    }

    @ApiResponse({
        description: 'Verify register OTP success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Verify register OTP' })
    @ApiBody({ type: VerifyOtpDto })
    @Post('verify-otp-register')
    async verifyRegisterOtp(@Body() body: VerifyOtpDto) {
        const data: VerifyOtpModel = {
            email: body.email,
            otpType: OtpType.REGISTER,
            otpSignature: body.otpSignature,
            otpCode: body.otpCode,
        } as VerifyOtpModel

        return await this.authService.verifyOtp(data);
    }

    @ApiResponse({
        description: 'Login success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Login user' })
    @ApiBody({ type: LoginDto })
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async loginUser(@Body() body: LoginDto) {
        return await this.authService.login(body)
    }

    @Get("facebook")
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin() {
    }

    @Get("facebook/redirect")
    @UseGuards(AuthGuard("facebook"))
    async facebookLoginRedirect(@Req() req: Request) {
        const loginSocialDto = new LoginSocialDto;
        loginSocialDto.userData = req['user'];
        loginSocialDto.socialName = SocialLoginName.FACEBOOK;

        return await this.authService.loginSocial(loginSocialDto);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() { }

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        const loginSocialDto = new LoginSocialDto;
        loginSocialDto.userData = req['user'];
        loginSocialDto.socialName = SocialLoginName.GOOGLE;
        loginSocialDto.email = req['user'].email;

        return await this.authService.loginSocial(loginSocialDto);
    }

    @ApiResponse({
        description: 'Send OTP to email success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'forgot password send OTP to email' })
    @ApiBody({ type: SendOtpToMailDto })
    @UseGuards(RecaptchaGuard)
    @Post('request-forgot-password')
    async sendOtpToEmail(@Body() body: SendOtpToMailDto) {
        // // TODO: not set otp type here, let client send otp type, and validate on dto
        // body.otpType = OtpType.FORGET_PASSWORD;
        const data: SendOtpModel = {
            email: body.email,
            otpType: OtpType.FORGET_PASSWORD,
        } as SendOtpModel

        return await this.authService.processSendOtp(data);
    }

    @ApiResponse({
        description: 'Verify OTP success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Verify OTP' })
    @ApiBody({ type: VerifyOtpDto })
    @Post('verify-otp-forgot-password')
    async verifyOtp(@Body() body: VerifyOtpDto) {
        const data: VerifyOtpModel = {
            email: body.email,
            otpType: OtpType.FORGET_PASSWORD,
            otpSignature: body.otpSignature,
            otpCode: body.otpCode
        } as VerifyOtpModel

        return await this.authService.verifyOtp(data);
    }

    @ApiResponse({
        description: 'send mail success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Forgot password' })
    @ApiBody({ type: ForgotPasswordDto })
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() body: ForgotPasswordDto) {
        return await this.authService.forgotPassword(body);
    }
}