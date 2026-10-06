import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';

export class AddToBlacklistDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsArray({ message: VALIDATION_MESSAGES.PHONE_REQUIRED })
  @ArrayNotEmpty({ message: VALIDATION_MESSAGES.PHONE_REQUIRED })
  @IsString({ each: true })
  phones!: string[];
}

export class AddToBlacklistResponseDto {
  status!: number;
  message?: string;
  errors?: unknown[];
}
