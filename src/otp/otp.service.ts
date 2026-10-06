import { Injectable } from '@nestjs/common';
import { TEXTME_OPERATIONS } from '../common/constants/api.constants';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { TextMeRequestOptions } from '../textme-client/textme-client.types';
import { SendOtpDto, SendOtpResponseDto } from './dto/send-otp.dto';
import { ValidateOtpDto, ValidateOtpResponseDto } from './dto/validate-otp.dto';

@Injectable()
export class OtpService {
  constructor(private readonly client: TextMeClientService) {}

  /**
   * Request TextMe to generate and send an OTP code to a phone number.
   */
  async sendOtp(dto: SendOtpDto, options?: TextMeRequestOptions): Promise<SendOtpResponseDto> {
    const payload: Record<string, unknown> = {
      phone: dto.phone,
      source: dto.source,
    };

    if (dto.user) payload.user = dto.user;
    if (dto.app_id) payload.app_id = dto.app_id;
    if (dto.max_tries !== undefined) payload.max_tries = dto.max_tries;
    if (dto.valid_time !== undefined) payload.valid_time = dto.valid_time;
    if (dto.text) payload.text = dto.text;

    return this.client.execute<Record<string, unknown>, SendOtpResponseDto>(
      TEXTME_OPERATIONS.SEND_OTP,
      payload,
      options,
    );
  }

  /**
   * Validate a code entered by the user against TextMe OTP registry.
   */
  async validateOtp(dto: ValidateOtpDto, options?: TextMeRequestOptions): Promise<ValidateOtpResponseDto> {
    const payload: Record<string, unknown> = {
      phone: dto.phone,
      code: dto.code,
    };

    if (dto.user) payload.user = dto.user;
    if (dto.app_id) payload.app_id = dto.app_id;
    if (dto.service_type) payload.service_type = dto.service_type;

    return this.client.execute<Record<string, unknown>, ValidateOtpResponseDto>(
      TEXTME_OPERATIONS.VALIDATE_OTP,
      payload,
      options,
    );
  }
}
