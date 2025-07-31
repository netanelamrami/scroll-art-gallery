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
  // יצירת מערך עמודות ומערך גבהים
  const columnArrays = Array.from({ length: columns }, () => [] as GalleryImage[]);
  const columnHeights = Array.from({ length: columns }, () => 0);

  images.forEach((image, index) => {
    // חישוב גובה התמונה (או 1 אם לא מוגדר)
    const imgHeight = image.height || 1;
    // מציאת העמודה עם הגובה הנמוך ביותר
    const minCol = columnHeights.indexOf(Math.min(...columnHeights));
    columnArrays[minCol].push(image);
    columnHeights[minCol] += imgHeight;
  });

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