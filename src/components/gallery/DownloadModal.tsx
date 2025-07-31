import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download, Mail, Phone, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { getDownloadFormData, saveDownloadFormData, downloadMultipleImages } from "@/utils/downloadUtils";
import { GalleryImage } from "@/types/gallery";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageCount: number;
  images?: GalleryImage[];
  autoDownload?: boolean; // For immediate download if <= 20 images
  albumName?: string; // Name of the album being downloaded
}

export const DownloadModal = ({ isOpen, onClose, imageCount, images = [], autoDownload = false, albumName }: DownloadModalProps) => {
  const [step, setStep] = useState<'contact' | 'quality' | 'success'>('contact');
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    quality: "high" // "high" or "web"
  });
  
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
    saveDownloadFormData({
      email: formData.email,
      phone: formData.phone
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
        // TODO: שליחה ל-API
        // await apiService.submitDownloadRequest(formData);
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
    setFormData({ email: "", phone: "", quality: "high" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] border-none bg-background/95 backdrop-blur-sm">
        <DialogHeader className="text-center space-y-4">
          {step === 'contact' && (
            <>
              <div className="flex justify-center">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle className="text-xl">
                {albumName ? `${t('downloadModal.albumDownload')} ${albumName}` : t('downloadModal.allPhotosDownload')}
              </DialogTitle>
              <DialogDescription className="text-base">
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
                     className="text-right"
                   />
                 </div>
                 
                 <div className="space-y-2">
                   <Label htmlFor="phone" className="flex items-center gap-2">
                     <Phone className="h-4 w-4" />
                     {t('downloadModal.phoneOptional')}
                   </Label>
                   <Input
                     id="phone"
                     type="tel"
                     value={formData.phone}
                     onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                     placeholder="05X-XXXXXXX"
                     className="text-right"
                   />
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
              <div className="flex justify-center">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle className="text-xl">{t('downloadModal.qualityTitle')}</DialogTitle>
              <DialogDescription className="text-base">
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
                 <Button onClick={handleQualitySubmit} className="flex-1">
                   {imageCount <= 20 ? t('downloadModal.downloadNow') : t('downloadModal.sendRequest')}
                 </Button>
                   <Button 
                     variant="outline" 
                     onClick={() => setStep('contact')}
                     className="flex-1"
                   >
                     {t('common.back')}
                   </Button>
                 </div>
              </div>
            </>
          )}

          {step === 'success' && (
            <>
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <DialogTitle className="text-xl">
                {imageCount <= 20 ? t('downloadModal.downloadStarted') : t('downloadModal.requestSent')}
              </DialogTitle>
              <DialogDescription className="text-base">
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