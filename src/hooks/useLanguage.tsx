import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'he' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  he: {
    // Hero Section
    'hero.title': 'גלריית תמונות החתונה',
    'hero.subtitle': 'כל הזכרונות הקסומים מהיום הכי מיוחד שלכם',
    'hero.allPhotos': 'כל התמונות',
    'hero.myPhotos': 'התמונות שלי',
    
    // Gallery Header
    'gallery.title': 'גלריית תמונות',
    'gallery.totalImages': 'סך התמונות',
    'gallery.columns': 'עמודות',
    'gallery.downloadAll': 'הורד הכל',
    'gallery.downloadSelected': 'הורד נבחרות',
    'gallery.selectImages': 'בחירת תמונות',
    'gallery.share': 'שיתוף',
    'gallery.cancelSelection': 'ביטול בחירה',
    'gallery.selectedImages': 'תמונות נבחרות',
    
    // Floating Navbar
    'navbar.support': 'תמיכה',
    'navbar.allPhotos': 'כל התמונות',
    'navbar.myPhotos': 'התמונות שלי',
    'navbar.shareEvent': 'שתף אירוע',
    'navbar.shareEventMobile': 'שתף',
    
    // Share Dialog
    'share.title': 'שתף את הגלריה',
    'share.description': 'סרוק את הקוד או שתף את הקישור',
    'share.copyLink': 'העתק קישור',
    
    // Toasts
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
    
    // Download Modal
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
    'downloadModal.downloadStarted': 'ההורדה החלה!',
    'downloadModal.requestSent': 'הבקשה נשלחה בהצלחה!',
    'downloadModal.downloadingToDevice': 'התמונות מורדות למכשיר שלכם.',
    'downloadModal.autoClose': '(חלון זה ייסגר אוטומטית)',
    'downloadModal.processingStarted': 'תהליך הכנת התמונות החל.',
    'downloadModal.linkSoon': 'נשלח לכם קישור להורדה תוך מספר דקות.',
    
    // Auth
    'auth.phoneEntry': 'הזנת מספר טלפון',
    'auth.otpVerification': 'אימות קוד',
    'auth.selfieCapture': 'צילום סלפי',
    'auth.registrationComplete': 'הרשמה הושלמה',
    
    // Leads
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
    
    // Support
    'support.guestSupport': 'תמיכה לאורחים',
    'support.faqAndQuickHelp': 'שאלות נפוצות ומענה מהיר',
    'support.whatsappMessage': 'יש+לי+שאלה+בנוגע+למערכת+',
    'support.eventName': 'שם+האירוע',
    'support.eventId': 'מזהה+אירוע',
    'support.noAnswer': 'לא מצאת תשובה?',
    'support.contactWhatsapp': 'צור קשר בוואטסאפ',
    'support.moreInfo': 'מידע נוסף באתר',
    'support.terms': 'תקנון',
    'support.privacy': 'פרטיות',
    
    // Common
    'common.back': 'חזור',
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
    'auth.phoneEntry': 'Phone Number Entry',
    'auth.otpVerification': 'Code Verification',
    'auth.selfieCapture': 'Selfie Capture',
    'auth.registrationComplete': 'Registration Complete',
    
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
    
    // Common
    'common.back': 'Back',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('he');

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]];
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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