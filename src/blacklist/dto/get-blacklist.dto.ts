import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';

export class GetBlacklistDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.DATE_RANGE_REQUIRED })
  @IsString()
  from!: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.DATE_RANGE_REQUIRED })
  @IsString()
  to!: string;
}

export class BlacklistContactItemDto {
  phone?: string;
  source?: string;
  date?: string;
  reason?: string;
  [key: string]: unknown;
}

export class GetBlacklistResponseDto {
  status!: number;
  message?: string;
  blacklists?: BlacklistContactItemDto[] | { blacklist: BlacklistContactItemDto | BlacklistContactItemDto[] };
  errors?: unknown[];
}
