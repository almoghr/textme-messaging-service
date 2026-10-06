import { Module } from '@nestjs/common';
import { TextMeClientModule } from '../textme-client/textme-client.module';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';

@Module({
  imports: [TextMeClientModule],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
