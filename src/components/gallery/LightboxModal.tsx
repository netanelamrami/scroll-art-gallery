import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GalleryImage } from "@/types/gallery";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, Star, Heart, Share2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { downloadImage } from "@/utils/downloadUtils";
import { shareImage } from "@/utils/shareUtils";
import { ShareOptionsModal } from "./ShareOptionsModal";
import { isIOS } from "@/utils/deviceUtils";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { ClipLoader } from "react-spinners";
import { apiService } from "@/data/services/apiService";

interface LightboxModalProps {
  isOpen: boolean;
  event: any;
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  galleryType: string
}

export const LightboxModal = ({
  isOpen,
  event,
  images,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
  isFavorite = false,
  onToggleFavorite,
  galleryType
}: LightboxModalProps) => {
  const navigate = useNavigate();
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const { t, language } = useLanguage();
  const [shareIsLoading, setShareIsLoading] = useState(false);
  const [downloadIsLoading, setDownloadIsLoading] = useState(false);

  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          onPrevious();
          break;
        case "ArrowRight":
          onNext();
          break;
        case "z":
        case "Z":
          setIsZoomed(!isZoomed);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious, isZoomed]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setImageLoaded(false);
      setIsZoomed(false);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    
    const deltaX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0 && currentIndex < images.length - 1) {
        // Swipe left - next image
        onNext();
      } else if (deltaX < 0 && currentIndex > 0) {
        // Swipe right - previous image
        onPrevious();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!isOpen || !currentImage) return null;

  const handleDownload = async () => {
    if (!currentImage) return;
      apiService.updateStatistic(event.id, "DownloadClick");

    // Check if iOS - redirect to image save page
    if (isIOS()) {
      // Get current scroll position and event link from URL
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      const currentPath = window.location.pathname;
      const eventLink = currentPath.startsWith('/') ? currentPath.slice(1) : currentPath;
      
      const params = new URLSearchParams({
        url: currentImage.largeSrc,
        name: `${currentImage.id}`,
        returnState: encodeURIComponent(JSON.stringify({ fromLightbox: true })),
        lightboxIndex: currentIndex.toString(),
        scrollPosition: scrollPosition.toString(),
        eventLink: eventLink || '',
        galleryType: galleryType,

      });
      navigate(`/image-save?${params.toString()}`);
      return;
    }
    if (!currentImage || isSharing) return;

    setIsSharing(true);
    
    toast({
      title: t('toast.downloadStarting.title'),
      description: t('toast.downloadStarting.title'),
    });
    setDownloadIsLoading(true);
    const success = await downloadImage(currentImage.largeSrc, `${currentImage.id}`);
    setDownloadIsLoading(false);

    if (success) {
      toast({
        title: t('toast.downloadComplete.title'),
        description: t('toast.downloadImageComplete.description'),
      });
    } else {
      toast({
        title: t('toast.error.title'),
        description: t('downloadModal.downloadError'),
        variant: "destructive"
      });

    try {
      const success = await downloadImage(currentImage.largeSrc, `${currentImage.id}`);
      
      if (success) {
        toast({
          title: t('toast.downloadComplete.title'),
          description: t('toast.downloadImageComplete.description'),
        });
      } else {
        toast({
          title: t('toast.error.title'),
          description: t('downloadModal.downloadError'),
          variant: "destructive"
        });
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleShare = async () => {
    if (!currentImage) return;

      apiService.updateStatistic(event.id, "SharePhotoClick");
      setShareIsLoading(true);
      const result = await shareImage(currentImage.largeSrc, `${currentImage.id}`);
      setShareIsLoading(false);
    if (result.success && result.method === 'native') {
      // toast({
      //   title: 'שיתוף הושלם',
      //   description: 'התמונה שותפה בהצלחה',
      // });
    } else if (result.success && result.method === 'options') {
      setShowShareModal(true);
    } else {
      toast({
        title: 'שגיאה',
        description: 'שגיאה בשיתוף התמונה',
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-background/95 dark:bg-black/90 backdrop-blur-sm" dir={language === 'he' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center justify-between">
          <div className="text-foreground">
            <span className="text-sm opacity-80">
              {currentIndex + 1} {t('common.of')} {images.length}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsZoomed(!isZoomed)}
              className="text-foreground hover:bg-accent"
            >
              {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="text-foreground hover:bg-accent"
            >
            {downloadIsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="h-4 w-4" />}
          </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="text-foreground hover:bg-accent"
            >
            {shareIsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
          </Button>
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleFavorite}
                className={cn(
                  "text-foreground hover:bg-accent",
                  isFavorite ? "text-black dark:text-white" : ""
                )}
              >
                <Heart className={cn("h-4 w-4", isFavorite ? "fill-black dark:fill-white" : "fill-none")} />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-foreground hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons - positioned based on language direction */}
      {currentIndex > 0 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          className={`absolute ${language === 'he' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 z-20 text-foreground hover:bg-accent/80 w-12 h-12 bg-black/20 backdrop-blur-sm`}
        >
          {language === 'he' ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
        </Button>
      )}

      {currentIndex < images.length - 1 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          className={`absolute ${language === 'he' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 z-20 text-foreground hover:bg-accent/80 w-12 h-12 bg-black/20 backdrop-blur-sm`}
        >
          {language === 'he' ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
        </Button>
      )}

      {/* Image Container */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4 cursor-pointer"
        onClick={onClose}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={cn(
            "relative w-full h-full flex items-center justify-center transition-transform duration-300",
            isZoomed ? "scale-150 cursor-move" : "cursor-pointer"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full"></div>
            </div>
          )}
          
          <img
            src={currentImage.mediumSrc}
            alt={currentImage.alt}
          className={cn(
            "max-w-full w-auto h-auto object-contain shadow-gallery transition-opacity duration-300 max-h-[calc(100vh-12vh)]",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}

            onLoad={() => setImageLoaded(true)}
            draggable={false}
          />
        </div>
      </div>
        



        
    {/* Bottom Info */}
    <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
      <div className={`text-foreground ${language === 'he' ? 'text-center' : 'text-center'}`}>
       {event.id == "691" && (
        <>
          <button
            className=" mb-3 sm:w-auto mx-auto flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:opacity-90 transition-all duration-300"
            onClick={() => {
              try {
                const photoUrl = currentImage.mediumSrc; 
                const encodedPhotoUrl = btoa(photoUrl); 
                const url = `https://plugos888.com/profile?eventid=68f1211cb0eacc6dff325195&photoUrl=${encodeURIComponent(encodedPhotoUrl)}`;
                window.open(url, '_blank'); 
              } catch (error) {
                console.error('Error encoding URL to base64', error);
              }
            }}
            >
        
            {language === 'he' ? 'שתפו ב-Plugos והרוויחו מטבעות 💎' : 'Share on Plugos & earn coins !💎'}
              {/* <img src="https://www.plugos888.com/_next/image?url=%2Fassets%2Fplugos.png&w=32&q=20" alt="" /> */}
          </button>
          <p className="text-sm opacity-80 mb-6">
          {language === 'he' ? 'המטבעות שלכם יהפכו לכסף אמיתי לבילוי הבא שלכם 🎉' : 'Your coins turn into real money for your next night out 🎉'}
          </p>
          </>
        )}
         {event.id != "691" && (
          <>
          <p className="text-sm opacity-80 mb-3">
            {currentImage.alt} • {t('common.imageSize')}: {currentImage.size}
          </p>
          </>
         )}
      </div>
    </div>
    
    
      {/* Click outside to close overlay */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />

      {/* Share Options Modal */}
      {currentImage && (
        <ShareOptionsModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          imageUrl={currentImage.largeSrc}
          imageName={`${currentImage.id}`}
        />
      )}
    </div>
  );
};