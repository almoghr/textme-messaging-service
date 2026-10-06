import { Injectable } from '@nestjs/common';
import { TEXTME_OPERATIONS } from '../common/constants/api.constants';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { TextMeRequestOptions } from '../textme-client/textme-client.types';
import { GetVerifiedPhonesDto, GetVerifiedPhonesResponseDto } from './dto/get-verified-phones.dto';
import { VerifyPhoneDto, VerifyPhoneResponseDto } from './dto/verify-phone.dto';

@Injectable()
export class VerifiedSendersService {
  constructor(private readonly client: TextMeClientService) {}

  /**
   * Submit a phone number to undergo sender ID verification.
   */
  async verifyPhone(dto: VerifyPhoneDto, options?: TextMeRequestOptions): Promise<VerifyPhoneResponseDto> {
    const payload: Record<string, unknown> = {
      phone: dto.phone,
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, VerifyPhoneResponseDto>(
      TEXTME_OPERATIONS.VERIFY_PHONE,
      payload,
      options,
    );
  }

  /**
   * Retrieve list of authorized sender phone numbers.
   */
  async getVerifiedPhones(
    dto?: GetVerifiedPhonesDto,
    options?: TextMeRequestOptions,
  ): Promise<GetVerifiedPhonesResponseDto> {
    const payload: Record<string, unknown> = {};

    if (dto?.user) payload.user = dto.user;
    if (dto?.is_subs) payload.is_subs = dto.is_subs;

    return this.client.execute<Record<string, unknown>, GetVerifiedPhonesResponseDto>(
      TEXTME_OPERATIONS.GET_VERIFIED_PHONES,
      payload,
      options,
    );
  }
}
