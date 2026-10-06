import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TextMeClientService } from './textme-client.service';

@Module({
  imports: [ConfigModule],
  providers: [TextMeClientService],
  exports: [TextMeClientService],
})
export class TextMeClientModule {}
