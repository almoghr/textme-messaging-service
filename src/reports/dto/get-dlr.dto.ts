import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';

export class GetDlrDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsArray({ message: VALIDATION_MESSAGES.EXTERNAL_IDS_REQUIRED })
  @ArrayNotEmpty({ message: VALIDATION_MESSAGES.EXTERNAL_IDS_REQUIRED })
  @IsString({ each: true })
  external_ids!: string[];

  @IsNotEmpty({ message: VALIDATION_MESSAGES.DATE_RANGE_REQUIRED })
  @IsString()
  from!: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.DATE_RANGE_REQUIRED })
  @IsString()
  to!: string;
}

export class DlrTransactionItemDto {
  external_id?: string;
  phone?: string;
  status?: string;
  he_message?: string;
  en_message?: string;
  date?: string;
  operator?: string;
  shipment_id?: string;
  [key: string]: unknown;
}

export class GetDlrResponseDto {
  status!: number;
  message?: string;
  transactions?: DlrTransactionItemDto[] | { transaction: DlrTransactionItemDto | DlrTransactionItemDto[] };
  errors?: unknown[];
}
