export interface TextMeStatusEnvelope {
  status: number | string;
  message?: string;
  message_he?: string;
  [key: string]: unknown;
}

export class TextMeResponseDto<T = unknown> {
  success!: boolean;
  status!: number;
  message!: string;
  message_he?: string;
  data?: T;
  raw?: unknown;
}

