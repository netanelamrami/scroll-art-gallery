import { useEffect, useState } from "react";
import { GalleryImage } from "@/types/gallery";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface LightboxModalProps {
  isOpen: boolean;
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const LightboxModal = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}: LightboxModalProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

  if (!isOpen || !currentImage) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = currentImage.src;
    link.download = `gallery-image-${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 dark:bg-black/90 backdrop-blur-sm">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center justify-between">
          <div className="text-foreground">
            <span className="text-sm opacity-80">
              {currentIndex + 1} מתוך {images.length}
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

      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 text-foreground hover:bg-accent w-12 h-12"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}

      {currentIndex < images.length - 1 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 text-foreground hover:bg-accent w-12 h-12"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}

      {/* Image Container */}
      <div
        className="absolute inset-0 flex items-center justify-center p-12 cursor-pointer"
        onClick={onClose}
      >
        <div
          className={cn(
            "relative max-w-full max-h-full transition-transform duration-300",
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
            src={currentImage.src}
            alt={currentImage.alt}
            className={cn(
              "max-w-full max-h-full object-contain  shadow-gallery transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <div className="text-center text-foreground">
          <p className="text-sm opacity-80">
            {currentImage.alt} • גודל: {currentImage.size}
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