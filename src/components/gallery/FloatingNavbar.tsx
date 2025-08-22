import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Share2, Images, MessageCircle, QrCode, ArrowUp, Menu, Download, CheckSquare, Users, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { FAQSupportDialog } from './FAQSupportDialog';
import { question } from '../../types/question';
import QRCode from 'qrcode';
import { event } from "@/types/event";
import { faqData } from '@/data/faqData';
import { useIsMobile } from "@/hooks/use-mobile";
import { useMultiUserAuth } from '@/contexts/AuthContext';

interface FloatingNavbarProps {
  event: event;
  galleryType: 'all' | 'my' | 'favorites';
  onToggleGalleryType: () => void;
  onDownloadAll?: () => void;
  onToggleSelectionMode?: () => void;
  className?: string;
  imageCount?: number; 
}

export const FloatingNavbar = ({ event, galleryType, onToggleGalleryType, onDownloadAll, onToggleSelectionMode, className, imageCount = 0 }: FloatingNavbarProps) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [isQrOpen, setIsQrOpen] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const isMobile = useIsMobile();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isAuthenticated, currentUser } = useMultiUserAuth();
  const [isConnect, setIsConnect] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > 1000 && imageCount > 0);
      setShowMenu(scrollTop > 500);
      // Auto-expand on first show for mobile
      if (isMobile && scrollTop > 500 && !isExpanded) {
        setTimeout(() => setIsExpanded(true), 300);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [imageCount, isMobile, isExpanded]);


  useEffect(() => {
    if(!showMenu){
      setIsExpanded(false);
      setIsQrOpen(false);
    }
  }, [showMenu]);


  useEffect(() => {
    if(!isExpanded){
      setIsQrOpen(false);
    }
  }, [isExpanded]);

  useEffect(() => {
    if(!currentUser){
      setIsConnect(false);
    }
    else{
      setIsConnect(true);
    }
  }, [currentUser]);

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
  if (!isMobile && showMenu) {
    return (
      <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-[95vw] ${className}`} >
        <div className="bg-background/95 backdrop-blur-sm border shadow-lg rounded-full px-4 py-3 flex items-center gap-2">


          {/* Download All */}
          {imageCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownloadAll}
              className="rounded-full hover:bg-accent px-4 py-2 text-sm"
              >
              <Download className="h-4 w-4 mr-2" />
              <span>{language === 'he' ? 'הורד' : 'Download'}</span>
            </Button>
          )}

          {/* Toggle Selection Mode */}
          {imageCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSelectionMode}
              className="rounded-full hover:bg-accent px-4 py-2 text-sm"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              <span>{language === 'he' ? 'בחר תמונות' : 'Select Images'}</span>
            </Button>
            )}

        {/* Gallery Toggle */}
          {event.withPhotos && (
              <Button
              variant="outline"
              size="sm"
              onClick={onToggleGalleryType}
              className="rounded-full px-4 py-2 text-sm"
              >
              {galleryType === 'all' ? <Users className="h-4 w-4" /> : <Images className="h-4 w-4" />}

                <span>
                  {galleryType === 'all' && isConnect ? t('navbar.myPhotos') : galleryType === 'all' && !isConnect ? t('navbar.findMe') :t ('navbar.allPhotos')}
                </span>
              </Button>
            )}

          {/* Share Event */}
          <Dialog open={isQrOpen} onOpenChange={setIsQrOpen} >
            <DialogTrigger asChild >
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
              <DialogHeader >
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

          {/* Back to Top Button - Desktop */}
          {showBackToTop && (
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToGallery}
              className="rounded-full hover:bg-accent px-2 py-2 transition-all duration-300"
              title="חזרה למעלה"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              {/* <span>{language === 'he' ? 'למעלה' : 'To Top'}</span> */}
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

  // Mobile version - horizontal with slide animation
  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-[95vw] ${className}`} data-floating-navbar>
      {showMenu && (
        <div 
          className={`bg-background/95 backdrop-blur-sm border shadow-lg rounded-full px-3 py-2 flex items-center gap-1 transition-all duration-500 ease-out ${
            isExpanded 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          {/* Gallery Toggle */}
          {event.withPhotos && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleGalleryType}
              className="rounded-full px-3 py-2 text-xs hover:bg-accent transition-all duration-200"
            >
              {galleryType === 'all' ? <Users className="h-3 w-3 mr-1" /> : <Images className="h-3 w-3 mr-1" />}
              <span className="hidden sm:inline">
                {galleryType === 'all' && isConnect ? t('navbar.myPhotos') : galleryType === 'all' && !isConnect ? t('navbar.findMe') : t('navbar.allPhotos')}
              </span>
            </Button>
          )}

          {/* Share Event */}
          <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateQRCode}
                className="rounded-full hover:bg-accent px-3 py-2 text-xs transition-all duration-200"
              >
                <Share2 className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">{t('navbar.shareEvent')}</span>
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
            className="rounded-full hover:bg-accent px-3 py-2 text-xs transition-all duration-200"
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">{language === 'he' ? 'תמיכה' : 'Support'}</span>
          </Button>

          {/* Back to Top Button */}
          {showBackToTop && (
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToGallery}
              className="rounded-full hover:bg-accent px-3 py-2 transition-all duration-200"
              title="חזרה למעלה"
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
          )}

          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="rounded-full hover:bg-accent px-2 py-2 ml-2 transition-all duration-200"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Toggle button */}
      {showMenu && !isExpanded && (
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(true)}
          className="h-12 w-12 rounded-full bg-background/95 backdrop-blur-sm hover:bg-accent shadow-lg border p-0 transition-all duration-300 hover:scale-105"
        >
          <Menu className="w-5 h-5" />
        </Button>
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