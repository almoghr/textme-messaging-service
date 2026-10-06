import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';
import { WEBHOOK_TYPES, WebhookType } from '../constants/webhooks.constants';

export class RegisterPushUrlDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.WEBHOOK_TYPE_INVALID })
  @IsIn([WEBHOOK_TYPES.DLR, WEBHOOK_TYPES.INCOMING, WEBHOOK_TYPES.BLACKLIST], {
    message: VALIDATION_MESSAGES.WEBHOOK_TYPE_INVALID,
  })
  type!: WebhookType;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.WEBHOOK_URL_REQUIRED })
  @IsString()
  url!: string;
}

export class RegisterPushUrlResponseDto {
  status!: number;
  message?: string;
  errors?: unknown[];
}
