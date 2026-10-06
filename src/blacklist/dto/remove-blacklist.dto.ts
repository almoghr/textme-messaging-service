import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';

export class RemoveFromBlacklistDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsArray({ message: VALIDATION_MESSAGES.PHONE_REQUIRED })
  @ArrayNotEmpty({ message: VALIDATION_MESSAGES.PHONE_REQUIRED })
  @IsString({ each: true })
  phones!: string[];

  @IsNotEmpty({ message: VALIDATION_MESSAGES.REASON_REQUIRED })
  @IsString()
  reason!: string;
}

export class RemoveFromBlacklistResponseDto {
  status!: number;
  message?: string;
  errors?: unknown[];
}
