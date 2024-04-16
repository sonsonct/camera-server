import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { TypeOrmExModule } from '../commons/typeorm-ex/typeorm-ex.module';
import { CommentRepository } from '../../repositories/comment.repository';
import { UserRepository } from '../../repositories/user.repository';
import { StatisticalRepository } from 'src/repositories/statistical.repository';
import { CommentPublicController } from './public/public-comment.controller';
import { CommentUserController } from './user/user-comment.controller';
import { ProductsRepository } from 'src/repositories/products.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CommentRepository, UserRepository, StatisticalRepository, ProductsRepository])],
  controllers: [CommentPublicController, CommentUserController],
  providers: [CommentService]
})
export class CommentModule { }
