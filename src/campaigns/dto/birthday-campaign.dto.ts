import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';

export class GetBirthdayCampaignsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;
}

export class EditBirthdayCampaignDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.CAMPAIGN_ID_REQUIRED })
  @IsString()
  campaign_id!: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.MESSAGE_REQUIRED })
  @MaxLength(1005, { message: VALIDATION_MESSAGES.MESSAGE_MAX_LENGTH })
  @IsString()
  message!: string;
}

export class BirthdayCampaignItemDto {
  id?: string | number;
  message?: string;
  source?: string;
  time?: string;
  [key: string]: unknown;
}

export class GetBirthdayCampaignsResponseDto {
  status!: number;
  message?: string;
  birthday_campaigns?: BirthdayCampaignItemDto[] | { birthday_campaign: BirthdayCampaignItemDto | BirthdayCampaignItemDto[] };
  errors?: unknown[];
}

export class EditBirthdayCampaignResponseDto {
  status!: number;
  message?: string;
  errors?: unknown[];
}
