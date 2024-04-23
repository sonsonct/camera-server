import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmExModule } from './../commons/typeorm-ex/typeorm-ex.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import I18nConfigModule from '../../configs/i18n';
import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from 'src/configs/typeorm';
import { CommentModule } from '../comment/comment.module';
import { DatabaseModule } from 'src/database';
import { StatisticalModule } from '../statistical/statistical.module';
// import { IpBlockMiddleware } from 'src/nest/middleware/ip-block.middleware';
// import { IpBlockRepository } from 'src/repositories/ipblock.repository';
import { HttpExceptionFilter } from 'src/nest/filters/http-exception.filter';
import { MailsModule } from '../mails/mails.module';
import { ResponseInterceptor } from 'src/nest/interceptors/response.Interceptor';
import { OtpModule } from '../otp/otp.module';
import { AccountModule } from '../account/account.module';
import { ProductsModule } from '../products/products.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PaypalModule } from '../paypal/paypal.module';
import { CartModule } from '../cart/cart.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    //TypeOrmExModule.forCustomRepository([IpBlockRepository]),
    MailsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.get('typeorm'),
    }),
    DatabaseModule,
    I18nConfigModule,
    ProductsModule,
    AuthModule,
    CategoryModule,
    CommentModule,
    StatisticalModule,
    AccountModule,
    OtpModule,
    CloudinaryModule,
    PaypalModule,
    CartModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(IpBlockMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
