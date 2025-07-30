import { useState, useEffect } from "react";
import { GalleryImage } from "@/types/gallery";
import { MasonryGrid } from "./MasonryGrid";
import { LightboxModal } from "./LightboxModal";
import { Button } from "@/components/ui/button";
import { Grid, LayoutGrid, Grid3x3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryProps {
  images: GalleryImage[];
}

export const Gallery = ({ images }: GalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [columns, setColumns] = useState(4);

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
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
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

  const columnOptions = [
    { value: 2, icon: Grid, label: "2 עמודות" },
    { value: 3, icon: LayoutGrid, label: "3 עמודות" },
    { value: 4, icon: Grid3x3, label: "4 עמודות" },
  ];

  return (
    <div className="min-h-screen bg-gallery-bg">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gallery-bg/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                גלריית תמונות
              </h1>
              <p className="text-muted-foreground mt-1">
                {images.length.toLocaleString()} תמונות
              </p>
            </div>
            
            {/* Column selector for desktop */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-3">עמודות:</span>
              {columnOptions.map(({ value, icon: Icon, label }) => (
                <Button
                  key={value}
                  variant={columns === value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setColumns(value)}
                  className={cn(
                    "gap-2",
                    columns === value && "bg-gradient-primary"
                  )}
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{value}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-8">
        <MasonryGrid
          images={images}
          onImageClick={handleImageClick}
          columns={columns}
        />
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={isLightboxOpen}
        images={images}
        currentIndex={selectedImageIndex || 0}
        onClose={handleCloseLightbox}
        onNext={handleNextImage}
        onPrevious={handlePreviousImage}
      />
    </div>
  );
};