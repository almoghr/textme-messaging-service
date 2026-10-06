import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';

export class SubAccountDetailsDto {
  @IsNotEmpty({ message: VALIDATION_MESSAGES.SUBSCRIBER_NAME_REQUIRED })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.USERNAME_REQUIRED })
  @IsString()
  username!: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.SUBSCRIBER_PASSWORD_REQUIRED })
  @IsString()
  password!: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.SOURCE_REQUIRED })
  @MaxLength(11, { message: VALIDATION_MESSAGES.SOURCE_MAX_LENGTH })
  @IsString()
  source!: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.SUBSCRIBER_AMOUNT_REQUIRED })
  @IsString()
  amount!: string;

  @IsOptional()
  @IsString()
  otpPhone?: string;
}

export class AddSubscriberDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SubAccountDetailsDto)
  userDetails!: SubAccountDetailsDto;
}

export class AddSubscriberResponseDto {
  status!: number;
  message?: string;
  errors?: unknown[];
}
