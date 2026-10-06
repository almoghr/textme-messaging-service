import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { API_CONSTANTS } from './common/constants/api.constants';
import { TextMeEnvironmentConfig } from './config/textme.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(API_CONSTANTS.GLOBAL_PREFIX);

  const configService = app.get(ConfigService);
  const config = configService.get<TextMeEnvironmentConfig>('textme');

  app.enableCors({
    origin: config?.corsOrigin === '*' ? true : config?.corsOrigin,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = config?.port ?? API_CONSTANTS.DEFAULT_PORT;
  await app.listen(port);

  logger.log(`TextMe Enterprise Service is running on port ${port} in [${config?.nodeEnv ?? 'development'}] mode`);
  logger.log(`API base prefix: /${API_CONSTANTS.GLOBAL_PREFIX}`);
}

void bootstrap();
