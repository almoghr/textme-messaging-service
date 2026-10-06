import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class RpcCallDto {
  @IsNotEmpty()
  @IsObject()
  body!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  apiToken?: string;

  @IsOptional()
  @IsString()
  username?: string;
}
