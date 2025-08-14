import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'he' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  setDefaultLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  he: {
    // Hero Section - סקטור גיבור
    'hero.title': 'גלריית תמונות החתונה',
    'hero.subtitle': 'כל הזכרונות הקסומים מהיום הכי מיוחד שלכם',
    'hero.allPhotos': 'כל התמונות',
    'hero.myPhotos': 'התמונות שלי',
    
    // Gallery Header - כותרת גלריה
    'gallery.title': 'גלריית תמונות',
    'gallery.totalImages': 'סך התמונות',
    'gallery.columns': 'עמודות',
    'gallery.downloadAll': 'הורד הכל',
    'gallery.downloadSelected': 'הורד נבחרות',
    'gallery.selectImages': 'בחירת תמונות',
    'gallery.share': 'שיתוף',
    'gallery.cancelSelection': 'ביטול בחירה',
    'gallery.selectedImages': 'תמונות נבחרות',
    'gallery.noImages': 'אין תמונות זמינות',
    'gallery.loadingImages': 'טוען תמונות...',
    'gallery.selectMode': 'בחירת תמונות',
    'gallery.selectedCount': 'תמונות נבחרו',
    'gallery.shareSelected': 'שתף נבחרות',
    'gallery.shareEvent': 'שתף אירוע',
    'gallery.viewAll': 'צפה בכל התמונות',
    'gallery.backToGallery': 'חזור לגלרייה',
    'gallery.downloadImage': 'הורד תמונה',
    'gallery.copyLink': 'העתק קישור',
<<<<<<< HEAD


=======
    
>>>>>>> 5fc2342a822990ba8e514876378ca89e3c397fed
    // Floating Navbar - תפריט נופף
    'navbar.support': 'תמיכה',
    'navbar.allPhotos': 'כל התמונות',
    'navbar.myPhotos': 'התמונות שלי',
    'navbar.shareEvent': 'שתף אירוע',
    'navbar.shareEventMobile': 'שתף',
    
    // Share Dialog - דיאלוג שיתוף
    'share.title': 'שתף את הגלריה',
    'share.description': 'סרוק את הקוד או שתף את הקישור',
    'share.copyLink': 'העתק קישור',
    
    // Toasts - הודעות טוסט
    'toast.downloadAll.title': 'הורדת תמונות',
    'toast.downloadAll.description': 'התחלת הורדת כל התמונות...',
    'toast.downloadSelected.title': 'הורדת תמונות נבחרות',
    'toast.downloadSelected.description': 'מוריד {count} תמונות...',
    'toast.downloadComplete.title': 'ההורדה הושלמה',
    'toast.downloadComplete.description': '{count} תמונות הורדו בהצלחה',
    'toast.noSelection.title': 'לא נבחרו תמונות',
    'toast.noSelection.description': 'אנא בחר תמונות להורדה',
    'toast.linkCopied.title': 'הקישור הועתק',
    'toast.linkCopied.description': 'הקישור לגלריה הועתק ללוח',
    'toast.support.title': 'תמיכה',
    'toast.support.description': 'פניה לתמיכה נשלחה בהצלחה',
    'toast.error.title': 'שגיאה',
    'toast.qrError.description': 'לא ניתן ליצור QR קוד',
    'toast.downloadStarting.title': 'מתחיל הורדה...',
    'toast.downloadStarting.description': 'מוריד {count} תמונות',
    'toast.downloadImageComplete.title': 'הורדת תמונה',
    'toast.downloadImageComplete.description': 'התמונה הורדה בהצלחה',
    'toast.downloadRequestSent.all': 'בקשת הורדה נשלחה עבור כל תמונות האירוע',
    'toast.downloadRequestSent.my': 'בקשת הורדה נשלחה עבור התמונות שלך',
    'toast.downloadRequestError': 'שגיאה בשליחת בקשת ההורדה. אנא נסה שוב.',
    
    // Auth Loading Messages - הודעות טעינה באימות
    'auth.loadingUserData': 'טוען נתוני משתמש...',
    'auth.loadingImages': 'טוען תמונות...',
    'auth.loadingRelatedUsers': 'טוען משתמשים קשורים...',
    'auth.sendingSMS': 'שולח SMS...',
    'auth.sendingEmail': 'שולח אימייל...',
    'auth.verifyingCode': 'מאמת קוד...',
    'auth.checkingExistingUser': 'בודק משתמש קיים...',
    'auth.existingUserFound': 'משתמש קיים נמצא, טוען נתונים...',
    'auth.processingImage': 'מעבד תמונה...',
    'auth.resizingImage': 'מקטין תמונה...',
    'auth.registeringNewUser': 'רושם משתמש חדש...',
    'auth.sendingGalleryLink': 'שולח קישור לגלריה...',
    'auth.registeringUser': 'רושם משתמש...',
    'auth.ready': 'מוכן!',
    'auth.galleryLoaded': 'הגלריה האישית שלך נטענה בהצלחה',
    'auth.alert': 'התראה',
    'auth.dataError': 'אירעה שגיאה בטעינת הנתונים, אבל הרישום הצליח',
    'auth.emailSent': 'אימייל נשלח',
    'auth.emailSentDesc': 'קוד האימות נשלח לכתובת המייל שלך',
    'auth.smsSent': 'SMS נשלח',
    'auth.smsSentDesc': 'קוד האימות נשלח למספר הטלפון שלך',
    'auth.sendError': 'שגיאה',
    'auth.sendErrorDesc': 'שליחת ה{type} נכשלה. אנא נסה שוב.',
    'auth.otpError': 'קוד האימות שגוי. אנא נסה שוב.',
    'auth.otpSystemError': 'אירעה שגיאה באימות הקוד. אנא נסה שוב.',
    'auth.welcomeBack': 'ברוכים השובים!',
    'auth.existingUserDesc': 'זוהית כמשתמש רשום. נכנסת לגלריה!',
    'auth.registrationSuccess': 'רישום הושלם בהצלחה!',
    'auth.registrationSuccessDesc': 'נרשמת בהצלחה!',
    'auth.registrationSuccessWithSMS': 'נרשמת בהצלחה! SMS נשלח עם קישור לגלריה שלך',
    'auth.smsWarning': 'הרישום הצליח אבל שליחת SMS נכשלה. תוכל לגשת לגלריה דרך הקישור באתר.',
    'auth.eventRegistrationSuccess': 'רישום הושלם!',
    'auth.eventRegistrationDesc': 'נרשמת בהצלחה לאירוע!',
    'auth.registrationError': 'שגיאה ברישום',
    'auth.registrationErrorDesc': 'אירעה שגיאה ברישום. אנא נסה שוב.',
    
    // Download Modal - מודל הורדה
    'downloadModal.contactRequired': 'אנא הזינו טלפון או מייל',
    'downloadModal.downloadComplete': 'הורדה הושלמה!',
    'downloadModal.photosDownloaded': 'תמונות הורדו בהצלחה',
    'downloadModal.partialError': 'שגיאה חלקית',
    'downloadModal.partialErrorDesc': 'חלק מהתמונות לא הורדו, נסו שוב',
    'downloadModal.downloadError': 'אירעה שגיאה בהורדת התמונות, נסו שוב',
    'downloadModal.albumDownload': 'הורדת אלבום',
    'downloadModal.allPhotosDownload': 'הורדת כל התמונות',
    'downloadModal.photosWaiting': 'תמונות ממתינות לכם!',
    'downloadModal.directDownload': 'התמונות יורדו ישירות למכשיר שלכם',
    'downloadModal.linkDownload': 'השאירו פרטים ונשלח לכם קישור להורדה כשהתמונות מוכנות',
    'downloadModal.emailOptional': 'מייל (אופציונלי)',
    'downloadModal.phoneOptional': 'טלפון (אופציונלי)',
    'downloadModal.contactNote': '* נדרש לפחות אחד מהפרטים לשליחת הקישור',
    'downloadModal.continueDownload': 'המשך להורדה',
    'downloadModal.continueQuality': 'המשך לבחירת איכות',
    'downloadModal.qualityTitle': 'בחירת איכות התמונות',
    'downloadModal.qualityQuestion': 'איזו איכות תמונות תעדיפו?',
    'downloadModal.highQuality': 'איכות גבוהה',
    'downloadModal.highQualityDesc': 'מתאים להדפסה ועריכה (קובץ גדול יותר)',
    'downloadModal.webQuality': 'איכות אינטרנט',
    'downloadModal.webQualityDesc': 'מתאים לשיתוף ברשתות (הורדה מהירה יותר)',
    'downloadModal.downloadNow': 'הורד עכשיו',
    'downloadModal.sendRequest': 'שלח בקשה',
    'downloadModal.downloadStarted': 'ההורדה החלה',
    'downloadModal.requestSent': 'הבקשה נשלחה בהצלחה',
    'downloadModal.downloadingToDevice': 'התמונות מורדות למכשיר שלכם.',
    'downloadModal.autoClose': '(חלון זה ייסגר אוטומטית)',
    'downloadModal.processingStarted': 'תהליך הכנת התמונות החל.',
    'downloadModal.linkSoon': 'נשלח לכם קישור להורדה תוך מספר דקות.',
    
    // Auth - אימות
    'auth.phoneEntry': 'הרשמה',
    'auth.emailEntry': 'הזנת כתובת מייל',
    'auth.otpVerification': 'אימות קוד',
    'auth.selfieCapture': 'צילום סלפי',
    'auth.registrationComplete': 'הרשמה הושלמה',
    'auth.phoneInstruction': 'נשלח לך קוד אימות בהודעת SMS',
    'auth.emailInstruction': 'נשלח לך קוד אימות למייל',
    'auth.phoneExample': 'המספר יוזן ללא הקידומת 0. לדוגמה: 50-123-4567',
    'auth.enterPhone': 'מספר טלפון',
    'auth.enterEmail': 'הזן כתובת מייל',
    'auth.orUsePhone': 'או השתמש בטלפון',
    'auth.orUseEmail': 'או השתמש במייל',
    'auth.sendCode': 'שלח קוד',
    'auth.resendIn': 'שלח שוב בעוד {seconds} שניות',
    'auth.resendCode': 'שלח קוד שוב',
    'auth.verifying': 'מאמת...',
    'auth.continue': 'המשך',
    'auth.selfieInstruction': 'צלם סלפי כדי לאתר את התמונות שלך ',
    'auth.takeSelfie': 'צלם סלפי',
    'auth.selectFile': 'בחר קובץ',
    'auth.camera': 'מצלמה',
    'auth.loading': 'טוען עוד תמונות...',
    'auth.takePhoto': 'צלם',
    'auth.confirm': 'אישור',
    'auth.retake': 'חזור',
    'auth.cameraError': 'שגיאה בגישה למצלמה. אנא וודא שהמצלמה מחוברת ונתת הרשאה.',
    'auth.invalidPhone': 'מספר הטלפון לא תקין עבור המדינה שנבחרה',
    'auth.invalidEmail': 'כתובת המייל לא תקינה',
    'auth.phoneRequired': 'אנא הזן מספר טלפון',
    'auth.emailRequired': 'אנא הזן כתובת מייל',
    'auth.selectImageOrCamera': 'בחר תמונה או צלם',
    'auth.notifyNewPhotos': 'עדכן אותי בעת מציאת תמונות חדשות',
    'auth.otpInstruction': 'הזן את הקוד בן 4 הספרות שנשלח אליך',
    'auth.logout': 'התנתק',
    
    // Leads - לידים
    'leads.thanksFeedback': 'תודה על המשוב!',
    'leads.futureHelp': 'נשמח לשמוע מכם בעתיד ולעזור בכל שאלה',
    'leads.thankYou': 'תודה רבה!',
    'leads.detailsSaved': 'הפרטים נשמרו בהצלחה, נחזור אליכם בהקדם ❤️',
    'leads.saveError': 'אירעה שגיאה בשמירת הפרטים, נסו שוב',
    'leads.likedService': 'אהבתם את השירות שלנו?',
    'leads.upcomingEvent': 'יש לכם אירוע בקרוב? נשמח לעזור לכם ליצור זיכרונות מושלמים!',
    'leads.yesEvent': 'כן! יש לנו אירוע 🎉',
    'leads.notSoon': 'לא בזמן הקרוב',
    'leads.letsTalk': 'בואו נדבר! 📞',
    'leads.leaveDetails': 'השאירו פרטים ונחזור אליכם עם הצעה מיוחדת לאירוע שלכם',
    'leads.fullName': 'שם מלא',
    'leads.fullNamePlaceholder': 'השם שלכם',
    'leads.phone': 'טלפון',
    'leads.eventType': 'איזה סוג אירוע? (אופציונלי)',
    'leads.eventTypePlaceholder': 'חתונה, בר/בת מצווה, יום הולדת, אירוע עסקי...',
    'leads.sendOffer': 'שלח וקבל הצעה 🎯',
    
    // Support - תמיכה
    'support.guestSupport': 'תמיכת אורח',
    'support.faqAndQuickHelp': 'שאלות נפוצות ועזרה מהירה',
    'support.whatsappMessage': 'היי,%20אני%20צריך%20עזרה%20עם%20האירוע',
    'support.eventName': 'שם%20האירוע',
    'support.eventId': 'מזהה%20האירוע',
    'support.noAnswer': 'לא מוצא תשובה?',
    'support.contactWhatsapp': 'פנה בוואטסאפ',
    'support.moreInfo': 'מידע נוסף',
    'support.terms': 'תקנון',
    'support.privacy': 'מדיניות פרטיות',
    
    // Privacy - פרטיות
    'privacy.agreement.prefix': 'בהעלאת סלפי אני מאשר את',
    'privacy.agreement.and': 'ו',
    'privacy.terms': 'תנאי השימוש',
    'privacy.policy': 'מדיניות הפרטיות',

    // Common - כללי
    'common.back': 'חזור',
    'common.selected': 'נבחרו',
    'common.favorites': 'מועדפים',
    'common.download': 'הורדה',
    'common.cancel': 'ביטול',
    'common.delete': 'מחק',
    'common.close': 'סגור',
    'common.next': 'הבא',
    'common.of': 'מתוך',
    'common.imageSize': 'גודל',
    'common.activeUser': 'משתמש פעיל',
    'common.optional': 'אופציונלי',

    // Notifications - התראות
    'notifications.title': 'התראות על תמונות חדשות',
    'notifications.subtitle': 'קבל התראה כשמתווספות תמונות',
    'notifications.subscribe': 'הרשמה',
    'notifications.getUpdates': 'קבלת עדכונים',
    'notifications.subscribeTo': 'הרשמה להתראות',
    'notifications.subscribeSuccess': 'נרשמת בהצלחה להתראות!',
    'notifications.enterPhone': 'הכנס מספר טלפון',
    'notifications.enterEmail': 'הכנס כתובת מייל',
    'notifications.sendCode': 'שלח קוד',
    'notifications.verifyCode': 'אמת קוד',
    'notifications.notificationsEnabled': 'התראות מופעלות',
    'notifications.notificationsDisabled': 'התראות מבוטלות',
    'notifications.phoneNumber': 'מספר טלפון',
    'notifications.email': 'כתובת מייל',
    'notifications.optional': '(אופציונלי)',
    'notifications.enableNotifications': 'אפשר התראות',
    'notifications.close': 'סגור',

    // Gallery - גלריה
    'gallery.language': 'שפה',
    'gallery.theme': 'ערכת נושא',
    'gallery.dark': 'כהה',
    'gallery.light': 'בהיר',

    // Empty states - מצבים ריקים
    'empty.allPhotos.title': 'אין תמונות זמינות עדיין',
    'empty.allPhotos.description': 'התמונות נטענות ומעובדות. חזרו בקרוב לראות את כל התמונות מהאירוע!',
    'empty.myPhotos.title': 'לא נמצאו תמונות שלכם',
    'empty.myPhotos.description': 'אולי התמונות שלכם עדיין לא הועלו, או שהן בתהליך זיהוי. נסו שוב מאוחר יותר!',
    'empty.allPhotos.clock':'בקרוב יהיו כאן תמונות מהאירוע',
    'empty.myPhotos.clock': 'בקרוב יהיו כאן התמונות שלכם',
    
    // Users - משתמשים
    'users.addUser': 'הוסף משתמש',
    'users.manageUsers': 'ניהול משתמשים',
    'users.switchUser': 'החלף משתמש',
    'users.deleteConfirm': 'האם אתה בטוח שברצונך למחוק משתמש זה?',
    'users.userAdded': 'משתמש נוסף בהצלחה',
    'users.userSwitched': 'המשתמש החדש הפך לפעיל',
    'users.infoRequired': 'יש להזין לפחות פרט אחד',
    'users.selfieRequired': 'יש להעלות תמונת סלפי',
    'users.name': 'שם',
    'users.phone': 'טלפון',
    'users.email': 'מייל',
    'users.namePlaceholder': 'הזן שם',
    'users.phonePlaceholder': 'הזן מספר טלפון',
    'users.emailPlaceholder': 'הזן כתובת מייל'
  },
  en: {
    // Hero Section
    'hero.title': 'Wedding Photo Gallery',
    'hero.subtitle': 'All the magical memories from your most special day',
    'hero.allPhotos': 'All Photos',
    'hero.myPhotos': 'My Photos',
    
    // Gallery Header
    'gallery.title': 'Photo Gallery',
    'gallery.totalImages': 'Total Images',
    'gallery.columns': 'Columns',
    'gallery.downloadAll': 'Download All',
    'gallery.downloadSelected': 'Download Selected',
    'gallery.selectImages': 'Select Images',
    'gallery.share': 'Share',
    'gallery.cancelSelection': 'Cancel Selection',
    'gallery.selectedImages': 'Selected Images',
    'gallery.noImages': 'No images available',
    'gallery.loadingImages': 'Loading images...',
    'gallery.selectMode': 'Select images',
    'gallery.selectedCount': 'images selected',
    'gallery.shareSelected': 'Share selected',
    'gallery.shareEvent': 'Share event',
    'gallery.viewAll': 'View all photos',
    'gallery.backToGallery': 'Back to gallery',
    'gallery.downloadImage': 'Download image',
    'gallery.copyLink': 'Copy link',
<<<<<<< HEAD


=======
    
>>>>>>> 5fc2342a822990ba8e514876378ca89e3c397fed
    // Floating Navbar
    'navbar.support': 'Support',
    'navbar.allPhotos': 'All Photos',
    'navbar.myPhotos': 'My Photos',
    'navbar.shareEvent': 'Share Event',
    'navbar.shareEventMobile': 'Share',
    
    // Share Dialog
    'share.title': 'Share Gallery',
    'share.description': 'Scan the code or share the link',
    'share.copyLink': 'Copy Link',
    
    // Toasts
    'toast.downloadAll.title': 'Downloading Images',
    'toast.downloadAll.description': 'Starting to download all images...',
    'toast.downloadSelected.title': 'Downloading Selected Images',
    'toast.downloadSelected.description': 'Downloading {count} images...',
    'toast.downloadComplete.title': 'Download Complete',
    'toast.downloadComplete.description': '{count} images downloaded successfully',
    'toast.noSelection.title': 'No Images Selected',
    'toast.noSelection.description': 'Please select images to download',
    'toast.linkCopied.title': 'Link Copied',
    'toast.linkCopied.description': 'Gallery link copied to clipboard',
    'toast.support.title': 'Support',
    'toast.support.description': 'Support request sent successfully',
    'toast.error.title': 'Error',
    'toast.qrError.description': 'Unable to generate QR code',
    'toast.downloadStarting.title': 'Starting Download...',
    'toast.downloadStarting.description': 'Downloading {count} images',
    'toast.downloadImageComplete.title': 'Image Downloaded',
    'toast.downloadImageComplete.description': 'Image downloaded successfully',
    'toast.downloadRequestSent.all': 'Download request sent for all event photos',
    'toast.downloadRequestSent.my': 'Download request sent for your photos',
    'toast.downloadRequestError': 'Error sending download request. Please try again.',
    
    // Auth Loading Messages
    'auth.loadingUserData': 'Loading user data...',
    'auth.loadingImages': 'Loading images...',
    'auth.loadingRelatedUsers': 'Loading related users...',
    'auth.sendingSMS': 'Sending SMS...',
    'auth.sendingEmail': 'Sending email...',
    'auth.verifyingCode': 'Verifying code...',
    'auth.checkingExistingUser': 'Checking existing user...',
    'auth.existingUserFound': 'Existing user found, loading data...',
    'auth.processingImage': 'Processing image...',
    'auth.resizingImage': 'Resizing image...',
    'auth.registeringNewUser': 'Registering new user...',
    'auth.sendingGalleryLink': 'Sending gallery link...',
    'auth.registeringUser': 'Registering user...',
    'auth.ready': 'Ready!',
    'auth.galleryLoaded': 'Your personal gallery has been loaded successfully',
    'auth.alert': 'Alert',
    'auth.dataError': 'An error occurred while loading data, but registration was successful',
    'auth.emailSent': 'Email Sent',
    'auth.emailSentDesc': 'Verification code sent to your email address',
    'auth.smsSent': 'SMS Sent',
    'auth.smsSentDesc': 'Verification code sent to your phone number',
    'auth.sendError': 'Error',
    'auth.sendErrorDesc': 'Failed to send {type}. try again.',
    'auth.otpError': 'Invalid verification code. try again.',
    'auth.otpSystemError': 'An error occurred during code verification. try again.',
    'auth.welcomeBack': 'Welcome back!',
    'auth.existingUserDesc': 'You have been identified as a registered user. Entering gallery!',
    'auth.registrationSuccess': 'Registration Completed Successfully!',
    'auth.registrationSuccessDesc': 'Successfully registered!',
    'auth.registrationSuccessWithSMS': 'Successfully registered! SMS sent with link to your gallery',
    'auth.smsWarning': 'Registration succeeded but SMS sending failed. You can access the gallery through the link on the website.',
    'auth.eventRegistrationSuccess': 'Registration Complete!',
    'auth.eventRegistrationDesc': 'Successfully registered for the event!',
    'auth.registrationError': 'Registration Error',
    'auth.registrationErrorDesc': 'An error occurred during registration. Please try again.',
    
    // Download Modal
    'downloadModal.contactRequired': 'Please enter phone or email',
    'downloadModal.downloadComplete': 'Download Complete!',
    'downloadModal.photosDownloaded': 'photos downloaded successfully',
    'downloadModal.partialError': 'Partial Error',
    'downloadModal.partialErrorDesc': 'Some photos failed to download, please try again',
    'downloadModal.downloadError': 'An error occurred while downloading photos, please try again',
    'downloadModal.albumDownload': 'Album Download',
    'downloadModal.allPhotosDownload': 'Download All Photos',
    'downloadModal.photosWaiting': 'photos waiting for you!',
    'downloadModal.directDownload': 'Photos will be downloaded directly to your device',
    'downloadModal.linkDownload': 'Leave your details and we\'ll send you a download link when ready',
    'downloadModal.emailOptional': 'Email (optional)',
    'downloadModal.phoneOptional': 'Phone (optional)',
    'downloadModal.contactNote': '* At least one contact detail is required',
    'downloadModal.continueDownload': 'Continue to Download',
    'downloadModal.continueQuality': 'Continue to Quality Selection',
    'downloadModal.qualityTitle': 'Choose Image Quality',
    'downloadModal.qualityQuestion': 'Which image quality would you prefer?',
    'downloadModal.highQuality': 'High Quality',
    'downloadModal.highQualityDesc': 'Suitable for printing and editing (larger file)',
    'downloadModal.webQuality': 'Web Quality',
    'downloadModal.webQualityDesc': 'Suitable for social sharing (faster download)',
    'downloadModal.downloadNow': 'Download Now',
    'downloadModal.sendRequest': 'Send Request',
    'downloadModal.downloadStarted': 'Download Started!',
    'downloadModal.requestSent': 'Request Sent Successfully!',
    'downloadModal.downloadingToDevice': 'Photos are being downloaded to your device.',
    'downloadModal.autoClose': '(This window will close automatically)',
    'downloadModal.processingStarted': 'Photo processing has started.',
    'downloadModal.linkSoon': 'We\'ll send you a download link within minutes.',
    
    // Auth
    'auth.phoneEntry': 'Sign Up',
    'auth.emailEntry': 'Email Address Entry',
    'auth.otpVerification': 'Code Verification',
    'auth.selfieCapture': 'Selfie Capture',
    'auth.registrationComplete': 'Registration Complete',
    'auth.phoneInstruction': 'We will send you a verification code via SMS',
    'auth.emailInstruction': 'We will send you a verification code via email',
    'auth.phoneExample': 'Enter number without leading 0. Example: 50-123-4567',
    'auth.enterPhone': 'Enter phone number',
    'auth.enterEmail': 'Enter email address',
    'auth.orUsePhone': 'or use phone',
    'auth.orUseEmail': 'or use email',
    'auth.sendCode': 'Send Code',
    'auth.resendIn': 'Resend in {seconds} seconds',
    'auth.resendCode': 'Send Code Again',
    'auth.verifying': 'Verifying...',
    'auth.continue': 'Continue',
    'auth.selfieInstruction': 'Take a selfie to identify your photos in the gallery',
    'auth.takeSelfie': 'Take Selfie',
    'auth.selectFile': 'Select File',
    'auth.camera': 'Camera',
    'auth.loading': 'Loading more images...',
    'auth.takePhoto': 'Take Photo',
    'auth.confirm': 'Confirm',
    'auth.retake': 'Retake',
    'auth.cameraError': 'Error accessing camera. Please ensure camera is connected and permission is granted.',
    'auth.invalidPhone': 'Phone number is invalid for the selected country',
    'auth.invalidEmail': 'Email address is invalid',
    'auth.phoneRequired': 'Please enter a phone number',
    'auth.emailRequired': 'Please enter an email address',
    'auth.selectImageOrCamera': 'Select image or take photo',
    'auth.notifyNewPhotos': 'Notify me when new photos are found',
    'auth.otpInstruction': 'Enter the 4-digit code sent to you',
    'auth.logout': 'Logout',
    
    // Leads
    'leads.thanksFeedback': 'Thanks for the feedback!',
    'leads.futureHelp': 'We\'d love to hear from you in the future and help with any questions',
    'leads.thankYou': 'Thank you!',
    'leads.detailsSaved': 'Details saved successfully, we\'ll get back to you soon ❤️',
    'leads.saveError': 'An error occurred while saving details, please try again',
    'leads.likedService': 'Did you like our service?',
    'leads.upcomingEvent': 'Have an upcoming event? We\'d love to help you create perfect memories!',
    'leads.yesEvent': 'Yes! We have an event 🎉',
    'leads.notSoon': 'Not in the near future',
    'leads.letsTalk': 'Let\'s talk! 📞',
    'leads.leaveDetails': 'Leave your details and we\'ll get back to you with a special offer for your event',
    'leads.fullName': 'Full Name',
    'leads.fullNamePlaceholder': 'Your name',
    'leads.phone': 'Phone',
    'leads.eventType': 'What type of event? (optional)',
    'leads.eventTypePlaceholder': 'Wedding, Bar/Bat Mitzvah, Birthday, Corporate event...',
    'leads.sendOffer': 'Send and Get Offer 🎯',
    
    // Support
    'support.guestSupport': 'Guest Support',
    'support.faqAndQuickHelp': 'FAQ and Quick Help',
    'support.whatsappMessage': 'I+have+a+question+about+the+system+',
    'support.eventName': 'Event+Name',
    'support.eventId': 'Event+ID',
    'support.noAnswer': 'Didn\'t find an answer?',
    'support.contactWhatsapp': 'Contact via WhatsApp',
    'support.moreInfo': 'More info on website',
    'support.terms': 'Terms',
    'support.privacy': 'Privacy',
    
    // Privacy
    'privacy.agreement.prefix': 'By uploud a selfie you agree to',
    'privacy.agreement.and': 'and',
    'privacy.terms': 'Terms',
    'privacy.policy': 'Privacy Policy',
    
    // Common
    'common.back': 'Back',
    'common.selected': 'Selected',
    'common.favorites': 'Favorites',
    'common.download': 'Download',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.close': 'Close',
    'common.next': 'Next',
    'common.of': 'of',
    'common.imageSize': 'Size',
    'common.activeUser': 'Active User',
    'common.optional': 'Optional',

    // Notifications
    'notifications.title': 'New photo alerts',
    'notifications.subtitle': 'Get notified when new photos are added',
    'notifications.subscribe': 'Subscribe',
    'notifications.getUpdates': 'Get Updates',
    'notifications.subscribeTo': 'Subscribe to notifications',
    'notifications.subscribeSuccess': 'Successfully subscribed to notifications!',
    'notifications.enterPhone': 'Enter phone number',
    'notifications.enterEmail': 'Enter email address',
    'notifications.sendCode': 'Send code',
    'notifications.verifyCode': 'Verify code',
    'notifications.notificationsEnabled': 'Notifications enabled',
    'notifications.notificationsDisabled': 'Notifications disabled',
    'notifications.phoneNumber': 'Phone number',
    'notifications.email': 'Email address',
    'notifications.optional': '(Optional)',
    'notifications.enableNotifications': 'Enable notifications',
    'notifications.close': 'Close',

    // Gallery
    'gallery.language': 'Language',
    'gallery.theme': 'Theme',
    'gallery.dark': 'Dark',
    'gallery.light': 'Light',

    // Empty states
    'empty.allPhotos.title': 'No Photos Available Yet',
    'empty.allPhotos.description': 'Photos are being uploaded and processed. Check back soon to see all photos from the event!',
    'empty.myPhotos.title': 'No Photos Found for You',
    'empty.myPhotos.description': 'Your photos might not be uploaded yet, or they\'re still being processed. Try again later!',
    'empty.allPhotos.clock':'Photos from the event will be here soon',
    'empty.myPhotos.clock': 'Your photos will be here soon',
    
    // Users
    'users.addUser': 'Add User',
    'users.manageUsers': 'Manage Users',
    'users.switchUser': 'Switch User',
    'users.deleteConfirm': 'Are you sure you want to delete this user?',
    'users.userAdded': 'User Added Successfully',
    'users.userSwitched': 'New user is now active',
    'users.infoRequired': 'Please enter at least one detail',
    'users.selfieRequired': 'Please upload a selfie photo',
    'users.name': 'Name',
    'users.phone': 'Phone',
    'users.email': 'Email',
    'users.namePlaceholder': 'Enter name',
    'users.phonePlaceholder': 'Enter phone number',
    'users.emailPlaceholder': 'Enter email address'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'he';
  });

  const setDefaultLanguage = (defaultLang: Language) => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (!savedLanguage) {
      setLanguage(defaultLang);
    }
  };

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]];
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, setDefaultLanguage }}>
      <div className={language === 'he' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};