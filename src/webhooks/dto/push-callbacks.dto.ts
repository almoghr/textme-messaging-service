import { IsOptional, IsString } from 'class-validator';

export class DeliveryReportCallbackDto {
  @IsOptional()
  @IsString()
  external_id?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  he_message?: string;

  @IsOptional()
  @IsString()
  en_message?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  operaor?: string;

  @IsOptional()
  @IsString()
  shipment_id?: string;
}

export class IncomingMessageCallbackDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  dest?: string;
}

export class BlocklistAdditionCallbackDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  dest?: string;
}

export class WebhookAckResponseDto {
  received!: boolean;
  timestamp!: string;
}
