import { useState, useEffect } from "react";
import { Gallery } from "@/components/gallery/Gallery";
import { WeddingHero } from "@/components/wedding/WeddingHero";
import { FloatingNavbar } from "@/components/gallery/FloatingNavbar";
import { AuthFlow } from "@/components/auth/AuthFlow";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { generateGalleryImages } from "@/data/galleryData";
import { log } from "console";
import { apiService } from "../data/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [showGallery, setShowGallery] = useState(false);
  const [galleryType, setGalleryType] = useState<'all' | 'my'>('all');
  const [showFloatingNavbar, setShowFloatingNavbar] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthFlow, setShowAuthFlow] = useState(false);
  const [userData, setUserData] = useState<{phone: string; otp: string; selfieData: string} | null>(null);
  const [event, setEvent] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    Promise.all([
      apiService.getEvent(),
      generateGalleryImages()
    ]).then(([eventData, imagesData]) => {
      setEvent(eventData);
      setGalleryImages(imagesData);
      setIsLoading(false);
    });
  }, []);

  // Feedback modal timer - show after 10 seconds of viewing gallery with images
  useEffect(() => {
    if (!showGallery || galleryImages.length === 0 || showFeedbackModal) return;

    const timer = setTimeout(() => {
      setShowFeedbackModal(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [showGallery, galleryImages.length, showFeedbackModal]);

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

  // Show loading skeleton while data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  );
};

export default Index;
