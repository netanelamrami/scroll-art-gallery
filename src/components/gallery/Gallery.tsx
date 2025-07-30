
import { useState, useEffect } from "react";
import { GalleryImage } from "@/types/gallery";
import { MasonryGrid } from "./MasonryGrid";
import { LightboxModal } from "./LightboxModal";
import { GalleryHeader } from "./GalleryHeader";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { event } from "@/types/event";

interface GalleryProps {
  event: event; 
  images: GalleryImage[];
}

export const Gallery = ({ event, images }: GalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [columns, setColumns] = useState(4);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { t } = useLanguage();
  // Responsive columns based on screen size
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumns(1);
      } else if (width < 768) {
        setColumns(2);
      } else if (width < 1024) {
        setColumns(3);
      } else {
        setColumns(4);
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
    toast({
      title: t('toast.downloadAll.title'),
      description: t('toast.downloadAll.description'),
    });
  };

  const handleDownloadSelected = () => {
    if (selectedImages.size === 0) {
      toast({
        title: t('toast.noSelection.title'),
        description: t('toast.noSelection.description'),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t('toast.downloadSelected.title'),
      description: t('toast.downloadSelected.description').replace('{count}', selectedImages.size.toString()),
    });

    // Here you would implement the actual download logic
    // For now, we'll just show a success message
    setTimeout(() => {
      toast({
        title: t('toast.downloadComplete.title'),
        description: t('toast.downloadComplete.description').replace('{count}', selectedImages.size.toString()),
      });
    }, 2000);
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

      {/* Gallery Grid */}
      <div className=" w-full px-2 py-8">
        <MasonryGrid
          images={images}
          onImageClick={handleImageClick}
          columns={columns}
          isSelectionMode={isSelectionMode}
          selectedImages={selectedImages}
          onImageSelection={handleImageSelection}
        />
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
        />
      )}
    </div>
  );
};
