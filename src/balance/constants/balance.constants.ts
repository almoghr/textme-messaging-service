export const BALANCE_TYPES = {
  SMS: 'sms',
  INTERNATIONAL: 'inter',
  MAIL: 'mail',
} as const;

export type BalanceType = typeof BALANCE_TYPES[keyof typeof BALANCE_TYPES];
