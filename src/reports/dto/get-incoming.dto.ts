import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.constants';
import { TextMeUserDto } from '../../common/dto/textme-user.dto';

export class GetIncomingMessagesDto {
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

export class IncomingMessageItemDto {
  source?: string;
  destination?: string;
  message?: string;
  date?: string;
  [key: string]: unknown;
}

export class GetIncomingMessagesResponseDto {
  status!: number;
  message?: string;
  incoming_messages?: IncomingMessageItemDto[] | { incoming_message: IncomingMessageItemDto | IncomingMessageItemDto[] };
  errors?: unknown[];
}
