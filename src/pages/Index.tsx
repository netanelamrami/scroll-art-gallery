import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WeddingHero } from "@/components/wedding/WeddingHero";
import { Gallery } from "@/components/gallery/Gallery";
import { NotificationSubscription } from "@/components/notifications/NotificationSubscription";
import { FloatingNavbar } from "@/components/gallery/FloatingNavbar";
import { AuthFlow } from "@/components/auth/AuthFlow";
import { LeadGenerationModal } from "@/components/leads/LeadGenerationModal";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { DownloadModal } from "@/components/gallery/DownloadModal";
import { generateGalleryImages } from "@/data/galleryData";
import { log } from "console";
import { apiService } from "../data/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";
import { useMultiUserAuth } from "@/contexts/AuthContext";
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
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const [galleryImages, setGalleryImages] = useState([]);
  const [userImages, setUserImages] = useState([]); // תמונות של המשתמש הנוכחי
  
  // Use multi-user auth system
  const { isAuthenticated, addUser, users, setUsers } = useMultiUserAuth();
  
  // Force re-render when authentication state changes
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // אם אין eventLink ב-URL, נשתמש ב-default
    const currentEventLink = eventLink || '2d115c1c-guy-sigal';
    
    // תחילה ננסה לקבל את האירוע
    apiService.getEvent(currentEventLink)
      .then(eventData => {        
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
    }, 300);
  };

  const handleToggleMyPhotos = async () => {
    // בדיקה אם המשתמש מחובר
    if (isAuthenticated) {
      await loadUserImages();
      setGalleryType('my');
      setShowGallery(true);
      
      // גלילה לגלריה
      setTimeout(() => {
        document.getElementById('gallery')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);
      return;
    }
    
    // אם המשתמש לא מחובר, נציג את תהליך ההרשמה
    setShowAuthFlow(true);
  };

  // פונקציה נפרדת לטעינת תמונות המשתמש
  const loadUserImages = async () => {
    setIsLoadingMyPhotos(true);
    try {
      const userId = parseInt(sessionStorage.getItem('userid') || '0');
      const eventId = event?.id;
      
      console.log('loadUserImages - userId:', userId, 'eventId:', eventId);
      
      if (userId && eventId) {
        console.log('Making API call to getImages...');
        const userImagesData = await apiService.getImages(userId, eventId);
        console.log('API response:', userImagesData);
        
        // המרת נתוני התמונות למבנה שהאפליקציה מצפה אליו
        const formattedUserImages = userImagesData?.map((imageData: any, index: number) => ({
          id: imageData.name || `user-image-${index}`,
          src: imageData.smallUrl,
          mediumSrc: imageData.medUrl,
          largeSrc: imageData.largeUrl,
          alt: `User image ${index + 1}`,
          size: 'medium' as const,
          width: 400,
          height: 300,
          albumId: imageData.albomId?.toString() || 'main'
        })) || [];
        
        console.log('Formatted user images:', formattedUserImages);
        console.log('Setting userImages to:', formattedUserImages.length, 'images');
        setUserImages(formattedUserImages);
      } else {
        console.log('Missing userId or eventId - userId:', userId, 'eventId:', eventId);
      }
    } catch (error) {
      console.error('Error loading user images:', error);
      setUserImages([]);
    }
    setIsLoadingMyPhotos(false);
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
      //setGalleryType('all');
      setShowGallery(true);
      setTimeout(() => {
        document.getElementById('gallery')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  const handleToggleGalleryType = async () => {
    if (galleryType === 'all') {
      // מעבר לתמונות שלי
      if (!isAuthenticated) {
        setShowAuthFlow(true);
        return;
      }
      await loadUserImages();
      setGalleryType('my');
    } else {
      // מעבר לכל התמונות
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

  const handleAuthComplete = async (authData: {contact: string; otp: string; selfieData: string; notifications: boolean}) => {
    setUserData(authData);
    setShowAuthFlow(false);
    // רק אם זה לא משתמש קיים, נוסיף אותו לרשימת המשתמשים
    if (authData.selfieData !== "existing-user") {
      console.log('Adding new user to multi-user system...');
      const newUser = addUser({
        name: authData.contact.includes('@') ? authData.contact.split('@')[0] : '',
        phone: authData.contact.includes('@') ? '' : authData.contact,
        email: authData.contact.includes('@') ? authData.contact : '',
        selfieImage: authData.selfieData
      });
      
      console.log('User added to multi-user system:', JSON.stringify(newUser, null, 2));
    } else {
      console.log('Existing user - not adding to multi-user system');
    }
    
    // Force immediate re-render
    forceUpdate({});
    
    // טוען את התמונות של המשתמש
    await loadUserImages();
    
    // Set gallery state
    setGalleryType('my');
    setShowGallery(true);
    
    // Show notification subscription for selfie-only users
    if (authData.contact === "selfie-only") {
      setTimeout(() => {
        setShowNotificationSubscription(true);
      }, 1000);
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
    // פתיחת מודל להורדת הכל
    setShowDownloadModal(true);
  };

  const handleToggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedImages(new Set());
  };


  // Listen for exit selection mode event and gallery type toggle
  useEffect(() => {
    const handleExitSelectionMode = () => {
      setSelectionMode(false);
      setSelectedImages(new Set());
    };

    const handleToggleGalleryTypeEvent = (event) => {
      const value = event.detail.type;
      if (value === 'my') {
        if (!isAuthenticated) {
          setShowAuthFlow(true);
          return;
        }
        loadUserImages().then(() => {
          setGalleryType('my');
        });
      } else {
        setGalleryType('all');
      }
    };

    const handleSwitchToMyPhotos = async () => {
      console.log('handleSwitchToMyPhotos called - isAuthenticated:', isAuthenticated);
      if (isAuthenticated) {
        console.log('User is authenticated, loading user images...');
        await loadUserImages();
        console.log('Images loaded, setting gallery type to my');
        setGalleryType('my');
        setShowGallery(true);
      } else {
        console.log('User not authenticated');
      }
    };

    // Listen for user switch events
    const handleAuthStateChanged = async () => {
      // אם המשתמש החליף משתמש והגלריה פתוחה ב"התמונות שלי"
      if (isAuthenticated && galleryType === 'my') {        
        await loadUserImages();
      }
    };

    window.addEventListener('exitSelectionMode', handleExitSelectionMode);
    window.addEventListener('toggleGalleryType', handleToggleGalleryTypeEvent);
    window.addEventListener('switchToMyPhotos', handleSwitchToMyPhotos);
    window.addEventListener('authStateChanged', handleAuthStateChanged);
    
    return () => {
      window.removeEventListener('exitSelectionMode', handleExitSelectionMode);
      window.removeEventListener('toggleGalleryType', handleToggleGalleryTypeEvent);
      window.removeEventListener('switchToMyPhotos', handleSwitchToMyPhotos);
      window.removeEventListener('authStateChanged', handleAuthStateChanged);
    };
  }, [isAuthenticated]);

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
    if (galleryType === 'my' && isAuthenticated) {
      baseImages = userImages; // שימוש בתמונות המשתמש שנטענו מהשרת
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
            onAuthComplete={handleAuthComplete}
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

        </div>
      )}
      
      {/* Auth Flow Modal */}
      {showAuthFlow && event && (
        <>
          <AuthFlow 
            event={event}
            onComplete={handleAuthComplete}
            onCancel={handleAuthCancel}
            setUsers={setUsers}
          />
        </>
      )}

      {/* Lead Generation Modal */}
      <LeadGenerationModal 
        isOpen={showLeadModal}
        onClose={handleLeadModalClose}
      />

      {showNotificationSubscription && (
        <NotificationSubscription
          event={event}
          onSubscribe={handleNotificationSubscribe}
          onClose={() => setShowNotificationSubscription(false)}
        />
      )}
      
      {/* FloatingNavbar replaces BottomMenu */}

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

      {/* Download All Modal */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        imageCount={galleryImages.length}
        images={galleryImages}
        autoDownload={galleryImages.length <= 20}
        albumName={event?.name || "כל התמונות"}
        galleryType={galleryType}
        eventId={event?.id}
      />

    </div>
  );
};

export default Index;
