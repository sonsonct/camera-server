import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { TypeOrmExModule } from '../commons/typeorm-ex/typeorm-ex.module';
import { OtpRepository } from 'src/repositories/otp.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([OtpRepository, UserRepository])],
  providers: [OtpService]
})
export class OtpModule { }
