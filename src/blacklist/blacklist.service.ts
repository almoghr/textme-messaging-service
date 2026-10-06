import { Injectable } from '@nestjs/common';
import { TEXTME_OPERATIONS } from '../common/constants/api.constants';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { TextMeRequestOptions } from '../textme-client/textme-client.types';
import { AddToBlacklistDto, AddToBlacklistResponseDto } from './dto/add-blacklist.dto';
import { GetBlacklistDto, GetBlacklistResponseDto } from './dto/get-blacklist.dto';
import { RemoveFromBlacklistDto, RemoveFromBlacklistResponseDto } from './dto/remove-blacklist.dto';

@Injectable()
export class BlacklistService {
  constructor(private readonly client: TextMeClientService) {}

  /**
   * Retrieve numbers blocked during a specified date window.
   */
  async getBlacklist(dto: GetBlacklistDto, options?: TextMeRequestOptions): Promise<GetBlacklistResponseDto> {
    const payload: Record<string, unknown> = {
      from: dto.from,
      to: dto.to,
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, GetBlacklistResponseDto>(
      TEXTME_OPERATIONS.BLACKLIST_GET,
      payload,
      options,
    );
  }

  /**
   * Add phone numbers to the account blocklist. TextMe reports status 946 on success.
   */
  async addToBlacklist(dto: AddToBlacklistDto, options?: TextMeRequestOptions): Promise<AddToBlacklistResponseDto> {
    const payload: Record<string, unknown> = {
      phones: {
        phone: dto.phones,
      },
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, AddToBlacklistResponseDto>(
      TEXTME_OPERATIONS.BLACKLIST_ADD,
      payload,
      options,
    );
  }

  /**
   * Remove phone numbers from the blocklist with a mandatory reason.
   */
  async removeFromBlacklist(
    dto: RemoveFromBlacklistDto,
    options?: TextMeRequestOptions,
  ): Promise<RemoveFromBlacklistResponseDto> {
    const payload: Record<string, unknown> = {
      phones: {
        phone: dto.phones,
      },
      reason: dto.reason,
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, RemoveFromBlacklistResponseDto>(
      TEXTME_OPERATIONS.BLACKLIST_REMOVE,
      payload,
      options,
    );
  }
}
