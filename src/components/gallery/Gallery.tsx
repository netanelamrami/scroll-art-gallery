
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
import { downloadImage, downloadMultipleImages } from "@/utils/downloadUtils";
import { shareImage } from "@/utils/shareUtils";
import { ShareOptionsModal } from "./ShareOptionsModal";
import { EmptyPhotosState } from "./EmptyPhotosState";
import { useAlbums } from "@/hooks/useAlbums";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, Heart, Link, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { isIOS } from "@/utils/deviceUtils";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogHeader } from "../ui/dialog";
import { Button } from "react-day-picker";

import QRCode from 'qrcode';
import { BackToTopButton } from "../ui/back-to-top";



interface GalleryProps {
  event: event; 
  images: GalleryImage[];
  favoriteImages: Set<string>;
  onToggleFavorite: (imageId: string) => void;
  galleryType?: 'all' | 'my';
  onAlbumClick?: (albumId: string) => void;
  selectedAlbum?: string | null;
  selectionMode?: boolean;
  lightboxState?: {isOpen: boolean, currentIndex: number} | null;
  onLightboxStateChange?: (state: {isOpen: boolean, currentIndex: number} | null) => void;
  selectedImages?: Set<string>;
  onImageSelect?: (imageId: string) => void;
  columns?: number;
  onAuthComplete?: (userData: { contact: string; otp: string; selfieData: string; notifications: boolean }) => void;
  onViewMyPhotos: () => void;
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
  onAuthComplete,
  onViewMyPhotos,
  lightboxState,
  onLightboxStateChange
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
 const [qrCode, setQrCode] = useState<string>('');
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [shareModalImage, setShareModalImage] = useState<{url: string, name: string} | null>(null);
  const [dropdownImage, setDropdownImage] = useState<{ id: string; position: { x: number; y: number } } | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { t, language } = useLanguage();
    const navigate = useNavigate();
  
  // Use albums hook
  const { albums, getImagesByAlbum, firstAlbum } = useAlbums(event.id.toString(), images);

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

  // Handle external lightbox state
  useEffect(() => {
    console.log(lightboxState)
    if (lightboxState?.isOpen && lightboxState?.currentIndex !== undefined) {
      console.log(lightboxState)
      setSelectedImageIndex(lightboxState.currentIndex);
      setIsLightboxOpen(true);
      onLightboxStateChange?.(null); // Clear the external state after applying
    }
  }, [lightboxState, onLightboxStateChange]);



  // Reset displayed images count when images or selected album changes
  useEffect(() => {
    setDisplayedImagesCount(30);
  }, [images, selectedAlbum]);

  useEffect(() => {
    if (firstAlbum != null && albums.length > 0 && !selectedAlbum && onAlbumClick) {
      onAlbumClick(firstAlbum);
    }
  }, [firstAlbum, albums, selectedAlbum, onAlbumClick]);

    useEffect(() => {
    if (firstAlbum != null) {
      onAlbumClick(firstAlbum);
    }
  }, [firstAlbum]);
  // Reset displayed images count when images change

  // Infinite scroll effect - updated to use filtered images and auto-switch albums
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
        
        console.log('IntersectionObserver triggered:', {
          isIntersecting: entries[0].isIntersecting,
          isLoadingMore,
          displayedImagesCount,
          currentImagesLength: currentImages.length,
          selectedAlbum,
          albumsCount: albums.length
        });
        
        if (entries[0].isIntersecting && !isLoadingMore) {
          // אם יש עוד תמונות באלבום הנוכחי
          if (displayedImagesCount < currentImages.length) {
            console.log('Loading more images in current album');
            setIsLoadingMore(true);
            setTimeout(() => {
              setDisplayedImagesCount(prev => Math.min(prev + 30, currentImages.length));
              setIsLoadingMore(false);
            }, 1000);
          } 
          // אם הגענו לסוף האלבום, עבור לאלבום הבא
          else if (selectedAlbum && selectedAlbum !== 'favorites' && albums.length > 0) {
            const currentAlbumIndex = albums.findIndex(album => album.id === selectedAlbum);
            const nextAlbumIndex = currentAlbumIndex + 1;
            
            console.log('End of album reached:', {
              currentAlbumIndex,
              nextAlbumIndex,
              totalAlbums: albums.length,
              nextAlbum: albums[nextAlbumIndex]
            });
            
            // אם יש אלבום הבא ויש בו תמונות
            if (nextAlbumIndex < albums.length && albums[nextAlbumIndex].imageCount > 0) {
              console.log('Switching to next album:', albums[nextAlbumIndex].id);
              setIsLoadingMore(true);
              setTimeout(() => {
                onAlbumClick?.(albums[nextAlbumIndex].id);
                setDisplayedImagesCount(30); // התחל עם 30 תמונות ראשונות מהאלבום הבא
                setIsLoadingMore(false);
              }, 500);
            } else {
              console.log('No next album available or next album is empty');
            }
          }
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [displayedImagesCount, images, selectedAlbum, favoriteImages, getImagesByAlbum, isLoadingMore, albums, onAlbumClick]);

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
    onLightboxStateChange?.(null);
  };

  
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
      selectedImagesArray.map(img => ({ src: img.largeSrc, id: img.id })), event.name
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

  const handleImageDropdown = (imageId: string, position: { x: number; y: number }) => {
    setDropdownImage({ id: imageId, position });
      document.body.style.overflow = "hidden";

  };

  const handleDropdownClose = () => {
    setDropdownImage(null);
    document.body.style.overflow = "auto"; 
  };

  const  handleImageDownload = async() => {
    if (!dropdownImage) return;
    
    const image = images.find(img => img.id === dropdownImage.id);
    if (!image) return;
    
    if (isIOS()) {
      // Get current scroll position and event link from URL
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      const currentPath = window.location.pathname;
      const eventLink = currentPath.startsWith('/') ? currentPath.slice(1) : currentPath;
          
          const params = new URLSearchParams({
            url: image.largeSrc,
            name: `${image.id}`,
            returnState: encodeURIComponent(JSON.stringify({ fromLightbox: false })),
            scrollPosition: scrollPosition.toString(),
            eventLink: eventLink || '',
            galleryType: galleryType || localGalleryType,
            
          });
          navigate(`/image-save?${params.toString()}`);
          return;
        }



      toast({
        title: t('downloadModal.downloadStarted'),
        description: t('downloadModal.downloadStarted'),
      });
      handleDropdownClose();
     const success = await downloadImage(image.largeSrc || image.src, image.id)
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

  // const handleImageCopyLink = () => {
  //   if (!dropdownImage) return;
    
  //   const image = images.find(img => img.id === dropdownImage.id);
  //   if (!image) return;
    
  //   navigator.clipboard.writeText(image.src);
  //   toast({
  //     title: t('toast.linkCopied.title'),
  //     description: t('toast.linkCopied.description'),
  //   });
    
  //   handleDropdownClose();
  // };

  const handleToggleImageFavorites = () => {
      onToggleFavorite(dropdownImage?.id );
      handleDropdownClose();
  };

  const handleImageShare = async () => {
    if (!dropdownImage) return;
    
    const image = images.find(img => img.id === dropdownImage.id);
    if (!image) return;

    handleDropdownClose();
    
    const result = await shareImage(image.largeSrc || image.src, image.id);
    
    if (result.success && result.method === 'native') {
      // toast({
      //   title: 'שיתוף הושלם',
      //   description: 'התמונה שותפה בהצלחה',
      // });
    } else if (result.success && result.method === 'options') {
      setShareModalImage({
        url: image.largeSrc || image.src,
        name: image.id
      });
    } else {
      toast({
        title: 'שגיאה',
        description: 'שגיאה בשיתוף התמונה',
        variant: "destructive"
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
        onViewMyPhotos={onViewMyPhotos}
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
        onToggleSelectionMode={() => window.dispatchEvent(new CustomEvent('toggleSelectionMode'))}
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
            event={event}
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
              onImageDropdownClick={handleImageDropdown}
              onShare={async (imageId) => {
                const image = images.find(img => img.id === imageId);
                if (!image) return;
                
                const result = await shareImage(image.largeSrc || image.src, image.id);
                
                if (result.success && result.method === 'native') {
                  // toast({
                  //   title: 'שיתוף הושלם',
                  //   description: 'התמונה שותפה בהצלחה',
                  // });
                } else if (result.success && result.method === 'options') {
                  setShareModalImage({
                    url: image.largeSrc || image.src,
                    name: image.id
                  });
                } else {
                  toast({
                    title: 'שגיאה',
                    description: 'שיתוף בוטל',
                    variant: "destructive"
                  });
                }
              }}
            />
            
            {/* Load More Trigger & Loader */}
            <div ref={loadMoreRef} className="w-full py-4 flex justify-center">
              {isLoadingMore ? (
                <div className="flex items-center justify-center">
                <div className={`flex  flex-col  items-center gap-3 `}>
                  <span className="text-muted-foreground text-sm ">
                    {/* animate-pulse */}
                    {/* {t('auth.loading')} */}
                    Powered by Pixshare AI
                    </span>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-black"></div>
                  </div>

                </div>
              ) : displayedImagesCount < filteredImages.length ? (
                <div className="h-4" />
              ) : null}
            </div>
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
          galleryType={galleryType}
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
        event={event}
      />

      <BackToTopButton/>
     {/* Global Image Dropdown */}

      {dropdownImage && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={handleDropdownClose}
          />
          <div
            className="fixed z-50 w-48 bg-popover border shadow-lg rounded-md"
            style={{
              left: `${Math.min(dropdownImage.position.x, window.innerWidth - 200)}px`,
              top: `${Math.min(dropdownImage.position.y, window.innerHeight - 100)}px`,
            }}
            dir={language === 'he' ? 'rtl' : 'ltr'}
          >
            <div className="py-1">
              <button
                onClick={handleImageDownload}
                className={cn(
                  "w-full px-4 py-2 text-sm hover:bg-accent cursor-pointer flex items-center",
                  language === 'he' ? 'text-right' : 'text-left'
                )}
              >
                <Download className={cn(
                  "h-4 w-4",
                  language === 'he' ? 'ml-2' : 'mr-2'
                )} />
                
                {t('gallery.downloadImage')}
              </button>
              <button
                onClick={handleImageShare}
                className={cn(
                  "w-full px-4 py-2 text-sm hover:bg-accent cursor-pointer flex items-center",
                  language === 'he' ? 'text-right' : 'text-left'
                )}
              >
                <Share2 className={cn(
                  "h-4 w-4",
                  language === 'he' ? 'ml-2' : 'mr-2'
                )} />
                {language === 'he' ?'שתף תמונה' :'Share photo'}
              </button>
              <button
                onClick={handleToggleImageFavorites}
                className={cn(
                  "w-full px-4 py-2 text-sm hover:bg-accent cursor-pointer flex items-center",
                  language === 'he' ? 'text-right' : 'text-left'
                )}
              >
                <Heart className={cn(
                  "h-4 w-4",
                  language === 'he' ? 'ml-2' : 'mr-2'
                )} />
                {t('gallery.addToFavorites')}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Share Options Modal */}
      {shareModalImage && (
        <ShareOptionsModal
          isOpen={!!shareModalImage}
          onClose={() => setShareModalImage(null)}
          imageUrl={shareModalImage.url}
          imageName={shareModalImage.name}
        />
      )}
    </div>
  );
};
