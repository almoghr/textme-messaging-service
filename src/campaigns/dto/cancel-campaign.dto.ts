import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';

export class CancelCampaignByIdDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.CAMPAIGN_ID_REQUIRED })
  @IsString()
  campaign_id!: string;
}

export class CancelCampaignByNameDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.CAMPAIGN_NAME_REQUIRED })
  @MaxLength(50, { message: VALIDATION_MESSAGES.CAMPAIGN_NAME_REQUIRED })
  @IsString()
  campaign_name!: string;
}

export class CancelCampaignResponseDto {
  status!: number;
  message?: string;
  errors?: unknown[];
}
