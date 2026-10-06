import {
  DLR_STATUS_HEBREW_MAP,
  HTTP_STATUS_HEBREW_MAP,
  STATUS_CODE_HEBREW_MAP,
  translateToHebrew,
} from './hebrew-translations.constants';

describe('Hebrew Translations', () => {
  it('should translate numeric status codes to Hebrew', () => {
    expect(translateToHebrew(undefined, 0)).toBe(STATUS_CODE_HEBREW_MAP[0]);
    expect(translateToHebrew(undefined, 4)).toBe('אין מספיק יתרת הודעות בחשבון לביצוע הפעולה');
    expect(translateToHebrew(undefined, 946)).toBe('המספר נוסף בהצלחה לרשימה השחורה');
    expect(translateToHebrew(undefined, 944)).toBe('חלק מהמספרים נמחקו, חלק אינם קיימים ברשימה השחורה');
  });

  it('should translate HTTP status codes to Hebrew', () => {
    expect(translateToHebrew(undefined, 400)).toBe(HTTP_STATUS_HEBREW_MAP[400]);
    expect(translateToHebrew(undefined, 401)).toBe(HTTP_STATUS_HEBREW_MAP[401]);
    expect(translateToHebrew(undefined, 404)).toBe(HTTP_STATUS_HEBREW_MAP[404]);
    expect(translateToHebrew(undefined, 500)).toBe(HTTP_STATUS_HEBREW_MAP[500]);
  });

  it('should translate common English phrases to Hebrew', () => {
    expect(translateToHebrew('SMS will be sent')).toBe('ההודעה התקבלה בהצלחה ותישלח ליעד');
    expect(translateToHebrew('Wallet successfully updated')).toBe('ארנק המנוי עודכן בהצלחה');
    expect(translateToHebrew('Internal server error')).toBe('שגיאת שרת פנימית');
    expect(translateToHebrew('ok')).toBe('המערכת פועלת כסדרה');
    expect(translateToHebrew('Bad Request')).toBe('בקשה לא תקינה, אנא בדוק את השדות שנשלחו');
  });

  it('should translate dynamic prefixes and class-validator patterns', () => {
    expect(translateToHebrew('Cannot GET /api/unknown')).toContain('הנתיב המבוקש בשיטת GET לא נמצא במערכת');
    expect(translateToHebrew('Cannot POST /api/unknown')).toContain('הנתיב המבוקש בשיטת POST לא נמצא במערכת');
    expect(translateToHebrew('username must be a string')).toContain('מחרוזת טקסט תקינה');
    expect(translateToHebrew('phones must be an array')).toContain('מערך נתונים');
    expect(translateToHebrew('Network or transport error contacting TextMe: timeout')).toContain('שגיאת רשת או תקשורת');
  });

  it('should translate validation errors array to Hebrew string', () => {
    const errors = ['Phone number must be non-empty', 'Message text must be non-empty'];
    const translated = translateToHebrew(errors);
    expect(translated).toContain('מספר טלפון הינו שדה חובה');
    expect(translated).toContain('תוכן ההודעה הינו שדה חובה');
  });

  it('should have DLR status Hebrew mappings', () => {
    expect(DLR_STATUS_HEBREW_MAP['0']).toBe('הגיע ליעד בהצלחה');
    expect(DLR_STATUS_HEBREW_MAP['102']).toBe('הגיע ליעד בהצלחה');
    expect(DLR_STATUS_HEBREW_MAP['-1']).toBe('נשלח - ללא אישור מסירה');
  });
});
