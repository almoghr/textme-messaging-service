import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';

export class RemoveContactListDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsArray({ message: VALIDATION_MESSAGES.CONTACT_LIST_ID_REQUIRED })
  @ArrayNotEmpty({ message: VALIDATION_MESSAGES.CONTACT_LIST_ID_REQUIRED })
  @IsString({ each: true })
  cl_ids!: string[];
}

export class RemoveContactListResponseDto {
  status!: number;
  message?: string;
  errors?: unknown[];
}
