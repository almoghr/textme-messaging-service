import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';

export class ValidateOtpDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.PHONE_REQUIRED })
  @IsString()
  phone!: string;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.OTP_CODE_REQUIRED })
  @IsString()
  code!: string;

  @IsOptional()
  @IsString()
  app_id?: string;

  @IsOptional()
  @IsString()
  service_type?: string;
}

export class ValidateOtpResponseDto {
  status!: number;
  message?: string;
  errors?: unknown[];
}
