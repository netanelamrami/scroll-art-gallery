
import React from "react";
import { GalleryImage } from "@/types/gallery";
import { GalleryImageCard } from "./GalleryImageCard";

interface MasonryColumnProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage, index: number) => void;
  allImages: GalleryImage[];
  isSelectionMode?: boolean;
  selectedImages?: Set<string>;
  onImageSelection?: (imageId: string) => void;
}

export const MasonryColumn = ({ 
  images, 
  onImageClick, 
  allImages,
  isSelectionMode = false,
  selectedImages = new Set(),
  onImageSelection
}: MasonryColumnProps) => {
  return (
    <div className="flex flex-col gap-4">
      {images.map((image) => {
        const globalIndex = allImages.findIndex(img => img.id === image.id);
        return (
          <GalleryImageCard
            key={image.id}
            image={image}
            onClick={() => onImageClick(image, globalIndex)}
            isSelectionMode={isSelectionMode}
            isSelected={selectedImages.has(image.id)}
            onSelectionChange={() => onImageSelection?.(image.id)}
          />
        );
      })}
    </div>
  );
};
