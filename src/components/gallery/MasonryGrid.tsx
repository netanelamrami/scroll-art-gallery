import React from "react";
import { GalleryImage } from "@/types/gallery";
import { MasonryColumn } from "./MasonryColumn";

interface MasonryGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage, index: number) => void;
  columns: number;
  isSelectionMode?: boolean;
  selectedImages?: Set<string>;
  onImageSelection?: (imageId: string) => void;
  favoriteImages?: Set<string>;
  onToggleFavorite?: (imageId: string) => void;
  onImageDropdownClick?: (imageId: string, position: { x: number; y: number }) => void;
}

export const MasonryGrid = ({
  images,
  onImageClick,
  columns,
  isSelectionMode = false,
  selectedImages = new Set(),
  onImageSelection,
  favoriteImages = new Set(),
  onToggleFavorite,
  onImageDropdownClick
}: MasonryGridProps) => {
  // אלגוריתם מאוזן משופר - מחשב גובה אמיתי ומאזן טוב יותר
  const distributeImagesBalanced = (images: GalleryImage[], numColumns: number) => {
    const columnArrays = Array.from({ length: numColumns }, () => [] as GalleryImage[]);
    const columnHeights = Array.from({ length: numColumns }, () => 0);
    // console.log('Distributing images into columns:', images, 'images across', numColumns, 'columns');
    images.forEach((image) => {
      // חישוב גובה אמיתי של התמונה בהתבסס על רוחב קבוע
      const baseWidth = 300; // רוחב קבוע לכל התמונות
      let actualHeight = 300; // ברירת מחדל ריבועית
      
      if (image.width && image.height && image.width > 0) {
        // חישוב גובה לפי יחס האספקט האמיתי
        const aspectRatio = image.height / image.width;
        actualHeight = Math.round(baseWidth * aspectRatio);
        
        // הגבלת גובה מינימלי ומקסימלי
        actualHeight = Math.max(200, Math.min(600, actualHeight));
      }
      
      // מציאת העמודה הקצרה ביותר
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      // הוספת התמונה לעמודה הקצרה בותר
      columnArrays[shortestColumnIndex].push(image);
      columnHeights[shortestColumnIndex] += actualHeight + 8; // +8 עבור מרווח בין תמונות
    });

    return columnArrays;
  };

  const columnArrays = distributeImagesBalanced(images, columns);

  return (
    <div
      className="grid gap-0.5"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {columnArrays.map((columnImages, columnIndex) => (
        <MasonryColumn
          key={columnIndex}
          images={columnImages}
          onImageClick={onImageClick}
          allImages={images}
          isSelectionMode={isSelectionMode}
          selectedImages={selectedImages}
          onImageSelection={onImageSelection}
          favoriteImages={favoriteImages}
          onToggleFavorite={onToggleFavorite}
          onImageDropdownClick={onImageDropdownClick}
        />
      ))}
    </div>
  );
};