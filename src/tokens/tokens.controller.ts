import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateTokenDto, CreateTokenResponseDto } from './dto/create-token.dto';
import { GetCurrentTokenDto, GetCurrentTokenResponseDto } from './dto/get-current-token.dto';
import { TokensService } from './tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createToken(@Body() dto: CreateTokenDto): Promise<CreateTokenResponseDto> {
    return this.tokensService.createToken(dto);
  }

  @Post('current')
  @HttpCode(HttpStatus.OK)
  async getCurrentToken(@Body() dto: GetCurrentTokenDto): Promise<GetCurrentTokenResponseDto> {
    return this.tokensService.getCurrentToken(dto);
  }
}
