import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmExModule } from '../commons/typeorm-ex/typeorm-ex.module';
import { ProductsRepository } from 'src/repositories/products.repository';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ProductsRepository])],
  controllers: [ProductsController],
  providers: [ProductsService, CloudinaryService]
})
export class ProductsModule { }
