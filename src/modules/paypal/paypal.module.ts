import { Module } from '@nestjs/common';
import { PaypalController } from './paypal.controller';
import { PaypalService } from './paypal.service';
import { CartRepository } from 'src/repositories/cart.repository';
import { TypeOrmExModule } from '../commons/typeorm-ex/typeorm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CartRepository])],
  controllers: [PaypalController],
  providers: [PaypalService]
})
export class PaypalModule { }
