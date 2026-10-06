import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';
import { SMS_CONSTANTS } from '../constants/sms.constants';

export class PhoneDestinationItemDto {
  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  id?: string;
}

export class SmsDestinationsDto {
  @IsOptional()
  phone?: string | string[] | PhoneDestinationItemDto[];

  @IsOptional()
  cl?: string | string[];
}

export class SmsLinkItemDto {
  @IsString()
  id!: string;

  @IsString()
  url!: string;
}

export class SendSmsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.SOURCE_REQUIRED })
  @MaxLength(SMS_CONSTANTS.MAX_SOURCE_LENGTH, { message: VALIDATION_MESSAGES.SOURCE_MAX_LENGTH })
  @IsString()
  source!: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.DESTINATIONS_REQUIRED })
  @ValidateNested()
  @Type(() => SmsDestinationsDto)
  destinations!: SmsDestinationsDto;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.MESSAGE_REQUIRED })
  @MaxLength(SMS_CONSTANTS.MAX_MESSAGE_LENGTH, { message: VALIDATION_MESSAGES.MESSAGE_MAX_LENGTH })
  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsIn([SMS_CONSTANTS.BOOLEAN_FLAGS.DISABLED, SMS_CONSTANTS.BOOLEAN_FLAGS.ENABLED])
  add_dynamic?: '0' | '1';

  @IsOptional()
  @IsString()
  timing?: string;

  @IsOptional()
  @IsIn([SMS_CONSTANTS.UNSUBSCRIBE_OPTIONS.REPLY, SMS_CONSTANTS.UNSUBSCRIBE_OPTIONS.LINK])
  add_unsubscribe?: '2' | '3';

  @IsOptional()
  @IsString()
  temp_bl?: string;

  @IsOptional()
  @IsIn([SMS_CONSTANTS.BOOLEAN_FLAGS.DISABLED, SMS_CONSTANTS.BOOLEAN_FLAGS.ENABLED])
  includes_international?: '0' | '1';

  @IsOptional()
  @MaxLength(SMS_CONSTANTS.MAX_CAMPAIGN_NAME_LENGTH, { message: VALIDATION_MESSAGES.CAMPAIGN_NAME_REQUIRED })
  @IsString()
  campaign_name?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SmsLinkItemDto)
  links?: SmsLinkItemDto[];
}

export class SendSmsResponseDto {
  status!: number;
  message?: string;
  shipment_id?: string;
  cost?: number | string;
  count?: number | string;
  errors?: unknown[];
}
