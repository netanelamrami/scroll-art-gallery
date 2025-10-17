
import React from "react";
import { GalleryImage } from "@/types/gallery";
import { GalleryImageCard } from "./GalleryImageCard";
import { event } from "@/types/event";

interface MasonryColumnProps {
  images: GalleryImage[];
  event?: event;
  onImageClick: (image: GalleryImage, index: number) => void;
  allImages: GalleryImage[];
  isSelectionMode?: boolean;
  selectedImages?: Set<string>;
  onImageSelection?: (imageId: string) => void;
  favoriteImages?: Set<string>;
  onToggleFavorite?: (imageId: string) => void;
  onImageDropdownClick?: (imageId: string, position: { x: number; y: number }) => void;
  onShare?: (imageId: string) => void;
}

export const MasonryColumn = ({
  images,
  event,
  onImageClick,
  allImages,
  isSelectionMode = false,
  selectedImages = new Set(),
  onImageSelection,
  favoriteImages = new Set(),
  onToggleFavorite,
  onImageDropdownClick,
  onShare
}: MasonryColumnProps) => {
  return (
    <div className="flex flex-col gap-0.5">
      {images.map((image) => {
        const globalIndex = allImages.findIndex(img => img.id === image.id);
        return (
          <GalleryImageCard
            key={image.id}
            image={image}
            event={event}
            onClick={() => onImageClick(image, globalIndex)}
            isSelectionMode={isSelectionMode}
            isSelected={selectedImages.has(image.id)}
            onSelectionChange={() => onImageSelection?.(image.id)}
            isFavorite={favoriteImages.has(image.id)}
            onToggleFavorite={() => onToggleFavorite?.(image.id)}
            onImageDropdownClick={onImageDropdownClick}
            onShare={() => onShare?.(image.id)}
          />
        );
      })}
    </div>
  );
};
