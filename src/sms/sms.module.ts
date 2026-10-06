import { Module } from '@nestjs/common';
import { TextMeClientModule } from '../textme-client/textme-client.module';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';

@Module({
  imports: [TextMeClientModule],
  controllers: [SmsController],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
