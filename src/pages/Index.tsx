import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WeddingHero } from "@/components/wedding/WeddingHero";
import { Gallery } from "@/components/gallery/Gallery";
import { NotificationSubscription } from "@/components/notifications/NotificationSubscription";
import { FloatingNavbar } from "@/components/gallery/FloatingNavbar";
import { AuthFlow } from "@/components/auth/AuthFlow";
import { LeadGenerationModal } from "@/components/leads/LeadGenerationModal";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { generateGalleryImages } from "@/data/galleryData";
import { log } from "console";
import { apiService } from "../data/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";
import { useMultiUserAuth } from "@/hooks/useMultiUserAuth";
import { BottomMenu } from "@/components/ui/bottom-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QRCode from "qrcode";
import { downloadMultipleImages } from "@/utils/downloadUtils";
import { toast } from "sonner";

const Index = () => {
  const { eventLink } = useParams();
  const navigate = useNavigate();
  const [showGallery, setShowGallery] = useState(false);
  const [galleryType, setGalleryType] = useState<'all' | 'my' | 'favorites'>('all');
  const [showFloatingNavbar, setShowFloatingNavbar] = useState(true);
  const [showAuthFlow, setShowAuthFlow] = useState(false);
  const [userData, setUserData] = useState<{contact: string; otp: string; selfieData: string; notifications: boolean} | null>(null);
  const [event, setEvent] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [favoriteImages, setFavoriteImages] = useState<Set<string>>(new Set());
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [isLoadingAllPhotos, setIsLoadingAllPhotos] = useState(false);
  const [isLoadingMyPhotos, setIsLoadingMyPhotos] = useState(false);
  const [showNotificationSubscription, setShowNotificationSubscription] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [columns, setColumns] = useState(3);
  const [qrCode, setQrCode] = useState<string>('');
  const [isQrOpen, setIsQrOpen] = useState(false);

  const [galleryImages, setGalleryImages] = useState([]);
  
  // Use multi-user auth system
  const { isAuthenticated, addUser } = useMultiUserAuth();
  
  // Force re-render when authentication state changes
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // אם אין eventLink ב-URL, נשתמש ב-default
    const currentEventLink = eventLink || '2d115c1c-guy-sigal';
    
    // תחילה ננסה לקבל את האירוע
    apiService.getEvent(currentEventLink)
      .then(eventData => {
        console.log('Event data:', eventData);
        
        // אם האירוע לא נמצא בכלל
        if (!eventData) {
          navigate('/event-not-found/' + currentEventLink);
          return null; // לא נמשיך לטעון תמונות
        }
        
        // Check if event is inactive or deleted
        if (eventData.isDeleted === true || eventData.isActive === false) {
          navigate('/event-inactive/' + currentEventLink);
          return null; // לא נמשיך לטעון תמונות
        }
        
        // האירוע קיים ופעיל, נמשיך לטעון תמונות
        setEvent(eventData);
        
        return apiService.getEventImagesFullData(currentEventLink);
      })
      .then(imagesData => {
        if (!imagesData) return; // אם נעברנו לדף אחר
        
        // המרת נתוני התמונות למבנה שהאפליקציה מצפה אליו
        const formattedImages = imagesData.map((imageData: any, index: number) => ({
          id: imageData.name || `image-${index}`,
          src: imageData.smallUrl,
          mediumSrc: imageData.medUrl,
          largeSrc: imageData.largeUrl,
          alt: `Gallery image ${index + 1}`,
          size: 'medium' as const,
          width: 400,
          height: 300,
          albumId: imageData.albomId?.toString() || 'main'
        }));
        
        setGalleryImages(formattedImages);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        // אם יש שגיאה בטעינת האירוע, מניחים שהוא לא קיים
        navigate('/event-not-found/' + currentEventLink);
      });
  }, [eventLink, navigate]);

  // Lead generation modal timer - show after 15 seconds if not shown before
  useEffect(() => {
    if (!showGallery || galleryImages.length === 0 || showLeadModal) return;
    
    // Check if modal was already shown in this browser
    const hasSeenLeadModal = localStorage.getItem('hasSeenLeadModal');
    if (hasSeenLeadModal) return;

    const timer = setTimeout(() => {
      setShowLeadModal(true);
    }, 15000); // 15 seconds

    return () => clearTimeout(timer);
  }, [showGallery, galleryImages.length, showLeadModal]);

  // Load favorite images from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteImages');
    if (savedFavorites) {
      setFavoriteImages(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const handleViewAllPhotos = () => {
    setIsLoadingAllPhotos(true);
    setGalleryType('all');
    
    // Simulate loading delay for server response
    setTimeout(() => {
      setShowGallery(true);
      setIsLoadingAllPhotos(false);
      // Smooth scroll to gallery
      setTimeout(() => {
        document.getElementById('gallery')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);
    }, 1000);
  };

  const handleViewMyPhotos = () => {
    setIsLoadingMyPhotos(true);
    setTimeout(() => {
      setShowAuthFlow(true);
      setIsLoadingMyPhotos(false);
    }, 1000 + Math.random() * 500);
  };

  const handleToggleMyPhotos = () => {
    // אם המשתמש כבר מחובר, עבור ישירות לגלרייה
    if (isAuthenticated) {
      setGalleryType('my');
      setShowGallery(true);
      return;
    }
    
    // אם המשתמש לא מחובר, נציג את תהליך ההרשמה
    setShowAuthFlow(true);
  };
  const handleViewFavorites = () => {
    setGalleryType('favorites');
    setShowGallery(true);
    // Smooth scroll to gallery
    setTimeout(() => {
      document.getElementById('gallery')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleAlbumClick = (albumId: string) => {
    setSelectedAlbum(albumId);
    if (albumId === 'favorites') {
      handleViewFavorites();
    } else {
      // For other albums, show all images for now
      setGalleryType('all');
      setShowGallery(true);
      setTimeout(() => {
        document.getElementById('gallery')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  const handleToggleGalleryType = () => {
    // אם המשתמש מנסה לעבור ל"התמונות שלי" בלי להיות מחובר
    if (galleryType === 'all' && !isAuthenticated) {
      setShowAuthFlow(true);
      return;
    }
    
    if (galleryType === 'all') {
      setGalleryType('my');
    } else if (galleryType === 'my') {
      setGalleryType('favorites');
    } else {
      setGalleryType('all');
    }
  };

  const handleToggleFavorite = (imageId: string) => {
    const newFavorites = new Set(favoriteImages);
    if (newFavorites.has(imageId)) {
      newFavorites.delete(imageId);
    } else {
      newFavorites.add(imageId);
    }
    setFavoriteImages(newFavorites);
    localStorage.setItem('favoriteImages', JSON.stringify(Array.from(newFavorites)));
  };

  const handleAuthComplete = (authData: {contact: string; otp: string; selfieData: string; notifications: boolean}) => {
    console.log('handleAuthComplete called with:', authData);
    setUserData(authData);
    setShowAuthFlow(false);
    setIsLoadingMyPhotos(true);
    
    // Add user to multi-user system
    console.log('About to call addUser...');
    const newUser = addUser({
      name: authData.contact.includes('@') ? authData.contact.split('@')[0] : '',
      phone: authData.contact.includes('@') ? '' : authData.contact,
      email: authData.contact.includes('@') ? authData.contact : '',
      selfieImage: authData.selfieData
    });
    
    console.log('User added to multi-user system:', JSON.stringify(newUser, null, 2));
    console.log('Current isAuthenticated state:', isAuthenticated);
    
    // Force immediate re-render
    forceUpdate({});
    
    // Set gallery state immediately
    setGalleryType('my');
    setShowGallery(true);
    setIsLoadingMyPhotos(false);
    
    // Show notification subscription for selfie-only users
    if (event?.needDetect === false && authData.contact === "selfie-only") {
      setTimeout(() => {
        setShowNotificationSubscription(true);
      }, 2000);
    }
    
    // Smooth scroll to gallery
    setTimeout(() => {
      document.getElementById('gallery')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleShareEvent = async () => {
    try {
      const url = window.location.href;
      const qrDataURL = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCode(qrDataURL);
      setIsQrOpen(true);
    } catch (error) {
      toast.error('שגיאה ביצירת QR קוד');
    }
  };

  const handleDownloadAll = async () => {
    const allImages = galleryImages.map(img => ({ src: img.src, id: img.id }));
    if (allImages.length === 0) {
      toast.error('אין תמונות להורדה');
      return;
    }
    
    toast.loading('מוריד תמונות...');
    const success = await downloadMultipleImages(allImages);
    
    if (success) {
      toast.success(`${allImages.length} תמונות הורדו בהצלחה`);
    } else {
      toast.error('שגיאה בהורדת התמונות');
    }
  };

  const handleToggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedImages(new Set());
  };

  const handleColumnsChange = (newColumns: number) => {
    setColumns(newColumns);
  };

  const handleNotificationSubscribe = (contact: string, notifications: boolean) => {
    console.log('Notification subscription:', { contact, notifications });
    setShowNotificationSubscription(false);
  };

  const handleAuthCancel = () => {
    setShowAuthFlow(false);
  };

  const handleLeadModalClose = () => {
    localStorage.setItem('hasSeenLeadModal', 'true');
    setShowLeadModal(false);
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

  // Filter images based on gallery type and selected album
  const filteredImages = (() => {
    let baseImages = galleryImages;
    
    if (galleryType === 'favorites') {
      baseImages = galleryImages.filter(img => favoriteImages.has(img.id));
    } else if (galleryType === 'my' && isAuthenticated) {
      baseImages = galleryImages.filter(img => img.id.includes('couple'));
    }
    
    // For now, all albums show all images (you can customize this later)
    return baseImages;
  })();

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
        isLoadingAllPhotos={isLoadingAllPhotos}
        isLoadingMyPhotos={isLoadingMyPhotos}
      />
      
      {showGallery && (
        <div id="gallery">
          <Gallery 
            event={event} 
            images={filteredImages}
            favoriteImages={favoriteImages}
            onToggleFavorite={handleToggleFavorite}
            galleryType={galleryType}
            onAlbumClick={handleAlbumClick}
            selectedAlbum={selectedAlbum}
            selectionMode={selectionMode}
            selectedImages={selectedImages}
            onImageSelect={(imageId) => {
              const newSelected = new Set(selectedImages);
              if (newSelected.has(imageId)) {
                newSelected.delete(imageId);
              } else {
                newSelected.add(imageId);
              }
              setSelectedImages(newSelected);
            }}
            columns={columns}
          />

          {/* FloatingNavbar temporarily hidden */}
          {false && showFloatingNavbar && !isLightboxOpen && (
            <FloatingNavbar 
              event={event}
              galleryType={galleryType}
              onToggleGalleryType={handleToggleGalleryType}
            />
          )}
        </div>
      )}
      
      {/* Auth Flow Modal */}
      {showAuthFlow && event && (
        <>
          {console.log('Index - Showing AuthFlow with event:', event)}
          {console.log('Index - event.needDetect:', event.needDetect)}
          <AuthFlow 
            event={event}
            onComplete={handleAuthComplete}
            onCancel={handleAuthCancel}
          />
        </>
      )}

      {/* Lead Generation Modal */}
      <LeadGenerationModal 
        isOpen={showLeadModal}
        onClose={handleLeadModalClose}
      />

      {showNotificationSubscription && event?.needDetect === false && (
        <NotificationSubscription
          event={event}
          onSubscribe={handleNotificationSubscribe}
          onClose={() => setShowNotificationSubscription(false)}
        />
      )}
      
      {/* Bottom Menu - Only show when gallery is visible */}
      {showGallery && (
        <BottomMenu 
          onViewAllPhotos={handleViewAllPhotos}
          onShareEvent={handleShareEvent}
          onDownloadAll={handleDownloadAll}
          onToggleSelectionMode={handleToggleSelectionMode}
          onColumnsChange={handleColumnsChange}
          columns={columns}
          event={event}
          onAuthComplete={handleAuthComplete}
        />
      )}

      {/* QR Code Dialog */}
      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">שתף אירוע</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            {qrCode && (
              <div className="bg-white p-4 rounded-lg">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
            )}
            <p className="text-sm text-muted-foreground text-center">
              סרוק את הקוד או שתף את הקישור
            </p>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('הקישור הועתק ללוח');
              }}
              className="w-full"
            >
              העתק קישור
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
};

export default Index;
