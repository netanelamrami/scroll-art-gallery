
import { useState, useEffect, useRef } from "react";
import { GalleryImage } from "@/types/gallery";
import { MasonryGrid } from "./MasonryGrid";
import { LightboxModal } from "./LightboxModal";
import { GalleryHeader } from "./GalleryHeader";
import { AlbumSection } from "./AlbumSection";
import { DownloadModal } from "./DownloadModal";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { event } from "@/types/event";
import { downloadMultipleImages } from "@/utils/downloadUtils";
import { Skeleton } from "@/components/ui/skeleton";

interface GalleryProps {
  event: event; 
  images: GalleryImage[];
  favoriteImages: Set<string>;
  onToggleFavorite: (imageId: string) => void;
  galleryType?: 'all' | 'my' | 'favorites';
  onAlbumClick?: (albumId: string) => void;
  selectedAlbum?: string | null;
}

export const Gallery = ({ event, images, favoriteImages, onToggleFavorite, galleryType, onAlbumClick, selectedAlbum }: GalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [columns, setColumns] = useState(4);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [localSelectedAlbum, setLocalSelectedAlbum] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [displayedImagesCount, setDisplayedImagesCount] = useState(30);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  // Reset displayed images count when images change
  useEffect(() => {
    setDisplayedImagesCount(30);
  }, [images]);

  // Infinite scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && displayedImagesCount < images.length) {
          setIsLoadingMore(true);
          // Simulate loading delay
          setTimeout(() => {
            setDisplayedImagesCount(prev => Math.min(prev + 30, images.length));
            setIsLoadingMore(false);
          }, 1500);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [displayedImagesCount, images.length, isLoadingMore]);

  // Responsive columns based on screen size
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumns(2);
      } else if (width < 768) {
        setColumns(3);
      } else if (width < 1024) {
        setColumns(4);
      } else {
        setColumns(5);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const handleImageClick = (image: GalleryImage, index: number) => {
    if (isSelectionMode) {
      handleImageSelection(image.id);
    } else {
      setSelectedImageIndex(index);
      setIsLightboxOpen(true);
    }
  };

  const handleImageSelection = (imageId: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImageIndex(null);
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleDownloadAll = () => {
    setShowDownloadModal(true);
  };

  const handleDownloadSelected = async () => {
    if (selectedImages.size === 0) {
      toast({
        title: t('toast.noSelection.title'),
        description: t('toast.noSelection.description'),
        variant: "destructive",
      });
      return;
    }

    const selectedImagesArray = images.filter(img => selectedImages.has(img.id));
    
    toast({
      title: "מתחיל הורדה...",
      description: `מוריד ${selectedImages.size} תמונות`,
    });

    const success = await downloadMultipleImages(
      selectedImagesArray.map(img => ({ src: img.src, id: img.id }))
    );

    if (success) {
      toast({
        title: "הורדה הושלמה!",
        description: `${selectedImages.size} תמונות הורדו בהצלחה`,
      });
    } else {
      toast({
        title: "שגיאה חלקית",
        description: "חלק מהתמונות לא הורדו, נסו שוב",
        variant: "destructive"
      });
    }
  };

  const handleToggleSelection = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedImages(new Set());
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t('hero.title'),
        text: t('hero.subtitle'),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: t('toast.linkCopied.title'),
        description: t('toast.linkCopied.description'),
      });
    }
  };

  const handleAlbumClick = (albumId: string) => {
    if (onAlbumClick) {
      onAlbumClick(albumId);
    } else if (albumId === 'favorites') {
      // Fallback handling
      toast({
        title: "אלבום נבחר",
        description: "הצגת התמונות הנבחרות שלכם",
      });
    } else {
      setLocalSelectedAlbum(albumId);
      toast({
        title: "אלבום נבחר",
        description: `נבחר אלבום: ${albumId}`,
      });
    }
  };

  // Get displayed images based on pagination
  const displayedImages = images.slice(0, displayedImagesCount);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <GalleryHeader
        event={event}
        totalImages={images.length}
        columns={columns}
        onColumnsChange={setColumns}
        onDownloadAll={handleDownloadAll}
        onDownloadSelected={handleDownloadSelected}
        onToggleSelection={handleToggleSelection}
        onShare={handleShare}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedImages.size}
      />

      {/* Albums Section */}
      <AlbumSection 
        albums={[
          { 
            id: 'favorites', 
            name: '❤️ נבחרות', 
            imageCount: favoriteImages.size,
            thumbnail: Array.from(favoriteImages)[0] ? images.find(img => img.id === Array.from(favoriteImages)[0])?.src : 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=300&h=300&fit=crop'
          }
        ]}
        onAlbumClick={handleAlbumClick}
        selectedAlbum={selectedAlbum}
        allImages={images}
      />

      {/* Gallery Grid */}
      <div className=" w-full px-2 py-8">
        <MasonryGrid
          images={displayedImages}
          onImageClick={handleImageClick}
          columns={columns}
          isSelectionMode={isSelectionMode}
          selectedImages={selectedImages}
          onImageSelection={handleImageSelection}
          favoriteImages={favoriteImages}
          onToggleFavorite={onToggleFavorite}
        />
        
        {/* Load More Trigger & Loader */}
        {displayedImagesCount < images.length && (
          <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
            {isLoadingMore ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
                <div className="text-center text-muted-foreground">
                  טוען עוד תמונות...
                </div>
              </div>
            ) : (
              <div className="h-4" />
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {!isSelectionMode && (
        <LightboxModal
          isOpen={isLightboxOpen}
          images={images}
          currentIndex={selectedImageIndex || 0}
          onClose={handleCloseLightbox}
          onNext={handleNextImage}
          onPrevious={handlePreviousImage}
          isFavorite={selectedImageIndex !== null ? favoriteImages.has(images[selectedImageIndex]?.id) : false}
          onToggleFavorite={selectedImageIndex !== null ? () => onToggleFavorite(images[selectedImageIndex].id) : undefined}
        />
      )}

      {/* Download Modal */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        imageCount={images.length}
        images={images}
        autoDownload={false}
      />
    </div>
  );
};
