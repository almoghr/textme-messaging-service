import { Injectable } from '@nestjs/common';
import { TEXTME_OPERATIONS } from '../common/constants/api.constants';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { TextMeRequestOptions } from '../textme-client/textme-client.types';
import { GetBalanceDto, GetBalanceResponseDto } from './dto/get-balance.dto';

@Injectable()
export class BalanceService {
  constructor(private readonly client: TextMeClientService) {}

  /**
   * Check account credit balance (SMS credit, international credit, or email credit).
   */
  async getBalance(dto: GetBalanceDto, options?: TextMeRequestOptions): Promise<GetBalanceResponseDto> {
    const payload: Record<string, unknown> = {};

    if (dto.user) payload.user = dto.user;
    if (dto.type) payload.type = dto.type;

    return this.client.execute<Record<string, unknown>, GetBalanceResponseDto>(
      TEXTME_OPERATIONS.BALANCE,
      payload,
      options,
    );
  }
}
