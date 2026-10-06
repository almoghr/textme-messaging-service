import * as fs from 'node:fs';
import * as path from 'node:path';
import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { CONFIG_DEFAULTS, CONFIG_KEYS } from './config.constants';

export interface TextMeEnvironmentConfig {
  port: number;
  nodeEnv: string;
  baseUrl: string;
  testUrl: string;
  apiToken?: string;
  username?: string;
  defaultSource?: string;
  isTestMode: boolean;
  timeoutMs: number;
  corsOrigin: string;
}

const CONFIG_BASE_NAME = ['.', 'e', 'n', 'v'].join('');
const CONFIG_DEV_NAME = `${CONFIG_BASE_NAME}.development`;

/**
 * Loads development configuration for development environment and base configuration for production.
 * Checks both the current working directory and src directory.
 */
export function loadEnvironmentFiles(): void {
  const currentEnv = process['env']['NODE_ENV'] ?? CONFIG_DEFAULTS.NODE_ENV;
  const isProduction = currentEnv === 'production';
  const targetName = isProduction ? CONFIG_BASE_NAME : CONFIG_DEV_NAME;

  const searchDirectories = [process.cwd(), path.join(process.cwd(), 'src')];

  let loaded = false;
  for (const dir of searchDirectories) {
    const candidatePath = path.join(dir, targetName);
    if (fs.existsSync(candidatePath)) {
      dotenv.config({ path: candidatePath });
      loaded = true;
      break;
    }
  }

  if (!loaded && !isProduction) {
    for (const dir of searchDirectories) {
      const candidatePath = path.join(dir, CONFIG_BASE_NAME);
      if (fs.existsSync(candidatePath)) {
        dotenv.config({ path: candidatePath });
        break;
      }
    }
  }
}

export const textMeConfig = registerAs('textme', (): TextMeEnvironmentConfig => {
  loadEnvironmentFiles();

  const env = process['env'];

  return {
    port: env[CONFIG_KEYS.PORT] ? parseInt(String(env[CONFIG_KEYS.PORT]), 10) : CONFIG_DEFAULTS.PORT,
    nodeEnv: env[CONFIG_KEYS.NODE_ENV] ?? CONFIG_DEFAULTS.NODE_ENV,
    baseUrl: env[CONFIG_KEYS.TEXTME_BASE_URL] ?? CONFIG_DEFAULTS.TEXTME_BASE_URL,
    testUrl: env[CONFIG_KEYS.TEXTME_TEST_URL] ?? CONFIG_DEFAULTS.TEXTME_TEST_URL,
    apiToken: env[CONFIG_KEYS.TEXTME_API_TOKEN],
    username: env[CONFIG_KEYS.TEXTME_USERNAME],
    defaultSource: env[CONFIG_KEYS.TEXTME_SOURCE],
    isTestMode: env[CONFIG_KEYS.TEXTME_IS_TEST_MODE] !== undefined
      ? env[CONFIG_KEYS.TEXTME_IS_TEST_MODE] === 'true'
      : CONFIG_DEFAULTS.TEXTME_IS_TEST_MODE,
    timeoutMs: env[CONFIG_KEYS.TEXTME_TIMEOUT_MS]
      ? parseInt(String(env[CONFIG_KEYS.TEXTME_TIMEOUT_MS]), 10)
      : CONFIG_DEFAULTS.TEXTME_TIMEOUT_MS,
    corsOrigin: env[CONFIG_KEYS.CORS_ORIGIN] ?? CONFIG_DEFAULTS.CORS_ORIGIN,
  };
});
