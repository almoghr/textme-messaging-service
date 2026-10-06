export const STATUS_CODE_HEBREW_MAP: Record<number, string> = {
  0: 'הבקשה התקבלה ועובדה בהצלחה',
  1: 'שגיאה בפענוח מבנה הנתונים (XML/JSON)',
  2: 'שדה חובה חסר בבקשה',
  3: 'שם משתמש, סיסמה או טוקן אינם תקינים',
  4: 'אין מספיק יתרת הודעות בחשבון לביצוע הפעולה',
  5: 'אין הרשאה לשליחת הודעות בשעות אלו על פי הגדרות החשבון',
  6: 'שגיאת תהליך זמנית במערכת, אנא נסה שוב',
  7: 'פורמט שליחה לא תקין, יש לשלוח בקבוצה (bulk)',
  8: 'כל מספרי היעד חסומים לקבלת הודעות',
  9: 'לפחות אחד ממספרי הטלפון קצר או ארוך מדי',
  10: 'טוקן ה-API פג תוקף, יש להנפיק טוקן חדש',
  11: 'טוקן ה-API אינו תואם לשם המשתמש המבוקש',
  12: 'אין מספיק יתרה או שקוד האימות שגוי',
  502: 'סוג הפעולה אינו חוקי במערכת',
  503: 'שם המשתמש אינו מורשה תחת חשבונך',
  504: 'טוקן נוכחי לא נמצא עבור משתמש זה',
  510: 'בקשת אימות שולח אינה תקינה: לא צוינו מספרי טלפון',
  511: 'אין לך הרשאה לביצוע פונקציה זו',
  515: 'שם השולח אינו מאומת במערכת',
  517: 'כתובת ה-Push כבר רשומה במערכת',
  714: 'תוכן לא תקין בפרמטר סינון זמני (temp_bl)',
  715: 'כל המספרים נחסמו על פי סינון שליחה חוזרת זמני',
  933: 'מספר הטלפון או סיבת ההסרה אינם תקינים',
  944: 'חלק מהמספרים נמחקו, חלק אינם קיימים ברשימה השחורה',
  946: 'המספר נוסף בהצלחה לרשימה השחורה',
  955: 'הקמפיין כבר בוטל בעבר',
  966: 'הקמפיין כבר נשלח ולא ניתן לבטלו',
  970: 'ביטול הקמפיין נכשל, אנא פנה לתמיכה',
  977: 'הקמפיין אינו שייך לחשבונך או שאינו קיים',
  980: 'הקישור שנשלח אינו תקין',
  981: 'שגיאה ביצירת קישור מקוצר',
  986: 'ערך קישור הסרה אינו תקין',
  988: 'רשימת התפוצה המבוקשת אינה קיימת',
  989: 'תוכן ההודעה קצר/ארוך מדי או ששם הקמפיין ארוך מדי',
  990: 'סכום ההקצאה חורג מיתרת הקרדיטים שלך',
  991: 'סכום הקרדיט חייב להכיל ספרות בלבד',
  992: 'שם השולח ארוך או קצר מדי (מקסימום 11 תווים)',
  993: 'סיסמת המשתמש ארוכה או קצרה מדי',
  994: 'שם המשתמש כבר קיים במערכת',
  995: 'שם המשתמש ארוך או קצר מדי',
  996: 'שם התצוגה ארוך או קצר מדי',
  997: 'פקודה לא מוכרת במערכת',
  998: 'שגיאה לא ידועה בבקשה',
  999: 'שגיאת שרת פנימית, אנא פנה לתמיכה',
};

export const HTTP_STATUS_HEBREW_MAP: Record<number, string> = {
  200: 'הפעולה הושלמה בהצלחה',
  201: 'המשאב נוצר בהצלחה',
  400: 'בקשה לא תקינה, אנא בדוק את הנתונים שנשלחו',
  401: 'אין הרשאת גישה, נדרש טוקן או אימות תקין',
  403: 'הגישה לפעולה זו אסורה',
  404: 'המשאב או הנתיב המבוקש לא נמצא במערכת',
  405: 'שיטת הפנייה אינה נתמכת עבור נתיב זה',
  408: 'פג זמן ההמתנה לבקשה (Timeout)',
  409: 'התנגשות בביצוע הבקשה מול מצב הנתונים הנוכחי',
  422: 'הנתונים שנשלחו אינם ניתנים לעיבוד',
  429: 'מספר בקשות רב מדי, אנא המתן לפני ניסיון נוסף',
  500: 'שגיאת שרת פנימית',
  502: 'שער הגישה קיבל תשובה לא תקינה (Bad Gateway)',
  503: 'השירות אינו זמין זמנית, אנא נסה שוב מאוחר יותר',
  504: 'פג זמן ההמתנה מול שרת היעד (Gateway Timeout)',
};

export const DLR_STATUS_HEBREW_MAP: Record<string, string> = {
  '0': 'הגיע ליעד בהצלחה',
  '102': 'הגיע ליעד בהצלחה',
  '-1': 'נשלח - ללא אישור מסירה',
  '2': 'פג תוקף אישור המסירה (Timeout)',
  '1': 'השליחה נכשלה',
  '3': 'השליחה נכשלה במערכת',
  '4': 'נכשל ברשת הסלולר',
  '5': 'נדחה על ידי מפעיל הסלולר',
  '6': 'מספר היעד חסום לקבלת הודעות',
  '7': 'מספר הטלפון אינו מחובר',
  '8': 'הנמען הוסר מרשימת התפוצה (הסר)',
  '9': 'קידומת טלפון אינה מוכרת',
  '10': 'פג תוקף ברשת הסלולר',
  '11': 'בוטל על ידי המשתמש',
  '12': 'סונן על פי הגדרות אל-תטריד',
};

export const COMMON_PHRASES_HEBREW_MAP: Record<string, string> = {
  // Common Success Phrases
  'SMS will be sent': 'ההודעה התקבלה בהצלחה ותישלח ליעד',
  'contact list successfully created': 'רשימת התפוצה נוצרה בהצלחה',
  'Wallet successfully updated': 'ארנק המנוי עודכן בהצלחה',
  'The user was created successfully': 'המשתמש נוצר בהצלחה',
  'birthday campaign successfully updated': 'קמפיין יום ההולדת עודכן בהצלחה',
  'push url has successfully added': 'כתובת ה-Push נרשמה בהצלחה',
  'number has successfully added to blacklist': 'המספר נוסף בהצלחה לרשימה השחורה',
  'Success': 'הפעולה הושלמה בהצלחה',
  'success': 'הפעולה הושלמה בהצלחה',
  'ok': 'המערכת פועלת כסדרה',
  'OK': 'המערכת פועלת כסדרה',
  'Verified': 'קוד האימות אומת בהצלחה',
  'OTP sent': 'קוד האימות נשלח בהצלחה',
  'Cancelled': 'הקמפיין בוטל בהצלחה',
  'deleted': 'הפריט נמחק בהצלחה',
  'added': 'הפריט נוסף בהצלחה',
  'Bulk queued': 'שליחת ההודעות המרוכזת הוכנסה לתור בהצלחה',
  'Dry run valid': 'בדיקת תקינות המבנה עברה בהצלחה (מצב בדיקה ללא חיוב)',
  'Mock success for sms': 'הודעת הדמיה נשלחה בהצלחה',
  'Mock raw success': 'בקשת הדמיה בוצעה בהצלחה',
  'Callback received successfully': 'הקריאה החוזרת התקבלה בהצלחה במערכת',

  // Common Error Phrases & HTTP Status Names
  'Internal server error': 'שגיאת שרת פנימית',
  'Internal Server Error': 'שגיאת שרת פנימית',
  'Bad Request': 'בקשה לא תקינה, אנא בדוק את השדות שנשלחו',
  'Unauthorized': 'אין הרשאת גישה, נדרש טוקן תקין',
  'Forbidden': 'הגישה לפעולה זו אסורה',
  'Not Found': 'המשאב המבוקש לא נמצא במערכת',
  'Method Not Allowed': 'שיטת הפנייה אינה נתמכת עבור נתיב זה',
  'Request Timeout': 'פג זמן ההמתנה לבקשה',
  'Conflict': 'התנגשות בביצוע הבקשה',
  'Unprocessable Entity': 'הנתונים שנשלחו אינם ניתנים לעיבוד',
  'Too Many Requests': 'מספר בקשות רב מדי, אנא המתן לפני ניסיון נוסף',
  'Bad Gateway': 'שער הגישה קיבל תשובה לא תקינה',
  'Service Unavailable': 'השירות אינו זמין זמנית',
  'Gateway Timeout': 'פג זמן ההמתנה מול שרת היעד',

  // Validation Messages (Full Match)
  'Username must be provided and non-empty': 'שם משתמש הינו שדה חובה',
  'API token must be provided and non-empty': 'טוקן API הינו שדה חובה',
  'Action must be either "current" or "new"': 'סוג הפעולה חייב להיות current או new',
  'Source phone or sender ID is required': 'שם השולח הינו שדה חובה',
  'Source sender ID cannot exceed 11 alphanumeric characters': 'שם השולח אינו יכול לעלות על 11 תווים',
  'Phone number must be non-empty': 'מספר טלפון הינו שדה חובה',
  'Phone number must follow Israeli format (e.g., 5xxxxxxxx or 05xxxxxxx) or international digits': 'מספר הטלפון חייב להיות בפורמט תקין (סלולרי ישראלי או בינלאומי)',
  'Destinations must contain at least one valid recipient or contact list': 'יש להזין לפחות יעד אחד או רשימת תפוצה',
  'Message text must be non-empty': 'תוכן ההודעה הינו שדה חובה',
  'Message text cannot exceed 1005 characters': 'תוכן ההודעה מוגבל לעד 1005 תווים',
  'Bulk request must include at least one message': 'בקשת שליחה מרוכזת חייבת לכלול לפחות הודעה אחת',
  'Bulk request cannot exceed 2500 messages': 'בקשת שליחה מרוכזת מוגבלת לעד 2500 הודעות',
  'OTP code is required and cannot be empty': 'קוד אימות OTP הינו שדה חובה',
  'Max tries must be a positive integer between 1 and 10': 'מספר הנסיונות המרבי חייב להיות בין 1 ל-10',
  'OTP max tries must be a positive integer between 1 and 10': 'מספר הנסיונות המרבי חייב להיות בין 1 ל-10',
  'Valid time must be a positive number of minutes between 1 and 60': 'זמן תוקף הקוד חייב להיות בין דקה אחת ל-60 דקות',
  'OTP valid time must be a positive number of minutes between 1 and 60': 'זמן תוקף הקוד חייב להיות בין דקה אחת ל-60 דקות',
  'Both from and to date strings must be provided': 'יש לציין תאריך התחלה ותאריך סיום',
  'Date must be formatted as dd/mm/yy hh:mm': 'תאריך חייב להיות בפורמט dd/mm/yy hh:mm',
  'At least one external ID or transaction reference is required': 'יש לציין לפחות מזהה חיצוני אחד',
  'Reason is required for blocklist removal': 'סיבת ההסרה הינה שדה חובה',
  'Contact list name is required and non-empty': 'שם רשימת התפוצה הינו שדה חובה',
  'Contact list ID is required': 'מזהה רשימת התפוצה הינו שדה חובה',
  'Campaign ID is required': 'מזהה הקמפיין הינו שדה חובה',
  'Campaign name is required and cannot exceed 50 characters': 'שם הקמפיין הינו שדה חובה ומוגבל לעד 50 תווים',
  'Subscriber display name is required': 'שם המנוי הינו שדה חובה',
  'Subscriber password is required and must meet length requirements': 'סיסמת המנוי הינה שדה חובה',
  'Subscriber starting amount must be numeric string or integer': 'סכום הקרדיט ההתחלתי חייב להיות מספר',
  'Push callback URL must be a valid HTTP or HTTPS URL': 'כתובת ה-Callback חייבת להיות כתובת URL תקינה',
  'Push type must be one of: dlr, incoming, blacklist': 'סוג ה-Push חייב להיות dlr, incoming או blacklist',

  // Transport & Internal Errors
  'No TextMe API token provided or configured in environment': 'לא הוגדר טוקן API של TextMe בסביבת העבודה',
  'TextMe operation reported non-zero status': 'הפעולה ב-TextMe החזירה קוד שגיאה',
  'Unexpected exhaustion of retry loop': 'מוצה מספר הנסיונות החוזרים לביצוע הפעולה מול השרת',
};

/**
 * Translates any English status string, error, validation message, or numeric code into Hebrew.
 */
export function translateToHebrew(message?: unknown, statusCode?: number | string): string {
  // 1. Direct match in Common Phrases dictionary
  if (typeof message === 'string') {
    const trimmed = message.trim();
    if (COMMON_PHRASES_HEBREW_MAP[trimmed]) {
      return COMMON_PHRASES_HEBREW_MAP[trimmed];
    }

    // Dynamic prefix pattern matching
    if (trimmed.startsWith('Cannot GET ')) {
      return `הנתיב המבוקש בשיטת GET לא נמצא במערכת: ${trimmed.replace('Cannot GET ', '')}`;
    }
    if (trimmed.startsWith('Cannot POST ')) {
      return `הנתיב המבוקש בשיטת POST לא נמצא במערכת: ${trimmed.replace('Cannot POST ', '')}`;
    }
    if (trimmed.startsWith('Network or transport error contacting TextMe:')) {
      return `שגיאת רשת או תקשורת מול שרתי TextMe: ${trimmed.replace('Network or transport error contacting TextMe:', '').trim()}`;
    }
    if (trimmed.includes('must be a string')) {
      return 'השדה חייב להיות מחרוזת טקסט תקינה';
    }
    if (trimmed.includes('must be an array')) {
      return 'השדה חייב להיות מערך נתונים';
    }
    if (trimmed.includes('must be an object')) {
      return 'השדה חייב להיות אובייקט נתונים';
    }
    if (trimmed.includes('must be a number')) {
      return 'השדה חייב להיות מספר תקין';
    }
    if (trimmed.includes('must be an integer')) {
      return 'השדה חייב להיות מספר שלם';
    }
    if (trimmed.includes('must be a boolean')) {
      return 'השדה חייב להיות ערך בוליאני (true/false)';
    }
    if (trimmed.includes('should not be empty')) {
      return 'שדה חובה אינו יכול להיות ריק';
    }
  }

  // 2. Check status codes (TextMe, HTTP, and string statuses like "ok")
  if (statusCode !== undefined && statusCode !== null) {
    if (typeof statusCode === 'string') {
      const trimmedStatus = statusCode.trim();
      if (COMMON_PHRASES_HEBREW_MAP[trimmedStatus]) {
        return COMMON_PHRASES_HEBREW_MAP[trimmedStatus];
      }
    }

    const numCode = typeof statusCode === 'string' ? parseInt(statusCode, 10) : statusCode;
    if (!isNaN(numCode)) {
      if (STATUS_CODE_HEBREW_MAP[numCode]) {
        return STATUS_CODE_HEBREW_MAP[numCode];
      }
      if (HTTP_STATUS_HEBREW_MAP[numCode]) {
        return HTTP_STATUS_HEBREW_MAP[numCode];
      }
    }
  }

  // 3. Array of error messages (e.g. from class-validator)
  if (Array.isArray(message)) {
    return message
      .map((item) => (typeof item === 'string' ? translateToHebrew(item) : 'נתון לא תקין בבקשה'))
      .join(', ');
  }

  // 4. Return message if string exists
  if (typeof message === 'string' && message.length > 0) {
    return message;
  }

  return 'הפעולה עובדה במערכת';
}
