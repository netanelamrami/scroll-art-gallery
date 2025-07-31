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
  // אלגוריתם חלוקה סיבובית פשוטה - מבטיח איזון מושלם
  const distributeImagesBalanced = (images: GalleryImage[], numColumns: number) => {
    const columnArrays = Array.from({ length: numColumns }, () => [] as GalleryImage[]);
    
    // חלוקה סיבובית פשוטה - כל תמונה הולכת לעמודה הבאה ברצף
    images.forEach((image, index) => {
      const columnIndex = index % numColumns;
      columnArrays[columnIndex].push(image);
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