import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DLR_STATUS_HEBREW_MAP, translateToHebrew } from '../i18n/hebrew-translations.constants';

@Injectable()
export class HebrewResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (!data || typeof data !== 'object') {
          return data;
        }

        return this.enrichWithHebrew(data as Record<string, unknown>);
      }),
    );
  }

  private enrichWithHebrew(obj: Record<string, unknown>): Record<string, unknown> {
    const enriched: Record<string, unknown> = { ...obj };

    // Inject message_he if message or status exists, or if received is true, or fallback
    if (enriched.message || enriched.status !== undefined) {
      enriched.message_he = translateToHebrew(
        enriched.message ?? (typeof enriched.status === 'string' ? enriched.status : undefined),
        enriched.status as number | string,
      );
    } else if (enriched.received === true) {
      if (!enriched.message) {
        enriched.message = 'Callback received successfully';
      }
      enriched.message_he = translateToHebrew(enriched.message);
    } else if (!enriched.message_he) {
      enriched.message_he = translateToHebrew(enriched.message ?? 'Success');
    }

    // Check for DLR transactions and ensure he_message is present
    if (Array.isArray(enriched.transactions)) {
      enriched.transactions = enriched.transactions.map((tx: unknown) => {
        if (tx && typeof tx === 'object') {
          const txObj = { ...(tx as Record<string, unknown>) };
          if (!txObj.he_message && txObj.status !== undefined) {
            txObj.he_message = DLR_STATUS_HEBREW_MAP[String(txObj.status)] ?? 'סטטוס לא ידוע';
          }
          return txObj;
        }
        return tx;
      });
    }

    return enriched;
  }
}
