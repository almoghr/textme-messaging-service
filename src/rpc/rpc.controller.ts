import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RawTextMeResponse } from '../textme-client/textme-client.types';
import { RpcCallDto } from './dto/rpc-request.dto';
import { RpcService } from './rpc.service';

@Controller('textme')
export class RpcController {
  constructor(private readonly rpcService: RpcService) {}

  @Post('call')
  @HttpCode(HttpStatus.OK)
  async call(@Body() dto: RpcCallDto): Promise<RawTextMeResponse> {
    return this.rpcService.executeCall(dto);
  }

  @Post('test')
  @HttpCode(HttpStatus.OK)
  async test(@Body() dto: RpcCallDto): Promise<RawTextMeResponse> {
    return this.rpcService.executeTest(dto);
  }
}
