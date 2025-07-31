import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Share2, Images, MessageCircle, QrCode, ArrowUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { FAQSupportDialog } from './FAQSupportDialog';
import { question } from '../../types/question';
import QRCode from 'qrcode';
import { event } from "@/types/event";

interface FloatingNavbarProps {
  event: event;
  galleryType: 'all' | 'my' | 'favorites';
  onToggleGalleryType: () => void;
  className?: string;
}

export const FloatingNavbar = ({ event, galleryType, onToggleGalleryType, className }: FloatingNavbarProps) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [isQrOpen, setIsQrOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Track scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const questions: question[] = [
    { title: "איך מעלים תמונה?", answer: "לחץ על כפתור ההעלאה ובחר קובץ מהמכשיר." },
    { title: "איך משתפים תמונה?", answer: "לחץ על כפתור השיתוף ליד התמונה." }
  ];
  const generateQRCode = async () => {
    try {
      const url = window.location.href;
      const qrDataURL = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCode(qrDataURL);
      setIsQrOpen(true);
    } catch (error) {
      toast({
        title: t('toast.error.title'),
        description: t('toast.qrError.description'),
        variant: "destructive",
      });
    }
  };

  const handleSupport = () => {
    toast({
      title: t('toast.support.title'),
      description: t('toast.support.description'),
    });
  };

  const scrollToGallery = () => {
    const galleryElement = document.getElementById('gallery');
    if (galleryElement) {
      galleryElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback to top if gallery not found
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 max-w-[95vw] ${className}`}>
      <div className="bg-background/95 backdrop-blur-sm border shadow-lg rounded-full px-3 py-3 flex items-center gap-2 overflow-x-auto sm:px-6 sm:gap-3">
        {/* Support */}
        <FAQSupportDialog
          isOpen={isSupportOpen}
          setIsOpen={setIsSupportOpen}
          questions={questions}
          event={event}
        />

        {/* Gallery Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleGalleryType}
          className="rounded-full min-w-[60px] px-1 py-1 text-sm sm:px-4 sm:py-2"
        >
          <Images className="h-4 w-4 ml-2" />
          {galleryType === 'all' ? t('navbar.allPhotos') : galleryType === 'my' ? t('navbar.myPhotos') : 'נבחרות'}
        </Button>

        {/* Back to Top Button - Only show when scrolled down */}
        {showBackToTop && (
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToGallery}
            className="rounded-full hover:bg-accent px-1 py-1 text-sm sm:px-3 sm:py-2 transition-all duration-300"
            title="חזרה למעלה"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}

        {/* Share Event */}
        <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateQRCode}
              className="rounded-full hover:bg-accent px-1 py-1 text-sm sm:px-4 sm:py-2"
            >
              <Share2 className="h-4 w-4 ml-2" />
              {t('navbar.shareEvent')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">{t('share.title')}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 py-4">
              {qrCode && (
                <div className="bg-white p-4 rounded-lg">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
              )}
              <p className="text-sm text-muted-foreground text-center">
                {t('share.description')}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({
                    title: t('toast.linkCopied.title'),
                    description: t('toast.linkCopied.description'),
                  });
                }}
                className="w-full"
              >
                <Share2 className="h-4 w-4 ml-2" />
                {t('share.copyLink')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};