import { Module } from '@nestjs/common';
import { CategoryAdminController } from './admin/admin-category.controller';
import { CategoryService } from './category.service';
import { TypeOrmExModule } from '../commons/typeorm-ex/typeorm-ex.module';
import { CategoryRepository } from '../../repositories/category.repository';
import { CategoryPublicController } from './public/public-category.controller';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CategoryRepository])],
  controllers: [CategoryAdminController, CategoryPublicController],
  providers: [CategoryService]
})
export class CategoryModule { }
