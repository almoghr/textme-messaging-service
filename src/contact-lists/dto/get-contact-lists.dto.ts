import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';

export class GetAllContactListsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;
}

export class GetContactListByIdDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.CONTACT_LIST_ID_REQUIRED })
  @IsString()
  cl_id!: string;
}

export class ContactListSummaryItemDto {
  id?: string | number;
  name?: string;
  count?: string | number;
  [key: string]: unknown;
}

export class GetAllContactListsResponseDto {
  status!: number;
  message?: string;
  contact_lists?: ContactListSummaryItemDto[] | { contact_list: ContactListSummaryItemDto | ContactListSummaryItemDto[] };
  errors?: unknown[];
}

export class GetContactListByIdResponseDto {
  status!: number;
  message?: string;
  contact_list?: unknown;
  errors?: unknown[];
}
