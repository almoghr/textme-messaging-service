import { Injectable } from '@nestjs/common';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { RawTextMeResponse } from '../textme-client/textme-client.types';
import { RpcCallDto } from './dto/rpc-request.dto';

@Injectable()
export class RpcService {
  constructor(private readonly client: TextMeClientService) {}

  /**
   * Execute an arbitrary TextMe RPC body payload against the live API endpoint.
   */
  async executeCall(dto: RpcCallDto): Promise<RawTextMeResponse> {
    const operationName = Object.keys(dto.body)[0];

    return this.client.executeRaw(dto.body, {
      apiToken: dto.apiToken,
      username: dto.username,
      isTestMode: false,
    }, operationName);
  }

  /**
   * Execute an arbitrary TextMe RPC body payload against the test validation endpoint (/api/test).
   */
  async executeTest(dto: RpcCallDto): Promise<RawTextMeResponse> {
    const operationName = Object.keys(dto.body)[0];

    return this.client.executeRaw(dto.body, {
      apiToken: dto.apiToken,
      username: dto.username,
      isTestMode: true,
    }, operationName);
  }
}
