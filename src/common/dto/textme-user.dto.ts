import { IsOptional, IsString } from 'class-validator';

export class TextMeUserDto {
  @IsOptional()
  @IsString()
  username?: string;
}
