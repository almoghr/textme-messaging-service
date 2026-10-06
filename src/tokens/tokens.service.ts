import { Injectable } from '@nestjs/common';
import { TEXTME_OPERATIONS } from '../common/constants/api.constants';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { TextMeRequestOptions } from '../textme-client/textme-client.types';
import { TOKEN_ACTIONS } from './constants/tokens.constants';
import { CreateTokenDto, CreateTokenResponseDto } from './dto/create-token.dto';
import { GetCurrentTokenDto, GetCurrentTokenResponseDto } from './dto/get-current-token.dto';

@Injectable()
export class TokensService {
  constructor(private readonly client: TextMeClientService) {}

  /**
   * Mint a new API token for the specified username.
   */
  async createToken(dto: CreateTokenDto, options?: TextMeRequestOptions): Promise<CreateTokenResponseDto> {
    const payload: Record<string, unknown> = {
      username: dto.username,
      action: TOKEN_ACTIONS.NEW,
    };
    if (dto.user) {
      payload.user = dto.user;
    }

    return this.client.execute<Record<string, unknown>, CreateTokenResponseDto>(
      TEXTME_OPERATIONS.GET_API_TOKEN,
      payload,
      options,
    );
  }

  /**
   * Read back the most recent valid API token for the specified username.
   */
  async getCurrentToken(dto: GetCurrentTokenDto, options?: TextMeRequestOptions): Promise<GetCurrentTokenResponseDto> {
    const payload: Record<string, unknown> = {
      username: dto.username,
      action: TOKEN_ACTIONS.CURRENT,
    };
    if (dto.user) {
      payload.user = dto.user;
    }

    return this.client.execute<Record<string, unknown>, GetCurrentTokenResponseDto>(
      TEXTME_OPERATIONS.GET_API_TOKEN,
      payload,
      options,
    );
  }
}
