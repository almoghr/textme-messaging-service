import { Module } from '@nestjs/common';
import { TextMeClientModule } from '../textme-client/textme-client.module';
import { VerifiedSendersController } from './verified-senders.controller';
import { VerifiedSendersService } from './verified-senders.service';

@Module({
  imports: [TextMeClientModule],
  controllers: [VerifiedSendersController],
  providers: [VerifiedSendersService],
  exports: [VerifiedSendersService],
})
export class VerifiedSendersModule {}
