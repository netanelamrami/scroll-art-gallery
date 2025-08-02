import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Share2, Images, MessageCircle, QrCode, ArrowUp, Menu, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { FAQSupportDialog } from './FAQSupportDialog';
import { question } from '../../types/question';
import QRCode from 'qrcode';
import { event } from "@/types/event";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useIsMobile();

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

  const NavContent = () => (
    <div className="space-y-4">
      {/* All Photos */}
      <Button
        variant="outline"
        size="lg"
        onClick={() => {
          onToggleGalleryType();
          if (isMobile) setIsSheetOpen(false);
        }}
        className="w-full justify-start gap-3 h-14"
      >
        <Images className="h-5 w-5" />
        <span className="text-base">
          {galleryType === 'all' ? t('navbar.allPhotos') : galleryType === 'my' ? t('navbar.myPhotos') : (useLanguage().language === 'he' ? 'נבחרות' : 'Favorites')}
        </span>
      </Button>

      {/* Share Event */}
      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="lg"
            onClick={generateQRCode}
            className="w-full justify-start gap-3 h-14 hover:bg-accent"
          >
            <Share2 className="h-5 w-5" />
            <span className="text-base">{t('navbar.shareEvent')}</span>
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

      {/* Support */}
      <Button
        variant="ghost"
        size="lg"
        onClick={() => {
          setIsSupportOpen(true);
          if (isMobile) setIsSheetOpen(false);
        }}
        className="w-full justify-start gap-3 h-14 hover:bg-accent"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-base">{t('navbar.support')}</span>
      </Button>

      <FAQSupportDialog
        isOpen={isSupportOpen}
        setIsOpen={setIsSupportOpen}
        questions={questions}
        event={event}
      />
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="default"
                size="lg"
                className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="bottom" 
              className="h-[50vh] rounded-t-3xl border-t-2 p-6 animate-slide-in-right"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">{event.name}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSheetOpen(false)}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <NavContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Back to Top Button - Only show when scrolled down and sheet is closed */}
        {showBackToTop && !isSheetOpen && (
          <div className="fixed bottom-24 right-6 z-30">
            <Button
              variant="secondary"
              size="sm"
              onClick={scrollToGallery}
              className="h-12 w-12 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              title="חזרה למעלה"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 max-w-[95vw] ${className}`}>
      <div className="bg-background/95 backdrop-blur-sm border shadow-lg rounded-full px-6 py-3 flex items-center gap-3">
        <NavContent />

        {/* Back to Top Button - Only show when scrolled down */}
        {showBackToTop && (
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToGallery}
            className="rounded-full hover:bg-accent px-3 py-2 transition-all duration-300"
            title="חזרה למעלה"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};