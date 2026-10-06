import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { BulkSendDto, BulkSendResponseDto } from './dto/bulk-send.dto';
import { SendSmsDto, SendSmsResponseDto } from './dto/send-sms.dto';
import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendSms(@Body() dto: SendSmsDto): Promise<SendSmsResponseDto> {
    return this.smsService.sendSms(dto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.OK)
  async sendBulk(@Body() dto: BulkSendDto): Promise<BulkSendResponseDto> {
    return this.smsService.sendBulk(dto);
  }
}
