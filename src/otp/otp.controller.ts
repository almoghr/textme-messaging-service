import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SendOtpDto, SendOtpResponseDto } from './dto/send-otp.dto';
import { ValidateOtpDto, ValidateOtpResponseDto } from './dto/validate-otp.dto';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto): Promise<SendOtpResponseDto> {
    return this.otpService.sendOtp(dto);
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateOtp(@Body() dto: ValidateOtpDto): Promise<ValidateOtpResponseDto> {
    return this.otpService.validateOtp(dto);
  }
}
