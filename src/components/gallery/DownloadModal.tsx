import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download, Mail, Phone, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { getDownloadFormData, saveDownloadFormData, downloadMultipleImages } from "@/utils/downloadUtils";
import { GalleryImage } from "@/types/gallery";
import { apiService } from "@/data/services/apiService";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageCount: number;
  images?: GalleryImage[];
  autoDownload?: boolean; // For immediate download if <= 20 images
  albumName?: string; // Name of the album being downloaded
  galleryType?: 'all' | 'my' | 'favorites'; // סוג הגלרייה - עבור קביעת DownloadAllPhotos
  eventId?: number; // מזהה האירוע
}

export const DownloadModal = ({ isOpen, onClose, imageCount, images = [], autoDownload = false, albumName, galleryType = 'all', eventId }: DownloadModalProps) => {
  const [step, setStep] = useState<'contact' | 'quality' | 'success'>('contact');
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    countryCode: "+972",
    quality: "high" // "high" or "web"
  });

  const countries = [
    { 
      code: "+972", 
      name: { he: "ישראל", en: "Israel" }, 
      flag: "🇮🇱",
      pattern: /^5[0-9]{8}$/
    },
    { 
      code: "+1", 
      name: { he: "ארה״ב", en: "United States" }, 
      flag: "🇺🇸",
      pattern: /^[2-9][0-9]{9}$/
    },
    { 
      code: "+44", 
      name: { he: "בריטניה", en: "United Kingdom" }, 
      flag: "🇬🇧",
      pattern: /^7[0-9]{9}$/
    },
    { 
      code: "+33", 
      name: { he: "צרפת", en: "France" }, 
      flag: "🇫🇷",
      pattern: /^[67][0-9]{8}$/
    },
    { 
      code: "+49", 
      name: { he: "גרמניה", en: "Germany" }, 
      flag: "🇩🇪",
      pattern: /^1[5-7][0-9]{8,9}$/
    },
    { 
      code: "+39", 
      name: { he: "איטליה", en: "Italy" }, 
      flag: "🇮🇹",
      pattern: /^3[0-9]{8,9}$/
    },
    { 
      code: "+34", 
      name: { he: "ספרד", en: "Spain" }, 
      flag: "🇪🇸",
      pattern: /^[67][0-9]{8}$/
    },
    { 
      code: "+31", 
      name: { he: "הולנד", en: "Netherlands" }, 
      flag: "🇳🇱",
      pattern: /^6[0-9]{8}$/
    },
    { 
      code: "+41", 
      name: { he: "שוויץ", en: "Switzerland" }, 
      flag: "🇨🇭",
      pattern: /^7[0-9]{8}$/
    },
    { 
      code: "+43", 
      name: { he: "אוסטריה", en: "Austria" }, 
      flag: "🇦🇹",
      pattern: /^6[0-9]{8,10}$/
    },
  ];
  
  // Load saved data on mount
  useEffect(() => {
    const savedData = getDownloadFormData();
    if (savedData) {
      setFormData(prev => ({ ...prev, ...savedData }));
      if (autoDownload && imageCount <= 20) {
        // Skip to quality selection if we have saved data and it's auto download
        setStep('quality');
      }
    } else if (autoDownload && imageCount <= 20) {
      // If no saved data but auto download, start from contact
      setStep('contact');
    }
  }, [isOpen, autoDownload, imageCount]);
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email && !formData.phone) {
      toast({
        title: t('toast.error.title'),
        description: t('downloadModal.contactRequired'),
        variant: "destructive"
      });
      return;
    }
    
    // Save form data for future use
    const phoneData = formData.phone ? `${formData.countryCode}${formData.phone.replace(/^0/, '')}` : '';
    saveDownloadFormData({
      email: formData.email,
      phone: phoneData
    });
    
    setStep('quality');
  };

  const handleQualitySubmit = async () => {
    try {
      if (imageCount <= 20 && images.length > 0) {
        // Direct download for small albums
        setStep('success');
        
        const success = await downloadMultipleImages(
          images.map(img => ({ src: img.src, id: img.id }))
        );
        
        if (success) {
          toast({
            title: t('downloadModal.downloadComplete'),
            description: `${imageCount} ${t('downloadModal.photosDownloaded')}`,
          });
        } else {
          toast({
            title: t('downloadModal.partialError'),
            description: t('downloadModal.partialErrorDesc'),
            variant: "destructive"
          });
        }
      } else {
        // For large albums - API request
        const userId = parseInt(sessionStorage.getItem('userid') || '0');
        const phoneData = formData.phone ? `${formData.countryCode}${formData.phone.replace(/^0/, '')}` : '';
        
        const downloadRequest = {
          UserId: userId,
          EventId: eventId,
          Email: formData.email,
          Phone: phoneData,
          Quality: formData.quality, // "high" or "web"
          DownloadAllPhotos: galleryType === 'all' // true אם זה כל התמונות, false אם זה התמונות שלי
        };
        
        console.log('Sending download request:', downloadRequest);
        
        try {
          await apiService.downloadUserImg(downloadRequest);
          
          toast({
            title: t('downloadModal.requestSent'),
            description: galleryType === 'all' 
              ? t('toast.downloadRequestSent.all')
              : t('toast.downloadRequestSent.my'),
          });
        } catch (error) {
          console.error('Download API Error:', error);
          toast({
            title: t('toast.error.title'),
            description: t('toast.downloadRequestError'),
            variant: "destructive"
          });
          return;
        }
        
        setStep('success');
      }
      
      // Close modal after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      toast({
        title: t('toast.error.title'),
        description: t('downloadModal.downloadError'),
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    onClose();
    setStep('contact');
    setFormData({ email: "", phone: "", countryCode: "+972", quality: "high" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] border-none bg-background/95 backdrop-blur-sm" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          {step === 'contact' && (
            <>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl">
                  {albumName ? `${t('downloadModal.albumDownload')} ${albumName}` : t('downloadModal.allPhotosDownload')}
                </DialogTitle>
                <button 
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>
              <DialogDescription className="text-base text-center mt-4">
                {imageCount} {t('downloadModal.photosWaiting')}
                <br />
                {imageCount <= 20 
                  ? t('downloadModal.directDownload')
                  : t('downloadModal.linkDownload')
                }
              </DialogDescription>
              
               <form onSubmit={handleContactSubmit} className="space-y-4 pt-4">
                 <div className="space-y-2">
                   <Label htmlFor="email" className="flex items-center gap-2">
                     <Mail className="h-4 w-4" />
                     {t('downloadModal.emailOptional')}
                   </Label>
                   <Input
                     id="email"
                     type="email"
                     value={formData.email}
                     onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                     placeholder="example@email.com"
                     className={language === 'he' ? 'text-right' : 'text-left'}
                     dir="ltr"
                   />
                 </div>
                 
                 <div className="space-y-2">
                   <Label htmlFor="phone" className="flex items-center gap-2">
                     <Phone className="h-4 w-4" />
                     {t('downloadModal.phoneOptional')}
                   </Label>
                   <div className="flex gap-2" dir="ltr">
                     <Select value={formData.countryCode} onValueChange={(value) => setFormData(prev => ({ ...prev, countryCode: value }))}>
                       <SelectTrigger className="w-32">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         {countries.map((country) => (
                           <SelectItem key={country.code} value={country.code}>
                             <div className="flex items-center gap-2">
                               <span>{country.flag}</span>
                               <span>{country.code}</span>
                               <span className="text-sm text-muted-foreground">
                                 {country.name[language as keyof typeof country.name]}
                               </span>
                             </div>
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     
                     <Input
                       id="phone"
                       type="tel"
                       value={formData.phone}
                       onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                       placeholder={t('auth.enterPhone')}
                       className="flex-1"
                       dir="ltr"
                     />
                   </div>
                 </div>
                 
                 <p className="text-xs text-muted-foreground text-center">
                   {t('downloadModal.contactNote')}
                 </p>
                 
                 <Button type="submit" className="w-full">
                   {imageCount <= 20 ? t('downloadModal.continueDownload') : t('downloadModal.continueQuality')}
                 </Button>
               </form>
            </>
          )}

          {step === 'quality' && (
            <>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl">{t('downloadModal.qualityTitle')}</DialogTitle>
                <button 
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>
              <DialogDescription className="text-base text-center mt-4">
                {t('downloadModal.qualityQuestion')}
              </DialogDescription>
              
              <div className="space-y-4 pt-4">
                <RadioGroup
                  value={formData.quality}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, quality: value }))}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="flex-1 cursor-pointer">
                      <div className="font-medium">{t('downloadModal.highQuality')}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('downloadModal.highQualityDesc')}
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                    <RadioGroupItem value="web" id="web" />
                    <Label htmlFor="web" className="flex-1 cursor-pointer">
                      <div className="font-medium">{t('downloadModal.webQuality')}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('downloadModal.webQualityDesc')}
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                
                 <div className="flex gap-3 pt-2">
                   {/* Main action button - positioned right in LTR, left in RTL */}
                   <Button 
                     onClick={handleQualitySubmit} 
                     className={`flex-1 ${language === 'he' ? 'order-1' : 'order-2'}`}
                   >
                     {imageCount <= 20 ? t('downloadModal.downloadNow') : t('downloadModal.sendRequest')}
                   </Button>
                   {/* Back button - positioned left in LTR, right in RTL */}
                   <Button 
                     variant="outline" 
                     onClick={() => setStep('contact')}
                     className={`flex-1 ${language === 'he' ? 'order-2' : 'order-1'}`}
                   >
                     {t('common.back')}
                   </Button>
                 </div>
              </div>
            </>
          )}

          {step === 'success' && (
            <>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl">
                  {imageCount <= 20 ? t('downloadModal.downloadStarted') : t('downloadModal.requestSent')}
                </DialogTitle>
                <button 
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>
              <DialogDescription className="text-base text-center mt-4">
                {imageCount <= 20 ? (
                  <>
                    {t('downloadModal.downloadingToDevice')}
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {t('downloadModal.autoClose')}
                    </span>
                  </>
                ) : (
                  <>
                    {t('downloadModal.processingStarted')}
                    <br />
                    {t('downloadModal.linkSoon')}
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {t('downloadModal.autoClose')}
                    </span>
                  </>
                )}
              </DialogDescription>
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};