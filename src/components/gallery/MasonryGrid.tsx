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
  // אלגוריתם מאוזן מוחלט - מבטיח איזון מקסימלי של גבהי עמודות
  const distributeImagesBalanced = (images: GalleryImage[], numColumns: number) => {
    // שלב 1: קביעת גובה אמיתי לכל תמונה
    const imagesWithCalculatedHeight = images.map(image => {
      const baseWidth = 300;
      let calculatedHeight = 300;
      
      if (image.width && image.height) {
        const aspectRatio = image.height / image.width;
        calculatedHeight = Math.round(baseWidth * aspectRatio);
      } else if (image.height) {
        calculatedHeight = image.height;
      }
      
      return {
        ...image,
        calculatedHeight: calculatedHeight + 8 // כולל gap
      };
    });

    // שלב 2: מיון תמונות מהגבוהה לנמוכה
    const sortedImages = [...imagesWithCalculatedHeight].sort((a, b) => 
      b.calculatedHeight - a.calculatedHeight
    );

    // שלב 3: אלגוריתם Bin Packing - תמיד נוסף לעמודה הנמוכה ביותר
    const columnArrays = Array.from({ length: numColumns }, () => [] as typeof sortedImages);
    const columnHeights = Array.from({ length: numColumns }, () => 0);

    sortedImages.forEach(image => {
      // מצא את העמודה עם הגובה הנמוך ביותר
      const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      // הוסף תמונה לעמודה הנמוכה ביותר
      columnArrays[minHeightIndex].push(image);
      columnHeights[minHeightIndex] += image.calculatedHeight;
    });

    // שלב 4: איזון נוסף אגרסיבי - העברות מרובות
    let balanced = false;
    let iterations = 0;
    const maxIterations = 10;

    while (!balanced && iterations < maxIterations) {
      balanced = true;
      iterations++;
      
      const currentHeights = columnArrays.map(column => 
        column.reduce((sum, img) => sum + img.calculatedHeight, 0)
      );
      
      const maxHeight = Math.max(...currentHeights);
      const minHeight = Math.min(...currentHeights);
      const heightDifference = maxHeight - minHeight;
      const avgHeight = currentHeights.reduce((sum, h) => sum + h, 0) / numColumns;
      
      // אם הפער גדול מ-10% מהממוצע, נמשיך לאזן
      if (heightDifference > avgHeight * 0.1) {
        balanced = false;
        
        const tallestColumnIndex = currentHeights.indexOf(maxHeight);
        const shortestColumnIndex = currentHeights.indexOf(minHeight);
        
        const tallestColumn = columnArrays[tallestColumnIndex];
        
        // נמצא תמונה מתאימה להעברה (קטנה יחסית)
        for (let i = tallestColumn.length - 1; i >= 0; i--) {
          const imageToMove = tallestColumn[i];
          
          // בדוק אם העברת התמונה תשפר את האיזון
          const newTallestHeight = currentHeights[tallestColumnIndex] - imageToMove.calculatedHeight;
          const newShortestHeight = currentHeights[shortestColumnIndex] + imageToMove.calculatedHeight;
          
          if (newShortestHeight <= newTallestHeight + avgHeight * 0.05) {
            // העבר את התמונה
            tallestColumn.splice(i, 1);
            columnArrays[shortestColumnIndex].push(imageToMove);
            break;
          }
        }
      }
    }

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