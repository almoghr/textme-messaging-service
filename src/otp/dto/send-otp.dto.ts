import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';
import { OTP_CONSTANTS } from '../constants/otp.constants';

export class SendOtpDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.PHONE_REQUIRED })
  @IsString()
  phone!: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.SOURCE_REQUIRED })
  @MaxLength(11, { message: VALIDATION_MESSAGES.SOURCE_MAX_LENGTH })
  @IsString()
  source!: string;

  @IsOptional()
  @IsString()
  app_id?: string;

  @IsOptional()
  @IsInt()
  @Min(OTP_CONSTANTS.MIN_MAX_TRIES, { message: VALIDATION_MESSAGES.OTP_MAX_TRIES_INVALID })
  @Max(OTP_CONSTANTS.MAX_MAX_TRIES, { message: VALIDATION_MESSAGES.OTP_MAX_TRIES_INVALID })
  max_tries?: number;

  @IsOptional()
  @IsInt()
  @Min(OTP_CONSTANTS.MIN_VALID_TIME_MINUTES, { message: VALIDATION_MESSAGES.OTP_VALID_TIME_INVALID })
  @Max(OTP_CONSTANTS.MAX_VALID_TIME_MINUTES, { message: VALIDATION_MESSAGES.OTP_VALID_TIME_INVALID })
  valid_time?: number;

  @IsOptional()
  @IsString()
  text?: string;
}

export class SendOtpResponseDto {
  status!: number;
  message?: string;
  count?: number | string;
  cost?: number | string;
  errors?: unknown[];
}
