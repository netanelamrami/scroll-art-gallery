
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
}

export const MasonryGrid = ({ 
  images, 
  onImageClick, 
  columns, 
  isSelectionMode = false,
  selectedImages = new Set(),
  onImageSelection
}: MasonryGridProps) => {
  // Create column arrays
  const columnArrays = Array.from({ length: columns }, () => [] as GalleryImage[]);
  
  // Distribute images across columns
  images.forEach((image, index) => {
    const columnIndex = index % columns;
    columnArrays[columnIndex].push(image);
  });

  return (
    <div 
      className="grid gap-4"
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
        />
      ))}
    </div>
  );
};
