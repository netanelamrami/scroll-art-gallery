import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GalleryImage } from "@/types/gallery";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { downloadImage } from "@/utils/downloadUtils";
import { isIOS } from "@/utils/deviceUtils";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

interface LightboxModalProps {
  isOpen: boolean;
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const LightboxModal = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
  isFavorite = false,
  onToggleFavorite,
}: LightboxModalProps) => {
  const navigate = useNavigate();
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const { t, language } = useLanguage();

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

    // Check if iOS - redirect to image save page
    if (isIOS()) {
      const params = new URLSearchParams({
        url: currentImage.largeSrc,
        name: `image-${currentImage.id}.jpg`
      });
      navigate(`/image-save?${params.toString()}`);
      return;
    }

    // For Android/Desktop - direct download
    toast({
      title: t('toast.downloadStarting.title'),
      description: t('toast.downloadStarting.title'),
    });

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
              <Download className="h-4 w-4" />
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
          <p className="text-sm opacity-80">
            {currentImage.alt} • {t('common.imageSize')}: {currentImage.size}
          </p>
        </div>
      </div>

      {/* Click outside to close overlay */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />
    </div>
  );
};