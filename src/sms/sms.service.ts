import { Injectable } from '@nestjs/common';
import { TEXTME_OPERATIONS } from '../common/constants/api.constants';
import { TextMeClientService } from '../textme-client/textme-client.service';
import { TextMeRequestOptions } from '../textme-client/textme-client.types';
import { BulkMessageItemDto, BulkSendDto, BulkSendResponseDto } from './dto/bulk-send.dto';
import { PhoneDestinationItemDto, SendSmsDto, SendSmsResponseDto, SmsDestinationsDto, SmsLinkItemDto } from './dto/send-sms.dto';

@Injectable()
export class SmsService {
  constructor(private readonly client: TextMeClientService) {}

  /**
   * Send a single message to one or more recipients or contact lists.
   */
  async sendSms(dto: SendSmsDto, options?: TextMeRequestOptions): Promise<SendSmsResponseDto> {
    const payload: Record<string, unknown> = {
      source: dto.source,
      destinations: this.formatDestinations(dto.destinations),
      message: dto.message,
    };

    if (dto.user) payload.user = dto.user;
    if (dto.tag) payload.tag = dto.tag;
    if (dto.add_dynamic) payload.add_dynamic = dto.add_dynamic;
    if (dto.timing) payload.timing = dto.timing;
    if (dto.add_unsubscribe) payload.add_unsubscribe = dto.add_unsubscribe;
    if (dto.temp_bl) payload.temp_bl = dto.temp_bl;
    if (dto.includes_international) payload.includes_international = dto.includes_international;
    if (dto.campaign_name) payload.campaign_name = dto.campaign_name;
    if (dto.links && dto.links.length > 0) {
      payload.links = this.formatLinks(dto.links);
    }

    return this.client.execute<Record<string, unknown>, SendSmsResponseDto>(
      TEXTME_OPERATIONS.SEND_SMS,
      payload,
      options,
    );
  }

  /**
   * Send bulk messages (up to 2,500 distinct messages in one call).
   */
  async sendBulk(dto: BulkSendDto, options?: TextMeRequestOptions): Promise<BulkSendResponseDto> {
    const formattedMessages = dto.messages.map((item: BulkMessageItemDto) => {
      const msgObj: Record<string, unknown> = {
        source: item.source,
        destinations: this.formatDestinations(item.destinations),
        message: item.message,
      };
      if (item.links && item.links.length > 0) {
        msgObj.links = this.formatLinks(item.links);
      }
      return msgObj;
    });

    const payload: Record<string, unknown> = {
      messages: {
        message: formattedMessages,
      },
    };

    if (dto.user) payload.user = dto.user;
    if (dto.timing) payload.timing = dto.timing;
    if (dto.temp_bl) payload.temp_bl = dto.temp_bl;
    if (dto.includes_international) payload.includes_international = dto.includes_international;
    if (dto.campaign_name) payload.campaign_name = dto.campaign_name;

    return this.client.execute<Record<string, unknown>, BulkSendResponseDto>(
      TEXTME_OPERATIONS.SEND_BULK,
      payload,
      options,
    );
  }

  private formatDestinations(destinations: SmsDestinationsDto): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    if (destinations.phone) {
      if (typeof destinations.phone === 'string' || Array.isArray(destinations.phone)) {
        if (Array.isArray(destinations.phone) && destinations.phone.length > 0 && typeof destinations.phone[0] === 'object') {
          result.phone = (destinations.phone as PhoneDestinationItemDto[]).map((p) => {
            if (p.id) {
              return {
                $: { id: p.id },
                _: p.phone,
              };
            }
            return p.phone;
          });
        } else {
          result.phone = destinations.phone;
        }
      }
    }

    if (destinations.cl) {
      result.cl = destinations.cl;
    }

    return result;
  }

  private formatLinks(links: SmsLinkItemDto[]): Record<string, unknown> {
    return {
      link: links.map((l) => ({
        $: { id: l.id },
        _: l.url,
      })),
    };
  }
}
