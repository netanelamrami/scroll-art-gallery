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
}

export const MasonryGrid = ({
  images,
  onImageClick,
  columns,
  isSelectionMode = false,
  selectedImages = new Set(),
  onImageSelection,
  favoriteImages = new Set(),
  onToggleFavorite
}: MasonryGridProps) => {
  // אלגוריתם מאוזן פשוט - לוקח בחשבון גובה אמיתי של תמונות
  const distributeImagesBalanced = (images: GalleryImage[], numColumns: number) => {
    const columnArrays = Array.from({ length: numColumns }, () => [] as GalleryImage[]);
    const columnHeights = Array.from({ length: numColumns }, () => 0);

    images.forEach((image) => {
      // חישוב גובה אמיתי של התמונה
      const baseWidth = 300; // רוחב בסיס
      let actualHeight = 400; // ברירת מחדל לתמונה ריבועית
      
      if (image.width && image.height) {
        // חישוב גובה לפי יחס גובה-רוחב
        const aspectRatio = image.height / image.width;
        actualHeight = baseWidth * aspectRatio;
      }
      
      // מוצא את העמודה עם הגובה הנמוך ביותר
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      // מוסיף את התמונה לעמודה הקצרה ביותר
      columnArrays[shortestColumnIndex].push(image);
      columnHeights[shortestColumnIndex] += actualHeight + 8; // +8 עבור מרווח
    });

    return columnArrays;
  };

  const columnArrays = distributeImagesBalanced(images, columns);

  return (
    <div
      className="grid gap-1"
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
        />
      ))}
    </div>
  );
};