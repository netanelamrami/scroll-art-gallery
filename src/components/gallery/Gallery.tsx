
import { useState, useEffect, useRef } from "react";
import { GalleryImage } from "@/types/gallery";
import { MasonryGrid } from "./MasonryGrid";
import { LightboxModal } from "./LightboxModal";
import { GalleryHeader } from "./GalleryHeader";
import { AlbumSection } from "./AlbumSection";
import { DownloadModal } from "./DownloadModal";
import { BottomActionBar } from "./BottomActionBar";
import { FloatingNavbar } from "./FloatingNavbar";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { event } from "@/types/event";
import { downloadMultipleImages } from "@/utils/downloadUtils";
import { EmptyPhotosState } from "./EmptyPhotosState";
import { useAlbums } from "@/hooks/useAlbums";


interface GalleryProps {
  event: event; 
  images: GalleryImage[];
  favoriteImages: Set<string>;
  onToggleFavorite: (imageId: string) => void;
  galleryType?: 'all' | 'my';
  onAlbumClick?: (albumId: string) => void;
  selectedAlbum?: string | null;
  selectionMode?: boolean;
  selectedImages?: Set<string>;
  onImageSelect?: (imageId: string) => void;
  columns?: number;
  onAuthComplete?: (userData: { contact: string; otp: string; selfieData: string; notifications: boolean }) => void;
}

export const Gallery = ({ 
  event, 
  images, 
  favoriteImages, 
  onToggleFavorite, 
  galleryType, 
  onAlbumClick, 
  selectedAlbum,
  selectionMode,
  selectedImages: externalSelectedImages,
  onImageSelect,
  columns: externalColumns,
  onAuthComplete
}: GalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [columns, setColumns] = useState(externalColumns || 4);
  const [isSelectionMode, setIsSelectionMode] = useState(selectionMode || false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(externalSelectedImages || new Set());
  // const [localSelectedAlbum, setLocalSelectedAlbum] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [displayedImagesCount, setDisplayedImagesCount] = useState(30);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [localGalleryType, setLocalGalleryType] = useState(galleryType || 'all');
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  // Use albums hook
  const { albums, getImagesByAlbum } = useAlbums(event.id.toString(), images);

  // Sync external props with internal state
  useEffect(() => {
    if (externalColumns !== undefined) {
      setColumns(externalColumns);
    }
  }, [externalColumns]);

  useEffect(() => {
    if (selectionMode !== undefined) {
      setIsSelectionMode(selectionMode);
    }
  }, [selectionMode]);

  useEffect(() => {
    if (externalSelectedImages !== undefined) {
      setSelectedImages(externalSelectedImages);
    }
  }, [externalSelectedImages]);

  // Set first album as default when albums are loaded
  useEffect(() => {
    if (albums.length > 0 && !selectedAlbum && onAlbumClick) {
      onAlbumClick(albums[0].id);
    }
  }, [albums, selectedAlbum, onAlbumClick]);

  // Reset displayed images count when images change
  useEffect(() => {
    setDisplayedImagesCount(30);
  }, [images]);

  // Infinite scroll effect - updated to use filtered images
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let currentImages = images;
        if (selectedAlbum) {
          if (selectedAlbum === 'favorites') {
            currentImages = images.filter(img => favoriteImages.has(img.id));
          } else {
            currentImages = getImagesByAlbum(selectedAlbum);
          }
        }
        
        if (entries[0].isIntersecting && !isLoadingMore && displayedImagesCount < currentImages.length) {
          setIsLoadingMore(true);
          // Simulate loading delay
          setDisplayedImagesCount(prev => Math.min(prev + 30, currentImages.length));
          setIsLoadingMore(false);
          // setTimeout(() => {
          // }, 1500);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [displayedImagesCount, images, selectedAlbum, favoriteImages, getImagesByAlbum, isLoadingMore]);

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
    console.log(imageId)
    if (onImageSelect) {
      onImageSelect(imageId);
    } else {
      const newSelection = new Set(selectedImages);
      if (newSelection.has(imageId)) {
        newSelection.delete(imageId);
      } else {
        newSelection.add(imageId);
      }
      setSelectedImages(newSelection);
    }
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImageIndex(null);
  };

  // Get filtered images based on selected album
  const getFilteredImages = () => {
    if (selectedAlbum) {
      if (selectedAlbum === 'favorites') {
        return images.filter(img => favoriteImages.has(img.id));
      } else {
        return getImagesByAlbum(selectedAlbum);
      }
    }
    return images;
  };

  const filteredImages = getFilteredImages();

  const handleNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < filteredImages.length - 1) {
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
      handleCancelSelection();
    const selectedImagesArray = filteredImages.filter(img => selectedImages.has(img.id));
    
    toast({
      title: t('toast.downloadStarting.title'),
      description: t('toast.downloadStarting.description').replace('{count}', selectedImages.size.toString()),
    });

    const success = await downloadMultipleImages(
      selectedImagesArray.map(img => ({ src: img.largeSrc, id: img.id }))
    );

    if (success) {
      toast({
        title: t('toast.downloadComplete.title'),
        description: t('toast.downloadComplete.description').replace('{count}', selectedImages.size.toString()),
      });
    } else {
      toast({
        title: t('downloadModal.partialError'),
        description: t('downloadModal.partialErrorDesc'),
        variant: "destructive"
      });
    }

  };

  const handleToggleFavorites = () => {
    Array.from(selectedImages).forEach(imageId => {
      onToggleFavorite(imageId);
    });
    handleCancelSelection();
  };

  const handleCancelSelection = () => {
    setSelectedImages(new Set());
    setIsSelectionMode(false);
    
    // If we have external callback for selection mode, use it
    if (onImageSelect) {
      // This means we're controlled by parent, notify parent to exit selection mode
      // We can trigger this by calling the toggle function
      if (selectionMode !== undefined) {
        // Parent is controlling the selection mode
        window.dispatchEvent(new CustomEvent('exitSelectionMode'));
      }
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
        title: t('toast.error.title'),
        description: t('common.favorites'),
      });
    } else {
      //setLocalSelectedAlbum(albumId);
      toast({
        title: t('toast.error.title'),
        description: `${t('common.selected')}: ${albumId}`,
      });
    }
  };

  const displayedImages = filteredImages.slice(0, displayedImagesCount);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <GalleryHeader
        event={event}
        totalImages={filteredImages.length}
        columns={columns}
        onColumnsChange={setColumns}
        onDownloadAll={handleDownloadAll}
        onDownloadSelected={handleDownloadSelected}
        onToggleSelection={handleCancelSelection}
        onShare={handleShare}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedImages.size}
        onAuthComplete={onAuthComplete}
      />
    
      {!isSelectionMode && (
      <FloatingNavbar
        event={event}
        galleryType={galleryType || localGalleryType}
        onToggleGalleryType={() => {
          if (localGalleryType === 'all') {
            setLocalGalleryType('my');
            window.dispatchEvent(new CustomEvent('switchToMyPhotos', { detail: { type: localGalleryType } }));
          } else {
            setLocalGalleryType('all');
            window.dispatchEvent(new CustomEvent('switchToAllPhotos', { detail: { type: localGalleryType } }));
          }
        }}
        onDownloadAll={handleDownloadAll}
        onToggleSelectionMode={handleToggleSelection}
        imageCount={images.length}
      />
      )}
      {/* Albums Section - Only show albums that have images for this user */}
      {images.length > 0 && (() => {
        // Filter albums to only show those that have images
        const albumsWithImages = albums.filter(album => {
          const albumImages = getImagesByAlbum(album.id);
          return albumImages.length > 0;
        });

        const visibleAlbums = [
          // Only show favorites if there are favorite images
          ...(favoriteImages.size > 0 ? [{
            id: 'favorites', 
            name: '❤️ נבחרות', 
            imageCount: favoriteImages.size,
            thumbnail: Array.from(favoriteImages)[0] ? images.find(img => img.id === Array.from(favoriteImages)[0])?.src : undefined
          }] : []),
          ...albumsWithImages
        ];

        // Only render AlbumSection if there are visible albums
        return visibleAlbums.length > 0 ? (
          <AlbumSection 
            albums={visibleAlbums}
            onAlbumClick={handleAlbumClick}
            selectedAlbum={selectedAlbum}
            allImages={images}
            getImagesByAlbum={getImagesByAlbum}
          />
        ) : null;
      })()}

      {/* Gallery Grid */}
      <div className="w-full px-0 py-4 relative">
        {images.length === 0 ? (
          <EmptyPhotosState type={galleryType === 'all' ? 'allPhotos' : 'myPhotos'} />
        ) : (
          <>
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
            {displayedImagesCount < filteredImages.length && (
              <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
                {isLoadingMore ? (
                  <div className="flex items-center justify-center">
                  <div className={`flex  flex-col  items-center gap-3 `}>
                    <span className="text-muted-foreground text-sm ">
                      {/* animate-pulse */}
                      {/* {t('auth.loading')} */}
                      Powered by Pixshare AI
                      </span>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-black"></div>
                    </div>

                  </div>
                ) : (
                  <div className="h-4" />
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {!isSelectionMode && (
        <LightboxModal
          isOpen={isLightboxOpen}
          images={filteredImages}
          currentIndex={selectedImageIndex || 0}
          onClose={handleCloseLightbox}
          onNext={handleNextImage}
          onPrevious={handlePreviousImage}
          isFavorite={selectedImageIndex !== null ? favoriteImages.has(filteredImages[selectedImageIndex]?.id) : false}
          onToggleFavorite={selectedImageIndex !== null ? () => onToggleFavorite(filteredImages[selectedImageIndex].id) : undefined}
        />
      )}

      
      {/* Bottom Action Bar for Selection Mode */}
      {isSelectionMode && (
        <BottomActionBar
          selectedCount={selectedImages.size}
          onDownloadSelected={handleDownloadSelected}
          onToggleFavorites={handleToggleFavorites}
          onCancel={handleCancelSelection}
        />
      )}

      {/* Download Modal */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        imageCount={images.length}
        images={images}
        autoDownload={false}
        eventId={event.id}
      />
    </div>
  );
};
