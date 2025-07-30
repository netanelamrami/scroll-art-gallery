import { useState, useEffect, useRef, useCallback } from "react";
import { GalleryImage } from "@/types/gallery";
import { MasonryColumn } from "./MasonryColumn";

interface MasonryGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage, index: number) => void;
  columns?: number;
}

export const MasonryGrid = ({ images, onImageClick, columns = 4 }: MasonryGridProps) => {
  const [visibleImages, setVisibleImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const IMAGES_PER_LOAD = 50;

  const loadMoreImages = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const currentLength = visibleImages.length;
      const nextImages = images.slice(currentLength, currentLength + IMAGES_PER_LOAD);
      
      if (nextImages.length === 0) {
        setHasMore(false);
      } else {
        setVisibleImages(prev => [...prev, ...nextImages]);
      }
      
      setLoading(false);
    }, 100);
  }, [images, visibleImages.length, loading, hasMore]);

  useEffect(() => {
    // Initial load
    const initialImages = images.slice(0, IMAGES_PER_LOAD);
    setVisibleImages(initialImages);
  }, [images]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreImages();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [loadMoreImages]);

  // Distribute images across columns
  const distributeImages = (images: GalleryImage[]) => {
    const columnArrays: GalleryImage[][] = Array.from({ length: columns }, () => []);
    const columnHeights = new Array(columns).fill(0);

    images.forEach((image) => {
      // Find the column with the least height
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      columnArrays[shortestColumnIndex].push(image);
      columnHeights[shortestColumnIndex] += image.height;
    });

    return columnArrays;
  };

  const imageColumns = distributeImages(visibleImages);

  return (
    <div className="w-full">
      <div 
        className="grid gap-4"
        style={{ 
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {imageColumns.map((columnImages, columnIndex) => (
          <MasonryColumn
            key={columnIndex}
            images={columnImages}
            onImageClick={(image) => {
              const globalIndex = visibleImages.findIndex(img => img.id === image.id);
              onImageClick(image, globalIndex);
            }}
          />
        ))}
      </div>
      
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
              <span>טוען תמונות...</span>
            </div>
          )}
        </div>
      )}
      
      {!hasMore && visibleImages.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          כל התמונות נטענו
        </div>
      )}
    </div>
  );
};