import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get<string>('MAIL_HOST'),
            port: configService.get<number>('MAIL_PORT'),
            secure: false,
            auth: {
              user: configService.get<string>('MAIL_USERNAME'),
              pass: configService.get<string>('MAIL_PASSWORD'),
            },
            tls: {
              rejectUnauthorized: false
            }
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new EjsAdapter(),
            options: {
              strict: false,
            },
          },
        }
      }
    }),
  ],
  providers: [MailsService]
})
export class MailsModule { }
