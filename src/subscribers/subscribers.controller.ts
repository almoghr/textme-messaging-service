import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AddSubscriberDto, AddSubscriberResponseDto } from './dto/add-subscriber.dto';
import { GetSubscriberBalancesDto, GetSubscriberBalancesResponseDto } from './dto/get-subscriber-balances.dto';
import { UpdateSubscriberWalletDto, UpdateSubscriberWalletResponseDto } from './dto/update-subscriber-wallet.dto';
import { SubscribersService } from './subscribers.service';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post('add')
  @HttpCode(HttpStatus.OK)
  async addSubscriber(@Body() dto: AddSubscriberDto): Promise<AddSubscriberResponseDto> {
    return this.subscribersService.addSubscriber(dto);
  }

  @Post('update-wallet')
  @HttpCode(HttpStatus.OK)
  async updateWallet(@Body() dto: UpdateSubscriberWalletDto): Promise<UpdateSubscriberWalletResponseDto> {
    return this.subscribersService.updateWallet(dto);
  }

  @Post('balances')
  @HttpCode(HttpStatus.OK)
  async getBalances(@Body() dto: GetSubscriberBalancesDto): Promise<GetSubscriberBalancesResponseDto> {
    return this.subscribersService.getBalances(dto);
  }
}
