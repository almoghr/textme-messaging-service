import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';

export class UpdateSubAccountDetailsDto {
  @IsNotEmpty({ message: VALIDATION_MESSAGES.USERNAME_REQUIRED })
  @IsString()
  username!: string;

  @IsOptional()
  @IsString()
  amount?: string;

  @IsOptional()
  @IsInt()
  amount_int?: number;
}

export class UpdateSubscriberWalletDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TextMeUserDto)
  user?: TextMeUserDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateSubAccountDetailsDto)
  userDetails!: UpdateSubAccountDetailsDto;
}

export class UpdateSubscriberWalletResponseDto {
  status!: number;
  message?: string;
  errors?: unknown[];
}
