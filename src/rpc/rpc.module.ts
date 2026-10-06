import { Module } from '@nestjs/common';
import { TextMeClientModule } from '../textme-client/textme-client.module';
import { RpcController } from './rpc.controller';
import { RpcService } from './rpc.service';

@Module({
  imports: [TextMeClientModule],
  controllers: [RpcController],
  providers: [RpcService],
  exports: [RpcService],
})
export class RpcModule {}
