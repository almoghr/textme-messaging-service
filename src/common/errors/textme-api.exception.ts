import { HttpException, HttpStatus } from '@nestjs/common';
import { translateToHebrew } from '../i18n/hebrew-translations.constants';

export interface TextMeErrorDetails {
  statusCode: number;
  message: string;
  operation?: string;
  errors?: unknown[];
  rawResponse?: unknown;
}

export class TextMeApiException extends HttpException {
  public readonly textMeStatus: number;
  public readonly textMeMessage: string;
  public readonly messageHe: string;
  public readonly operation?: string;
  public readonly errors?: unknown[];
  public readonly rawResponse?: unknown;

  constructor(details: TextMeErrorDetails, httpStatus: HttpStatus = HttpStatus.BAD_REQUEST) {
    const messageHe = translateToHebrew(details.message, details.statusCode);
    super(
      {
        success: false,
        textMeStatus: details.statusCode,
        message: details.message,
        message_he: messageHe,
        operation: details.operation,
        errors: details.errors,
      },
      httpStatus,
    );
    this.textMeStatus = details.statusCode;
    this.textMeMessage = details.message;
    this.messageHe = messageHe;
    this.operation = details.operation;
    this.errors = details.errors;
    this.rawResponse = details.rawResponse;
  }
}
