import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TextMeEnvironmentConfig } from './config/textme.config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHealth(): Record<string, unknown> {
    const config = this.configService.get<TextMeEnvironmentConfig>('textme');
    return {
      status: 'ok',
      service: 'textme-service',
      environment: config?.nodeEnv ?? 'development',
      isTestMode: config?.isTestMode ?? false,
      timestamp: new Date().toISOString(),
    };
  }
}
