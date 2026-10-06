import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
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
import { SmsDestinationsDto, SmsLinkItemDto } from './send-sms.dto';

export class BulkMessageItemDto {
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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SmsLinkItemDto)
  links?: SmsLinkItemDto[];
}

export class BulkSendDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsArray({ message: VALIDATION_MESSAGES.BULK_MESSAGES_REQUIRED })
  @ArrayMinSize(1, { message: VALIDATION_MESSAGES.BULK_MESSAGES_REQUIRED })
  @ArrayMaxSize(SMS_CONSTANTS.MAX_BULK_MESSAGES, { message: VALIDATION_MESSAGES.BULK_MESSAGES_MAX_LIMIT })
  @ValidateNested({ each: true })
  @Type(() => BulkMessageItemDto)
  messages!: BulkMessageItemDto[];

  @IsOptional()
  @IsString()
  timing?: string;

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
}

export class BulkSendResponseDto {
  status!: number;
  message?: string;
  shipment_id?: string;
  cost?: number | string;
  count?: number | string;
  errors?: unknown[];
}
