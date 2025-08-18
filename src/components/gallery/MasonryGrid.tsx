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

      // מציאת העמודה הקצרה ביותר
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      columnArrays[shortestColumnIndex].push(image);
      columnHeights[shortestColumnIndex] += (image.photoHeight || 0) + 4;
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