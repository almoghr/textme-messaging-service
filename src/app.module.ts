import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BalanceModule } from './balance/balance.module';
import { BlacklistModule } from './blacklist/blacklist.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { TextMeExceptionFilter } from './common/errors/textme-exception.filter';
import { HebrewResponseInterceptor } from './common/interceptors/hebrew-response.interceptor';
import { textMeConfig } from './config/textme.config';
import { ContactListsModule } from './contact-lists/contact-lists.module';
import { OtpModule } from './otp/otp.module';
import { ReportsModule } from './reports/reports.module';
import { RpcModule } from './rpc/rpc.module';
import { SmsModule } from './sms/sms.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { TextMeClientModule } from './textme-client/textme-client.module';
import { TokensModule } from './tokens/tokens.module';
import { VerifiedSendersModule } from './verified-senders/verified-senders.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [textMeConfig],
    }),
    TextMeClientModule,
    TokensModule,
    SmsModule,
    OtpModule,
    BalanceModule,
    ReportsModule,
    BlacklistModule,
    ContactListsModule,
    CampaignsModule,
    VerifiedSendersModule,
    SubscribersModule,
    WebhooksModule,
    RpcModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: TextMeExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HebrewResponseInterceptor,
    },
  ],
})
export class AppModule {}
