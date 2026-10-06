import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';
import { ContactListMemberDto } from './create-contact-list.dto';

export class AddNumbersToListDto {
  @IsNotEmpty({ message: VALIDATION_MESSAGES.CONTACT_LIST_ID_REQUIRED })
  @IsString()
  cl_id!: string;

  @IsArray({ message: VALIDATION_MESSAGES.PHONE_REQUIRED })
  @ArrayNotEmpty({ message: VALIDATION_MESSAGES.PHONE_REQUIRED })
  @ValidateNested({ each: true })
  @Type(() => ContactListMemberDto)
  contacts!: ContactListMemberDto[];
}

export class AddNumbersToContactListDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddNumbersToListDto)
  lists!: AddNumbersToListDto[];
}

export class RemoveNumbersFromListDto {
  @IsNotEmpty({ message: VALIDATION_MESSAGES.CONTACT_LIST_ID_REQUIRED })
  @IsString()
  cl_id!: string;

  @IsArray({ message: VALIDATION_MESSAGES.PHONE_REQUIRED })
  @ArrayNotEmpty({ message: VALIDATION_MESSAGES.PHONE_REQUIRED })
  @IsString({ each: true })
  phones!: string[];
}

export class RemoveNumbersFromContactListDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RemoveNumbersFromListDto)
  lists!: RemoveNumbersFromListDto[];
}

export class ManageNumbersResponseDto {
  status!: number;
  message?: string;
  errors?: unknown[];
}
