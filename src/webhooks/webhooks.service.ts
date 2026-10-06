import { Injectable, Logger } from '@nestjs/common';
import { TEXTME_OPERATIONS } from '../common/constants/api.constants';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { TextMeRequestOptions } from '../textme-client/textme-client.types';
import {
  BlocklistAdditionCallbackDto,
  DeliveryReportCallbackDto,
  IncomingMessageCallbackDto,
  WebhookAckResponseDto,
} from './dto/push-callbacks.dto';
import { RegisterPushUrlDto, RegisterPushUrlResponseDto } from './dto/register-push-url.dto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private readonly client: TextMeClientService) {}

  /**
   * Register a callback URL with TextMe for a specific push feed type.
   */
  async registerPushUrl(dto: RegisterPushUrlDto, options?: TextMeRequestOptions): Promise<RegisterPushUrlResponseDto> {
    const payload: Record<string, unknown> = {
      type: dto.type,
      url: dto.url,
    };

    if (dto.user) payload.user = dto.user;

    return this.client.execute<Record<string, unknown>, RegisterPushUrlResponseDto>(
      TEXTME_OPERATIONS.PUSH_URL,
      payload,
      options,
    );
  }

  /**
   * Process pushed delivery report callbacks sent from TextMe.
   */
  processDeliveryReport(callback: DeliveryReportCallbackDto): WebhookAckResponseDto {
    this.logger.log(
      `Received pushed DLR: external_id=${callback.external_id ?? 'N/A'}, status=${callback.status ?? 'N/A'}, phone=${callback.phone ?? 'N/A'}`,
    );

    return {
      received: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Process pushed incoming messages sent from TextMe.
   */
  processIncomingMessage(callback: IncomingMessageCallbackDto): WebhookAckResponseDto {
    this.logger.log(
      `Received pushed inbound message: from=${callback.phone ?? 'N/A'}, to=${callback.dest ?? 'N/A'}, text=${callback.message ?? ''}`,
    );

    return {
      received: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Process pushed blocklist additions / opt-outs sent from TextMe.
   */
  processBlocklistAddition(callback: BlocklistAdditionCallbackDto): WebhookAckResponseDto {
    this.logger.log(
      `Received pushed blocklist addition: dest=${callback.dest ?? 'N/A'}, message=${callback.message ?? ''}`,
    );

    return {
      received: true,
      timestamp: new Date().toISOString(),
    };
  }
}
