import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';

export class ContactListMemberDto {
  @IsNotEmpty({ message: VALIDATION_MESSAGES.PHONE_REQUIRED })
  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  df1?: string;

  @IsOptional()
  @IsString()
  df2?: string;

  @IsOptional()
  @IsString()
  df3?: string;

  @IsOptional()
  @IsString()
  df4?: string;

  @IsOptional()
  @IsString()
  df5?: string;

  @IsOptional()
  @IsString()
  df6?: string;
}

export class CreateContactListItemDto {
  @IsNotEmpty({ message: VALIDATION_MESSAGES.CONTACT_LIST_NAME_REQUIRED })
  @IsString()
  name!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactListMemberDto)
  contacts?: ContactListMemberDto[];
}

export class CreateContactListDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContactListItemDto)
  lists!: CreateContactListItemDto[];
}

export class CreateContactListResponseDto {
  status!: number;
  message?: string;
  cl_id?: string | number;
  cl_ids?: Array<string | number>;
  errors?: unknown[];
}
