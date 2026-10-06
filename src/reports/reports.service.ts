import { Injectable } from '@nestjs/common';
import { TEXTME_OPERATIONS } from '../common/constants/api.constants';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { TextMeRequestOptions } from '../textme-client/textme-client.types';
import { GetDlrByDateDto, GetDlrByDateResponseDto } from './dto/get-dlr-by-date.dto';
import { GetDlrDto, GetDlrResponseDto } from './dto/get-dlr.dto';
import { GetIncomingMessagesDto, GetIncomingMessagesResponseDto } from './dto/get-incoming.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly client: TextMeClientService) {}

  /**
   * Pull delivery reports for specific external IDs within a date window.
   */
  async getDlr(dto: GetDlrDto, options?: TextMeRequestOptions): Promise<GetDlrResponseDto> {
    const payload: Record<string, unknown> = {
      transactions: {
        external_id: dto.external_ids,
      },
      from: dto.from,
      to: dto.to,
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, GetDlrResponseDto>(
      TEXTME_OPERATIONS.DLR,
      payload,
      options,
    );
  }

  /**
   * Pull delivery reports across an entire date window without specific external IDs.
   */
  async getDlrByDate(dto: GetDlrByDateDto, options?: TextMeRequestOptions): Promise<GetDlrByDateResponseDto> {
    const payload: Record<string, unknown> = {
      transactions: {},
      from: dto.from,
      to: dto.to,
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, GetDlrByDateResponseDto>(
      TEXTME_OPERATIONS.DLR_BY_DATE,
      payload,
      options,
    );
  }

  /**
   * Pull messages received on account numbers during a date window.
   */
  async getIncomingMessages(
    dto: GetIncomingMessagesDto,
    options?: TextMeRequestOptions,
  ): Promise<GetIncomingMessagesResponseDto> {
    const payload: Record<string, unknown> = {
      from: dto.from,
      to: dto.to,
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, GetIncomingMessagesResponseDto>(
      TEXTME_OPERATIONS.INCOMING,
      payload,
      options,
    );
  }
}
