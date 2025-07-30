
import { useState } from "react";
import { GalleryImage } from "@/types/gallery";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreVertical, Download, Link, Copy } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

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
  const [showOverlay, setShowOverlay] = useState(false);
  const { toast } = useToast();

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

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.src;
    link.download = `image-${image.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "הורדת תמונה",
      description: "התמונה הורדה בהצלחה",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(image.src);
    toast({
      title: "קישור הועתק",
      description: "קישור התמונה הועתק ללוח",
    });
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-none cursor-pointer",
        "bg-card hover:bg-accent/50 dark:bg-card dark:hover:bg-accent/50",
        "transform transition-all duration-300 hover:scale-[1.00]",
        "shadow-md hover:shadow-xl border border-border",
        isSelectionMode && "ring-2 ring-transparent",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
      onClick={handleClick}
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
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
      {!isSelectionMode && showOverlay && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300" />
          
          {/* Image ID */}
          <div className="absolute top-2 left-2">
            <div className="px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-white text-xs">
              ID: {image.id}
            </div>
          </div>

          {/* Actions menu */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 bg-black/70 backdrop-blur-sm text-white hover:bg-black/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-background border border-border shadow-lg min-w-[150px]"
                style={{ zIndex: 99999 }}
                onCloseAutoFocus={(e) => e.preventDefault()}
                side="bottom"
                sideOffset={5}
              >
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-accent focus:bg-accent"
                  onSelect={(e) => {
                    e.preventDefault();
                    handleDownload();
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  הורד תמונה
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-accent focus:bg-accent"
                  onSelect={(e) => {
                    e.preventDefault();
                    handleCopyLink();
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  העתק קישור
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="absolute bottom-2 right-2">
            <div className="px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-white text-xs">
              {image.id}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
