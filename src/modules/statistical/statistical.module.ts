import { Module } from '@nestjs/common';
import { StatisticalController } from './statistical.controller';
import { StatisticalService } from './statistical.service';
import { TypeOrmExModule } from '../commons/typeorm-ex/typeorm-ex.module';
import { CartRepository } from 'src/repositories/cart.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CartRepository])],
  controllers: [StatisticalController],
  providers: [StatisticalService]
})
export class StatisticalModule { }
