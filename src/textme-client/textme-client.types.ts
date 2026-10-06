export interface TextMeRequestOptions {
  apiToken?: string;
  username?: string;
  isTestMode?: boolean;
  timeoutMs?: number;
  retries?: number;
}

export type RawTextMeResponse = Record<string, unknown>;
