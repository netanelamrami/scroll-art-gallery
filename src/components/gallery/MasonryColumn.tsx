import { GalleryImage } from "@/types/gallery";
import { GalleryImageCard } from "./GalleryImageCard";

interface MasonryColumnProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
}

export const MasonryColumn = ({ images, onImageClick }: MasonryColumnProps) => {
  return (
    <div className="flex flex-col gap-4">
      {images.map((image) => (
        <GalleryImageCard
          key={image.id}
          image={image}
          onClick={() => onImageClick(image)}
        />
      ))}
    </div>
  );
};