export const DLR_STATUS = {
  DELIVERED_0: '0',
  DELIVERED_102: '102',
  SENT_UNCONFIRMED: '-1',
  TIMEOUT: '2',
  FAILED_GENERAL: '1',
  FAILED_SYSTEM: '3',
  FAILED_CELLULAR: '4',
  FAILED_CARRIER_REJECT: '5',
  DESTINATION_BLOCKED: '6',
  NUMBER_NOT_IN_USE: '7',
  OPTED_OUT: '8',
  UNKNOWN_PREFIX: '9',
  CARRIER_TIMEOUT: '10',
  CANCELLED_BY_USER: '11',
  DND_FILTERED: '12',
} as const;

export const DLR_STATUS_BUCKET = {
  DELIVERED: 'DELIVERED',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  BLOCKED: 'BLOCKED',
} as const;

export function categorizeDlrStatus(status: string | number): string {
  const normalized = String(status).trim();
  if (normalized === DLR_STATUS.DELIVERED_0 || normalized === DLR_STATUS.DELIVERED_102) {
    return DLR_STATUS_BUCKET.DELIVERED;
  }
  if (normalized === DLR_STATUS.SENT_UNCONFIRMED || normalized === DLR_STATUS.TIMEOUT) {
    return DLR_STATUS_BUCKET.PENDING;
  }
  if (normalized === DLR_STATUS.DESTINATION_BLOCKED || normalized === DLR_STATUS.OPTED_OUT || normalized === DLR_STATUS.DND_FILTERED) {
    return DLR_STATUS_BUCKET.BLOCKED;
  }
  return DLR_STATUS_BUCKET.FAILED;
}
