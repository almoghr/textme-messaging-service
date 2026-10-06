export const TOKEN_ACTIONS = {
  NEW: 'new',
  CURRENT: 'current',
} as const;

export type TokenActionType = typeof TOKEN_ACTIONS[keyof typeof TOKEN_ACTIONS];
