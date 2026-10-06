import { Type } from 'class-transformer';
import { IsIn, IsOptional, ValidateNested } from 'class-validator';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';
import { BALANCE_TYPES, BalanceType } from '../constants/balance.constants';

export class GetBalanceDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsOptional()
  @IsIn([BALANCE_TYPES.SMS, BALANCE_TYPES.INTERNATIONAL, BALANCE_TYPES.MAIL])
  type?: BalanceType;
}

export class GetBalanceResponseDto {
  status!: number;
  message?: string;
  amount?: string | number;
  errors?: unknown[];
}
