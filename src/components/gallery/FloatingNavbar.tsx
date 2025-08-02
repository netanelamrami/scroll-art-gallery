import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Share2, Images, MessageCircle, QrCode, ArrowUp, Menu, Download, CheckSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { FAQSupportDialog } from './FAQSupportDialog';
import { question } from '../../types/question';
import QRCode from 'qrcode';
import { event } from "@/types/event";
import { faqData } from '@/data/faqData';
import { useIsMobile } from "@/hooks/use-mobile";

interface FloatingNavbarProps {
  event: event;
  galleryType: 'all' | 'my' | 'favorites';
  onToggleGalleryType: () => void;
  onDownloadAll?: () => void;
  onToggleSelectionMode?: () => void;
  className?: string;
}

export const FloatingNavbar = ({ event, galleryType, onToggleGalleryType, onDownloadAll, onToggleSelectionMode, className }: FloatingNavbarProps) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [isQrOpen, setIsQrOpen] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const isMobile = useIsMobile();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Track scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close navbar when clicking outside (mobile only)
  useEffect(() => {
    if (!isMobile) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const navbar = target.closest('[data-floating-navbar]');
      if (!navbar && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, isExpanded]);

  const questions = faqData[language] || faqData.he;
  
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

  const scrollToGallery = () => {
    const galleryElement = document.getElementById('gallery');
    if (galleryElement) {
      galleryElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };


  // Desktop version - always expanded with text
  if (!isMobile) {
    return (
      <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 max-w-[95vw] ${className}`}>
        <div className="bg-background/95 backdrop-blur-sm border shadow-lg rounded-full px-6 py-3 flex items-center gap-3">
          {/* Gallery Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleGalleryType}
            className="rounded-full px-4 py-2 text-sm"
          >
            <Images className="h-4 w-4 mr-2" />
            <span>
              {galleryType === 'all' ? t('navbar.allPhotos') : galleryType === 'my' ? t('navbar.myPhotos') : (language === 'he' ? 'נבחרות' : 'Favorites')}
            </span>
          </Button>

          {/* Download All */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownloadAll}
            className="rounded-full hover:bg-accent px-4 py-2 text-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            <span>{language === 'he' ? 'הורד הכל' : 'Download All'}</span>
          </Button>

          {/* Toggle Selection Mode */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSelectionMode}
            className="rounded-full hover:bg-accent px-4 py-2 text-sm"
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            <span>{language === 'he' ? 'בחר תמונות' : 'Select Images'}</span>
          </Button>

          {/* Share Event */}
          <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateQRCode}
                className="rounded-full hover:bg-accent px-4 py-2 text-sm"
              >
                <Share2 className="h-4 w-4 mr-2" />
                <span>{t('navbar.shareEvent')}</span>
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
                  <Share2 className="h-4 w-4 mr-2" />
                  {t('share.copyLink')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Support */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSupportOpen(true)}
            className="rounded-full hover:bg-accent px-4 py-2 text-sm"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            <span>{language === 'he' ? 'תמיכה' : 'Support'}</span>
          </Button>

          {/* Back to Top Button */}
          {showBackToTop && (
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToGallery}
              className="rounded-full hover:bg-accent px-4 py-2 transition-all duration-300"
              title="חזרה למעלה"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              <span>{language === 'he' ? 'למעלה' : 'To Top'}</span>
            </Button>
          )}
        </div>

        <FAQSupportDialog
          isOpen={isSupportOpen}
          setIsOpen={setIsSupportOpen}
          questions={questions}
          event={event}
        />
      </div>
    );
  }

  // Mobile version - collapsible vertically
  return (
    <div className={`fixed bottom-6 left-6 z-50 ${className}`} data-floating-navbar>
      <div className="relative">
        
        {/* Expanded state - full navbar */}
        {isExpanded && (
          <div className={`absolute bottom-16 left-0 bg-background/95 backdrop-blur-sm border shadow-lg rounded-2xl px-3 py-3 flex flex-col gap-2 animate-fade-in transition-all duration-500 transform origin-bottom min-w-[160px]`}>
            
            {/* Gallery Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onToggleGalleryType();
                setIsExpanded(false);
              }}
              className="rounded-full px-3 py-2 text-sm flex items-center gap-2 transition-all duration-200 hover:scale-105 justify-start w-full"
            >
              <Images className="h-4 w-4" />
              <span>
                {galleryType === 'all' ? 'כל התמונות' : galleryType === 'my' ? 'התמונות שלי' : 'נבחרות'}
              </span>
            </Button>

            {/* Download All */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDownloadAll?.();
                setIsExpanded(false);
              }}
              className="rounded-full hover:bg-accent px-3 py-2 text-sm flex items-center gap-2 transition-all duration-200 hover:scale-105 justify-start w-full"
            >
              <Download className="h-4 w-4" />
              <span>הורד הכל</span>
            </Button>

            {/* Toggle Selection Mode */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onToggleSelectionMode?.();
                setIsExpanded(false);
              }}
              className="rounded-full hover:bg-accent px-3 py-2 text-sm flex items-center gap-2 transition-all duration-200 hover:scale-105 justify-start w-full"
            >
              <CheckSquare className="h-4 w-4" />
              <span>בחר תמונות</span>
            </Button>

            {/* Share Event */}
            <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    generateQRCode();
                    setIsExpanded(false);
                  }}
                  className="rounded-full hover:bg-accent px-3 py-2 text-sm flex items-center gap-2 transition-all duration-200 hover:scale-105 justify-start w-full"
                >
                  <Share2 className="h-4 w-4" />
                  <span>שתף אירוע</span>
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
                    <Share2 className="h-4 w-4 mr-2" />
                    {t('share.copyLink')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Support */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsSupportOpen(true);
                setIsExpanded(false);
              }}
              className="rounded-full hover:bg-accent px-3 py-2 text-sm flex items-center gap-2 transition-all duration-200 hover:scale-105 justify-start w-full"
            >
              <MessageCircle className="h-4 w-4" />
              <span>תמיכה</span>
            </Button>
          </div>
        )}

        {/* Control button - always stays in place */}
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-14 w-14 rounded-full bg-white/90 hover:bg-white shadow-lg border border-gray-200 p-0 transition-all duration-300 hover:scale-105"
        >
          <Menu 
            className={`w-6 h-6 text-gray-700 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : 'rotate-0'
            }`} 
          />
        </Button>
      </div>

      {/* Back to Top Button - Fixed separate button on the right */}
      {showBackToTop && (
        <div className="fixed bottom-6 right-6 z-40">
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

      <FAQSupportDialog
        isOpen={isSupportOpen}
        setIsOpen={setIsSupportOpen}
        questions={questions}
        event={event}
      />
    </div>
  );
};