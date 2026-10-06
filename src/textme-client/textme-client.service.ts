import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONSTANTS } from '../common/constants/api.constants';
import { isTextMeSuccess, TEXTME_STATUS } from '../common/constants/status-codes.constants';
import { TextMeApiException } from '../common/errors/textme-api.exception';
import { TextMeEnvironmentConfig } from '../config/textme.config';
import { translateToHebrew } from '../common/i18n/hebrew-translations.constants';
import { RawTextMeResponse, TextMeRequestOptions } from './textme-client.types';

@Injectable()
export class TextMeClientService {
  private readonly logger = new Logger(TextMeClientService.name);
  private readonly http: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get<TextMeEnvironmentConfig>('textme');
    const timeout = config?.timeoutMs ?? API_CONSTANTS.DEFAULT_TIMEOUT_MS;

    this.http = axios.create({
      timeout,
      headers: {
        [API_CONSTANTS.HEADER_CONTENT_TYPE]: API_CONSTANTS.CONTENT_TYPE_JSON,
      },
    });
  }

  /**
   * Generic execution method for any TextMe operation by root key.
   * Encapsulates the root element, user credentials, environment routing, and response validation.
   */
  async execute<TReq extends Record<string, unknown>, TRes>(
    rootKey: string,
    payload: TReq,
    options?: TextMeRequestOptions,
  ): Promise<TRes> {
    const enrichedPayload = this.enrichPayloadWithUser(payload, options);
    const requestBody: Record<string, unknown> = {
      [rootKey]: enrichedPayload,
    };

    return this.executeRaw<TRes>(requestBody, options, rootKey);
  }

  /**
   * Generic execution of a raw body against the TextMe endpoint.
   */
  async executeRaw<TRes = RawTextMeResponse>(
    body: Record<string, unknown>,
    options?: TextMeRequestOptions,
    operationName?: string,
  ): Promise<TRes> {
    const config = this.configService.get<TextMeEnvironmentConfig>('textme');
    const token = options?.apiToken ?? config?.apiToken;

    if (!token) {
      throw new TextMeApiException({
        statusCode: TEXTME_STATUS.INVALID_CREDENTIALS,
        message: 'No TextMe API token provided or configured in environment',
        operation: operationName,
      });
    }

    const isTestMode = options?.isTestMode ?? config?.isTestMode ?? false;
    const baseUrl = config?.baseUrl ?? API_CONSTANTS.PROD_BASE_URL;
    const url = isTestMode
      ? `${baseUrl}${API_CONSTANTS.TEST_ENDPOINT_PATH}`
      : `${baseUrl}${API_CONSTANTS.LIVE_ENDPOINT_PATH}`;

    const headers: Record<string, string> = {
      [API_CONSTANTS.HEADER_CONTENT_TYPE]: API_CONSTANTS.CONTENT_TYPE_JSON,
      [API_CONSTANTS.HEADER_AUTHORIZATION]: `${API_CONSTANTS.AUTH_HEADER_PREFIX}${token}`,
    };

    const maxRetries = options?.retries ?? API_CONSTANTS.DEFAULT_MAX_RETRIES;
    const timeout = options?.timeoutMs ?? config?.timeoutMs ?? API_CONSTANTS.DEFAULT_TIMEOUT_MS;

    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        this.logger.debug(
          `Executing TextMe call [${operationName ?? 'raw'}]: url=${url}, attempt=${attempt + 1}/${maxRetries + 1}`,
        );

        const response: AxiosResponse<TRes> = await this.http.post<TRes>(url, body, {
          headers,
          timeout,
        });

        const data = response.data as Record<string, unknown>;
        const statusCode = typeof data.status === 'string' ? parseInt(data.status, 10) : (Number(data.status) || 0);

        if (!isTextMeSuccess(statusCode, operationName)) {
          throw new TextMeApiException({
            statusCode,
            message: (data.message as string) ?? 'TextMe operation reported non-zero status',
            operation: operationName,
            errors: data.errors as unknown[],
            rawResponse: data,
          });
        }

        if (data && typeof data === 'object') {
          data.message_he = translateToHebrew(data.message, statusCode);
        }

        return response.data;
      } catch (error) {
        if (error instanceof TextMeApiException) {
          throw error;
        }

        const isLastAttempt = attempt >= maxRetries;
        if (isLastAttempt) {
          const axiosError = error as Error;
          this.logger.error(
            `TextMe request failed after ${attempt + 1} attempts: ${axiosError.message}`,
            axiosError.stack,
          );
          throw new TextMeApiException({
            statusCode: TEXTME_STATUS.UNKNOWN_ERROR,
            message: `Network or transport error contacting TextMe: ${axiosError.message}`,
            operation: operationName,
            rawResponse: error,
          });
        }

        attempt++;
        const backoffDelay = API_CONSTANTS.RETRY_INITIAL_DELAY_MS * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      }
    }

    throw new TextMeApiException({
      statusCode: TEXTME_STATUS.CONTACT_SUPPORT,
      message: 'Unexpected exhaustion of retry loop',
      operation: operationName,
    });
  }

  /**
   * Enriches request payload with default user.username if missing and configured.
   */
  private enrichPayloadWithUser<TReq extends Record<string, unknown>>(
    payload: TReq,
    options?: TextMeRequestOptions,
  ): Record<string, unknown> {
    const config = this.configService.get<TextMeEnvironmentConfig>('textme');
    const targetUsername = options?.username ?? config?.username;

    const copy: Record<string, unknown> = { ...payload };
    const userObj = copy.user as Record<string, unknown> | undefined;

    if (!userObj?.username && targetUsername) {
      copy.user = {
        ...userObj,
        username: targetUsername,
      };
    }

    return copy;
  }
}
