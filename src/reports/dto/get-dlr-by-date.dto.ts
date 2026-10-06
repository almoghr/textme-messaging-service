import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';
import { GetDlrResponseDto } from './get-dlr.dto';

export class GetDlrByDateDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.DATE_RANGE_REQUIRED })
  @IsString()
  from!: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.DATE_RANGE_REQUIRED })
  @IsString()
  to!: string;
}

export { GetDlrResponseDto as GetDlrByDateResponseDto };
