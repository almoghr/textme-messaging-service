import { Type } from 'class-transformer';
import { IsIn, IsOptional, ValidateNested } from 'class-validator';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';

export class GetVerifiedPhonesDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsOptional()
  @IsIn(['0', '1'])
  is_subs?: '0' | '1';
}

export class VerifiedPhoneItemDto {
  PHONE?: string;
  source?: string;
  phone?: string;
  [key: string]: unknown;
}

export class GetVerifiedPhonesResponseDto {
  status!: number;
  message?: string;
  verified_phones?: VerifiedPhoneItemDto[] | { phone: VerifiedPhoneItemDto | VerifiedPhoneItemDto[] };
  errors?: unknown[];
}
