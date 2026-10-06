export const WEBHOOK_TYPES = {
  DLR: 'dlr',
  INCOMING: 'incoming',
  BLACKLIST: 'blacklist',
} as const;

export type WebhookType = typeof WEBHOOK_TYPES[keyof typeof WEBHOOK_TYPES];
