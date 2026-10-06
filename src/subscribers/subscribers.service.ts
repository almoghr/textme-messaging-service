import { Injectable } from '@nestjs/common';
import { TEXTME_OPERATIONS } from '../common/constants/api.constants';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { TextMeRequestOptions } from '../textme-client/textme-client.types';
import { AddSubscriberDto, AddSubscriberResponseDto } from './dto/add-subscriber.dto';
import { GetSubscriberBalancesDto, GetSubscriberBalancesResponseDto } from './dto/get-subscriber-balances.dto';
import { UpdateSubscriberWalletDto, UpdateSubscriberWalletResponseDto } from './dto/update-subscriber-wallet.dto';

@Injectable()
export class SubscribersService {
  constructor(private readonly client: TextMeClientService) {}

  /**
   * Create a new sub-account with assigned credits under the reseller's account.
   */
  async addSubscriber(dto: AddSubscriberDto, options?: TextMeRequestOptions): Promise<AddSubscriberResponseDto> {
    const payload: Record<string, unknown> = {
      userDetails: {
        name: dto.userDetails.name,
        username: dto.userDetails.username,
        password: dto.userDetails.password,
        source: dto.userDetails.source,
        amount: dto.userDetails.amount,
      },
    };

    if (dto.userDetails.otpPhone) {
      (payload.userDetails as Record<string, unknown>).otpPhone = dto.userDetails.otpPhone;
    }
    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, AddSubscriberResponseDto>(
      TEXTME_OPERATIONS.SUBSCRIBER_ADD,
      payload,
      options,
    );
  }

  /**
   * Top up message credits or monetary balance for a designated sub-account.
   */
  async updateWallet(
    dto: UpdateSubscriberWalletDto,
    options?: TextMeRequestOptions,
  ): Promise<UpdateSubscriberWalletResponseDto> {
    const details: Record<string, unknown> = {
      username: dto.userDetails.username,
    };

    if (dto.userDetails.amount !== undefined) {
      details.amount = dto.userDetails.amount;
    }
    if (dto.userDetails.amount_int !== undefined) {
      details.amount_int = dto.userDetails.amount_int;
    }

    const payload: Record<string, unknown> = {
      userDetails: details,
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, UpdateSubscriberWalletResponseDto>(
      TEXTME_OPERATIONS.SUBSCRIBER_UPDATE_WALLET,
      payload,
      options,
    );
  }

  /**
   * Retrieve balance information for all sub-accounts under the reseller account.
   */
  async getBalances(
    dto?: GetSubscriberBalancesDto,
    options?: TextMeRequestOptions,
  ): Promise<GetSubscriberBalancesResponseDto> {
    const payload: Record<string, unknown> = {};
    if (dto?.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, GetSubscriberBalancesResponseDto>(
      TEXTME_OPERATIONS.SUBSCRIBER_BALANCES,
      payload,
      options,
    );
  }
}
