import { useState, useEffect } from "react";
import { Gallery } from "@/components/gallery/Gallery";
import { WeddingHero } from "@/components/wedding/WeddingHero";
import { FloatingNavbar } from "@/components/gallery/FloatingNavbar";
import { AuthFlow } from "@/components/auth/AuthFlow";
import { generateGalleryImages } from "@/data/galleryData";
import { log } from "console";
import { apiService } from "../data/services/apiService";

const Index = () => {
  const [showGallery, setShowGallery] = useState(false);
  const [galleryType, setGalleryType] = useState<'all' | 'my'>('all');
  const [showFloatingNavbar, setShowFloatingNavbar] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthFlow, setShowAuthFlow] = useState(false);
  const [userData, setUserData] = useState<{phone: string; otp: string; selfieData: string} | null>(null);
  const [event, setEvent] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    apiService.getEvent().then(setEvent);
  }, []);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    generateGalleryImages().then(setGalleryImages);
  }, []);

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
    // אם המשתמש לא מחובר, נציג את תהליך ההרשמה
    if (!isAuthenticated) {
      setShowAuthFlow(true);
      return;
    }
    
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
    // אם המשתמש מנסה לעבור ל"התמונות שלי" בלי להיות מחובר
    if (galleryType === 'all' && !isAuthenticated) {
      setShowAuthFlow(true);
      return;
    }
    setGalleryType(galleryType === 'all' ? 'my' : 'all');
  };

  const handleAuthComplete = (authData: {phone: string; otp: string; selfieData: string}) => {
    setUserData(authData);
    setIsAuthenticated(true);
    setShowAuthFlow(false);
    setGalleryType('my');
    setShowGallery(true);
    
    // Smooth scroll to gallery
    setTimeout(() => {
      document.getElementById('gallery')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleAuthCancel = () => {
    setShowAuthFlow(false);
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
      const shouldShow = scrollTop > galleryTop;
      setShowFloatingNavbar(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showGallery]);

  // Filter images based on gallery type
  const filteredImages = galleryType === 'all' 
    ? galleryImages 
    : isAuthenticated 
      ? galleryImages.filter(img => img.id.includes('couple')) // Mock filter for authenticated user's photos
      : [];
  return (
    <div>
      <WeddingHero 
        event={event}
        onViewAllPhotos={handleViewAllPhotos}
        onViewMyPhotos={handleViewMyPhotos}
      />
      {showGallery && (
        <div id="gallery">
          <Gallery 
            event={event} images={filteredImages} />

          {showFloatingNavbar && !isLightboxOpen && (
            <FloatingNavbar 
              event={event}
              galleryType={galleryType}
              onToggleGalleryType={handleToggleGalleryType}
            />
          )}
        </div>
      )}
      
      {/* Auth Flow Modal */}
      {showAuthFlow && (
        <AuthFlow 
          onComplete={handleAuthComplete}
          onCancel={handleAuthCancel}
        />
      )}
    </div>
  );
};

export default Index;
