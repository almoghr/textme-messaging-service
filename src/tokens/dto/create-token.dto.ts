import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';

export class CreateTokenDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.USERNAME_REQUIRED })
  @IsString()
  username!: string;
}

export class CreateTokenResponseDto {
  status!: number;
  message?: string;
  token?: string;
  expiration_date?: string;
  action?: string;
}
