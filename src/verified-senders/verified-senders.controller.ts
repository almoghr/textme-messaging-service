import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GetVerifiedPhonesDto, GetVerifiedPhonesResponseDto } from './dto/get-verified-phones.dto';
import { VerifyPhoneDto, VerifyPhoneResponseDto } from './dto/verify-phone.dto';
import { VerifiedSendersService } from './verified-senders.service';

@Controller('verified-senders')
export class VerifiedSendersController {
  constructor(private readonly verifiedSendersService: VerifiedSendersService) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyPhone(@Body() dto: VerifyPhoneDto): Promise<VerifyPhoneResponseDto> {
    return this.verifiedSendersService.verifyPhone(dto);
  }

  @Post('all')
  @HttpCode(HttpStatus.OK)
  async getVerifiedPhones(@Body() dto: GetVerifiedPhonesDto): Promise<GetVerifiedPhonesResponseDto> {
    return this.verifiedSendersService.getVerifiedPhones(dto);
  }
}
