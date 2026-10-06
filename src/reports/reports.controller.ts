import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GetDlrByDateDto, GetDlrByDateResponseDto } from './dto/get-dlr-by-date.dto';
import { GetDlrDto, GetDlrResponseDto } from './dto/get-dlr.dto';
import { GetIncomingMessagesDto, GetIncomingMessagesResponseDto } from './dto/get-incoming.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('dlr')
  @HttpCode(HttpStatus.OK)
  async getDlr(@Body() dto: GetDlrDto): Promise<GetDlrResponseDto> {
    return this.reportsService.getDlr(dto);
  }

  @Post('dlr-by-date')
  @HttpCode(HttpStatus.OK)
  async getDlrByDate(@Body() dto: GetDlrByDateDto): Promise<GetDlrByDateResponseDto> {
    return this.reportsService.getDlrByDate(dto);
  }

  @Post('incoming')
  @HttpCode(HttpStatus.OK)
  async getIncomingMessages(@Body() dto: GetIncomingMessagesDto): Promise<GetIncomingMessagesResponseDto> {
    return this.reportsService.getIncomingMessages(dto);
  }
}
