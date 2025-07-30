import { useState } from "react";
import { GalleryImage } from "@/types/gallery";
import { cn } from "@/lib/utils";

interface GalleryImageCardProps {
  image: GalleryImage;
  onClick: () => void;
}

export const GalleryImageCard = ({ image, onClick }: GalleryImageCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg cursor-pointer",
        "bg-gallery-card hover:bg-gallery-hover",
        "transform transition-gallery hover:scale-[1.02]",
        "shadow-card hover:shadow-gallery"
      )}
      onClick={onClick}
    >
      {!isLoaded && (
        <div 
          className="w-full bg-gradient-to-br from-gallery-card to-gallery-hover animate-pulse rounded-lg"
          style={{ height: `${image.height}px` }}
        />
      )}
      
      {hasError ? (
        <div 
          className="w-full bg-gallery-card flex items-center justify-center text-muted-foreground rounded-lg"
          style={{ height: `${image.height}px` }}
        >
          <span>שגיאה בטעינת התמונה</span>
        </div>
      ) : (
        <img
          src={image.src}
          alt={image.alt}
          className={cn(
            "w-full h-auto object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="px-2 py-1 bg-black/50 rounded text-white text-xs">
          {image.size}
        </div>
      </div>
    </div>
  );
};