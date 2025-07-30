import { useState, useEffect } from "react";
import { Gallery } from "@/components/gallery/Gallery";
import { WeddingHero } from "@/components/wedding/WeddingHero";
import { FloatingNavbar } from "@/components/gallery/FloatingNavbar";
import { galleryImages } from "@/data/galleryData";

const Index = () => {
  const [showGallery, setShowGallery] = useState(false);
  const [galleryType, setGalleryType] = useState<'all' | 'my'>('all');
  const [showFloatingNavbar, setShowFloatingNavbar] = useState(true);

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

  const handleToggleGalleryType = () => {
    setGalleryType(galleryType === 'all' ? 'my' : 'all');
  };

  // Track scroll position to hide floating navbar when near hero
  useEffect(() => {
    if (!showGallery) return;

    const handleScroll = () => {
      const galleryElement = document.getElementById('gallery');
      if (!galleryElement) return;

      const galleryTop = galleryElement.offsetTop;
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Hide floating navbar if user scrolled back near the hero section
      // Show it when user is well into the gallery
      const shouldShow = scrollTop > galleryTop + windowHeight * 0.3;
      setShowFloatingNavbar(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showGallery]);

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
          {showFloatingNavbar && (
            <FloatingNavbar 
              galleryType={galleryType}
              onToggleGalleryType={handleToggleGalleryType}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
