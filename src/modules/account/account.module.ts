import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { UserRepository } from 'src/repositories/user.repository';
import { TypeOrmExModule } from '../commons/typeorm-ex/typeorm-ex.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  controllers: [AccountController],
  providers: [AccountService, CloudinaryService],
})
export class AccountModule {}
