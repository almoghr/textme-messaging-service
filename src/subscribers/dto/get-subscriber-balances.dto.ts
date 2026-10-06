import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';

export class GetSubscriberBalancesDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;
}

export class SubscriberBalanceItemDto {
  username?: string;
  amount?: string | number;
  money_amount?: string | number;
  [key: string]: unknown;
}

export class GetSubscriberBalancesResponseDto {
  status!: number;
  message?: string;
  balances?: SubscriberBalanceItemDto[] | { balance: SubscriberBalanceItemDto | SubscriberBalanceItemDto[] };
  errors?: unknown[];
}
