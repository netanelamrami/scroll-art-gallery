
import { useState } from "react";
import { GalleryImage } from "@/types/gallery";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface GalleryImageCardProps {
  image: GalleryImage;
  onClick: () => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelectionChange?: () => void;
}

export const GalleryImageCard = ({ 
  image, 
  onClick, 
  isSelectionMode = false,
  isSelected = false,
  onSelectionChange
}: GalleryImageCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const handleClick = () => {
    if (isSelectionMode && onSelectionChange) {
      onSelectionChange();
    } else {
      onClick();
    }
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-none  cursor-pointer",
        "bg-card hover:bg-accent/50 dark:bg-card dark:hover:bg-accent/50",
        "transform transition-all duration-300 hover:scale-[1.00]",
        "shadow-md hover:shadow-xl border border-border",
        isSelectionMode && "ring-2 ring-transparent",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
      onClick={handleClick}
    >
      {!isLoaded && (
        <div 
          className="w-full bg-muted animate-pulse rounded-none "
          style={{ height: `${image.height}px` }}
        />
      )}
      
      {hasError ? (
        <div 
          className="w-full bg-muted flex items-center justify-center text-muted-foreground rounded-none "
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
      
      {/* Selection mode overlay */}
      {isSelectionMode && (
        <>
          <div className="absolute inset-0 bg-black/20 transition-opacity duration-200" />
          <div className="absolute top-2 right-2">
            <Checkbox
              checked={isSelected}
              onChange={onSelectionChange}
              className="bg-background shadow-lg border-2"
            />
          </div>
        </>
      )}
      
      {/* Regular hover overlay - only show when not in selection mode */}
      {!isSelectionMode && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-white text-xs">
              {image.size}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
