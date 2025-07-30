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