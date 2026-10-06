import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { translateToHebrew } from '../i18n/hebrew-translations.constants';
import { TextMeApiException } from './textme-api.exception';

@Catch()
export class TextMeExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(TextMeExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof TextMeApiException) {
      this.logger.warn(
        `TextMe API Error [${exception.operation ?? 'Unknown'}]: status=${exception.textMeStatus}, message=${exception.textMeMessage}`,
      );
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const baseObj: Record<string, unknown> =
        typeof res === 'object' && res !== null
          ? { ...(res as Record<string, unknown>) }
          : { statusCode: status, message: res };

      if (Array.isArray(baseObj.message)) {
        const messagesHe = (baseObj.message as unknown[]).map((msg) => translateToHebrew(msg));
        baseObj.messages_he = messagesHe;
        baseObj.message_he = messagesHe.join(', ');
      } else {
        baseObj.message_he = translateToHebrew(baseObj.message, status);
      }

      if (baseObj.error && typeof baseObj.error === 'string') {
        baseObj.error_he = translateToHebrew(baseObj.error, status);
      }

      response.status(status).json(baseObj);
      return;
    }

    const error = exception as Error;
    this.logger.error(`Unhandled Exception: ${error?.message ?? 'Unknown error'}`, error?.stack);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      message_he: translateToHebrew('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR),
      error: error?.message,
      error_he: translateToHebrew(error?.message ?? 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR),
    });
  }
}
