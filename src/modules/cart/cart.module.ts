import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmExModule } from '../commons/typeorm-ex/typeorm-ex.module';
import { CartRepository } from 'src/repositories/cart.repository';
import { ProductsRepository } from 'src/repositories/products.repository';
import { OrderRepository } from 'src/repositories/order.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CartRepository, ProductsRepository, OrderRepository])],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule { }
