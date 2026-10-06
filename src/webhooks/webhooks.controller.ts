import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  BlocklistAdditionCallbackDto,
  DeliveryReportCallbackDto,
  IncomingMessageCallbackDto,
  WebhookAckResponseDto,
} from './dto/push-callbacks.dto';
import { RegisterPushUrlDto, RegisterPushUrlResponseDto } from './dto/register-push-url.dto';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('push-url/register')
  @HttpCode(HttpStatus.OK)
  async registerPushUrl(@Body() dto: RegisterPushUrlDto): Promise<RegisterPushUrlResponseDto> {
    return this.webhooksService.registerPushUrl(dto);
  }

  @Post('delivery-report')
  @HttpCode(HttpStatus.OK)
  handleDeliveryReport(@Body() dto: DeliveryReportCallbackDto): WebhookAckResponseDto {
    return this.webhooksService.processDeliveryReport(dto);
  }

  @Post('incoming-message')
  @HttpCode(HttpStatus.OK)
  handleIncomingMessage(@Body() dto: IncomingMessageCallbackDto): WebhookAckResponseDto {
    return this.webhooksService.processIncomingMessage(dto);
  }

  @Post('blocklist-addition')
  @HttpCode(HttpStatus.OK)
  handleBlocklistAddition(@Body() dto: BlocklistAdditionCallbackDto): WebhookAckResponseDto {
    return this.webhooksService.processBlocklistAddition(dto);
  }
}
