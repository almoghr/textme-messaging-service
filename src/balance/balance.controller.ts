import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { GetBalanceDto, GetBalanceResponseDto } from './dto/get-balance.dto';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post('query')
  @HttpCode(HttpStatus.OK)
  async getBalance(@Body() dto: GetBalanceDto): Promise<GetBalanceResponseDto> {
    return this.balanceService.getBalance(dto);
  }
}
