import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Share2, Images, MessageCircle, QrCode, ArrowUp, Menu, X, Download, CheckSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { FAQSupportDialog } from './FAQSupportDialog';
import { question } from '../../types/question';
import QRCode from 'qrcode';
import { event } from "@/types/event";
import { faqData } from '@/data/faqData';

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

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`fixed bottom-6 left-6 z-50 ${className}`}>
      <div className={`transition-all duration-300 ease-in-out ${
        isExpanded 
          ? 'translate-x-0' 
          : 'translate-x-0'
      }`}>
        {!isExpanded ? (
          // Collapsed state - hamburger button
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(true)}
            className="h-14 w-14 rounded-full bg-white/90 hover:bg-white shadow-lg border border-gray-200 p-0 transition-all duration-300"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </Button>
        ) : (
          // Expanded state - full navbar
          <div className={`bg-background/95 backdrop-blur-sm border shadow-lg rounded-full px-3 py-3 flex items-center gap-2 animate-slide-in-right`}>
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="rounded-full px-2 py-2 shrink-0 hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Gallery Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleGalleryType}
              className="rounded-full px-2 py-2 text-xs"
              title={galleryType === 'all' ? 'כל התמונות' : galleryType === 'my' ? 'התמונות שלי' : 'נבחרות'}
            >
              <Images className="h-4 w-4" />
            </Button>

            {/* Download All */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownloadAll}
              className="rounded-full hover:bg-accent px-2 py-2 text-xs"
              title="הורד הכל"
            >
              <Download className="h-4 w-4" />
            </Button>

            {/* Toggle Selection Mode */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSelectionMode}
              className="rounded-full hover:bg-accent px-2 py-2 text-xs"
              title="בחר תמונות"
            >
              <CheckSquare className="h-4 w-4" />
            </Button>

            {/* Share Event */}
            <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateQRCode}
                  className="rounded-full hover:bg-accent px-2 py-2 text-xs"
                  title="שתף אירוע"
                >
                  <Share2 className="h-4 w-4" />
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
              size="sm"
              onClick={() => setIsSupportOpen(true)}
              className="rounded-full hover:bg-accent px-2 py-2 text-xs"
              title="תמיכה"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>

            {/* Back to Top Button - Only show when scrolled down */}
            {showBackToTop && (
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToGallery}
                className="rounded-full hover:bg-accent px-2 py-2 transition-all duration-300"
                title="חזרה למעלה"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
          </div>
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
};