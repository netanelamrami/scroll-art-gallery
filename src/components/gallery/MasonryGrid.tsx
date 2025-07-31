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
  // אלגוריתם מאוזן מתקדם לחלוקת תמונות בין עמודות
  const distributeImagesBalanced = (images: GalleryImage[], numColumns: number) => {
    const columnArrays = Array.from({ length: numColumns }, () => [] as GalleryImage[]);
    const columnHeights = Array.from({ length: numColumns }, () => 0);
    const baseWidth = 300; // רוחב בסיס לחישוב

    // שלב 1: חלוקה ראשונית לפי גובה מחושב
    images.forEach((image) => {
      // חישוב גובה אמיתי של התמונה ביחס לרוחב הקולונה
      let actualHeight = 300; // גובה ברירת מחדל
      
      if (image.width && image.height) {
        const aspectRatio = image.height / image.width;
        actualHeight = baseWidth * aspectRatio;
      } else if (image.height) {
        actualHeight = image.height;
      }
      
      // מציאת העמודה עם הגובה הנמוך ביותר
      const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      // הוספת התמונה לעמודה
      columnArrays[minHeightIndex].push(image);
      columnHeights[minHeightIndex] += actualHeight + 8; // +8 עבור gap
    });

    // שלב 2: איזון נוסף - העברת תמונות אחרונות אם יש פער גדול
    const maxHeight = Math.max(...columnHeights);
    const avgHeight = columnHeights.reduce((sum, h) => sum + h, 0) / numColumns;
    
    columnHeights.forEach((height, columnIndex) => {
      const heightDifference = maxHeight - height;
      
      // אם הפער גדול מ-20% מהגובה הממוצע, ננסה לאזן
      if (heightDifference > avgHeight * 0.2) {
        // מצא עמודה גבוהה עם תמונות שאפשר להעביר
        const tallestColumnIndex = columnHeights.indexOf(maxHeight);
        const tallestColumn = columnArrays[tallestColumnIndex];
        
        // העבר תמונה אחרונה אם יש יותר מתמונה אחת
        if (tallestColumn.length > 1) {
          const imageToMove = tallestColumn.pop();
          if (imageToMove) {
            columnArrays[columnIndex].push(imageToMove);
            
            // עדכן גבהים
            let movedImageHeight = 300;
            if (imageToMove.width && imageToMove.height) {
              const aspectRatio = imageToMove.height / imageToMove.width;
              movedImageHeight = baseWidth * aspectRatio;
            }
            
            columnHeights[tallestColumnIndex] -= (movedImageHeight + 8);
            columnHeights[columnIndex] += (movedImageHeight + 8);
          }
        }
      }
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