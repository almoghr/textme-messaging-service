import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { AddToBlacklistDto, AddToBlacklistResponseDto } from './dto/add-blacklist.dto';
import { GetBlacklistDto, GetBlacklistResponseDto } from './dto/get-blacklist.dto';
import { RemoveFromBlacklistDto, RemoveFromBlacklistResponseDto } from './dto/remove-blacklist.dto';

@Controller('blacklist')
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Post('query')
  @HttpCode(HttpStatus.OK)
  async getBlacklist(@Body() dto: GetBlacklistDto): Promise<GetBlacklistResponseDto> {
    return this.blacklistService.getBlacklist(dto);
  }

  @Post('add')
  @HttpCode(HttpStatus.OK)
  async addToBlacklist(@Body() dto: AddToBlacklistDto): Promise<AddToBlacklistResponseDto> {
    return this.blacklistService.addToBlacklist(dto);
  }

  @Post('remove')
  @HttpCode(HttpStatus.OK)
  async removeFromBlacklist(@Body() dto: RemoveFromBlacklistDto): Promise<RemoveFromBlacklistResponseDto> {
    return this.blacklistService.removeFromBlacklist(dto);
  }
}
