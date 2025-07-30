import { useState } from "react";
import { Gallery } from "@/components/gallery/Gallery";
import { WeddingHero } from "@/components/wedding/WeddingHero";
import { galleryImages } from "@/data/galleryData";

const Index = () => {
  const [showGallery, setShowGallery] = useState(false);
  const [galleryType, setGalleryType] = useState<'all' | 'my'>('all');

  const handleViewAllPhotos = () => {
    setGalleryType('all');
    setShowGallery(true);
    // Smooth scroll to gallery
    setTimeout(() => {
      document.getElementById('gallery')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleViewMyPhotos = () => {
    setGalleryType('my');
    setShowGallery(true);
    // Smooth scroll to gallery
    setTimeout(() => {
      document.getElementById('gallery')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  };

  // Filter images based on gallery type
  const filteredImages = galleryType === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.id.includes('couple')); // Mock filter for "my photos"

  return (
    <div>
      <WeddingHero 
        onViewAllPhotos={handleViewAllPhotos}
        onViewMyPhotos={handleViewMyPhotos}
      />
      {showGallery && (
        <div id="gallery">
          <Gallery images={filteredImages} />
        </div>
      )}
    </div>
  );
};

export default Index;
