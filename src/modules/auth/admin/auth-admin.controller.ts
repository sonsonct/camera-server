import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VerifyOtpDto } from '../../otp/dto/verify-otp.dto';
import { SendOtpToMailDto } from '../../otp/dto/send-otp-to-mail.dto';
import { OtpType, RoleScope } from 'src/commons/enums';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
//import { BlockDto } from "../dto/admin-dto/block.dto";
import { SetRoles } from 'src/nest/decorators/set-roles.decorator';
import { ApplyAuthGuard } from 'src/nest/guards/auth.guard';
import { RegisterAdminDto } from '../dto/admin-dto/register-admin.dto';
import { RecaptchaGuard } from 'src/nest/guards/recaptcha.guard';
import { SendOtpModel, VerifyOtpModel } from 'src/modules/otp/otp.interface';

@ApiTags('Auth-admin')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    description: 'Register success',
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'Register admin' })
  @ApiBody({ type: RegisterAdminDto })
  @Post('/register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() body: RegisterAdminDto) {
    return await this.authService.registerAdmin(body);
  }

  @ApiResponse({
    description: 'Login success',
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'Login admin' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginAdmin(@Body() body: LoginDto) {
    body.role = RoleScope.ADMIN;

    return await this.authService.login(body);
  }

  @ApiResponse({
    description: 'Send OTP to email success',
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'forgot password send OTP to email' })
  @ApiBody({ type: SendOtpToMailDto })
  @UseGuards(RecaptchaGuard)
  @Post('request-forgot-password')
  async sendMailForgotPassword(@Body() body: SendOtpToMailDto) {
    const data: SendOtpModel = {
      email: body.email,
      otpType: OtpType.FORGET_PASSWORD,
    } as SendOtpModel;
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
      otpCode: body.otpCode,
    } as VerifyOtpModel;

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

  @ApiResponse({
    description: 'Block user  success',
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'Block user' })
  @ApplyAuthGuard()
  @SetRoles(RoleScope.ADMIN)
  //@ApiBody({ type })
  @Delete('block')
  @HttpCode(HttpStatus.OK)
  async blockUser(@Body() body: any) {
    return await this.authService.blockUser(body);
  }

  @ApiResponse({
    description: 'Block user  success',
    status: HttpStatus.OK,
  })
  @Delete('/delete')
  @ApiBody({ type: SendOtpToMailDto })
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Body() body: SendOtpToMailDto) {
    return await this.authService.deleteUser(body);
  }
}
